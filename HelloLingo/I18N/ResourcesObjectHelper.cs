using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Considerate.Hellolingo.I18N
{
	public static class ResourcesObjectHelper
	{
		public static object GetTextChatResources()
		{
			return new {
				Audio = new {
					Busy                       = TextChatResource.Audio_Busy,
					UnsupportedDevice          = TextChatResource.Audio_Unsupported_Device,
					UnsupportedBrowser         = TextChatResource.Audio_Unsupported_Browser,
					UnsupportedJoin            = TextChatResource.Audio_Unsupported_Join,
					DeclineUnsupportedDevice   = TextChatResource.Audio_Decline_Unsupported_Device,
					DeclineUnsupportedBrowser  = TextChatResource.Audio_Decline_Unsupported_Browser,
					DeclineBusy                = TextChatResource.Audio_Decline_Busy,
					PeerDeclined               = TextChatResource.Audio_Peer_Declined,
					PeerUnsupported            = TextChatResource.Audio_Peer_Unsupported,
					PeerBusy                   = TextChatResource.Audio_Peer_Busy,
					Hangout                    = TextChatResource.Audio_Hangout,
					PeerHangout                = TextChatResource.Audio_Peer_Hangout,
					PeerDisconnected           = TextChatResource.YourPartnerIsOffline,
					YoureConnected             = TextChatResource.Audio_YoureConnected,
				}
			};
		}

		public static Dictionary<string,string> GetCountriesResources()
		{
			var countries = new Dictionary<string,string>();

			Type resourceType = typeof (CountriesResource);
			foreach(var countryProp in resourceType.GetProperties())
				if(Regex.IsMatch(countryProp.Name, @"^C\d{1,3}$"))
					countries.Add(countryProp.Name, ( string )countryProp.GetValue(null, null));

			return countries;
		}

		public static object GetStatesTitles() => new {
			home                    = StringsFoundation.PageTitle_Home,
			termsOfUse              = StringsFoundation.TermsOfUse,
			privacyPolicy           = StringsFoundation.PrivacyPolicy,
			contactUs               = StringsFoundation.ContactUs,

			signup                  = StringsFoundation.JoinUs,
			login                   = StringsFoundation.LogIn,
			profile                 = MainStrings.MyProfile,

			sharedTalk              = StringsFoundation.PageTitle_SharedTalk,
			livemocha               = StringsFoundation.PageTitle_Livemocha,
			sharedlingo             = StringsFoundation.PageTitle_SharedLingo,

			featureI18N             = StringsFoundation.BuiltByMembers,

			find                    = MainStrings.FindTitle,
			findByLanguages         = PageTitleResource.PageTitle_FindByLanguages,
			findByName              = PageTitleResource.PageTitle_FindByName,
			findBySharedTalk        = PageTitleResource.PageTitle_FindBySharedTalk,
			findByLivemocha         = PageTitleResource.PageTitle_FindByLivemocha,

			mailbox                 = MainStrings.MyMailbox,
			mailboxInbox            = MainStrings.MyMailbox,
			mailboxArchives         = MainStrings.MyMailbox,
			mailboxUser             = MainStrings.MyMailbox,

			textChat                = StringsFoundation.TextChat,
			textChatLobby           = PageTitleResource.PageTitle_TextChatLobby,
			textChatRoomPrivate     = MainStrings.PrivateChat,
			textChatRoomPublic      = MainStrings.TextChatTitle,
			textChatInvites         = PageTitleResource.PageTitle_TextChatRoomInvitations,
			textChatRoomCustom      = TextChatResource.SecretRooms,

			voiceOut                = MainStrings.VoiceOutTitle,
			voiceOutLobby           = MainStrings.VoiceOutTitle,
			voiceOutInvite          = MainStrings.VoiceOutTitle,
			voiceOutRequests        = MainStrings.VoiceOutTitle,
		};
	}
}
