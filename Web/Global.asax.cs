using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Considerate.Hellolingo.WebApp.Helpers;
using log4net;

namespace Considerate.Hellolingo.WebApp
{
	public class MvcApplication : HttpApplication
	{
		protected void Application_Start()
		{
			// Common .net MVC + API Starters
			AreaRegistration.RegisterAllAreas();
			GlobalConfiguration.Configure(WebApiConfig.Register); // Web Api Configuration
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters); // MVC Configuration
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
			AsyncConfig.LogUnobservedTaskExceptions();

			// HeloLingo Starters
			CultureConfig.SetCustomCultureManagement();
			IoCConfig.BindDependencies();
			Log4NetConfig.StartLog4Net();
			JsonConfig.ConfigCamelCase();

			Log.Info(LogTag.Application_Started);

		}

		private void Application_Error(object sender, EventArgs e)
		{
			var ex = Server.GetLastError().GetBaseException();
			var url = HttpContext.Current?.Request?.Url?.PathAndQuery ?? "#NoUrlFound#";
			if (Log.IsErrorToBeTreatedAsWarning(ex.Message))
				Log.Warn(LogTag.UnhandledApplicationException, ex, new { url });
			else
				Log.Error(LogTag.UnhandledApplicationException, ex, new { url });
		}

		private void Application_End()
		{
			Log.Info(LogTag.Application_Ending);
			SignalRStateHelper.SaveState();
			Log.Info(LogTag.Application_Ended);

			// Explicitly Shutdown log4net so that it releases the log files 
			// and doesn't interfere with the new instance of the site 
			// which appears immediately on restart/recycle...
			LogManager.Shutdown();
		}
	}
}
