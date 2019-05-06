using System.Web.Mvc;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public class MvcHandleErrorAttribute : HandleErrorAttribute {
		public override void OnException(ExceptionContext filterContext) {

			//if (filterContext.ExceptionHandled || !filterContext.HttpContext.IsCustomErrorEnabled)
			//	return;

			//if (new HttpException(null, filterContext.Exception).GetHttpCode() != 500)
			//	return;

			//if (!ExceptionType.IsInstanceOfType(filterContext.Exception))
			//	return;


			// log the error using log4net.
			Log.Error(LogTag.UnhandledMvcException, filterContext.HttpContext.Request, filterContext.Exception);
			filterContext.ExceptionHandled = true;
			//filterContext.HttpContext.Response.Clear();
			filterContext.HttpContext.Response.StatusCode = 500;
			//filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;

    }
  }
}