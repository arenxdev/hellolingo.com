using System.Collections.Generic;
using System.Text.RegularExpressions;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers;

namespace Considerate.Hellolingo.Helpers
{
	public static class RoomIdHelpers
	{
		private static readonly HashSet<string> Languages = new HashSet<string> {
			"english", "spanish", "french", "japanese", "german", "italian", "chinese", "russian", "portuguese", "korean",
			"arabic", "bengali", "bosnian", "bulgarian", "cantonese", "catalan", "croatian", "czech", "danish", "dutch",
			"esperanto", "finnish", "greek", "hebrew", "hindi", "hungarian", "icelandic", "indonesian", "irish", "lithuanian",
			"norwegian", "persian", "polish", "romanian", "serbian", "slovak", "slovenian", "swahili", "swedish", "tagalog",
			"thai", "turkish", "ukrainian", "urdu", "vietnamese", "estonian", "albanian", "latvian", "malay", "mongolian",
			"macedonian", "kazakh", "belarusian", "georgian", "armenian"
		};
		private static readonly HashSet<string> Topics = new HashSet<string>{"hellolingo"};

		public static bool IsGroup(this RoomId roomId) => !IsPrivate(roomId);
		public static bool IsPublic(this RoomId roomId) => roomId.IsMonoLang() || roomId.IsDualLang() || roomId.IsTopic();
		public static bool IsSecret(this RoomId roomId) => IsGroup(roomId) && !IsPublic(roomId);
		public static bool IsTopic(this RoomId roomId) => Topics.Contains(roomId);
		public static bool IsMonoLang(this RoomId roomId) => Languages.Contains(roomId);
		
		// This is inefficient because it recompiles the regex at every call
		//public static bool IsDualLang(this RoomId roomId) => new Regex(@"^[a-z]+-[a-z]+$").IsMatch(roomId.ToString());
		//public static bool IsPrivate(this RoomId roomId) => new Regex(@"^\d+-\d+$").IsMatch(roomId.ToString());
		
		// This is efficient, because Regex retrieves the compiled expression from its cache.
		public static bool IsDualLang(this RoomId roomId) => Regex.IsMatch(roomId.ToString(), @"^[a-z]+-[a-z]+$");
		public static bool IsPrivate(this RoomId roomId) => Regex.IsMatch(roomId.ToString(), @"^\d+-\d+$");

		public static RoomType RoomType(this RoomId roomid)
		{
			if (roomid.IsPrivate()) return TextChatRoomTypes.Private;
			if (roomid.IsPublic()) return TextChatRoomTypes.Public;
			if (roomid.IsSecret()) return TextChatRoomTypes.Secret;

			throw new LogReadyException(LogTag.UnknownRoomType);
		}

		public static UserId PartnerId(this RoomId roomid, UserId thisUserId) => 
			((string)roomid).Replace(thisUserId.ToString(), "").Replace("-","");

	}
}
