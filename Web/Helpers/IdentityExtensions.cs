using System.Security.Claims;
using System.Security.Principal;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Helpers;

namespace Considerate.Hellolingo.WebApp.Helpers
{

	public static class IdentityExtensions {

		public static IdentityClaims GetClaims(this IIdentity identity) {
			return new IdentityClaims(identity);
		}

	}

	public class IdentityClaims {

		private int _id;
		private string _userCulture;

		public IdentityClaims(IIdentity identity)
		{

			//Collect UserId
			GetUserId(identity);
			//Collect UserCulture
			GetUserCulture(identity);
		}

		public int Id => _id;
		public string UserCulture => _userCulture;

		private void GetUserId(IIdentity identity)
		{
			var userIdStr = ((ClaimsIdentity)identity).FindFirst(CustomClaimTypes.UserId)?.Value;
			if (int.TryParse(userIdStr, out _id) == false)
				throw new LogReadyException(LogTag.UnknownUserIdClaimed, new { userIdStr });
		}

		private void GetUserCulture(IIdentity identity)
		{
			string userCulture = ((ClaimsIdentity)identity).FindFirst(CustomClaimTypes.UserCulture)?.Value;
			_userCulture = userCulture;
		}

	}

}
