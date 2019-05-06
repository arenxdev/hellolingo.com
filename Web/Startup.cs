using System;
using Considerate.Hellolingo.WebApp.App_Start;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace Considerate.Hellolingo.WebApp
{
    public partial class Startup
    {

		public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);

			SignalRConfig.ConfigureAndMapSignalR(app);
			//SignalRStateHelper.LoadState(); // Disabled (the client now can handle its own reconnection quite well
			HangFireJob.ConfigureHangFire(app);
		}
	}
}
