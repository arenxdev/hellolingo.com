using System;
using System.Web.Http;

namespace Considerate.Hellolingo.WebApp.Controllers
{
	public class LogController : ApiController
    {
		[AllowAnonymous]
		[Route("api/log")]

		public void Log(LogData data) {
			// Try block added to try to intercept corrupted calls coming from iOs
			try { Helpers.Log.Client(data.Logger, data.Level, data.Path, data.Message, Request); }
			catch (Exception) {
				if (data == null) Helpers.Log.Warn(LogTag.ClientLoggingReceivedNullData, Request);
				else Helpers.Log.Error(LogTag.ClientLoggingFailed, Request, new { data });
			}
		}
	}

	public class LogData {
		public string Logger;
		public LogLevel Level;
		public string Path;
		public string Message; 
	}

}
