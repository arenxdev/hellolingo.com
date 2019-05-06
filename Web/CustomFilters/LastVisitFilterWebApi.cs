//using System.Threading;
//using System.Threading.Tasks;
//using System.Web.Http.Controllers;
//using System.Web.Http.Filters;
//using Considerate.Hellolingo.WebApp.Helpers;

//namespace Considerate.Hellolingo.WebApp.CustomFilters
//{
//	public class LastVisitFilterWebApi : ActionFilterAttribute
//	{
//		private readonly ILastVisitHelper _helper;

//		public LastVisitFilterWebApi()
//		{
//			_helper = new LastVisitHelper();
//		}

//		public LastVisitFilterWebApi(ILastVisitHelper helper)
//		{
//			_helper = helper;
//		}

//		public override Task OnActionExecutingAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
//		{
//			var currentIdentity = actionContext.RequestContext.Principal.Identity;
//			if (currentIdentity.IsAuthenticated)
//			{
//				_helper.SaveUserLastVisit(currentIdentity.Name, actionContext.Request);
//			}
//			return base.OnActionExecutingAsync(actionContext, cancellationToken);
//		}
//	}
//}
