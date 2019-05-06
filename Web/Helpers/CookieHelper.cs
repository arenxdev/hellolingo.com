using System;
using System.Collections.Generic;
using System.Web;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Considerate.Hellolingo.WebApp.Helpers {
    public class CookieHelper {

		// All cookie names must match client-side code
	    public static class CookieNames {
			public const string UiCulture = "UiCulture"; 
			public const string OldUiCulture = "OldUiCulture"; 
			public const string DeviceTag = "DeviceTag"; 
			public const string SessionTag = "SessionTag";
	    }

		public static string GetValue(string cookieName, IDictionary<string, Microsoft.AspNet.SignalR.Cookie> cookies) => cookies[cookieName]?.Value; 
		public static string GetValue(string cookieName, HttpRequestBase request) {
			// Look in the response in case we already have a such value there
			var response = request.RequestContext.HttpContext.Response;
			// Don't ever try to read Cookies[cookiename] without being sure it exists, because it will actually 
			// create a cookie with an empty value by that cookiename name and you'll be screwed
			if (response.Cookies.AllKeys.Any(a => a == cookieName)) 
				return response.Cookies[cookieName]?.Value; 

			// Otherwise, get cookie from request
			//var cookie = request.RequestContext.HttpContext.Request.Cookies[cookieName];
			var cookie2 = request.Cookies[cookieName];
			return cookie2 != null && cookie2.Value != "" ? cookie2.Value : null;
		}

		public static string GetValueFromWebApi(string cookieName, HttpRequestMessage request)
		{
			CookieHeaderValue cookie = request.Headers.GetCookies(cookieName).FirstOrDefault();
			return cookie?[cookieName].Value;
		}

		public static void Set(string cookieName, object cookieValue, HttpRequestBase request) {
			var response = request.RequestContext.HttpContext.Response;
			var cookie = new HttpCookie(cookieName, cookieValue.ToString());
			cookie.Expires = DateTime.MaxValue;
			response.SetCookie(cookie);
		}

		public static void Set(string cookieName, string cookieValue, HttpResponse response)
		{
			var cookie = new HttpCookie(cookieName,cookieValue);
			cookie.Expires = DateTime.MaxValue;
			response.Cookies.Add(cookie);
		}
				

		public static void Remove(string cookieName, HttpRequestBase request) {
			var response = request.RequestContext.HttpContext.Response;
			var cookie = new HttpCookie(cookieName, "") {Expires = DateTime.Now.AddDays(-365)}; //Yup, you remove cookies by forcing them to expire.
			response.SetCookie(cookie);
		}
	}
}

