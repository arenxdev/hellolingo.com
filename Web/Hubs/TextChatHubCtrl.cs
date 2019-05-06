using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.Helpers;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Helpers;
using Considerate.Helpers.Collections;
using Considerate.Helpers.Communication;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR.Transports;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Hubs {

	/// <summary>
	/// This class exists to facilitate unit testing
	/// Otherwise it could simply be merged to TextChatHub.cs
	/// </summary>

	public class TextChatHubCtrl {

		//========== Constants  ======================================================================================
		private const int BootOutOfRoomAfter = 30; // 30 mins
		private const int BootAboveUserCount = 1; // 1 user. Note that this creates a particular dynamic in which a user who's alone and inactive in a room gets disconnected (with a visual warning) quite quickly (max 30 secs.) when another user comes in. The warned user is proposed to rejoin and should immediately notice the other user. The newbie user will see the other user leaving and coming back, which may tell him it's time to react.
		private const int UserIdleAfter = 45; // 45 mins (Was 30 minutes on SharedTalk)
		private const int HeartbeatCheckInterval = 30; // seconds
		private const int HealthReportInterval = 300; // seconds
		private const int CleanZombieAfter = 300; // seconds (Zombies are client with SignalR connections but not heartbeat/ping)

		//========== Singleton ======================================================================================
		private static readonly Lazy<TextChatHubCtrl> _instance = new Lazy<TextChatHubCtrl>(() => Injection.Kernel.Get<TextChatHubCtrl>());
		public static TextChatHubCtrl Instance => _instance.Value;

		//========== Private ======================================================================================
		private readonly ITransportHeartbeat _heartBeat = GlobalHost.DependencyResolver.Resolve<ITransportHeartbeat>();

		//========== Public  ======================================================================================
		public virtual OneToManyMapper<UserId, ConnectionId> UsersConnections { get; private set; }
		public virtual RoomsConnectionsManager RoomsConnections { get; private set; }
		public virtual Dictionary<ConnectionId, DateTime> LastSeenConnections { get; private set; }
		public readonly Dictionary<ConnectionId, AckableQueue<HubClientInvoker>> MessageQueues = new Dictionary<ConnectionId, AckableQueue<HubClientInvoker>>();

		//Andriy: I changed this for be able to have different instances during tests. 
		//I don't see any problems with this because TextChatHubMaster class still singleton and contains instance of controller.
		//It's not good idea to make controller availble to reset from outside class, but i can't make test with this,
		// Another option is introduce interface For controller.
		public TextChatController ChatCtrl { get; set; }

		public readonly IHubConnectionContext<ITextChatHubClient> Clients;

		//========== Maintenance Tasks  ======================================================================================
		private Action<Exception> OnLogHeartbeatError = (e) => Log.Error(LogTag.HeartBeat_OnError, e);
		private Action<Exception> OnLogHealthReportError = (e) => Log.Error(LogTag.HealthReport_OnError, e);

		//========== Constructor ======================================================================================
    
		public TextChatHubCtrl(IHubConnectionContext<ITextChatHubClient> clients, TextChatController chatController) {
			Clients = clients; 
			RoomsConnections = new RoomsConnectionsManager();
			UsersConnections = new OneToManyMapper<UserId, ConnectionId>();
			ChatCtrl = chatController;
			LastSeenConnections = new Dictionary<ConnectionId, DateTime>();
			// Handle Chat Controller Events 
			ChatCtrl.OnUserJoined             += (user)           => Send(UsersConnections.Values,                       new AddUserInvoker(user));
			ChatCtrl.OnUserLeft               += (userId)         => Send(UsersConnections.Values,                       new RemoveUserInvoker(userId));
			ChatCtrl.OnUserJoinedRoom         += (roomId, userId) => Send(RoomsConnections.GetConnections(roomId),       new AddUserToInvoker(roomId, userId)); 
			ChatCtrl.OnUserLeftRoom           += (roomId, userId) => Send(RoomsConnections.GetConnections(roomId),       new RemoveUserFromInvoker(roomId, userId));
			ChatCtrl.OnCountOfUsersUpdated    += (roomId, count)  => Send(UsersConnections.Values,                       new UpdateCountOfUsersInvoker(roomId, count));
			ChatCtrl.OnUserStartedTyping      += (roomId, userId) => Send(RoomsConnections.GetConnections(roomId),       new MarkUserAsTypingInvoker(roomId, userId));
			ChatCtrl.OnUserStoppedTyping      += (roomId, userId) => Send(RoomsConnections.GetConnections(roomId),       new UnmarkUserAsTypingInvoker(userId));
			ChatCtrl.OnUserRequestedAudioCall += (roomId, userId)         => Send(GetPartnerConnections(roomId, userId), new RequestAudioCallInvoker(roomId));
			ChatCtrl.OnUserCancelledAudioCall += (roomId, userId)         => Send(GetPartnerConnections(roomId, userId), new CancelAudioCallInvoker(roomId, userId));
			ChatCtrl.OnUserDeclinedAudioCall  += (roomId, reason, connId) => Send(GetRelatedConnections(roomId, connId), new DeclineAudioCallInvoker(roomId, reason)); 
			ChatCtrl.OnUserHangoutedAudioCall += (roomId, userId)         => Send(GetRelatedConnections(roomId),         new HangoutAudioCallInvoker(roomId, userId));
			ChatCtrl.OnAudioCallConnected     += (roomId, userId)         => Send(GetRelatedConnections(roomId),         new AudioCallConnectedInvoker(roomId, userId));
			ChatCtrl.OnPostedMessage     += (msg) => {
				Send(msg.RoomId.IsPrivate()
						? GetPartnerAndActiveConnections(msg.RoomId, msg.UserId, msg.ConnectionId)
						: RoomsConnections.GetConnections(msg.RoomId, msg.ConnectionId),
					 new AddMessageInvoker(msg));
			};

			ChatCtrl.OnUserIdle += (userId) => Send(UsersConnections.GetFromKey(userId), new SetUserIdleInvoker(userId));

			// Start connection heartbeat check
			var heartBeatTimer = new BetterTimer(OnLogHeartbeatError) { AutoReset = true };
			heartBeatTimer.Start(null, HeartbeatCheck, HeartbeatCheckInterval);

			// Start connection heartbeat check
			var healthReportTimer = new BetterTimer(OnLogHealthReportError) { AutoReset = true };
			healthReportTimer.Start(null, PublishHealthReport, HealthReportInterval);
		}

		//========== Connection Helpers  ======================================================================================

		// Get users's connections to the chat
		private IEnumerable<ConnectionId> GetUserConnections(UserId partnerId) {
			return UsersConnections.GetFromKey(partnerId);
		}

		// Get the partner's connections related to a specific private room
		private IEnumerable<ConnectionId> GetPartnerConnections(RoomId roomId, UserId thisUserId) {
			return GetUserConnections (TextChatController.PartnerInPrivateRoom(roomId, thisUserId));
		}

		// Get the users' connections related to a specific private room
		private IEnumerable<ConnectionId> GetRelatedConnections(RoomId roomId, ConnectionId exceptConnection = null) {
			var userIds = TextChatController.UserIdsInPrivateRoom(roomId);
			return UsersConnections.All.Where(r => userIds.Contains(r.Key)).SelectMany(v => v.Value).Where(c => c != exceptConnection);
		}

		// Get the partner's connections related to a specific private room, along with the active connections to the room
		private IEnumerable<ConnectionId> GetPartnerAndActiveConnections(RoomId roomId, UserId thisUserId, ConnectionId exceptConnection = null) {
			var roomConnIds = RoomsConnections.GetConnections(roomId, exceptConnection);
			var userConnIds = GetPartnerConnections(roomId, thisUserId);
			return roomConnIds.Union(userConnIds).Where(c => c != exceptConnection);
		}

		//========== Managed Queues ======================================================================================

		public int ManagedQueuesCount => MessageQueues.Count;
		public int UnackedManagedQueuesCount => MessageQueues.Count(q => q.Value.AllAcked == false);

		public virtual void Send(ConnectionId connectionId, HubClientInvoker msg) => Send(new List<ConnectionId> { connectionId }, msg);

		public virtual void Send(IEnumerable<ConnectionId> connectionIds, HubClientInvoker msg) {

			// Get a list from connectionIds, because it will be enumerated several times, and because it will also help thread safety
			var listOfConnectionIds = connectionIds.ToList();
			if (!listOfConnectionIds.Any()) return;

			// Log selected events as a bundle, rather than waiting for them to be split between individual connections and clog the log files with redundant messages
			// The selected events are those that tends to affects a lot of users
			if (// Too Much Data in log files:  msg.MethodName == "AddUser" || msg.MethodName == "RemoveUser" || 
				msg.MethodName == "AddUserTo" || msg.MethodName == "RemoveUserFrom" ||
				msg.MethodName == "AddMessage" || msg.MethodName == "SetUserIdle")
				Log.SignalROut(listOfConnectionIds, msg);

			// Note: This may have been adressed by extracting a ToList() from the Enumerable
			foreach (var connectionId in listOfConnectionIds) {
				AckableQueue<HubClientInvoker> managedQueue;
				if (!MessageQueues.TryGetValue(connectionId, out managedQueue))
					managedQueue = CreateQueue(connectionId);
				managedQueue.Enqueue(msg);
			}
		}

		public AckableQueue<HubClientInvoker> CreateQueue(ConnectionId connectionId) {
			AckableQueue<HubClientInvoker> messageQueue = new AckableQueue<HubClientInvoker>();
			messageQueue.OnUnexpectedAckOrderId += (orderId, cause) => Log.SignalR(LogTag.ManagedQueue_OnUnexpectedAckOrderId, new { connectionId, orderId, cause });
			messageQueue.OnUnexpectedResendOrderIds += (cause) => Log.SignalR(LogTag.ManagedQueue_OnUnexpectedResendOrderIds, new { connectionId, cause });
			messageQueue.OnQueueOverflow += () => {
				Log.Warn(LogTag.ManagedQueue_OnQueueOverflow, new { connectionId });
				CleanConnection(connectionId);
				Clients.Client(connectionId).ResetClient();
			};
			
			messageQueue.OnMessages += (messages) => {
				Log.SignalROut(connectionId, messages);
				Clients.Client(connectionId).Do(messages);
			};
			MessageQueues.Add(connectionId, messageQueue);
			return messageQueue;
		}

		//========== Connection Methods ======================================================================================

		public int Ping(string connectionId, OrderId orderIdToAck)
		{
			// Update Last Seen record
			if (LastSeenConnections.ContainsKey(connectionId)) LastSeenConnections[connectionId] = DateTime.Now;
			else LastSeenConnections.Add(connectionId, DateTime.Now);

			MessageQueues[connectionId].Ack(orderIdToAck); // Ack messages
			return MessageQueues[connectionId].HighestQueuedOrderId; // Returned id of last queued message for the client to check if it is in sync
		}

		public void RequestResend(string connectionId, OrderId[] orderIds) {
			Log.SignalR(LogTag.ResendingMessages, new { orderIds});
			MessageQueues[connectionId].RequestResend(orderIds);
		}

		public virtual void CleanConnection(string connectionId) {
			Log.SignalR(LogTag.TextChatHub_CleaningConnection, new { connectionId });

			// Remove Message Queue for this connection. Queues are created only when needed, so they might not always exists
			if (MessageQueues.ContainsKey(connectionId)) {
				MessageQueues[connectionId].Reset();
				MessageQueues.Remove(connectionId);
			}
			
			// Remove all connections to rooms
			RoomsConnections.RemoveConnectionFromAllRooms(connectionId);

			// Remove User's Connection, and leave chat if this was the last connection
			if (UsersConnections.ContainsValue(connectionId)) { 
				UserId userId = UsersConnections.GetFromValue(connectionId); 
				UsersConnections.Remove(connectionId);
				if (!UsersConnections.ContainsKey(userId)) ChatCtrl.LeaveChat(userId);
			} else
				Log.Info(LogTag.TextChatHub_AlreadyCleaned);

			// Also remove LastSeen Info for this connection
			if (LastSeenConnections.ContainsKey(connectionId)) LastSeenConnections.Remove(connectionId);

		}

		//========== Background Methods ======================================================================================

		private void HeartbeatCheck() {
			try { // Try catch needed because errors are otherwised silenced, somehow :-(

				// Remove dead connections (Ping not received timely)
				foreach (var kvp in LastSeenConnections.ToList())
					if (kvp.Value < DateTime.Now.AddSeconds(-CleanZombieAfter)) {
						var connectionId = kvp.Key;
						Log.SignalR(LogTag.CleaningZombieConnection, new { connectionId });
						CleanConnection(connectionId);
					}

				// Remove inactive members from "crowded" rooms
				var chatState = ChatCtrl.GetState();
				foreach (var roomKvp in chatState.Rooms)
					if (roomKvp.Key.IsMonoLang() && roomKvp.Value.Count > BootAboveUserCount) {
						var mostInactiveUserKvp = roomKvp.Value.Aggregate((l, r) => l.Value.LastActive < r.Value.LastActive ? l : r);
						if (mostInactiveUserKvp.Value.LastActive < DateTime.Now.AddMinutes(-BootOutOfRoomAfter)) {
							Log.SignalR(LogTag.KickSlackerOutOfRoom, new {roomId = roomKvp.Key, userId = mostInactiveUserKvp.Key});
							// Get the list of connections that have to leave the room
							var userConnectionIds = UsersConnections.GetFromKey(mostInactiveUserKvp.Key)
								.Where(connId => RoomsConnections.HasConnection(roomKvp.Key, connId))
								.Select(connId => connId.ToString()).ToList();
							Clients.Clients(userConnectionIds).LeaveRoom(roomKvp.Key);
						}
					}

				// Check for inactive members
				foreach (var chatUser in chatState.AllUsers.Values)
					if (chatUser.LastActivity < DateTime.Now.AddMinutes(-UserIdleAfter)) {
						ChatCtrl.SetIdleStatus(chatUser.Id);
						Log.SignalR(LogTag.SetChatUserIdle, new { userId = chatUser.Id });
					}

				Log.SignalR(LogTag.HubHeartbeatCheckCompleted);
			} catch (Exception e) {
				Log.Error(LogTag.HeartbeatCheckError, e);
			}
		}

		private void PublishHealthReport() {
			var chatState = ChatCtrl.GetState();
			var report = new {
				HubAliveConnections = _heartBeat.GetConnections().Count,
				UsersConnectionsCount = UsersConnections.Count,
				UsersConnectionsValuesCount = UsersConnections.Values.Count,
				RoomsConnectionsCount = RoomsConnections.Count,
				RoomsConnectionsValuesCount = RoomsConnections.ValuesCount,
				ChatAllUsersCount = chatState.AllUsers.Count,
				ChatRoomsCounts = chatState.Rooms.Count,
				ChatRoomsUsersCounts = chatState.Rooms.Values.Sum(list => list.Count),
				ManagedQueuesCount, UnackedManagedQueuesCount,
				FullDetails= new { HubAliveConnections = _heartBeat.GetConnections().Select(conn => new { conn.ConnectionId, conn.IsAlive, conn.IsTimedOut }), UsersConnections = UsersConnections.All, RoomsConnections = RoomsConnections.All }
			};

			Log.SignalR(LogTag.ChatHubHealthReport, new { report });
		}

	}


}
