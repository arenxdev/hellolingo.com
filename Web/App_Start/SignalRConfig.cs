using Considerate.Hellolingo.WebApp.Hubs;
using Microsoft.AspNet.SignalR;
using Owin;

namespace Considerate.Hellolingo.WebApp
{
	public class SignalRConfig
	{
		public static void ConfigureAndMapSignalR(IAppBuilder app)
		{
			// Some SignalR connections configuration that might be needed in the future
			//GlobalHost.Configuration.ConnectionTimeout = TimeSpan.FromSeconds(110);
			//GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(30);
			//GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(30);

			// Configure and Map SignalR
			GlobalHost.HubPipeline.AddModule(new LoggingPipelineModule()); // Bernard: Let's not disable this line. It's needed to log SignalR Events and Errors
			app.MapSignalR();

			// Alternative Signar Mapping with  Logging Configuration
			// It's really verbose and it end ups sending code details to the client ==> Disabled
			//var hubConfiguration = new HubConfiguration { EnableDetailedErrors = true };
			//app.MapSignalR(hubConfiguration);
		}
	}
}
