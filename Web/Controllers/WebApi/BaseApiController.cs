using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Helpers;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	//Andriy: I suggest to put all functionallity what we need in all our controllers here.
	public class BaseApiController : ApiController
    {
		private IHellolingoEntities _entity;

		protected IHellolingoEntities Entity
		{
			get { return _entity ?? ( _entity = new HellolingoEntities() ); }
			set { _entity = value; }
		}


		protected int? GetDeviceTag()
		{
			var deviceTagString = CookieHelper.GetValueFromWebApi(CookieHelper.CookieNames.DeviceTag, Request);
			//Andriy: As i undererstand it's not possible not having device tag.
			//Bernard: That's correct. All sessions have a device tag, unless the user tampered with their cookies, in which case throwing an error is fine.
			//         On a second thought, we should probably just block web api calls that requires a device tag but don't have it, instead of crashing the request
			int deviceTag;
			if(!int.TryParse(deviceTagString, out deviceTag))
				throw new LogReadyException(LogTag.BaseApi_GetDeviceTagError, new { deviceTagString });

			return deviceTag;
		}

		public UserId LocalUserId => User.Identity.GetClaims().Id;
		//public string LocalUserCulture => User.Identity.GetClaims().UserCulture;

		public async Task<User> GetLocalUser() {
			using (var db = new HellolingoEntities()) {
				var localUserId = LocalUserId;
				return await db.Users.AsNoTracking().Include(u => u.Status).FirstOrDefaultAsync(u => u.Id == localUserId);
			}
		}

		//Andriy: I have added here dispose method, because we don't use using statement in controller. (Hope i don't miss any side logic.)
		protected override void Dispose(bool disposing)
		{
			Entity.Dispose();
			base.Dispose(disposing);
		}
	}


}
