using System.Web.Mvc;
using System.Web.Routing;

namespace Considerate.Hellolingo.WebApp
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			// Warning! All usual entry point to the web app should go through Home/Index in order to get a new SessionTag
			routes.MapRoute("", "", new {controller = "Home", action = "Index"});
			routes.MapRoute("404", "404", new {controller = "Home", action = "Index"});
			routes.MapRoute("Find", "find/{id}", new { controller = "Home", action = "Index", id = UrlParameter.Optional });
			routes.MapRoute("FindByLanguages", "find/languages/{learn}/{known}", new { controller = "Home", action = "Index", learn = UrlParameter.Optional, known = UrlParameter.Optional });
			routes.MapRoute("ContactUs", "contact-us", new {controller = "Home", action = "Index"});
			routes.MapRoute("TermsOfUse", "terms-of-use", new {controller = "Home", action = "Index"});
			routes.MapRoute("PrivacyPolicy", "privacy-policy", new {controller = "Home", action = "Index"});

			// Dead site landing
			routes.MapRoute("SharedTalk", "sharedtalk", new { controller = "Home", action = "Index" });
			routes.MapRoute("Livemocha", "livemocha", new { controller = "Home", action = "Index" });
			routes.MapRoute("SharedLingo", "sharedlingo", new { controller = "Home", action = "Index" });
			routes.MapRoute("TT4You", "tt4you", new { controller = "Home", action = "Index" });
			routes.MapRoute("XLingo", "xlingo", new { controller = "Home", action = "Index" });
			routes.MapRoute("LingoFriends", "lingofriends", new { controller = "Home", action = "Index" });
			routes.MapRoute("Atisba", "atisba", new { controller = "Home", action = "Index" });
			routes.MapRoute("LingApp", "lingapp", new { controller = "Home", action = "Index" });
			routes.MapRoute("VoxSwap", "voxswap", new { controller = "Home", action = "Index" });
			routes.MapRoute("SpeakMania", "speakmania", new { controller = "Home", action = "Index" });
			routes.MapRoute("Palabea", "palabea", new { controller = "Home", action = "Index" });
			routes.MapRoute("LingUp", "lingup", new { controller = "Home", action = "Index" });
			routes.MapRoute("HuiTalk", "huitalk", new { controller = "Home", action = "Index" });

			// Features
			routes.MapRoute("MadeByMembers", "made-by-members", new { controller = "Home", action = "Index" });

			// Account
			routes.MapRoute("SignUp", "signup", new { controller = "Home", action = "Index" });
			routes.MapRoute("Account", "validate-email", new {controller = "Account", action="ValidateEmail"});
			routes.MapRoute("Login", "login", new { controller = "Home", action = "Index" });
			routes.MapRoute("Manage", "manage", new { controller = "Home", action = "Index" }); 
            routes.MapRoute("Profile", "profile", new { controller = "Home", action = "Index" });
			routes.MapRoute("ForgotPassword", "forgot-password", new { controller = "Account", action = "ForgotPassword" });
			routes.MapRoute("AccountManagment", "account/{action}", new { controller = "Account", action = "index" });
			routes.MapRoute("EmailNotConfirmed", "email-not-confirmed", new { controller = "Home", action = "Index" });

			// Mailbox
			routes.MapRoute("MailboxInbox", "mailbox/inbox", new { controller = "Home", action = "Index" });
			routes.MapRoute("MailboxArchives", "mailbox/archives", new { controller = "Home", action = "Index" });
			routes.MapRoute("MailboxUser", "mailbox/user/{id}/{isNew}", new { controller = "Home", action = "Index", isNew = UrlParameter.Optional });

			// TextChat
			routes.MapRoute("TextChat"             , "text-chat"                      , new { controller = "Home", action = "Index" });
			routes.MapRoute("TextChatLobby"        , "text-chat/lobby"                , new { controller = "Home", action = "Index" });
			routes.MapRoute("TextChatHistory"      , "text-chat/history"			  , new { controller = "Home", action = "Index" });
			routes.MapRoute("TextChatInvite"       , "text-chat/invite-from/{userId}" , new { controller = "Home", action = "Index" });
			routes.MapRoute("PublicTextChatRooms"  , "text-chat/in/{language}"        , new { controller = "Home", action = "Index", language = UrlParameter.Optional });
			routes.MapRoute("PrivateTextChatRooms" , "text-chat/with/{userId}/{name}" , new { controller = "Home", action = "Index", name = UrlParameter.Optional });
			routes.MapRoute("CustomTextChatRooms"  , "text-chat/room/{roomId}"        , new { controller = "Home", action = "Index" });
			routes.MapRoute("DualLangTextChatRooms", "text-chat/in/{langA}/{langB}"   , new { controller = "Home", action = "Index" });

			// Partials
			routes.MapRoute("Partials", "partials/{action}", new {controller = "Partials", action = "Home"});

			// Catch all MVC remaining routes
			routes.MapRoute("NotFound", "{*url}", new {controller = "NotFound", action = "index"});
		}
	}
}
