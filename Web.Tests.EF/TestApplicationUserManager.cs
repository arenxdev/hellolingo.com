using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using Considerate.Hellolingo.WebApp.Controllers.WebApi;
using Microsoft.AspNet.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Web;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Moq;

namespace Considerate.Hellolingo.WebApp.Tests.EF
{
	[TestClass]
	public class TestApplicationUserManager
	{
		[TestMethod]
		public void CreateUserTest()
		{

			long tick = DateTime.Now.Ticks;
			string email = $"test{tick}@and.com";
			string userName =$"andriy{tick}";
			string uiCulutre = "en";
			var newUser = new AspNetUser() { Email=email, UserName=userName, UiCulture = uiCulutre};
			var manager = new ApplicationUserManager(new ApplicationUserStore(new HellolingoEntities()));
			manager.PasswordValidator = new PasswordValidator
			{
				RequiredLength = 3,
				RequireNonLetterOrDigit = false,
				RequireDigit = false,
				RequireLowercase = false,
				RequireUppercase = false,
			};
			var result = manager.CreateAsync(newUser, "123");
			result.Wait();
			if(result.Result.Succeeded == false)
			{
				Assert.Fail($"User is not created. Errors: {string.Join(";", result.Result.Errors)}");
			}
			manager.Dispose();
		}

		

	}
}
