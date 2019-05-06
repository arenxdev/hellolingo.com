using System;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Linq;
using System.Web.Mvc;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Controllers {

	// This could be used to prevent IE's aggressive caching of partial views
	// It's not used because a custom $httpProviders has been configured on the angular client to prevent this
	// [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]

	public class PartialsController : Controller
	{
		private IHellolingoEntities _db;

		private IHellolingoEntities Db => _db ?? (_db = new HellolingoEntities());

		public PartialsController() { }
		public PartialsController(IHellolingoEntities db)
		{
			_db = db;
		}

		//========== Guest Partial Pages  ======================================================================================

		[AllowAnonymous]
		public ActionResult Home() {
			//if (Request.IsAuthenticated && User.IsInRole("Something"))
			var culture = System.Threading.Thread.CurrentThread.CurrentCulture;
			var uiCulture = System.Threading.Thread.CurrentThread.CurrentUICulture;
			return PartialView();
		}

		[AllowAnonymous] public ActionResult SharedTalk() => PartialView(); 
		[AllowAnonymous] public ActionResult Livemocha() => PartialView(); 
		[AllowAnonymous] public ActionResult SharedLingo() => PartialView(); 
		[AllowAnonymous] public ActionResult Tt4You() { ViewBag.deadSiteNameAndOrLink = "TT4You"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult Xlingo() { ViewBag.deadSiteNameAndOrLink = "xLingo"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult LingoFriends() { ViewBag.deadSiteNameAndOrLink = "<a href=\"https://www.linkedin.com/company/lingofriends-com\" target =\"_blank\">LingoFriends</a>"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult Atisba() { ViewBag.deadSiteNameAndOrLink = "Atisba"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult LingApp() { ViewBag.deadSiteNameAndOrLink = "LingApp"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult VoxSwap() { ViewBag.deadSiteNameAndOrLink = "<a href=\"https://www.crunchbase.com/organization/voxswap#/entity\" target =\"_blank\">VoxSwap</a>"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult SpeakMania() { ViewBag.deadSiteNameAndOrLink = "SpeakMania"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult Palabea() { ViewBag.deadSiteNameAndOrLink = "<a href=\"https://www.crunchbase.com/organization/palabea#/entity\" target =\"_blank\">Palabea</a>"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult LingUp() { ViewBag.deadSiteNameAndOrLink = "<a href=\"https://www.linkedin.com/company/lingup\" target =\"_blank\">LingUp</a>"; return PartialView("Dead-Site-Generic"); }
		[AllowAnonymous] public ActionResult HuiTalk() { ViewBag.deadSiteNameAndOrLink = "<a href=\"http://killerstartups.com/social-networking/huitalk-com-a-new-way-to-learn-language\" target =\"_blank\">HuiTalk</a>"; return PartialView("Dead-Site-Generic"); }

		[AllowAnonymous]
		[ActionName("Terms-Of-Use")]
		public ActionResult TermsOfUse() => PartialView();

		[AllowAnonymous]
		[ActionName("Privacy-Policy")]
		public ActionResult PrivacyPolicy() => PartialView();

		[AllowAnonymous]
		[ActionName("Login")]
		public ActionResult LoginView() => PartialView();

		[AllowAnonymous]
		[ActionName("Signup")]
		public ActionResult SignupView() => PartialView();

		[AllowAnonymous]
		[ActionName("Find")]
		public ActionResult Search()
		{
			using (var db = new HellolingoEntities())
				ViewBag.membersCount = db.Users.Max(r => r.Id);
			return PartialView();
		}

		[AllowAnonymous]
		[ActionName("Made-By-Members")]
		public ActionResult MadeByMembers()
		{
			using (var db = new HellolingoEntities())
				ViewBag.membersCount = db.Users.Max(r => r.Id);
			return PartialView();
		}

		//========== User-only Partial Pages  ======================================================================================

		public ActionResult MailBox() => PartialView();

		[ActionName("Text-Chat")]
		public ActionResult TextChat() => PartialView();
		
	    [ActionName("Dashboard")]
		public ActionResult Dashboard() => PartialView();

		[ActionName("Profile")]
		public ActionResult UserProfile() => PartialView();

		//========== Angular Directive Templates  ======================================================================================

		[AllowAnonymous]
		[ActionName("Sign-Up-Directive")]
		public ActionResult SignUpDirective() => PartialView();

		[AllowAnonymous]
		[ActionName("Log-In-Directive")]
		public ActionResult LogInDirective() => PartialView();

		[AllowAnonymous]
		[ActionName("Contact-Us")]
		public ActionResult ContactUs() => PartialView();

	}
}