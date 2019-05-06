using System.Security.Principal;
using System.Web.Mvc;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.CustomFilters
{
  public class LastVisitFilter:ActionFilterAttribute
  {
    private readonly ILastVisitHelper _helper;

    public LastVisitFilter()
    {
       _helper = new LastVisitHelper();
    }
	
    public LastVisitFilter(ILastVisitHelper helper)
    {
      _helper = helper;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
      IIdentity currentIdentity = filterContext.HttpContext.User.Identity;
      if (currentIdentity.IsAuthenticated)
      {
        _helper.SaveUserLastVisit(currentIdentity.Name,filterContext.HttpContext.Request);
      }
      base.OnActionExecuting(filterContext);
    }
   
  }
}
  