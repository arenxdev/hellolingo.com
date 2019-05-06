using System.Web.Mvc;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public class MvcLogExecutionFilterAttribute : ActionFilterAttribute {
		public override void OnActionExecuting(ActionExecutingContext filterContext) {
			Log.Info(LogTag.Executing, filterContext.HttpContext.Request);
			base.OnActionExecuting(filterContext);
		}

		public override void OnResultExecuted(ResultExecutedContext filterContext) {
			//Log.Info("Executed", filterContext.HttpContext.Request);
			base.OnResultExecuted(filterContext);
		}
	}
}