using System.Web.Mvc;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Controllers
{
	[AllowAnonymous]
	public class NotFoundController : Controller {
		public ActionResult Index() {
			Log.Warn(LogTag.FourOFour_Page_Not_Found, Request);
			return RedirectToAction("Index", "Home");
		}
	}
}
