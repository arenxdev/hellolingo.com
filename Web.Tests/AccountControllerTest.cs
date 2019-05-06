using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Controllers;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Considerate.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Considerate.HellolingoMock.DbContext;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class AccountControllerTest
	{
		[TestMethod]
		public async Task ConfirmationEmailTest()
		{
			string aspNetUserId  = "123";
			int userId           = 5;
			string token         = "token";
			string email         = "b.vdr@outlook.com";
			string composedToken = $"{token}:{email}";
			string encodedToken  = EmailConfirmationHelper.TokenEncode(composedToken);
			string decodedToken  = EmailConfirmationHelper.TokenDecode(encodedToken);
			
			List<User> usertData = new List<User>() {new User() {Id=userId,StatusId = UserStatuses.PendingEmailValidation} };
			AspNetUser aspNetUser = new AspNetUser() {Id = aspNetUserId, Email = email, Users = new List<User>() {new User() {Id = userId}}};

			var entitiesMock      = GetEntitiesMock();
			var userManagerMock   = GetApplicationUserManagerMock(new Mock<IUserStore<AspNetUser, string>>());
			var signInManagerMock = GetSignInManagerMock(userManagerMock, GetAuthenticationManagerMock());
			var usersDbSetMock = GetUsersDbSetMock(usertData);
			usersDbSetMock.Setup(u => u.FindAsync(It.Is<int>((id) => id == userId))).ReturnsAsync(usertData [ 0 ]);
			entitiesMock.Setup(e => e.Users).Returns(usersDbSetMock.Object);
			entitiesMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
			userManagerMock.Setup(m => m.FindByIdAsync(It.Is<string>((id) => id == aspNetUserId))).ReturnsAsync(aspNetUser);
			userManagerMock.Setup(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == token)))
				.ReturnsAsync(IdentityResult.Success);

			//Act
		
			AccountController controller = new AccountController(entitiesMock.Object,userManagerMock.Object, signInManagerMock.Object, new Mock<IEmailSender>().Object);
			ActionResult result = await controller.ValidateEmail(aspNetUserId,encodedToken);

			//Assert
			ViewResult viewResult = (ViewResult) result;
			Assert.AreEqual(composedToken, decodedToken);
			Assert.AreEqual(( ( EmailConfirmationViewModel )viewResult.Model ).isSuccess, true);
			Assert.AreEqual(usertData.FirstOrDefault()?.StatusId,UserStatuses.Valid);
			entitiesMock.Verify();
		}

		[TestMethod]
		public async Task ConfirmationEmailFailedTest()
		{
			string aspNetUserId  = "123";
			int userId           = 5;
			string token         = "token";
			string email         = "b.vdr@outlook.com";
			string composedToken = $"{token}:{email}";
			string encodedToken  = EmailConfirmationHelper.TokenEncode(composedToken);
			string decodedToken  = EmailConfirmationHelper.TokenDecode(encodedToken);
			
			List<User> userData  = new List<User>() { new User() {Id=userId, StatusId = UserStatuses.PendingEmailValidation} };
			AspNetUser aspNetUser = new AspNetUser() {Id = aspNetUserId,Email = email, Users = new List<User>() {new User() {Id = userId}}};

			var entitiesMock      = GetEntitiesMockForEmailValidationTests(userData);
			var userManagerMock   = GetApplicationUserManagerMock(new Mock<IUserStore<AspNetUser, string>>());
			var signInManagerMock = GetSignInManagerMock(userManagerMock, GetAuthenticationManagerMock());
		
			userManagerMock.Setup(m => m.FindByIdAsync(It.Is<string>((id) => id == aspNetUserId))).ReturnsAsync(aspNetUser);
			userManagerMock.Setup(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == token)))
				.ReturnsAsync(new IdentityResult());

			AccountController controller = new AccountController(entitiesMock.Object,userManagerMock.Object, signInManagerMock.Object, new Mock<IEmailSender>().Object);
			controller.ControllerContext = GetDefaultAccountControllerRequest(controller);
	
			//Act
			ActionResult result = await controller.ValidateEmail(aspNetUserId,encodedToken);
			
			//Assert
			ViewResult viewResult = (ViewResult) result;
			Assert.AreEqual(composedToken, decodedToken);
		    Assert.AreEqual(( ( EmailConfirmationViewModel )viewResult.Model ).isSuccess, false);
			Assert.AreEqual(userData.FirstOrDefault()?.StatusId,UserStatuses.PendingEmailValidation);
		}

		[TestMethod]
		public async Task ConfirmationEmailStatusUpdateFailedTest()
		{
			string aspNetUserId  = "123";
			int userId           = 5;
		    string token         = "token";
			string email         = "b.vdr@outlook.com";
			string composedToken = $"{token}:{email}";
			string encodedToken  = EmailConfirmationHelper.TokenEncode(composedToken);
			string decodedToken  = EmailConfirmationHelper.TokenDecode(encodedToken);
			
			List<User> userData = new List<User>() {new User() {Id=userId,StatusId = UserStatuses.PendingEmailValidation} };
			AspNetUser aspNetUser = new AspNetUser() {Id = aspNetUserId, Email = email, Users = new List<User>() {new User() {Id = userId}}};

			var entitiesMock      = GetEntitiesMockForEmailValidationTests(userData);
			entitiesMock.Setup(e => e.SaveChangesAsync())
				.Callback(() => { userData.FirstOrDefault().StatusId = UserStatuses.PendingEmailValidation; })
				.Throws(new Exception("Saving is failed."));
			var userManagerMock   = GetApplicationUserManagerMock(new Mock<IUserStore<AspNetUser, string>>());
			var signInManagerMock = GetSignInManagerMock(userManagerMock, GetAuthenticationManagerMock());
		
			userManagerMock.Setup(m => m.FindByIdAsync(It.Is<string>((id) => id == aspNetUserId))).ReturnsAsync(aspNetUser);
			userManagerMock.Setup(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == token)))
				.ReturnsAsync(new IdentityResult());

			AccountController controller = new AccountController(entitiesMock.Object,userManagerMock.Object, signInManagerMock.Object, new Mock<IEmailSender>().Object);
			controller.ControllerContext = GetDefaultAccountControllerRequest(controller);
	
			//Act
			ActionResult result = await controller.ValidateEmail(aspNetUserId,encodedToken);

			//Assert
			ViewResult viewResult = (ViewResult) result;
			Assert.AreEqual(composedToken, decodedToken);
		    Assert.AreEqual("", viewResult.ViewName);
			Assert.AreEqual(userData.FirstOrDefault()?.StatusId,UserStatuses.PendingEmailValidation);
		}

		[TestMethod]
		public async Task ConfirmationEmailAlreadyDoneSuccessTest()
		{
			string aspNetUserId  = "123";
			int userId           = 5;
			string token         = "token";
			string email         = "b.vdr@outlook.com";
			string composedToken = $"{token}:{email}";
			string encodedToken  = EmailConfirmationHelper.TokenEncode(composedToken);
			string decodedToken  = EmailConfirmationHelper.TokenDecode(encodedToken);
			bool emailIsConfirmed = true;
			
			List<User> userData  = new List<User>() { new User() {Id=userId, StatusId = UserStatuses.Deleted} };
			AspNetUser aspNetUser = new AspNetUser() {Id = aspNetUserId, Email = email,EmailConfirmed = emailIsConfirmed, Users = new List<User>() {new User() {Id = userId}}};

			var entitiesMock      = GetEntitiesMockForEmailValidationTests(userData);
			var userManagerMock   = GetApplicationUserManagerMock(new Mock<IUserStore<AspNetUser, string>>());
			var signInManagerMock = GetSignInManagerMock(userManagerMock, GetAuthenticationManagerMock());
		
			userManagerMock.Setup(m => m.FindByIdAsync(It.Is<string>((id) => id == aspNetUserId))).ReturnsAsync(aspNetUser);
			userManagerMock.Setup(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == decodedToken)))
				.ReturnsAsync(new IdentityResult());

			AccountController controller = new AccountController(entitiesMock.Object,userManagerMock.Object, signInManagerMock.Object, new Mock<IEmailSender>().Object);
			controller.ControllerContext = GetDefaultAccountControllerRequest(controller);
	
			//Act
			ActionResult result = await controller.ValidateEmail(aspNetUserId,encodedToken);
			
			//Assert
			ViewResult viewResult = (ViewResult) result;
			Assert.AreEqual(composedToken, decodedToken);
		    Assert.AreEqual(( ( EmailConfirmationViewModel )viewResult.Model ).isSuccess, true);
			Assert.AreEqual(userData.FirstOrDefault()?.StatusId,UserStatuses.Deleted);
			userManagerMock.Verify(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == token)),Times.Never);
		}

		[TestMethod]
		public async Task ConfirmationEmailWrongUserEmailFailedTest()
		{
			string aspNetUserId  = "123";
			int userId           = 5;
			string token         = "token";
			string email         = "b.vdr@outlook.com";
			string newEmail      = "bernard@hellolingo.com";
			string composedToken = $"{token}:{email}";
			string encodedToken  = EmailConfirmationHelper.TokenEncode(composedToken);
			string decodedToken  = EmailConfirmationHelper.TokenDecode(encodedToken);
			
			List<User> userData  = new List<User>() { new User() {Id=userId, StatusId = UserStatuses.PendingEmailValidation} };
			AspNetUser aspNetUser = new AspNetUser() {Id = aspNetUserId, Email = newEmail, Users = new List<User>() {new User() {Id = userId}}};

			var entitiesMock      = GetEntitiesMockForEmailValidationTests(userData);
			var userManagerMock   = GetApplicationUserManagerMock(new Mock<IUserStore<AspNetUser, string>>());
			var signInManagerMock = GetSignInManagerMock(userManagerMock, GetAuthenticationManagerMock());
		
			userManagerMock.Setup(m => m.FindByIdAsync(It.Is<string>((id) => id == aspNetUserId))).ReturnsAsync(aspNetUser);
			userManagerMock.Setup(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == decodedToken)))
				.ReturnsAsync(new IdentityResult());

			AccountController controller = new AccountController(entitiesMock.Object,userManagerMock.Object, signInManagerMock.Object, new Mock<IEmailSender>().Object);
			controller.ControllerContext = GetDefaultAccountControllerRequest(controller);
	
			//Act
			ActionResult result = await controller.ValidateEmail(aspNetUserId,encodedToken);
			
			//Assert
			ViewResult viewResult = (ViewResult) result;
			Assert.AreEqual(composedToken, decodedToken);
		    Assert.AreEqual(( ( EmailConfirmationViewModel )viewResult.Model ).isSuccess, false);
			Assert.AreEqual(userData.FirstOrDefault()?.StatusId,UserStatuses.PendingEmailValidation);
			userManagerMock.Verify(m => m.ConfirmEmailAsync(It.Is<string>((id) => id == aspNetUserId), It.Is<string>((t) => t == token)),Times.Never);
		}

		private Mock<IHellolingoEntities> GetEntitiesMock()
		{
			var entitiesMock = new Mock<IHellolingoEntities>();
			return entitiesMock;
		}

		private Mock<IHellolingoEntities> GetEntitiesMockForEmailValidationTests(List<User> userData)
		{
			var entitiesMock = new Mock<IHellolingoEntities>();
			var usersMock    = DbSetMockHelper.GetDbSetMock(userData);
			usersMock.Setup(u=>u.FindAsync(It.IsAny<int>())).ReturnsAsync(userData.FirstOrDefault());
			entitiesMock.Setup(e=>e.Users).Returns(usersMock.Object);
			return entitiesMock;
		}

		private Mock<ApplicationSignInManager> GetSignInManagerMock(Mock<ApplicationUserManager> userManagerMock, Mock<IAuthenticationManager> authManagerMock)
		{
			return new Mock<ApplicationSignInManager>(userManagerMock.Object, authManagerMock.Object);
		}

		private Mock<IAuthenticationManager> GetAuthenticationManagerMock()
		{
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			return authenticationManagerMock;
		}

		private Mock<ApplicationUserManager> GetApplicationUserManagerMock(Mock<IUserStore<AspNetUser,string>> userStoreMock)
		{
			return new Mock<ApplicationUserManager>(userStoreMock.Object);
		}

		private Mock<DbSet<User>> GetUsersDbSetMock(IEnumerable<User> usersData)
		{
			return DbSetMockHelper.GetDbSetMock(usersData);
		}

		private ControllerContext GetDefaultAccountControllerRequest(Controller controller)
		{
			var contextMock  = new Mock<HttpContextBase>();
			var requestMock  = new Mock<HttpRequestBase>();
			var responseMock = new Mock<HttpResponseBase>();

			requestMock.Setup(r => r.HttpMethod).Returns("GET");
			requestMock.Setup(r => r.Url).Returns(new Uri("http://localhost"));
			requestMock.Setup(r => r.RequestContext).Returns(new RequestContext(contextMock.Object,new RouteData()));
			requestMock.Setup(r => r.Cookies).Returns(new HttpCookieCollection());

			responseMock.Setup(r => r.Cookies).Returns(new HttpCookieCollection());

			contextMock.Setup(r => r.Request).Returns(requestMock.Object);
			contextMock.Setup(r => r.Response).Returns(responseMock.Object);

			return new ControllerContext(contextMock.Object, new RouteData(), controller);
		}
	}
}
