/// <reference path="stateshelper.ts" />
/// <reference path="state.ts" /> 

module States {

	export const home          = new State("root.home"          , "^/", true);
	export const termsOfUse    = new State("root.terms-of-use"  , "^/terms-of-use");
	export const privacyPolicy = new State("root.privacy-policy", "^/privacy-policy");
	export const contactUs     = new State("root.contact-us"    , "^/contact-us", true);                            

	// Account and settings
	export const signup            = new State("root.signup"                  , "^/signup", true);
	export const login             = new State("root.login"                   , "^/login");
	export const profile           = new State("root.profile"                 , "^/profile", true);
	export const emailNotConfirmed = new State("root.home.email-not-confirmed", "^/email-not-confirmed", true, { templateLess: true });

	// Closed Communities
	export const sharedTalk   = new State("root.sharedtalk", "^/sharedtalk");
	export const livemocha    = new State("root.livemocha" , "^/livemocha");
	export const sharedlingo  = new State("root.sharedlingo" , "^/sharedlingo");
	export const tt4You       = new State("root.tt4you" , "^/tt4you");
	export const xLingo       = new State("root.xlingo" , "^/xlingo");
	export const lingoFriends = new State("root.lingofriends" , "^/lingofriends");
	export const atisba       = new State("root.atisba" , "^/atisba");
	export const lingApp      = new State("root.lingapp" , "^/lingapp");
	export const voxSwap      = new State("root.voxswap" , "^/voxswap");
	export const speakMania   = new State("root.speakmania", "^/speakmania");
	export const palabea      = new State("root.palabea", "^/palabea");
	export const lingUp       = new State("root.lingup", "^/lingup");
	export const huiTalk      = new State("root.huitalk", "^/huitalk");

	// Features
	export const featureI18N        = new State("root.made-by-members", "^/made-by-members");

	// Find
	export const find              = new State("root.find"            , "^/find"           ,   true, { deepStateRedirect: { default: "root.find.languages" } } );
	export const findByLanguages   = new State("root.find.languages"  , "^/find/languages/{known}/{learn}", true, { templateLess: true });
	export const findByName        = new State("root.find.name"       , "^/find/name"      ,   true, { templateLess: true });
	export const findBySharedTalk  = new State("root.find.sharedtalk" , "^/find/sharedtalk",   true, { templateLess: true });
	export const findByLivemocha   = new State("root.find.livemocha"  , "^/find/livemocha" ,   true, { templateLess: true });
	export const findBySharedLingo = new State("root.find.sharedlingo", "^/find/sharedlingo" , true, { templateLess: true });

	// Mailbox
	export const mailbox         = new State("root.mailbox"      ,    "^/mailbox"                  , true, { deepStateRedirect: { default: "root.mailbox.inbox" } });
	export const mailboxInbox    = new State("root.mailbox.inbox",    "^/mailbox/inbox"            , true, { templateLess: true });
	export const mailboxArchives = new State("root.mailbox.archives", "^/mailbox/archives"         , true, { templateLess: true });
	export const mailboxUser     = new State("root.mailbox.user",     "^/mailbox/user/{id}/{isNew}", true, { templateLess: true });

	// Text Chat
	export const textChat               = new State("root.text-chat",         "^/text-chat"               , true, { deepStateRedirect: { default: "root.text-chat.lobby" } });
	export const textChatLobby          = new State("root.text-chat.lobby",   "/lobby"                    , true, { templateLess: true });
	export const textChatHistory        = new State("root.text-chat.history", "/history"                  , true, { templateLess: true });
	export const textChatInvite         = new State("root.text-chat.invite",  "/invite-from/{userId}"     , true, { templateLess: true });
	export const textChatRoomPrivate    = new State("root.text-chat.private", "/with/{userId}/{firstName}", true, { templateLess: true });
	export const textChatRoomPublic     = new State("root.text-chat.public",  "/in/{roomId}"              , true, { templateLess: true });
	export const textChatRoomCustom     = new State("root.text-chat.custom",  "/room/{roomId}"            , true, { templateLess: true });
	export const textChatRoomDualLang   = new State("root.text-chat.dual",    "/in/{langA}/{langB}"       , true, { templateLess: true });

}