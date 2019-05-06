using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Considerate.HelloLingo.TextChat;
using Considerate.HelloLingo.WebApp.Helpers;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IO;
using System.Net;
using System.Security.Claims;
using Considerate.HelloLingo.AspNetIdentity;
using Considerate.HelloLingo.DataAccess;
using Considerate.Helpers;

namespace Considerate.HelloLingo.WebApp.Hubs {

	/*
		Remake of https://github.com/andyet/signalmaster/blob/master/sockets.js in SignalR terms
	*/
	public class SimpleWebRtcHub : Hub<ISimpleWebRtcClient>
	{
		public static readonly Dictionary<string, List<string>> RoomsConnectionsDictionary = new Dictionary<string, List<string>>();
		public static readonly Dictionary<string, VoiceCall> RoomsVoiceCallsDictionary = new Dictionary<string, VoiceCall>();

		private static XirsysServer[] _iceServers;

		private readonly ChatModel _chatModel;

		private readonly IHelloLingoEntities _db;
		
		public SimpleWebRtcHub(IHelloLingoEntities db, ChatModel chatModel)
		{
			_chatModel = chatModel;
			_db = db;
		}

		public SimpleWebRtcHub()
		{
			_chatModel = TextChatHubMaster.Instance.ChatCtrl.ChatModel;
			_db = new HelloLingoEntities();
		}

		//▬▬▬▬▬▬▬▬▬▬ Handle Clients Connecting/Disconnecting ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
		// We'll most probably have already established connection to SignalR hub
		// so we need Init method at the beginnig of interaction with this hub
		public async Task Init()
		{
			// only for socket.io compatibility
			Clients.Caller.Emit(new SimpleWebRtcClientMethodCall { Method = SignallingAction.Connect, Args = null });

			await SendIceServers();
		}

		public override async Task OnDisconnected(bool stopCalled) {

			var roomIds = RoomsConnectionsDictionary
					// Select rooms with client ConnectionId
					.Where(kvp => kvp.Value.Any(c => c == Context.ConnectionId))
					.Select(kvp => kvp.Key).ToArray();

			foreach (var roomId in roomIds)
			{
				await CallFinished(roomId, "disconnected");
				Leave(roomId);
			}
		
			await base.OnDisconnected(stopCalled);
		}

		//▬▬▬▬▬▬▬▬▬▬ Method for Clients ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
		public string[] Create(string roomId)
		{
			if (!_chatModel.IsPrivateRoom(roomId)) return new[] { "Calls allowed only for private rooms!" };

			return new[] { null, roomId };
		}


		public async Task<object[]> Join(string roomId)
		{
			List<string> roomConnections;
			var hasGroupConnectionsList = RoomsConnectionsDictionary.TryGetValue(roomId, out roomConnections);
			if (!hasGroupConnectionsList)
			{
				roomConnections = new List<string>();
				RoomsConnectionsDictionary.Add(roomId, roomConnections);
			}

			Log.SignalR(LogTag.ClientJoinedRoom, new {roomId}, Context);

			// ReSharper disable once SimplifyLinqExpression
			if (!roomConnections.Any(c => c == Context.ConnectionId))
				roomConnections.Add(Context.ConnectionId);

			await PersistVoiceCallInfo(roomId);

			var roomClients = roomConnections.Where(c => c != Context.ConnectionId)
											 .ToDictionary(c => c, c => SimpleWebRtcClientResources.Default);

			return new object[] { null, new { clients = roomClients } };
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
					currentVoiceCall.CalleeId = _chatModel.UsersInRoom(roomId, currentVoiceCall.CallerId).FirstOrDefault();
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
				var userId = GetUserIdFromClaims();
				var vc = new VoiceCall
				{
					Created = DateTime.Now,
					CallerId = userId,
					CalleeId = _chatModel.UsersInRoom(roomId, userId).FirstOrDefault() ??
							   _chatModel.GetAbsentPrivateChatUserIds(roomId).First(),
					Platform = Enumerables.VoicePlatforms.OnSiteWebRtc,
					Source = Enumerables.SourceFeatures.PrivateTextChat
				};

				RoomsVoiceCallsDictionary.Add(roomId, vc);

				_db.VoiceCalls.Add(vc);
				Log.SignalR(LogTag.SavingInitiatedCallToDb, new { roomId },Context);
			}

			await _db.SaveChangesAsync();
		}

		/* Because SignalR don't like methods with default parameters value */
		public void Leave()
		{
			Leave(null);
		}
		
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
				room.Value.ForEach(connectionId =>
				{
					Clients.Client(connectionId)
						   .Emit(new SimpleWebRtcClientMethodCall {
																	   Method = SignallingAction.Remove,
																	   Args = new[] { new { id = Context.ConnectionId } }
																  }
						   );
				});
				room.Value.Remove(Context.ConnectionId);

				if (room.Value.Count == 0) RoomsConnectionsDictionary.Remove(room.Key);

				Log.SignalR(LogTag.ClientHaveLeftRoom, new { roomId }, Context);
			}
		}

		public void Message(SimpleWebRtcMessage message)
		{
			var otherClient = Clients.Client(message.To);
			if (otherClient == null) return;

			message.From = Context.ConnectionId;
			otherClient.Emit(new SimpleWebRtcClientMethodCall { Method = SignallingAction.Message, Args = new[] { message } });
		}

		public async Task CallFinished(string roomId, string reasonString)
		{
			if (string.IsNullOrEmpty(roomId)) return;

			Log.SignalR(LogTag.ReceivedCallFinished, new { roomId, reason = reasonString }, Context);

			var reason = CallFinishedReason.Parse(reasonString);
			
			VoiceCall vc;
			RoomsVoiceCallsDictionary.TryGetValue(roomId, out vc);

			var userId = GetUserIdFromClaims();
			if (vc == null)
			{
				if (reason.Reason == "unsupported" && reason.Src != CallFinishedReason.Reporter.Peer)
				{
					// Special case! Reporting about call finish and failed to initiate it
					// so we don't have anything for it in RoomsVoiceCallsDictionary but have to save something to DB
					vc = new VoiceCall
					{
						Created = DateTime.Now,
						CallerId = userId,
						CalleeId = _chatModel.UsersInRoom(roomId, userId).FirstOrDefault() ??
						           _chatModel.GetAbsentPrivateChatUserIds(roomId).First(),
						Platform = Enumerables.VoicePlatforms.OnSiteWebRtc,
						Source = Enumerables.SourceFeatures.PrivateTextChat
					};

					RoomsVoiceCallsDictionary.Add(roomId, vc);

					_db.VoiceCalls.Add(vc);
				}
				else
				{
					return;
				}
			}
			else
			{
				((DbContext)_db).Entry(vc).State = EntityState.Modified;
			}

			RoomsVoiceCallsDictionary.Remove(roomId);

			vc.Ended = DateTime.Now;

			var isCallerEvent = (userId == vc.CallerId && reason.Src != CallFinishedReason.Reporter.Peer) ||
								(userId != vc.CallerId && reason.Src == CallFinishedReason.Reporter.Peer);

			byte outcome;
			switch (reason.Reason)
			{
				case "cancelled":
					outcome = Enumerables.VoiceCallOutcomes.Cancel;
					break;
				case "declined":
					outcome = Enumerables.VoiceCallOutcomes.Decline;
					break;
				case "unsupported":
					if (reason.Detail == "browser")
					{
						outcome = isCallerEvent ? 
								  Enumerables.VoiceCallOutcomes.FailOnCallerUnsupportedBrowser
								: Enumerables.VoiceCallOutcomes.FailOnCalleeUnsupportedBrowser;
					}
					else
					{
						outcome = isCallerEvent ?
								  Enumerables.VoiceCallOutcomes.FailOnCallerMicNotFound
								: Enumerables.VoiceCallOutcomes.FailOnCalleeMicNotFound;
					}
					break;
				case "hangout":
					outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.AcceptThenCallerHangout
											: Enumerables.VoiceCallOutcomes.AcceptThenCalleeHangout;
					break;
				case "leftRoom":
					outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.AcceptThenCallerLeft
											: Enumerables.VoiceCallOutcomes.AcceptThenCalleeLeft;
					break;
				case "disconnected":
					outcome = isCallerEvent ? Enumerables.VoiceCallOutcomes.AcceptThenLostCaller
											: Enumerables.VoiceCallOutcomes.AcceptThenLostCallee;
					break;
				default:
					outcome = Enumerables.VoiceCallOutcomes.Error;
					break;
			}
			vc.Outcome = outcome;

			Log.SignalR(LogTag.SavingCallOutcome, new { roomId }, Context);

			await _db.SaveChangesAsync();
		}

		// TODO: Oleg: remove ridiculous copypasting
		protected virtual int GetUserIdFromClaims()
		{
			var identity = (ClaimsIdentity)Context.User.Identity;
			string userIdString = identity.Claims.FirstOrDefault(c => c.Type == HelloLingoCustomClaims.HelloLingoUserId)?.Value;

			int userId;
			if (int.TryParse(userIdString, out userId) == false)
				throw new LogReadyException(LogTag.UnknownUserIdClaimed, new { userIdString });

			return userId;
		}

		private async Task SendIceServers()
		{
			if (_iceServers != null)
			{
				Clients.Caller.Emit(new SimpleWebRtcClientMethodCall
				{
					Method = SignallingAction.Stunservers,
					Args = new[] { _iceServers }
				});

				return;
			}

			var queryDict = ConfigurationManager.AppSettings.AllKeys
				.Where(key => key.StartsWith("xirsys:"))
				.ToDictionary(k => k.Replace("xirsys:", ""), k => ConfigurationManager.AppSettings[k]);

			var queryString = string.Join("&", queryDict.Select(kvp => $"{kvp.Key}={kvp.Value}").ToArray());
			var xirsysUrl = "https://service.xirsys.com/ice" + "?" + queryString;
			try
			{
				var req = WebRequest.Create(xirsysUrl);

				var response = await req.GetResponseAsync();

				using (var stream = response.GetResponseStream())
				using (var reader = new StreamReader(stream))
				{
					var responseBody = reader.ReadToEnd();
					var jsonResponse = JsonConvert.DeserializeObject<XirsysResponse>(responseBody);

					var servers = jsonResponse?.D?.IceServers;

					if (servers == null || servers.Length == 0)
					{
						Log.SignalRError(LogTag.MalformedXirsysResponse, new { xirsysUrl, responseBody }, Context);
						return;
					}

					Log.SignalR(LogTag.XirsysResponse, new { xirsysUrl, responseBody }, Context);
					_iceServers = servers;

					Clients.Caller.Emit(new SimpleWebRtcClientMethodCall
					{
						Method = SignallingAction.Stunservers,
						Args = new[] { _iceServers }
					});
				}
			}
			catch (WebException ex)
			{
				Log.SignalRError(LogTag.XirsysRequestError, new { xirsysUrl }, ex, Context);
			}
		}

	}

	public enum SignallingAction {
		Connect, Stunservers, Turnservers, Message, Remove
	}

	//▬▬▬▬▬▬▬▬▬▬ Methods at Client ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

	public interface ISimpleWebRtcClient
	{
		void Emit(SimpleWebRtcClientMethodCall message);
	}

	//▬▬▬▬▬▬▬▬▬▬ Hub data classes ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
	public struct SimpleWebRtcClientMethodCall
	{
		[JsonConverter(typeof(StringEnumConverter))]
		[JsonProperty("method")]
		public SignallingAction Method;
		[JsonProperty("args")]
		public dynamic Args;
	}

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
		[JsonProperty("url")]
		public string Url { get; set; }
		[JsonProperty("credential")]
		public string Credential { get; set; }
		[JsonProperty("username")]
		public string Username { get; set; }

		public bool IsStun => Url.StartsWith("stun:");
	}

	public class SimpleWebRtcMessage
	{
		[JsonProperty("to")]
		public string To { get; set; }
		[JsonProperty("from")]
		public string From { get; set; }
		[JsonProperty("sid")]
		public string Sid { get; set; }
		[JsonProperty("broadcaster")]
		public string Broadcaster { get; set; }
		[JsonProperty("roomType")]
		public string RoomType { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("payload")]
		public RtcPayload Payload { get; set; }
		[JsonProperty("prefix")]
		public string Prefix { get; set; }
	}

	public class RtcPayload
	{
		[JsonProperty("sdp")]
		public string Sdp { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("candidate")]
		public RtcCandidate Candidate { get; set; }
	}

	public class RtcCandidate
	{
		[JsonProperty("candidate")]
		public string Candidate { get; set; }
		[JsonProperty("sdpMLineIndex")]
		public int SdpMLineIndex { get; set; }
		[JsonProperty("sdpMid")]
		public string SdpMid { get; set; }
	}

	public class SimpleWebRtcClientResources
	{
		[JsonProperty("screen")]
		public bool Screen { get; set; }
		[JsonProperty("video")]
		public bool Video { get; set; }
		[JsonProperty("audio")]
		public bool Audio { get; set; }

		public static SimpleWebRtcClientResources Default
						=> new SimpleWebRtcClientResources { Screen = false, Video = true, Audio = true };
	}

	public class CallFinishedReason
	{
		public enum Reporter { Self, Peer };

		public static CallFinishedReason Parse(string reason)
		{
			var result = new CallFinishedReason();
			var reasonArr = reason.Split('_');
			if (reasonArr.Length == 1)
			{
				result.Reason = reasonArr[0];
			}
			else
			{
				if (reasonArr[0] == "peer")
				{
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
