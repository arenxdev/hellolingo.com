using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers;
using Ninject;
using Considerate.Hellolingo.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Considerate.Hellolingo.TextChat
{
	public class TextChatController
	{
		// Constants
		private const int HistoryLength = 150;

		// Fields
		public ChatModel ChatModel { get; set; }

		// Events
		public event Action<ITextChatUser> OnUserJoined;
		public event Action<UserId> OnUserLeft;
		public event Action<RoomId, UserId> OnUserJoinedRoom;
		public event Action<RoomId, UserId> OnUserLeftRoom;
		public event Action<RoomId, UserId> OnUserStartedTyping;
		public event Action<RoomId, UserId> OnUserStoppedTyping;
		public event Action<ITextChatMessage> OnPostedMessage;
		public event Action<RoomId, int> OnUserRequestedAudioCall;
		public event Action<RoomId, int> OnUserCancelledAudioCall;
		public event Action<RoomId, string, string> OnUserDeclinedAudioCall;
		public event Action<RoomId, int> OnUserHangoutedAudioCall;
		public event Action<RoomId, int> OnAudioCallConnected;
		public event Action<UserId> OnUserIdle;
		public event Action<RoomId, int> OnCountOfUsersUpdated;


		// Constructor
		public TextChatController() {
			Reset();
		}

		public void Reset()
		{
			ChatModel = Injection.Kernel.Get<ChatModel>();
		}

		// Simple Methods
		public List<ITextChatUser> GetUsersExcept(UserId except) => ChatModel.GetUsers(except);
		public List<ITextChatUser> GetUsersWhoJustLeft() => ChatModel.GetUsersWhoJustLeft();
		public CountOfUsers GetCountsOfUsers() => ChatModel.GetCountsOfUsers();
		public bool IsPresent(UserId id) => ChatModel.IsInChat(id);
		public ChatModelState GetState() => ChatModel.GetState();
		protected virtual async Task<User> GetUser(UserId userId) => await new HellolingoEntities().Users.AsNoTracking().Include(u => u.Status).FirstOrDefaultAsync(u => u.Id == userId);

		// Simple Helpers
		public static List<UserId> UserIdsInPrivateRoom(RoomId roomId) => roomId.ToString().Split('-').Select(id => (UserId)int.Parse(id)).ToList();
		public static UserId PartnerInPrivateRoom(RoomId roomId, UserId thisUserId) => UserIdsInPrivateRoom(roomId).First(id => id != thisUserId);

		public List<IPrivateChatStatus> GetPrivateChatStatuses(UserId userId) => ChatModel.GetPrivateChatStatuses(userId);

		public void JoinChat(UserId userId, TextChatUser textChatUser)
		{
			ChatModel.AddUserToChat(userId, textChatUser);
			OnUserJoined?.Invoke(textChatUser);
		}

		public void LeaveChat(UserId userId)
		{
			var user = ChatModel.GetUser(userId);
			foreach (var roomId in user.JoinedRooms.ToArray())
				LeaveRoom(userId, roomId);
			ChatModel.RemoveUserFromChat(userId);
			OnUserLeft?.Invoke(userId);
		}

		public void SetIdleStatus(UserId userId) => OnUserIdle?.Invoke(userId);

		public void SetLastActivity(UserId userId) => ChatModel.GetUser(userId).LastActivity = DateTime.Now;

		public virtual Tuple<List<UserId>, List<ITextChatMessage>> JoinRoom(UserId userId, RoomId roomId)
		{
			var user = ChatModel.GetUser(userId);

			// If the room is private and the user has nothing to do here, EXPLODE!
			if (roomId.IsPrivate() && !UserIdsInPrivateRoom(roomId).Contains(userId))
				throw new LogReadyException(LogTag.PrivateRoomIntrusionAttempt, new { userId, roomId } );

			if (!ChatModel.IsInRoom(roomId, user.Id))
			{
				ChatModel.AddUserToRoom(userId, roomId);
				OnUserJoinedRoom?.Invoke(roomId, user.Id);
				if (roomId.IsPublic())
					OnCountOfUsersUpdated?.Invoke(roomId, ChatModel.UsersCountOf(roomId));
			}

			var withVisibilities = new List<MessageVisibility> { MessageVisibility.Everyone, MessageVisibility.Sender, MessageVisibility.Ephemeral, MessageVisibility.News };

			var customMessageHistory = ChatModel.LatestMessagesIn(roomId, HistoryLength * 2, withVisibilities)
				.Where(a => (a.Visibility != MessageVisibility.Sender && a.Visibility != MessageVisibility.Ephemeral ) || a.UserId == userId)
				.Reverse().Take(HistoryLength).Reverse()
				.ToList();

			// If in a private room and the partner doesn't want private chat, Signal it with a service message
			if (roomId.IsGroup()) goto Skip;
			var partnerId = PartnerInPrivateRoom(roomId, userId);
			if (!ChatModel.IsInChat(partnerId)) goto Skip;
			var partner = ChatModel.GetUser(partnerId);
			if (partner.IsNoPrivateChat)
				customMessageHistory.Add(new TextChatMessage {
					RoomId = roomId,
					Text = JsonConvert.SerializeObject(new { noPrivateChat = ChatModel.GetPublicRoomsFor(partner.Id) }, Formatting.None, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }),
					Visibility = MessageVisibility.System
				});
			Skip:

			return new Tuple<List<UserId>, List<ITextChatMessage>>(
				ChatModel.UsersInRoom(roomId, user.Id),
				customMessageHistory
			);
		}

		public virtual void LeaveRoom(UserId userId, RoomId roomId)
		{
			ChatModel.RemoveUserFromRoom(userId, roomId);
			if (roomId.IsPublic())
				OnCountOfUsersUpdated?.Invoke(roomId, ChatModel.UsersCountOf(roomId));

			OnUserLeftRoom?.Invoke(roomId, userId);
		}

		public async Task PostTo(User fromUser, ITextChatMessage msg) {

			// Mark user as active
			SetLastActivity(fromUser.Id);

			// Propagate message
			OnPostedMessage?.Invoke(msg);
			
			// Unset typing
			ChatModel.UnsetAsTyping(fromUser.Id, silent: true); 

			// Add Message to chat model
			await ChatModel.AddMessageAsync(msg);

		}

		public async Task SetTypingActivity(UserId userId, RoomId roomId)
		{
			// Mark user as active
			SetLastActivity(userId);
			ChatModel.SetLastActiveInRoom(userId, roomId);

			// Mark user as Typing
			var onStartedTyping = new Action(() => OnUserStartedTyping?.Invoke(roomId, userId));
			var onStoppedTyping = new Action(() => OnUserStoppedTyping?.Invoke(roomId, userId));
			ChatModel.SetAsTyping(userId, roomId, onStartedTyping, onStoppedTyping);
		}

		public void RequestAudioCall(RoomId roomId, UserId userId) {
			SetLastActivity(userId);
			OnUserRequestedAudioCall?.Invoke(roomId, userId);
		}

		public void CancelAudioCall(UserId userId, RoomId roomId) => OnUserCancelledAudioCall?.Invoke(roomId, userId);
		public void DeclineAudioCall(RoomId roomId, string reason, ConnectionId connId) => OnUserDeclinedAudioCall?.Invoke(roomId, reason, connId);
		public void HangoutAudioCall(UserId userId, RoomId roomId) => OnUserHangoutedAudioCall?.Invoke(roomId, userId);
		public void AudioCallConnected(UserId userId, RoomId roomId) => OnAudioCallConnected?.Invoke(roomId, userId);

	}
}
