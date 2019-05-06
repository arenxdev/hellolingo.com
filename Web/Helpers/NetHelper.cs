using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.ServiceModel.Channels;
using System.Threading;
using System.Web;
using Considerate.Hellolingo.AspNetIdentity;
using Cookie = Microsoft.AspNet.SignalR.Cookie;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public class NetHelper {

		public static string GetClientIpAddressFrom(HttpRequestMessage request)
		{
			if (request.Properties.ContainsKey("MS_HttpContext"))
				return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;

			if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
				return ((RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name]).Address;

			return null;
		}

		public static uint? GetClientIpAddressAsUIntFrom(HttpRequestMessage request)
		{
			var ipV4String = GetClientIpAddressFrom(request);
			if (ipV4String == null)
			{
				Log.Error(LogTag.UnexpectedNullIPV4);
				return null;
			}

			try
			{
				var ipAddressArray = IPAddress.Parse(ipV4String).GetAddressBytes();
				Array.Reverse(ipAddressArray);
				var ipV4 = BitConverter.ToUInt32(ipAddressArray, 0);
				if (ipV4 == 0) throw new Exception();
				return ipV4;
			} catch (Exception) {
				Log.Error(LogTag.FailedToConvertIPV4ToUInt, new { ipV4String });
				return null;
			}
		}


		public class HttpInfo {
			public string Method { get; }
			public string PathAndQuery { get; }
			public string RequestBody { get; }
			public string IpAddress { get; }
			public string DeviceTag { get; }
			public string SessionTag { get; }
			public string UserId { get; }

			public string LogHead => $"{IpAddress}>{DeviceTag}>{SessionTag}>{UserId}	{(Method == "" ? "" : $"[{Method}]")}{PathAndQuery}	";
			public string LogHeadNoPath => $"{IpAddress}>{DeviceTag}>{SessionTag}>{UserId}	";
			public string LogHeadAndBody => $"{LogHead}{RequestBody}";
			public string LogHeadAndBodyAndResponseReady => $"{LogHead}{RequestBody} => ";


			public HttpInfo(HttpRequestMessage request, string path = null, string method = null)
			{
				Method = method ?? request.Method.Method;
				PathAndQuery = path ?? request.RequestUri.PathAndQuery;
				IpAddress = GetClientIpAddressFrom(request);
				var cookiesCollection = request.Headers?.GetCookies();
				// Force to null if count == 0 to prevent issues later on. This is needed for when something hits a web api without prior cookies
				var cookies = cookiesCollection?.Count == 0 ? null : cookiesCollection?[0];
				DeviceTag = cookies? [ CookieHelper.CookieNames.DeviceTag ]?.Value ?? ".";
				SessionTag = cookies? [ CookieHelper.CookieNames.SessionTag ]?.Value ?? ".";
				UserId = GetHellolingoUserId();
				RequestBody = request.Content.ReadAsStringAsync().Result;
			}

			public HttpInfo(HttpRequestBase request) {
				Method = request.HttpMethod;
				PathAndQuery = request.Url?.PathAndQuery;
				IpAddress = request.UserHostAddress;
				DeviceTag = CookieHelper.GetValue(CookieHelper.CookieNames.DeviceTag, request) ?? ".";
				SessionTag = CookieHelper.GetValue(CookieHelper.CookieNames.SessionTag, request) ?? ".";
				UserId = GetHellolingoUserId();
			}
			public HttpInfo(HttpRequestBase request, IDictionary<string, Cookie> cookies) {
				Method = request.HttpMethod;
				// Somehow, request.Url will crash if this is called by a SignalR.OnDisconnected event triggered by a dirty client disconnect
				try { PathAndQuery = request.Url?.PathAndQuery; } catch (Exception) { PathAndQuery = request.RawUrl; }
				// Request.UserHostAddress can crash in the same way as request.Url :-(
				try { IpAddress = request.UserHostAddress; } catch (Exception) { IpAddress = "IpNotFound"; }
				Cookie deviceTag;
				cookies.TryGetValue(CookieHelper.CookieNames.DeviceTag, out deviceTag);
				DeviceTag = deviceTag?.Value ?? ".";
				Cookie sessionTag;
				cookies.TryGetValue(CookieHelper.CookieNames.SessionTag, out sessionTag);
				SessionTag = sessionTag?.Value ?? ".";
				UserId = GetHellolingoUserId();
			}

			private string GetHellolingoUserId() {
				var principal = Thread.CurrentPrincipal;
				var identity = (ClaimsIdentity)principal.Identity;
				string userId = identity.Claims.FirstOrDefault(c => c.Type == CustomClaimTypes.UserId)?.Value;
				return string.IsNullOrEmpty(userId) ? "." : userId; //"." means it's a guest
			}

		}

		public struct CookieTags {
			public string OldSessionTag;
			public string NewSessionTag;
			public string DeviceTag;
			public string UiCulture;
			public string UserAcceptedLanguages;
		}

	}
}
