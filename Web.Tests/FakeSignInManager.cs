using System;
using System.Threading.Tasks;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace Considerate.Hellolingo.WebApp.Tests
{
	public class FakeSignInManager : ApplicationSignInManager
	{
		public FakeSignInManager(ApplicationUserManager fakeUserManager, IAuthenticationManager fakeAuthenticationManager)
			: base(fakeUserManager, fakeAuthenticationManager)
		{ }

		private Func<string, string, bool, bool, Task<SignInStatus>> _passwordSignInAsyncDelegate;

		public Func<string, string, bool, bool, Task<SignInStatus>> PasswordSignInAsyncDelegate
		{
			get { return _passwordSignInAsyncDelegate; }
			set { _passwordSignInAsyncDelegate = value; }
		}

		public override async Task<SignInStatus> PasswordSignInAsync(string userName, string password, bool isPersistent, bool shouldLockout)
		{
			return await PasswordSignInAsyncDelegate(userName, password, isPersistent, shouldLockout);
		}

		public override Task SignInAsync(AspNetUser user, bool isPersistent, bool rememberBrowser)
		{
			return Task.FromResult(0);
		}
	}
}
