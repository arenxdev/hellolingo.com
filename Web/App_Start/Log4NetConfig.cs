using System.IO;
using System.Web;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp {
	public class Log4NetConfig {
		public static void StartLog4Net() {
			log4net.GlobalContext.Properties["tab"] = "\t";
			Log.Info(LogTag.Log4NetLoggingStarted);
		}
	}
}
