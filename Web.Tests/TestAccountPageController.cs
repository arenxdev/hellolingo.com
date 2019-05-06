using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Models;
using Considerate.Hellolingo.WebApp.Controllers;
using Microsoft.AspNet.Identity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestAccountPageController
	{
		[TestMethod]
		public async Task ForgotPasswordForDeletedUser()
		{
			string email = "deleted@email.com";
			//string errorMessage = "some error happened";
			var model = new ForgotPasswordViewModel() {Email =email };
			var  dbMock = new Mock<IHellolingoEntities>();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);

			userManagerMock.Setup(u => u.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser {Users = new[] {new User {StatusId = UserStatuses.Deleted}}});

			var controller = new AccountController(dbMock.Object,userManagerMock.Object,null,null);
			ActionResult actionResult = await controller.ForgotPassword(model);
			var viewResult = (ViewResult) actionResult;
			var viewResultModel = (ForgotPasswordViewModel) viewResult.Model;
			Assert.AreEqual(true, viewResultModel.InvalidEmail);
			userManagerMock.Verify(u=>u.GeneratePasswordResetTokenAsync(It.IsAny<string>()),Times.Never);
			userManagerMock.Verify(u=>u.SendEmailAsync(It.IsAny<string>(),It.IsAny<string>(),It.IsAny<string>()),Times.Never);
		}

		[TestMethod]
		public async Task ForgotPasswordForNotFoundUser()
		{
			string email = "notFound@email.com";
			var model = new ForgotPasswordViewModel() {Email =email };
			var  dbMock = new Mock<IHellolingoEntities>();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);

			userManagerMock.Setup(u => u.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(null);

			var controller = new AccountController(dbMock.Object,userManagerMock.Object,null, null);
			ActionResult actionResult = await controller.ForgotPassword(model);
			var viewResult = (ViewResult)actionResult;
			var viewResultModel = (ForgotPasswordViewModel)viewResult.Model;
			Assert.AreEqual(true, viewResultModel.InvalidEmail);
			userManagerMock.Verify(u=>u.GeneratePasswordResetTokenAsync(It.IsAny<string>()),Times.Never);
			userManagerMock.Verify(u=>u.SendEmailAsync(It.IsAny<string>(),It.IsAny<string>(),It.IsAny<string>()),Times.Never);
		}
	}
}
