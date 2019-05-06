using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Security.Claims;
using System.Security.Principal;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.WebApp.Helpers {

	// This approach using and IControllerActivator might be to much
	// It might be better and more recommendede to Do an ActionFilter(aka FilterAttribute) (like MvcHandlerErrorAttribute or MvcLoggerFilterAttribute
	// on onInitialize or onResultExecuting

	public class CultureHelper {

		public const string DefaultUiCulture = "en";

		public static readonly Dictionary<string, string> UserLangsToUiCultures = new Dictionary<string, string> (StringComparer.InvariantCultureIgnoreCase)
		{
			/* English */	{"en", "en"}, {"en-GB"/*United Kingdom*/, "en"}, {"en-US"/*United States*/, "en"}, {"en-AU" /*Australia*/, "en"}, {"en-BZ" /*Belize*/, "en"} , {"en-CA" /*Canada*/, "en"},
							{"en-CB" /*Caribbean*/, "en"}, {"en-IE" /*Ireland*/, "en"}, {"en-JM" /*Jamaica*/, "en"}, {"en-NZ" /*New Zealand*/, "en"}, {"en-PH" /*Philippines*/, "en"},
							{"en-ZA" /*South Africa*/, "en"}, {"en-TT" /*Trinidad and Tobago*/, "en"}, {"en-ZW" /*Zimbabwe*/, "en"},
			/* French */	{"fr", "fr"}, {"fr-CH" /*Switzerland*/, "fr"}, {"fr-BE" /*Belgium*/, "fr"}, {"fr-CA" /*Canada*/, "fr"},
							{"fr-FR" /*France*/, "fr"}, {"fr-LU" /*Luxembourg*/, "fr"}, {"fr-MC" /*Monaco*/, "fr"},
			/* German */	{"de", "de"}, {"de-AT"/*Austria*/, "de"}, {"de-DE"/*Germany*/, "de"}, {"de-LI"/*Liechtenstein*/, "de"}, {"de-LU"/*Luxembourg*/, "de"}, {"de-CH"/*Switzerland*/, "de"},
			/* Japanese */	{"ja", "ja"}, {"ja-JP", "ja"},
			/* Italian */	{"it", "it"}, {"it-IT"/*Italy*/, "it"}, {"it-CH"/*Switzerland*/, "it"},
			/* Spanish */	{"es", "es"}, {"es-AR"/*Argentina*/, "es"}, {"es-BO"/*Bolivia*/, "es"}, {"es-CL"/*Chile*/, "es"}, {"es-CO"/*Colombia*/, "es"}, {"es-CR"/*Costa Rica*/, "es"},
							{"es-DO"/*Dominican Republic*/, "es"}, {"es-EC"/*Ecuador*/, "es"}, {"es-SV"/*El Salvador*/, "es"}, {"es-GT"/*Guatemala*/, "es"}, {"es-HN"/*Honduras*/, "es"},
							{"es-MX"/*Mexico*/, "es"}, {"es-NI"/*Nicaragua*/, "es"}, {"es-PA"/*Panama*/, "es"}, {"es-PY"/*Paraguay*/, "es"}, {"es-PE"/*Peru*/, "es"}, 
							{"es-ES"/*Spain*/, "es"}, {"es-UY"/*Uruguay*/, "es"}, {"es-VE"/*Venezuela*/, "es"}, {"es-PR"/*Puerto Rico*/, "es"},
			/* Korean */	{"ko", "ko"}, {"ko-KR"/*Korean - Korea*/, "ko"},
			/* Portuguese */{"pt", "pt-BR"}, {"pt-BR"/*Portuguese - Brazil*/, "pt-BR"}, {"pt-PT"/*Portuguese - Portugal*/, "pt-BR"},
			/* Dutch */		{"nl", "nl"}, {"nl-BE" /*Dutch - Belgium*/, "nl"}, { "nl-NL" /*Dutch - The Netherlands*/, "nl"}, { "af-ZA" /*Afrikaans-South Africa*/, "nl"},
			/* Russian */	{"ru", "ru"}, {"ru-RU", "ru"},
			/* Chinese */	{"zh", "zh-CN"}, {"zh-CN"/*Chinese(Simplified)*/, "zh-CN"}, {"zh-HK", /*Hong Kong SAR*/ "zh-CN"}, {"zh-MO", /*Macau SAR*/ "zh-CN"}, {"zh-SG", /*Singapore*/ "zh-CN"}, {"zh-TW", /*Taiwan*/ "zh-CN"}, {"zh-CHT", /*Chinese(Traditional)*/ "zh-CN"},
			/* Hebrew */	{"he", "he"}, {"he-IL"/*Hebrew - Israel*/, "he"},
			/* Turkish */	{"tr", "tr"}, {"tr-TR"/*Turkish - Turkey*/, "tr"},
			/* Czech */		{"cs", "cs"}, {"cs-CZ"/*Czech - Czech Republic*/, "cs"},
			/* Vietnamese */{"vi", "vi"}, {"vi-VN"/*Vietnamese - Vietnam*/, "vi"},
			/* Greek */		{"el", "el"}, {"el-GR"/*Greek - Greece*/, "el"},

			// Arabic: ar-DZ Algeria, ar-BH Bahrain, ar-EG Egypt, ar-IQ Iraq, ar-JO Jordan, ar-KW Kuwait, ar-LB Lebanon, ar-LY Libya, ar-MA Morocco, ar-OM Oman, ar-QA Qatar, ar-SA Saudi Arabia, ar-SY Syria, ar-TN Tunisia, ar-AE United Arab Emirates, ar-YE Yemen
			// Estonian: et / DON'T USE 'et' because we hijacked it to support esperanto, which is a culture not supported on the production server, and the client can request 'et' and expect Esperanto
			// Others: hy-AM Armenian - Armenia, Cy-az-AZ Azeri(Cyrillic) - Azerbaijan, Lt-az-AZ Azeri(Latin) - Azerbaijan, eu-ES Basque - Basque, be-BY Belarusian - Belarus, bg-BG Bulgarian - Bulgaria, ca-ES Catalan - Catalan, hr-HR Croatian - Croatia, 
			//		   da-DK Danish - Denmark, div-MV Dhivehi - Maldives, et-EE Estonian - Estonia, fo-FO Faroese - Faroe Islands, fa-IR Farsi - Iran, fi-FI Finnish - Finland, gl-ES Galician - Galician, ka-GE Georgian - Georgia, gu-IN Gujarati - India, 
			//		   hi-IN Hindi - India, hu-HU Hungarian - Hungary, is-IS Icelandic - Iceland, id-ID Indonesian - Indonesia, kn-IN Kannada - India, kk-KZ Kazakh - Kazakhstan, kok-IN Konkani - India, ky-KZ Kyrgyz - Kazakhstan, lv-LV Latvian - Latvia
			//		   lt-LT Lithuanian - Lithuania, mk-MK Macedonian(FYROM), ms-BN Malay - Brunei, ms-MY Malay - Malaysia, mr-IN Marathi - India, mn-MN Mongolian - Mongolia, nb-NO Norwegian(Bokmål) - Norway, nn-NO Norwegian(Nynorsk) - Norway, pl-PL Polish - Poland, pa-IN Punjabi - India
			//		   ro-RO Romanian - Romania, sa-IN Sanskrit - India, Cy-sr-SP Serbian(Cyrillic) - Serbia, Lt-sr-SP Serbian(Latin) - Serbia, sk-SK Slovak - Slovakia, sl-SI Slovenian - Slovenia, sw-KE Swahili - Kenya, sv-FI Swedish - Finland, sv-SE Swedish - Sweden, syr-SY Syriac - Syria
			//		   ta-IN Tamil - India, tt-RU Tatar - Russia, te-IN Telugu - India, th-TH Thai - Thailand, uk-UA Ukrainian - Ukraine, ur-PK Urdu - Pakistan, Cy-uz-UZ Uzbek(Cyrillic) - Uzbekistan, Lt-uz-UZ Uzbek(Latin) - Uzbekistan
	};


		public class CultureAwareControllerActivator : IControllerActivator
		{
			public IController Create(RequestContext requestContext, Type controllerType)
			{
				// Determine and set culture for the user thread
				var uiCultureFromCookie = CookieHelper.GetValue(CookieHelper.CookieNames.UiCulture, requestContext.HttpContext.Request);
				var userAcceptedLanguages = requestContext.HttpContext.Request.UserLanguages ?? new string[0];
				SetUserCulture(requestContext.HttpContext.Request, uiCultureFromCookie, userAcceptedLanguages);

				// Obscure but necessary code
				return DependencyResolver.Current.GetService(controllerType) as IController;
			}

			public void SetUserCulture(HttpRequestBase request, string cookieCulture = null, string[] acceptedLanguages = null)
			{
				// Set appropriate culture for the thread.
				var hostname = request.Url != null ? request.Url.Host : "";
				var uiCulture = GetCultureFromOptions(cookieCulture, acceptedLanguages, hostname);
				SetCurrentCultureInThread(uiCulture);

				// Update culture preferences for this user
				if(request.IsAuthenticated) {
					var userIdentity = request.RequestContext.HttpContext.User.Identity;
					string userUiCulture = userIdentity.GetClaims().UserCulture;
					if(userUiCulture == null || !userUiCulture.Equals(uiCulture, StringComparison.InvariantCulture))
						UpdateUserUiCulture(request, uiCulture, userIdentity);
				}
			}
		}

		private static void UpdateUserUiCulture(HttpRequestBase request, string uiCulture, IIdentity userIdentity)
		{
			//Andriy: Difficult to test this method, not fully clear how to correct inject database access in this code
			string aspNetUserId = userIdentity.GetUserId();
			//Update user Ui Culture in database
			var db = request.GetOwinContext().Get<HellolingoEntities>();
			AspNetUser user = db.AspNetUsers.Find(aspNetUserId);
			if(user == null)
			{
				Log.Warn(LogTag.CultureAwareActivator_UserNotFound, request, new { AspNetUserId = aspNetUserId });
				return;
			}
			user.UiCulture = uiCulture;
			db.SaveChanges();
			//Update user claims with new Ui Culture.
			var signInManager = request.GetOwinContext().Get<ApplicationSignInManager>();
			signInManager.AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
			var applicationUserManager = request.GetOwinContext().GetUserManager<ApplicationUserManager>();
			ClaimsIdentity newUserIdentity = user.GenerateUserIdentity(applicationUserManager);
			signInManager.AuthenticationManager.SignIn(newUserIdentity);
		}

		public static string GetCultureFromOptions(string cookieCulture = null, string[] acceptedLanguages = null, string hostName = "", string defaultCulture = DefaultUiCulture)
		{
			// Check for null values
			if (acceptedLanguages == null) acceptedLanguages = new string[] {};

			// Why aren't we applying this?
			// if (!UserLangsToUiCultures.ContainsValue(cookieCulture)) cookieCulture = null; // nullify cookieCulture if it's not a valid one

			// Dump the culture from the cookie if it's not known on the system (happens with corrupted/tampered with cookies)
			if (CultureInfo.GetCultures(CultureTypes.AllCultures).All(culture => culture.Name != cookieCulture))
				cookieCulture = null;

			// Extract potential culture from domain name (e.g.: fr.hellolingo.com)
			var subDomain = hostName.Split('.')[0];
			var cultureFromHostName = UserLangsToUiCultures.ContainsKey(subDomain)? subDomain : null;

			return cookieCulture
				?? cultureFromHostName
			    ?? GetSupportedUiCultureFromLanguages(acceptedLanguages)
			    ?? defaultCulture;
		}

		public static string GetCurrentCulture() {
			return Thread.CurrentThread.CurrentCulture.Name;
		}

		public static void SetCurrentCultureInThread(string culture) {
			CultureInfo cultureInfo = CultureInfo.GetCultureInfo(culture);
			Thread.CurrentThread.CurrentCulture = cultureInfo;
			Thread.CurrentThread.CurrentUICulture = cultureInfo;
		}

		public static string GetSupportedUiCultureFromLanguages(string[] languages) {
			// languages can look like this: ["da", "en-gb;q=0.8", "en;q=0.7"]
			// We ignore the q value (weight), so a little bit of cleanup is necessary
			var cleanedLanguages = languages.Select(a => a.Split(';')[0]);

			// Get and return the UI Culture first language matching a supported UI Culture
			var matchingLang = cleanedLanguages.FirstOrDefault(a => UserLangsToUiCultures.ContainsKey(a));
			return matchingLang == null ? null : UserLangsToUiCultures[matchingLang];
		}
	}
}

