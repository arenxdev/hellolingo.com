using System;
using System.Collections.Generic;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers;

namespace Considerate.Hellolingo.TextChat {

	public class TextChatUser : ITextChatUser
	{
		public int  Id { get; set; }
		public FirstName FirstName { get; set; }
		public LastName LastName { get; set; }
		public byte Country { get; set; }
		public string Location { get; set; }
		public string Gender { get; set; }
		public int? Age { get; set; }
		public bool IsSharedTalkMember { get; set; }
		public bool HasJustLeft { get; set; } = false;
		public DateTime LastActivity { get; set; } = DateTime.Now;
		public bool IsNoPrivateChat { get; set; }
		
		public LangId Knows { get; set; }
		public LangId Learns { get; set; }
		public LangId Knows2 { get; set; }
		public LangId Learns2 { get; set; }
		public List<RoomId> JoinedRooms { get; } = new List<RoomId>();
		public RoomId RoomTypingIn { get; set; }
		public BetterTimer TypingTimer { get; set; } = new BetterTimer( (e) => { } );
	}

	public class TextChatMessage : ITextChatMessage{
		public DateTime When { get; set; } = DateTime.Now;
		public UserId UserId { get; set; }
		public DeviceTag DeviceTag { get; set; }
		public ConnectionId ConnectionId { get; set; }
		public RoomId RoomId { get; set; }
		public FirstName FirstName { get; set; }
		public LastName LastName { get; set; }
		public string Text { get; set; }
		public MessageVisibility Visibility { get; set; }
	}

	public class PrivateChatStatus: IPrivateChatStatus {
		public TextChatUser Partner { get; set; }
		public int StatusId { get; set; }
		public DateTime StatusAt { get; set; }
	}

	public class RoomId : NamedString {
		public RoomId(string value) : base(value) { }
		public static implicit operator RoomId(string value) { return new RoomId(value); }
	}

	public class RoomType : NamedString {
		public RoomType(string value) : base(value) { }
		public static implicit operator RoomType(string value) { return new RoomType(value); }
	}

	public class ConnectionId : NamedString {
		public ConnectionId(string value) : base(value) { }
		public static implicit operator ConnectionId(string value) { return new ConnectionId(value); } 
	}
}