using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Microsoft.AspNet.Identity.Owin;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	public class MemberController : BaseApiController
    {
		private ApplicationUserManager _userManager;
		private ApplicationUserManager UserManager => _userManager ?? (_userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>());

	    public class GetProfileRequest {
		    public int Id;
	    }

		[HttpPost]
		[AllowAnonymous]
		[Route("api/members/list")]
		public IEnumerable<ListedUser> List( ListRequest request )
		{
		    using (HellolingoEntities db = new HellolingoEntities())
		    {
				int? tag = null;
				if(request.IsSharedTalkMember) tag = UserTags.FormerSharedTalkMember;
				if(request.IsLivemochaMember) tag = UserTags.LivemochaMember;
				if(request.IsSharedLingoMember) tag = UserTags.SharedLingoMember;
				IEnumerable<ListedUser> listedMembers = db.ListedUsers_GetBy(
					count: null, belowId: request.BelowId,
					knows: request.KnownId, learns: request.LearnId,
					firstName: request.FirstName, lastName: request.LastName,
					country: null, location: null,
					minAge: null, maxAge: null,
					tag: tag
				).ToList();
			    return listedMembers;
		    }
	    }

		[HttpPost]
		[AllowAnonymous]
		[Route("api/members/get-profile")]
		public async Task<PublicUser> GetProfile(GetProfileRequest request)
		{
			using (HellolingoEntities db = new HellolingoEntities()) {
				User foundUser = await db.Users.FindAsync(request.Id);
				if (foundUser == null) {
					Log.Error(LogTag.UserNotFoundForGetProfileRequest, Request, new { request });
					return null;
				}
				return new PublicUser(foundUser);
			}
		}
	}
}
