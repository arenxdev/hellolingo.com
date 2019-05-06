using System.Web.Mvc;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp {
	public class CultureConfig {
		public static void SetCustomCultureManagement() {
			var controllerFactory = new DefaultControllerFactory(new CultureHelper.CultureAwareControllerActivator());
			ControllerBuilder.Current.SetControllerFactory(controllerFactory);
		}
	}
}
