using System.Web.Mvc;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.WebApp.CustomFilters;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Controllers
{
	[AllowAnonymous]
	public class HomeController : Controller
	{
		[LastVisitFilter]
		public ActionResult Index()
		{
			// === Bypass HEAD requests ====
			// We don't need to handle these in the same way as a get request
			// They are requests from web crawlers, caching proxies and the likes
			// They also often pollute the log files with RejectedBrowser events
			if (Request.RequestType == "HEAD") {
				Log.Info(LogTag.IgnoredHeadRequest, Request, new { Request.UserAgent });
				return View();
			}

			// === CHECK BROWSER SUPPORT====
			// We do it before unecessarily assigning a Device and Session Tag
			// Especially because some of these calls are from bots and caching proxy that will ignore cookies are required new tags all the time
			var isCompatible = true;
			switch (Request.Browser.Browser) {
				case "Chrome":             if (Request.Browser.MajorVersion < 33) isCompatible = false; break;
				case "Edge":               if (Request.Browser.MajorVersion < 12) isCompatible = false; break;
				case "IE":                                                        isCompatible = false; break; // No more support for IE
				case "InternetExplorer":                                          isCompatible = false; break; // No more support for IE
				case "IEMobile":                                                  isCompatible = false; break; // No more support for IE
				case "Firefox":            if (Request.Browser.MajorVersion < 40) isCompatible = false; break;
				case "Opera":              if (Request.Browser.MajorVersion < 32) isCompatible = false; break;
				case "Mozilla":	           if (Request.Browser.MajorVersion == 0 && Request.UserAgent != null) isCompatible =
												   Request.UserAgent.Contains("Baiduspider") || Request.UserAgent.Contains("bingbot")
												|| Request.UserAgent.Contains("Cliqzbot")    || Request.UserAgent.Contains("Googlebot")
												|| Request.UserAgent.Contains("MJ12bot")     || Request.UserAgent.Contains("Android 4")
												|| Request.UserAgent.Contains("Android 5")   || Request.UserAgent.Contains("Android 6")
												|| Request.UserAgent.Contains("Android 7")   || Request.UserAgent.Contains("Android 8")
												|| Request.UserAgent.Contains("Android 9")   || Request.UserAgent.Contains("Android 10")
												|| Request.UserAgent.Contains("SkypeUriPreview") || Request.UserAgent.Contains("AdsBot-Google")
												|| Request.UserAgent.Contains("YandexBot")  || Request.UserAgent.Contains("facebookexternalhit")
												|| Request.UserAgent.Contains("Pinterest")  || Request.UserAgent.Contains("Sogou web spider")
												|| Request.UserAgent.Contains("Twitterbot") || Request.UserAgent.Contains("WhatsApp")
												|| Request.UserAgent.Contains("CPU OS 10_") || Request.UserAgent.Contains("CPU iPhone OS 10_") || Request.UserAgent.Contains("OS X 10_")
												|| Request.UserAgent.Contains("CPU OS 11_") || Request.UserAgent.Contains("CPU iPhone OS 11_") || Request.UserAgent.Contains("OS X 11_")
												|| Request.UserAgent.Contains("CPU OS 12_") || Request.UserAgent.Contains("CPU iPhone OS 12_") || Request.UserAgent.Contains("OS X 12_")
												|| Request.UserAgent.Contains("CPU OS 13_") || Request.UserAgent.Contains("CPU iPhone OS 13_") || Request.UserAgent.Contains("OS X 13_");
											break;
				case "Safari":             if (Request.Browser.MajorVersion == 0 && Request.UserAgent != null) isCompatible =
												   Request.UserAgent.Contains("CPU OS 9_") || Request.UserAgent.Contains("CPU iPhone OS 9_")
												|| Request.UserAgent.Contains("CPU OS 10_") || Request.UserAgent.Contains("CPU iPhone OS 10_")
												|| Request.UserAgent.Contains("CPU OS 11_") || Request.UserAgent.Contains("CPU iPhone OS 11_")
												|| Request.UserAgent.Contains("CPU OS 12_") || Request.UserAgent.Contains("CPU iPhone OS 12_")
												|| Request.UserAgent.Contains("CPU OS 13_") || Request.UserAgent.Contains("CPU iPhone OS 13_");
					else if (Request.Browser.MajorVersion < 9) isCompatible = false; break;
				default: Log.Info(LogTag.UnrecognizedBrowser, Request, new { Request.Browser.Browser, Request.Browser.MajorVersion, Request.UserAgent }); break;
			}

			if (!isCompatible) {
				Log.Info(LogTag.RejectedBrowser, Request, new { Request.Browser.Browser, Request.Browser.MajorVersion, Request.UserAgent });
				Response.Redirect("https://www.browser-update.org/update.html?force_outdated=true");
				return null;
			}

			// === SESSION ID ===
			// Get a new SessionTag for the new session
			// The application is architected for this MVC Action to be the only proper entry point
			// Hence, we'll initialize the SessionTag cookie here. It will allow to track the user session
			var oldSessionTag = CookieHelper.GetValue(CookieHelper.CookieNames.SessionTag, Request);
			var newSessionTag = SqlModelHelper.GetNewSessionTag().ToString();
			CookieHelper.Set(CookieHelper.CookieNames.SessionTag, newSessionTag, Request);

			// === DEVICE TAG ===
			// Add a new DeviceTag Cookie if no tag cookie found for the requesting device
			// A new DeviceTag denotes a device we have never seen before, or its cookies has been cleared
			var deviceTag = CookieHelper.GetValue(CookieHelper.CookieNames.DeviceTag, Request);
			if (string.IsNullOrEmpty(deviceTag)) 
			{
				deviceTag = SqlModelHelper.GetNewDeviceTag().ToString();
				CookieHelper.Set(CookieHelper.CookieNames.DeviceTag, deviceTag, Request);
			}

			// === CULTURE ===
			// Set the culture in cookies if needed
			// Log the culture data (on first time, or when defaulted to something else than user selection, which can happen if cookies get corrupted or when UiCultures are disabled)
			var currentCulture = CultureHelper.GetCurrentCulture();
			var uiCultureFromCookie = CookieHelper.GetValue(CookieHelper.CookieNames.UiCulture, Request);
			var oldUiCultureFromCookie = CookieHelper.GetValue(CookieHelper.CookieNames.OldUiCulture, Request);

			var userAcceptedLanguages = Request.RequestContext.HttpContext.Request.UserLanguages ?? new string[0];
			if (currentCulture != uiCultureFromCookie || oldUiCultureFromCookie != null)
			{
				Log.UiCultureChange(currentCulture, uiCultureFromCookie, oldUiCultureFromCookie, string.Join(",", userAcceptedLanguages),
					Request.RequestContext.HttpContext.Request, newSessionTag);
				CookieHelper.Remove(CookieHelper.CookieNames.OldUiCulture, Request);
				CookieHelper.Set(CookieHelper.CookieNames.UiCulture, currentCulture, Request);
			}

			// === LOGGING ===
			// Log relevant info for an entry page visit

			Log.Info(LogTag.RequestedHostName, Request, new { HostName = Request.Url == null? "" : Request.Url.Host });
			Log.CookieTags(oldSessionTag, Request);
			Log.ReferrerUrl(Request);
			Log.BrowserCapabilities(Request);

			return View();
		}

	}
}