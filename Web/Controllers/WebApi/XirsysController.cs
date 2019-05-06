
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// This class isn't used but may be used later if we start relying on the upcoming
// (if they ever complete it properly) Xirsys Signaling. At this time,
// only the non-secure signaling is available. More info at http://xirsys.com/simplewebrtc/
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Threading.Tasks;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	public class XirsysController : BaseApiController
    {
		const string XirsysUrl = "https://api.xirsys.com/getToken";

		public class GetContentRequest { public int Id; }

		[Route("api/xirsys/get-token")]
	    [HttpPost]
		public async Task<HttpResponseMessage> GetToken()
	    {
			var httpResponse= Request.CreateResponse(HttpStatusCode.OK);
			var queryDict = ConfigurationManager.AppSettings.AllKeys
				.Where(key => key.StartsWith("xirsys:"))
				.ToDictionary(k => k.Replace("xirsys:", ""), k => ConfigurationManager.AppSettings[k]);
			var postContent = string.Join("&", queryDict.Select(kvp => $"{kvp.Key}={kvp.Value}").ToArray());

			try {
				var request = WebRequest.Create(XirsysUrl);

				request.Method = "POST";
				request.ContentType = "application/x-www-form-urlencoded";
				request.ContentLength = postContent.Length;
				using (Stream stream = request.GetRequestStream()) {
					stream.Write(Encoding.ASCII.GetBytes(postContent), 0, postContent.Length);
				}

				var response = await request.GetResponseAsync();
				using (var stream = response.GetResponseStream())
				using (var reader = new StreamReader(stream)) {
					var responseBody = reader.ReadToEnd();
					Log.Info(LogTag.XirsysTokenResponse, Request, new { XirsysUrl, responseBody });
					httpResponse.Content = new StringContent(responseBody, Encoding.UTF8, "application/json");
				}
			} catch (WebException ex) {
				Log.Error(LogTag.XirsysRequestError, Request, new { XirsysUrl }, ex);
				httpResponse.StatusCode = HttpStatusCode.InternalServerError;
			}

			return httpResponse;
	    }

	}

}
