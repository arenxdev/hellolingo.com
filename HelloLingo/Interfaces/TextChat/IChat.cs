using System;
using System.Collections.Generic;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.TextChat {

	[JsonObject(MemberSerialization.OptIn)]
	public interface ITextChatMessage {
		[JsonProperty("roomId")]	RoomId RoomId { get; set; }
		[JsonProperty("firstName")]	FirstName FirstName { get; set; }
		[JsonProperty("lastName")]	LastName LastName { get; set; }
		[JsonProperty("text")]		string Text { get; set; }
									DateTime When { get; }
									ConnectionId ConnectionId { get; set; }
	    [JsonProperty("userId")]    UserId UserId { get; set; }
									DeviceTag DeviceTag { get; set; }
									MessageVisibility Visibility { get; set; }
	}

	[JsonObject(MemberSerialization.OptIn)]
	public interface ITextChatUser {
		
		[JsonProperty("id")]		          int Id { get; set; }
		[JsonProperty("firstName")]		      FirstName FirstName { get; set; }
		[JsonProperty("knows")]			      LangId Knows { get; set; }
		[JsonProperty("learns")]		      LangId Learns { get; set; }
		[JsonProperty("knows2")]			  LangId Knows2 { get; set; }
		[JsonProperty("learns2")]		      LangId Learns2 { get; set; }
		[JsonProperty("roomTypingIn")]	      RoomId RoomTypingIn { get; set; }
		[JsonProperty("lastName")]            LastName LastName { get; set; }
		[JsonProperty("country")]             byte Country { get; set; }
		[JsonProperty("location")]            string Location { get; set; }
		[JsonProperty("gender")]              string Gender { get; set; }
		[JsonProperty("age")]                 int? Age { get; set; }
		[JsonProperty("isSharedTalkMember")]  bool IsSharedTalkMember { get; set; }
		[JsonProperty("hasJustLeft")]         bool HasJustLeft { get; set; }
								              DateTime LastActivity { get; set; }
											  bool IsNoPrivateChat { get; set; }
											  BetterTimer TypingTimer { get; set; }
											  List<RoomId> JoinedRooms { get; }
	}

	[JsonObject(MemberSerialization.OptIn)]
	public interface IPrivateChatStatus {
		[JsonProperty("partner")]	TextChatUser Partner { get; set; }
		[JsonProperty("statusId")]	int StatusId { get; set; }
		[JsonProperty("statusAt")]	DateTime StatusAt { get; set; }
	}

}