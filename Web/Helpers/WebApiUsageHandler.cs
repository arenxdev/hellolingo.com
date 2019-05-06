using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public class WebApiUsageHandler: DelegatingHandler {
	
		public static HashSet<string> CultureAgnosticWebApiPath = new HashSet<string> { "/api/log", "/api/check" };

		// If issues with logging, you could always check: If Logging issues: check http://weblogs.asp.net/fredriknormen/log-message-request-and-response-in-asp-net-webapi
		protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) {

			// Set the thread culture according to the UICulture cookie (which has been set by the asp.net app)
			if (!CultureAgnosticWebApiPath.Contains(request.RequestUri.AbsolutePath)) { 
				var uiCultureFromCookie = CookieHelper.GetValueFromWebApi(CookieHelper.CookieNames.UiCulture, request);
				CultureInfo cultureInfo = CultureInfo.GetCultureInfo(uiCultureFromCookie);
				Thread.CurrentThread.CurrentCulture = cultureInfo;
				Thread.CurrentThread.CurrentUICulture = cultureInfo;
			}

			// Force to read the forward only content, otherwise it's at the end of the stream and logging can't happen :-(
			await request.Content.ReadAsStringAsync();

			// Proceed with the api request
			var response = await base.SendAsync(request, cancellationToken);

			// Log data movements, except for client logging events
			if (request.RequestUri.AbsolutePath != "/api/log")
				Log.DataInAndOut(response);

			return response;
		}
	}
}