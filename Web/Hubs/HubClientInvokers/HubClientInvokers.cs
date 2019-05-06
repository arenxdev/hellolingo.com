using System.Collections.Generic;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;

namespace Considerate.Hellolingo.WebApp.Hubs
{
	public class AddInitialUsersInvoker: HubClientInvoker<List<ITextChatUser>>
	{
		public AddInitialUsersInvoker() { }
		public AddInitialUsersInvoker(List<ITextChatUser> users) : base(users) { }
	}

	public class AddPrivateChatStatusInvoker: HubClientInvoker<List<IPrivateChatStatus>>
	{
		public AddPrivateChatStatusInvoker() { }
		public AddPrivateChatStatusInvoker(List<IPrivateChatStatus> users) : base(users) { }
	}

	public class AddInitialUsersToInvoker : HubClientInvoker<RoomId, List<UserId>>
	{
		public AddInitialUsersToInvoker() { }
		public AddInitialUsersToInvoker(RoomId roomId, List<UserId> userIds) : base(roomId, userIds) { }
	}

	public class AddInitialMessagesInvoker : HubClientInvoker<List<ITextChatMessage>>
	{
		public AddInitialMessagesInvoker() { }
		public AddInitialMessagesInvoker(List<ITextChatMessage> messages): base(messages) { }
	}

	public class AddUserInvoker : HubClientInvoker<ITextChatUser>
	{
		public AddUserInvoker() { }
		public AddUserInvoker(ITextChatUser user) : base(user) { }
	}

	public class RemoveUserInvoker : HubClientInvoker<UserId>
	{
		public RemoveUserInvoker() { }
		public RemoveUserInvoker(UserId userId) : base(userId) { }
	}

	public class AddUserToInvoker : HubClientInvoker<RoomId, UserId>
	{
		public AddUserToInvoker() { }
		public AddUserToInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class RemoveUserFromInvoker : HubClientInvoker<RoomId, UserId>
	{
		public RemoveUserFromInvoker() { }
		public RemoveUserFromInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class MarkUserAsTypingInvoker : HubClientInvoker<RoomId, UserId>
	{
		public MarkUserAsTypingInvoker() { }
		public MarkUserAsTypingInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class UnmarkUserAsTypingInvoker : HubClientInvoker<UserId>
	{
		public UnmarkUserAsTypingInvoker() { }
		public UnmarkUserAsTypingInvoker(UserId userId) : base(userId) { }
	}

	public class AddMessageInvoker : HubClientInvoker<ITextChatMessage>
	{
		public AddMessageInvoker() { }
		public AddMessageInvoker(ITextChatMessage message) : base(message) { }
	}

	public class RequestAudioCallInvoker : HubClientInvoker<RoomId>
	{
		public RequestAudioCallInvoker() { }
		public RequestAudioCallInvoker(RoomId roomId) : base(roomId) { }
	}

	public class CancelAudioCallInvoker : HubClientInvoker<RoomId, UserId>
	{
		public CancelAudioCallInvoker() { }
		public CancelAudioCallInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class DeclineAudioCallInvoker : HubClientInvoker<RoomId, string>
	{
		public DeclineAudioCallInvoker() { }
		public DeclineAudioCallInvoker(RoomId roomId, string reason) : base(roomId, reason) { }
	}

	public class HangoutAudioCallInvoker : HubClientInvoker<RoomId, UserId>
	{
		public HangoutAudioCallInvoker() { }
		public HangoutAudioCallInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class AudioCallConnectedInvoker : HubClientInvoker<RoomId, UserId>
	{
		public AudioCallConnectedInvoker() { }
		public AudioCallConnectedInvoker(RoomId roomId, UserId userId) : base(roomId, userId) { }
	}

	public class SetUserIdleInvoker : HubClientInvoker<UserId>
	{
		public SetUserIdleInvoker() { }
		public SetUserIdleInvoker(UserId userId) : base(userId) { }
	}

	public class UpdateCountOfUsersInvoker : HubClientInvoker<RoomId, int>
	{
		public UpdateCountOfUsersInvoker() { }
		public UpdateCountOfUsersInvoker(RoomId roomId, int count) : base(roomId, count) { }
	}
	public class SetInitialCountOfUsersInvoker : HubClientInvoker<CountOfUsers>
	{
		public SetInitialCountOfUsersInvoker() { }
		public SetInitialCountOfUsersInvoker(CountOfUsers countOfUsers) : base(countOfUsers) { }
	}
	public class PrivateChatRequestResponse : HubClientInvoker<ListOfUsersPublicRooms>
	{
		public PrivateChatRequestResponse() { }
		public PrivateChatRequestResponse(ListOfUsersPublicRooms list) : base(list) { }
	}

}