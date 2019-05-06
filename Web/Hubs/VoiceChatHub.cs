using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Helpers;

namespace Considerate.Hellolingo.WebApp.Hubs
{
	public class VoiceChatHub : SimpleWebRtcHub
	{
		public static readonly Dictionary<string, VoiceCall> RoomsVoiceCallsDictionary = new Dictionary<string, VoiceCall>();

		private readonly IHellolingoEntities _db;

		public VoiceChatHub(IHellolingoEntities db) { _db = db; }
		public VoiceChatHub() { _db = new HellolingoEntities(); }

		public override async Task OnDisconnected(bool stopCalled)
		{
			var roomIds = RoomsConnectionsDictionary
					// Select rooms with client ConnectionId
					.Where(kvp => kvp.Value.Any(c => c == Context.ConnectionId))
					.Select(kvp => kvp.Key).ToArray();

			foreach (var roomId in roomIds)
				await CallFinished(roomId, "disconnected");

			await base.OnDisconnected(stopCalled);
		}

		//========== Methods for Clients ======================================================================================

		public override async Task<SimpleWebRtcRoomClients> Join(string roomId) {
			var userId = Context.User.Identity.GetClaims().Id;
			if (RoomsVoiceCallsDictionary.ContainsKey(roomId) && RoomsVoiceCallsDictionary[roomId].CallerId == userId) throw new LogReadyException(LogTag.InvalidConcurrentVoiceCalls);
			var result = await base.Join(roomId);
			await PersistVoiceCallInfo(roomId);
			return result;
		}

		private async Task PersistVoiceCallInfo(string roomId)
		{
			if (RoomsConnectionsDictionary[roomId].Count > 1)
			{
				// Second user joined voice chat room - call is accepted
				if (RoomsVoiceCallsDictionary.ContainsKey(roomId))
				{
					var currentVoiceCall = RoomsVoiceCallsDictionary[roomId];
					currentVoiceCall.Accepted = DateTime.Now;
					currentVoiceCall.CalleeId = TextChatController.PartnerInPrivateRoom(roomId, currentVoiceCall.CallerId);
					((DbContext)_db).Entry(currentVoiceCall).State = EntityState.Modified;

					Log.SignalR(LogTag.SavingAcceptedCallToDb, new { roomId }, Context);
				}
				else
				{
					// Something wrong have happened and we don't have a VoiceCall object in dict yet
					Log.SignalRError(LogTag.AcceptedVoiceCallRoomIdNotFoundDictionary, new { roomId }, Context);
				}
			}
			else
			{
				if (RoomsVoiceCallsDictionary.ContainsKey(roomId))
				{
					Log.SignalRError(LogTag.VoiceCallRoomAlreadyExistsOnInitiatingCall, new { roomId }, Context);
					return;
				}

				// One user is here - call initiated
				var userId = Context.User.Identity.GetClaims().Id;
				var vc = new VoiceCall {
					Created = DateTime.Now,
					CallerId = userId,
					CalleeId = TextChatController.PartnerInPrivateRoom(roomId, userId),
					Platform = 1, // Formerly obtained from VoicePlatforms table (table abandonned when VoiceOut got removed)
					Source = Enumerables.SourceFeatures.PrivateTextChat
				};

				RoomsVoiceCallsDictionary.Add(roomId, vc);

				_db.VoiceCalls.Add(vc);
				Log.SignalR(LogTag.SavingInitiatedCallToDb, new { roomId }, Context);
			}

			await _db.SaveChangesAsync();
		}

		public async Task CallFinished(string roomId, string reasonString)
		{
			if (string.IsNullOrEmpty(roomId)) return;

			Log.SignalR(LogTag.ReceivedCallFinished, new { roomId, reason = reasonString }, Context);

			VoiceCall vc;
			var reason = CallFinishedReason.Parse(reasonString);
			RoomsVoiceCallsDictionary.TryGetValue(roomId, out vc);

			var userId = Context.User.Identity.GetClaims().Id;
			if (vc == null) {
				if (reason.Reason == "unsupported" && reason.Src != CallFinishedReason.Reporter.Peer) {
					// Special case #2. unsupported_join stands for voice call attempt from the same user that was already joined to the same room
					// We're not finishing established call in this case
					if (reason.Detail == "join") return;

					// Special case! Reporting about call finish and failed to initiate it
					// so we don't have anything for it in RoomsVoiceCallsDictionary but have to save something to DB
					vc = new VoiceCall {
						Created = DateTime.Now,
						CallerId = userId,
						CalleeId = TextChatController.PartnerInPrivateRoom(roomId, userId),
						Platform = 1, // Formerly obtained from VoicePlatforms table (table abandonned when VoiceOut got removed)
						Source = Enumerables.SourceFeatures.PrivateTextChat
					};

					RoomsVoiceCallsDictionary.Add(roomId, vc);
					_db.VoiceCalls.Add(vc);
				} else return;
			} else ((DbContext)_db).Entry(vc).State = EntityState.Modified;

			RoomsVoiceCallsDictionary.Remove(roomId);

			vc.Ended = DateTime.Now;

			var isCallerEvent = (userId == vc.CallerId && reason.Src != CallFinishedReason.Reporter.Peer) ||
								(userId != vc.CallerId && reason.Src == CallFinishedReason.Reporter.Peer);

			byte outcome;
			switch (reason.Reason)
			{
				case "cancelled": outcome = Enumerables.VoiceCallOutcomes.Cancel; break;
				case "declined": outcome = Enumerables.VoiceCallOutcomes.Decline; break;
				case "unsupported":
					if (reason.Detail == "browser") outcome = isCallerEvent ? 
								  Enumerables.VoiceCallOutcomes.FailOnCallerUnsupportedBrowser
								: Enumerables.VoiceCallOutcomes.FailOnCalleeUnsupportedBrowser;
					else outcome = isCallerEvent ?
								  Enumerables.VoiceCallOutcomes.FailOnCallerMicNotFound
								: Enumerables.VoiceCallOutcomes.FailOnCalleeMicNotFound;
					break;
				case "hangout": outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.CallerHangout : Enumerables.VoiceCallOutcomes.CalleeHangout; break;
				case "leftRoom": outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.CallerLeft : Enumerables.VoiceCallOutcomes.CalleeLeft; break;
				case "disconnected": outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.LostCaller : Enumerables.VoiceCallOutcomes.LostCallee; break;
				default: outcome = Enumerables.VoiceCallOutcomes.Error; break;
			}
			vc.Outcome = outcome;

			Log.SignalR(LogTag.SavingCallOutcome, new { roomId }, Context);

			await _db.SaveChangesAsync();
		}

	}

	public interface ISimpleWebRtcHubClient
	{
		void Connect();
		void Remove(RemoveClientMessage message);
		void Message(SimpleWebRtcMessage message);
		void Stunservers(XirsysServer[] servers);
		void Turnservers(XirsysServer[] servers);
	}
	
	//	Remake of https://github.com/andyet/signalmaster/blob/master/sockets.js in SignalR terms
	public class SimpleWebRtcHub : Hub<ISimpleWebRtcHubClient>
	{
		public static readonly Dictionary<string, List<string>> RoomsConnectionsDictionary = new Dictionary<string, List<string>>();

		private static readonly ConcurrentDictionary<RoomId, XirsysServer[]> XirsysServersByRoom = new ConcurrentDictionary<RoomId, XirsysServer[]>();

		//========== Handle Clients Connecting/Disconnecting ======================================================================================
		// We can have already established connection to SignalR
		// so we need Init method at the beginnig of interaction with this hub instead of OnConnected
		public async Task Init(RoomId roomId, bool caller)
		{
			Clients.Caller.Connect(); // get simplewebrtc on the move
			await SendIceServers(roomId, caller);
		}

		public override async Task OnDisconnected(bool stopCalled) 
		{
			var roomIds = RoomsConnectionsDictionary // Select rooms with client ConnectionId
					.Where(kvp => kvp.Value.Any(c => c == Context.ConnectionId))
					.Select(kvp => kvp.Key).ToArray();
			foreach (var roomId in roomIds) Leave(roomId);
			await base.OnDisconnected(stopCalled);
		}

		//========== Method for Clients ======================================================================================

		public virtual Task<SimpleWebRtcRoomClients> Join(string roomId)
		{
			List<string> roomConnections;
			var hasGroupConnectionsList = RoomsConnectionsDictionary.TryGetValue(roomId, out roomConnections);
			if (!hasGroupConnectionsList)
			{
				roomConnections = new List<string>();
				RoomsConnectionsDictionary.Add(roomId, roomConnections);
			}

			Log.SignalR(LogTag.ClientJoinedRoom, new { roomId }, Context);

			// ReSharper disable once SimplifyLinqExpression
			if (!roomConnections.Any(c => c == Context.ConnectionId))
				roomConnections.Add(Context.ConnectionId);

			var roomClients = roomConnections.Where(c => c != Context.ConnectionId)
											 .ToDictionary(c => c, c => SimpleWebRtcClientResources.Default);

			return Task.FromResult(new SimpleWebRtcRoomClients { Clients = roomClients });
		}

		public void Leave() => Leave(null); // Because SignalR doesn't like methods with default parameters value
		public void Leave(string roomId)
		{
			if (roomId == null) Log.SignalR(LogTag.ClientTryingToLeaveAllRooms, Context);
			else Log.SignalR(LogTag.ClientTryingToLeaveRoom, new { roomId }, Context);

			var roomsWithConnection = RoomsConnectionsDictionary
									  // Select rooms with client ConncetionId
									  .Where(kvp => kvp.Value.Any(c => c == Context.ConnectionId) &&
													(roomId == null || roomId == kvp.Key))
									  .Select(kvp => kvp).ToArray();

			foreach (var room in roomsWithConnection)
			{
				// Send to all clients in these rooms that we remove the client
				room.Value.ForEach(
					connectionId => Clients.Client(connectionId).Remove(new RemoveClientMessage {Id = Context.ConnectionId}));
				room.Value.Remove(Context.ConnectionId);

				if (room.Value.Count == 0) RoomsConnectionsDictionary.Remove(room.Key);

				Log.SignalR(LogTag.ClientHaveLeftRoom, new { roomId }, Context);
			}
		}

		public void Message(SimpleWebRtcMessage message)
		{
			var partner = Clients.Client(message.To);
			if (partner == null) return;
			message.From = Context.ConnectionId;
			partner.Message(message);
		}

		private async Task SendIceServers(RoomId roomId, bool caller)
		{
			var queryDict = ConfigurationManager.AppSettings.AllKeys
				.Where(key => key.StartsWith("xirsys:"))
				.ToDictionary(k => k.Replace("xirsys:", ""), k => ConfigurationManager.AppSettings[k]);

			var queryString = string.Join("&", queryDict.Select(kvp => $"{kvp.Key}={kvp.Value}").ToArray());
			var xirsysUrl = "https://service.xirsys.com/ice" + "?" + queryString;

			if (caller) try {
				var request = WebRequest.Create(xirsysUrl);
				var response = await request.GetResponseAsync();
				using (var stream = response.GetResponseStream())
				using (var reader = new StreamReader(stream))
				{
					var responseBody = reader.ReadToEnd();
					var jsonResponse = JsonConvert.DeserializeObject<XirsysResponse>(responseBody);
					XirsysServer[] servers = jsonResponse?.D?.IceServers;

					if (servers == null || servers.Length == 0)
					{
						Log.SignalRError(LogTag.MalformedXirsysResponse, new {xirsysUrl, responseBody}, Context);
						return;
					}

					Log.SignalR(LogTag.XirsysResponse, new {xirsysUrl, responseBody}, Context);

					XirsysServersByRoom.AddOrUpdate(roomId, servers, (key, oldValue) => servers);
				}

			}
			catch (WebException ex) {
				Log.SignalRError(LogTag.XirsysRequestError, new {xirsysUrl}, ex, Context);
			}

			// Send servers
			Clients.Caller.Stunservers(XirsysServersByRoom[roomId].Where(srv => srv.IsStun).ToArray()); 
			Clients.Caller.Turnservers(XirsysServersByRoom[roomId].Where(srv => !srv.IsStun).ToArray());
		}

	}
	
	//========== Hub data classes =======================================================================================
	public class XirsysResponse
	{
		public int S { get; set; }
		public string P { get; set; }
		public string E { get; set; }
		public XirsysResponseData D { get; set; }
	}

	public class XirsysResponseData
	{
		public XirsysServer[] IceServers { get; set; }
	}

	public class XirsysServer
	{
		public string Url { get; set; }
		public string Credential { get; set; }
		public string Username { get; set; }

		public bool IsStun => Url.StartsWith("stun:");
	}

	public class SimpleWebRtcMessage
	{
		public string To { get; set; }
		public string From { get; set; }
		public string Sid { get; set; }
		public string Broadcaster { get; set; }
		public string RoomType { get; set; }
		public string Type { get; set; }
		public RtcPayload Payload { get; set; }
		public string Prefix { get; set; }
	}

	public class RtcPayload
	{
		public string Sdp { get; set; }
		public string Type { get; set; }
		public RtcCandidate Candidate { get; set; }
	}

	public class RtcCandidate
	{
		public string Candidate { get; set; }
		public int SdpMLineIndex { get; set; }
		public string SdpMid { get; set; }
	}

	public class SimpleWebRtcRoomClients
	{
		public Dictionary<string, SimpleWebRtcClientResources> Clients { get; set; }
	}

	public class SimpleWebRtcClientResources
	{
		public bool Screen { get; set; }
		public bool Video { get; set; }
		public bool Audio { get; set; }

		public static SimpleWebRtcClientResources Default
						=> new SimpleWebRtcClientResources { Screen = false, Video = false, Audio = true };
	}

	public class RemoveClientMessage
	{
		public string Id { get; set; }
	}

	public class CallFinishedReason
	{
		public enum Reporter { Self, Peer };

		public static CallFinishedReason Parse(string reason)
		{
			var result = new CallFinishedReason();
			var reasonArr = reason.Split('_');
			if (reasonArr.Length == 1)
				result.Reason = reasonArr[0];
			else {
				if (reasonArr[0] == "peer") {
					result.Src = Reporter.Peer;
					reasonArr = reasonArr.Skip(1).ToArray();
				}

				result.Reason = reasonArr[0];
				if (reasonArr.Length > 1) result.Detail = reasonArr[1];
			}

			return result;
		}

		public Reporter Src { get; set; }
		public string Reason { get; set; }
		public string Detail { get; set; }
	}
}
