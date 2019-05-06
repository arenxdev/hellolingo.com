using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.Helpers;
using Considerate.Hellolingo.Regulators;
using Considerate.Helpers;

namespace Considerate.Hellolingo.TextChat
{
	public class ChatModel
	{
		private const int TypingTimeOut = 20;
		private const int MinimumHistoryLength = 500; // 500 lines of history should allow all requests to have enough history to work with.
		private const int InvalidateHistoryEvery = 60*60; // 60 minutes 
		private const int InvalidateHellolingoRoomHistoryEvery = 5*60; // 5 minutes 
		private const float PreservedQuittersRatio = .1f; // 1/10 (was .166f = 1/6)

		private readonly Dictionary<RoomId, RoomModel> _rooms = new Dictionary<RoomId, RoomModel>();
		private readonly Dictionary<UserId, ITextChatUser> _allUsers = new Dictionary<UserId, ITextChatUser>();
		private readonly List<ITextChatUser> _usersWhoJustLeft = new List<ITextChatUser>();

		private readonly ITextChatStorage _storage;
		private readonly object _locker = new object();
		private readonly Action<Exception> _onInvalidateHistoryError = e => { throw e; };

		public ChatModel(ITextChatStorage storage)
		{
			_storage = storage;
			new BetterTimer(_onInvalidateHistoryError){ AutoReset = true }.Start(null, InvalidateAllRoomsHistory, InvalidateHistoryEvery);
			new BetterTimer(_onInvalidateHistoryError){ AutoReset = true }.Start(null, InvalidateHellolingoRoomHistory, InvalidateHellolingoRoomHistoryEvery);
		}

		public bool HasUser(UserId userId) => _allUsers.ContainsKey(userId);
		public ITextChatUser GetUser(UserId userId) => _allUsers[userId];
		public bool HasRoom(RoomId roomId) => _rooms.ContainsKey(roomId);
		public bool IsInRoom(RoomId roomId, UserId userId) => HasRoom(roomId) && _rooms[roomId].HasUser(userId);
		public bool IsEmpty(RoomId roomId) => !_rooms[roomId].Users.Any();
		public bool IsInChat(UserId id) => _allUsers.ContainsKey(id);
		public void CloseRoom(RoomId roomId) => _rooms.Remove(roomId);
		public int UsersCountOf(RoomId roomId) => _rooms[roomId].Users.Count;
		public List<RoomId> GetPublicRoomsFor(UserId userId) => GetUser(userId)?.JoinedRooms?.Where(id => id.IsPublic()).ToList();
		public ITextChatMessage LastMessageIn(RoomId roomId) => _rooms.ContainsKey(roomId) ? _rooms[roomId].LastMessage : null;
		public List<UserId> UsersInRoom(RoomId roomId, UserId except = null) => _rooms[roomId].Users.Keys.Where(r => r != except).ToList();
		public List<ITextChatUser> GetUsers(UserId except) => _allUsers.Where(a => a.Key != except).Select(a => a.Value).ToList();
		public List<ITextChatUser> GetUsersWhoJustLeft() => _usersWhoJustLeft;
		public List<IPrivateChatStatus> GetPrivateChatStatuses(UserId userId) => _storage.GetPrivateChatStatuses(userId);
		public bool IsTypingInRoom(ITextChatUser user, RoomId roomId) => user.TypingTimer.Running && user.RoomTypingIn == roomId;
		public static RoomId PrivateRoomIdFrom(UserId userId, UserId partnerId) => partnerId < userId ? $"{partnerId}-{userId}" : $"{userId}-{partnerId}";

		public static UserId PartnerIdFrom (RoomId roomId, UserId userId) {
			var userIds = roomId.ToString().Split('-').Select(int.Parse).ToArray();
			return userId == userIds[0] ? userIds[1] : userIds[0];
		}

		public CountOfUsers GetCountsOfUsers()
		{
			return new CountOfUsers {
				// Horrible hack to select only the count for public rooms. That will surely fail as soon as we have custom rooms.
				// We should have roomTypes (public, private, custom)
				ForPublicRooms = _rooms.Where(r => !r.Key.Value.Contains("-")).ToDictionary(r => r.Key, r => r.Value.Users.Count),
				InPrivateRooms = _rooms.Where(r => r.Key.Value.Contains("-")).Sum(r => r.Value.Users.Count),
				InSecretRooms = _allUsers.Count / 10 // This number is fake, because figuring out which rooms are secret isn't easy with the current design
			};
		}

		public List<ITextChatMessage> LatestMessagesIn(RoomId roomId, int messageCount, List<MessageVisibility> withVisibilities = null) {
			if (withVisibilities == null)
				withVisibilities = new List<MessageVisibility> {MessageVisibility.Everyone};

			return HasRoom(roomId) && _rooms[roomId].ValidHistory
				? _rooms[roomId].Messages.Where(msg => withVisibilities.Contains(msg.Visibility)).Reverse().Take(messageCount).Reverse().ToList()
				: _storage.GetHistory(roomId, withVisibilities, messageCount);
		}

		public int CountOfMessagesInRoom(RoomId roomId) => LatestMessagesIn(roomId, MinimumHistoryLength).Count;

		public void AddUserToChat(UserId userId, TextChatUser user)
		{
			if (!_allUsers.ContainsKey(userId))
				_allUsers.Add(userId, user);
			_usersWhoJustLeft.RemoveAll(r => r.Id == userId);
		}

		public void RemoveUserFromChat(UserId userId)
		{
			var user = GetUser(userId);
			user.TypingTimer.Cancel();
			user.HasJustLeft = true;
			_usersWhoJustLeft.Add(user);
			while (_usersWhoJustLeft.Count - 1 >= (_allUsers.Count) * PreservedQuittersRatio)
				_usersWhoJustLeft.RemoveAt(0); // Limit length of the list
			_allUsers.Remove(userId);
		}

		public void AddUserToRoom(UserId userId, RoomId roomId)
		{
			var user = _allUsers[userId];
			PrepareRoom(roomId);
			_rooms[roomId].AddUser(user.Id);
			user.JoinedRooms.Add(roomId);
		}

		private void PrepareRoom(RoomId roomId) {
			lock (_locker) {
				if (!HasRoom(roomId)) _rooms.Add(roomId, new RoomModel());

				if (!_rooms[roomId].ValidHistory) {
					var withVisibilities = new List<MessageVisibility> { MessageVisibility.Everyone, MessageVisibility.Ephemeral, MessageVisibility.Sender, MessageVisibility.News };
					_rooms[roomId].Messages = LatestMessagesIn(roomId, MinimumHistoryLength, withVisibilities);
					_rooms[roomId].ValidHistory = true;
				}
			}
		}

		public void RemoveUserFromRoom(UserId userId, RoomId roomId)
		{
			var user = GetUser(userId);
			_rooms[roomId].RemoveUser(user.Id);
			_allUsers[userId].JoinedRooms.Remove(roomId);
		}

		public async Task AddMessageAsync(ITextChatMessage msg)
		{
			if (_rooms.ContainsKey(msg.RoomId)) // The room isn't necessarily loaded (e.g.: ChatRequest is sent, but no one has joined the room yet)
				_rooms[msg.RoomId].AddMessage(msg);
			await _storage.AddMessageAsync(msg);
		}

		public ChatModelState GetState()
		{
			var state = new ChatModelState
			{
				AllUsers = _allUsers
			};
			foreach (var keyValuePair in _rooms)
			{
				var roomId = keyValuePair.Key;
				var roomModel = keyValuePair.Value;
				state.Rooms.Add(roomId, roomModel.Users);
			}
			return state;
		}

		public void SetLastActiveInRoom(UserId userId, RoomId roomId) => _rooms[roomId].Users[userId].LastActive = DateTime.Now;

		public void SetAsTyping(UserId userId, RoomId roomId, Action onStartedTyping, Action onStoppedTyping)
		{
			// Update Activity Tracker for that user/room
			SetLastActiveInRoom(userId, roomId);

			// if the user is already typing in the room, just prolonge the typing duration
			var chatUser = GetUser(userId);
			if (chatUser.TypingTimer.Running && chatUser.RoomTypingIn == roomId) {
				chatUser.TypingTimer.ReTime(TypingTimeOut);
				return;	
			}

			// if the user has switched to another room, complete is current existing activity
			if (chatUser.TypingTimer.Running && chatUser.RoomTypingIn != roomId)
				UnsetAsTyping(chatUser.Id);

			var onStoppedTypingEnhanced = new Action(() =>
			{
				onStoppedTyping?.Invoke();
				chatUser.RoomTypingIn = null;
			});

			// Start the tracker
			chatUser.TypingTimer.Start(onStartedTyping, onStoppedTypingEnhanced, TypingTimeOut);
			chatUser.RoomTypingIn = roomId;
		}

		public void UnsetAsTyping(UserId userId, bool silent = false)
		{
			var user = GetUser(userId);
			if (silent) user.TypingTimer.Cancel();
			else user.TypingTimer.Complete();
			user.RoomTypingIn = null;
		}

		private void InvalidateAllRoomsHistory() => InvalidateHistory(false);
		private void InvalidateHellolingoRoomHistory() => InvalidateHistory(true);
		private void InvalidateHistory(bool hellolingoRoomOnly) {
			lock (_locker)
			{
				var roomsToClose = new List<RoomId>();	
				foreach (var kvp in _rooms) {
					var roomId = kvp.Key;
					if (hellolingoRoomOnly && roomId != "hellolingo") continue;
					if (IsEmpty(roomId)) roomsToClose.Add(roomId);
					else kvp.Value.ValidHistory = false;
				}
				foreach (var roomId in roomsToClose) CloseRoom(roomId);
			}
		}

	}

	public class CountOfUsers
	{
		public Dictionary<RoomId, int> ForPublicRooms;
		public int InPrivateRooms;
		public int InSecretRooms;
	}

	public class ChatModelState
	{
		public Dictionary<UserId, ITextChatUser> AllUsers { get; set; }
		public Dictionary<RoomId, Dictionary<UserId, RoomUser>> Rooms { get; } = new Dictionary<RoomId, Dictionary<UserId, RoomUser>>();
	}

	public class ListOfUsersPublicRooms {
		public UserId UserId;
		public List<RoomId> RoomIds;
		public bool IsNoPrivateChat { get; set; }
	}

}