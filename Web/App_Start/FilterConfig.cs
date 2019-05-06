using System.Web.Mvc;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.CustomFilters;

namespace Considerate.Hellolingo.WebApp {
	public class FilterConfig {
		public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
			filters.Add(new MvcHandleErrorAttribute()); //filters.Add(new HandleErrorAttribute());
			filters.Add(new MvcLogExecutionFilterAttribute());
			filters.Add(new AuthorizeAttribute()); // This applies only to MVC Pages, not to Web Api
		}
	}
}
