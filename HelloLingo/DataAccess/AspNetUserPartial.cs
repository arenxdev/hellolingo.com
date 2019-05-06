using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Considerate.Hellolingo.AspNetIdentity;
using Microsoft.AspNet.Identity;

namespace Considerate.Hellolingo.DataAccess
{
	public partial class AspNetUser : IUser<string>
	{

		//Andriy: This method is standard implemntation of ASP.NET Identity package. We can't change it simply
		public async Task<ClaimsIdentity> GenerateUserIdentityAsync(ApplicationUserManager manager)
		{
			// Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
			var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
			
			// Add custom user claims here
			userIdentity.AddClaim(new Claim(CustomClaimTypes.UserId, Users.First().Id.ToString()));
			userIdentity.AddClaim(new Claim(CustomClaimTypes.UserCulture, UiCulture));

			return userIdentity;
		}

		//Andriy: this method is my custom implemetation of method above. I use it in synchronous method. 
		public ClaimsIdentity GenerateUserIdentity(ApplicationUserManager manager)
		{
			// Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
			var userIdentity = manager.CreateIdentity(this, DefaultAuthenticationTypes.ApplicationCookie);
			
			// Add custom user claims here
			userIdentity.AddClaim(new Claim(CustomClaimTypes.UserId, Users.First().Id.ToString()));
			userIdentity.AddClaim(new Claim(CustomClaimTypes.UserCulture, UiCulture));

			return userIdentity;
		}
	}
}
