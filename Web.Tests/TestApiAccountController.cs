using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Management;
using Considerate.Hellolingo.WebApp.Controllers.WebApi;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Considerate.HellolingoMock.DbContext;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestApiAccountController
	{
		const string  UserIdClaimType      = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

		[TestMethod]
		public async Task LoginInvalidUserTest()
		{
			//Prepare Mocks
			string userName      = "test@test.com";
			string password      = "test1234test";

			var enityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userStoreMock             = new Mock<IUserEmailStore<AspNetUser,string>>();
			var userManager               = new ApplicationUserManager(userStoreMock.Object);
			var userManagerMock           = new Mock<ApplicationUserManager>(userStoreMock.Object);
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, enityMock.Object, lasVisitMock.Object, null, null);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			var requiestModel                     = new LoginRequestModel() {UserName = userName,Password = password};


			//Prepare Deleted
			userManagerMock.Setup(s => s.FindByNameAsync(It.IsAny<string>()))
						 .ReturnsAsync(new AspNetUser()
						 {
							 Id = Guid.NewGuid().ToString(),
							 UserName = userName,
							 EmailConfirmed = true,
							 Users = new User[]
										  {
										     new User()
										        {
										   	    	Status = new UsersStatus() { Id=Enumerables.UserStatuses.Deleted},
										   	    	StatusId = Enumerables.UserStatuses.Deleted
										        }
										  }
						 });
			userManagerMock.Setup(m => m.IsEmailConfirmedAsync(It.IsAny<string>())).ReturnsAsync(true);
			// ReSharper disable once PossibleNullReferenceException
			byte status = (await userManagerMock.Object.FindByNameAsync(userName)).Users.FirstOrDefault().StatusId;
			
			//Act
			LoginResponseModel responce                  = await accountController.PostLogin(requiestModel);

			//Assert
			Assert.AreEqual(LoginResponseModel.UnrecognizedEmailOrPassword.IsAuthenticated, responce.IsAuthenticated, $"Wrong IsAuthenticated property value for status {status}.");
			Assert.AreEqual(LoginResponseModel.UnrecognizedEmailOrPassword.Message, responce.Message, $"Wrong Message property value for status {status}.");
			

			
		}

		[TestMethod]
		public async Task LoginNotConfirmedEmailTest()
		{
			//Prepare Mocks
			string userName      = "test@test.com";
			string password      = "test1234test";

			var enityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var deviceTagMock                 = new Mock<IDeviceTagManager>();
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, enityMock.Object, lasVisitMock.Object, null, null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			var requiestModel                     = new LoginRequestModel() {UserName = userName,Password = password};


			//Prepare Deleted
			userManagerMock.Setup(s => s.FindByNameAsync(It.IsAny<string>()))
						 .ReturnsAsync(new AspNetUser()
						 {
							 Id = Guid.NewGuid().ToString(),
							 UserName = userName,
							 EmailConfirmed = false,
							 Users = new User[] {
								new User {
									Id = 1,
									Status   = new UsersStatus() { Id = UserStatuses.PendingEmailValidation},
									StatusId = UserStatuses.PendingEmailValidation,
								}
							}
						 });
			
			// ReSharper disable once PossibleNullReferenceException
			byte status = (await userManagerMock.Object.FindByNameAsync(userName)).Users.FirstOrDefault().StatusId;
			
			//Act
			LoginResponseModel responce = await accountController.PostLogin(requiestModel);

			//Assert
			Assert.AreEqual(true, responce.IsAuthenticated, $"Login must be allowed for status {status}.");
			Assert.AreEqual(null, responce.Message, $"Wrong Message property value for status {status}.");
		    deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Once);
		}

		[TestMethod]
		public async Task LoginSuccessTest()
		{
			//Prepare Mocks
			string userName             = "test@test.com";
			string password             = "test1234test";
			var user = new User[]
			{
				new User()
				{
					Id = 1,
					FirstName    = "Andriy",
					LastName     = "Lakhno",
					Gender       = "M",
					BirthMonth   = 2,
					BirthYear    = 1980,
					CountryId    = 1,
					Location     = "Kyiv",
					LearnsId     = 1,
					KnowsId      = 2,
					Introduction = "Intro",
					Tags = new UsersTagsValue[]
					{
						new UsersTagsValue() {Id = 10, Description = "LookToLearnWithTextChat"},
						new UsersTagsValue() {Id = 11, Description = "LookToLearnWithVoiceChat"},
						new UsersTagsValue() {Id = 12, Description = "LookToLearnWithGames"},
						new UsersTagsValue() {Id = 13, Description = "LookToLearnWithMore"},
					},

				}
			};

			var userToLogin = new AspNetUser()
			{
				UserName = userName,
				Users = user
			};

			var entitiesMock              = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var deviceTagMock                 = new Mock<IDeviceTagManager>();
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entitiesMock.Object, lasVisitMock.Object, null, null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			var requestModel              = new LoginRequestModel { UserName = userName, Password = password };

			userManagerMock.Setup(s => s.FindByNameAsync(It.IsAny<string>()))
						 .ReturnsAsync(userToLogin);
			userManagerMock.Setup(s => s.IsEmailConfirmedAsync(It.IsAny<string>()))
						 .ReturnsAsync(true);
			lasVisitMock.Setup(lv => lv.SaveUserLastVisit(It.IsAny<string>(), It.IsAny<HttpRequestMessage>())).Verifiable();

			var validStatuses = new byte[] {
				UserStatuses.PendingSignUpReview,
				UserStatuses.TemporarilyDisabled,
				UserStatuses.Valid,
			};

			foreach(var st in validStatuses)
			{
				//iterate statuses
				userToLogin.Users.FirstOrDefault().StatusId = st;
				userToLogin.Users.FirstOrDefault().Status = new UsersStatus { Id = st };

				//Act
				LoginResponseModel responce = await accountController.PostLogin(requestModel);

				//Assert
				Assert.AreEqual(true, responce.IsAuthenticated, "IsAuthenticated must be true");
				Assert.AreEqual(null, responce.Message, "Message property must be null");
			}
			
			//Assert
			lasVisitMock.Verify(lv => lv.SaveUserLastVisit(It.IsAny<string>(), It.IsAny<HttpRequestMessage>()), Times.Exactly(3));
            deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Exactly(3));
		}

		[TestMethod]
		public async Task LoginFailedTest()
		{
			//Prepare Mocks
			string userName      = "test@test.com";
			string password      = "test1234test";

			var userToLogin = new AspNetUser()
			{
				UserName = userName,
				Users = new User[]
				{
					new User()
					{
						Id = 1,
						StatusId = Enumerables.UserStatuses.Valid
					}
				}
			};

			var enityMock                 = new Mock<IHellolingoEntities>();
	        var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userStoreMock             = new Mock<IUserStore<AspNetUser,string>>();
			var userManager               = new ApplicationUserManager(userStoreMock.Object);
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManager, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Failure)
			};
			var accountController         = new AccountController(userManager, applicationSignInManager, enityMock.Object, lasVisitMock.Object, null, null);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			var requestModel = new LoginRequestModel() {UserName = userName,Password = password};

			//Act
			LoginResponseModel responce = await accountController.PostLogin(requestModel);

			//Assert
			Assert.AreEqual(LoginResponseModel.UnrecognizedEmailOrPassword.IsAuthenticated, responce.IsAuthenticated, $"Wrong IsAuthenticated property value.");
			Assert.AreEqual(LoginResponseModel.UnrecognizedEmailOrPassword.Message, responce.Message, $"Wrong Message property value.");
			Assert.IsNull(responce.UserData, $"User data must be null.");
		}

		[TestMethod]
		public void GetProfileTest()
		{
			Assert.Inconclusive();
		}

		[TestMethod]
		public async Task SignUpSuccess()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@gmail.com",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 1,
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};

			var usersTestData       = new List<User>() {};
			var aspNetUsersTestData = new List<AspNetUser>() {};

			var entityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object);
			var sgClientMock              = new Mock<IEmailSender>();
			var deviceTagMock             = new Mock<IDeviceTagManager>();

			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(null);
			userManagerMock.Setup(m => m.CreateAsync(It.Is<AspNetUser>(u => u.UserName == model.Email && u.Email == model.Email),It.Is<string>(s=>s==model.Password)))
				.ReturnsAsync(IdentityResult.Success);
			userManagerMock.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<string>())).ReturnsAsync("token").Verifiable();
				
			var tagValuesMock = DbSetMockHelper.GetDbSetMock(WebTestsHelper.GetTagsValuesData());
			var usersMock = DbSetMockHelper.GetDbSetMock(usersTestData);
			usersMock.Setup(u => u.Add(It.IsAny<User>())).Verifiable();
			var aspNetUsersMock = DbSetMockHelper.GetDbSetMock(aspNetUsersTestData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser() {Users =new []{new User() {BirthMonth = 10,BirthYear = 1980} } });
			
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.AspNetUsers).Returns(aspNetUsersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();

			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, sgClientMock.Object,null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			
			SignUpResponseModel response = await accountController.SignUp(model);
			Assert.AreEqual(true, response.IsAuthenticated);
			Assert.AreEqual(null,response.Message);
			entityMock.Verify();
			usersMock.Verify();
			sgClientMock.Verify(s => s.SendSignUpEmailConfirmation(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Once);
			deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Once);
		}

		[TestMethod]
		public async Task SignUpSuceessForBannedAndValid()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@gmail.com",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 3, //setup AccountRegulator to assign Valid status. Please look DumbAccountRegulator.cs
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};
			string newAspNetUserId = "123";

			var usersTestData       = new List<User>() {};
			var aspNetUsersTestData = new List<AspNetUser>() {};

			var entityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var signInManagerMock  = new Mock<FakeSignInManager>(userManagerMock.Object, authenticationManagerMock.Object);
			signInManagerMock.Setup(s=>s.SignInAsync(It.Is<AspNetUser>((u)=>u.Id==newAspNetUserId),It.Is<bool>((p)=>p==false),It.Is<bool>((p)=>p==false)))
				.Returns(Task.FromResult(0))
				.Verifiable();
			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(null);
			userManagerMock.Setup(m => m.CreateAsync(It.Is<AspNetUser>(u => u.UserName == model.Email && u.Email == model.Email),It.Is<string>(s=>s==model.Password)))
				.ReturnsAsync(IdentityResult.Success);
			var deviceTagMock             = new Mock<IDeviceTagManager>();
			
			var tagValuesMock     = DbSetMockHelper.GetDbSetMock(WebTestsHelper.GetTagsValuesData());
			var usersMock = DbSetMockHelper.GetDbSetMock(usersTestData);
			usersMock.Setup(u => u.Add(It.IsAny<User>())).Verifiable();
			var aspNetUsersMock = DbSetMockHelper.GetDbSetMock(aspNetUsersTestData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser()
			{
				Email        = model.Email,
				Id           = newAspNetUserId,
				Users        = new [ ]{new User() {
										Id = 1,
										BirthMonth   = model.BirthMonth,
				                        BirthYear    = model.BirthYear,
				                        CountryId    = model.Country     ,
				                        Introduction = model.Introduction,
				                        KnowsId      = model.Knows       ,
				                        LearnsId     = model.Learns      ,
				                        Location     = model.Location
			                           } }
			});



			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.AspNetUsers).Returns(aspNetUsersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();

			//Act for Valid new user
			var accountController         = new AccountController(userManagerMock.Object, signInManagerMock.Object, entityMock.Object, lasVisitMock.Object, null, null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			DateTime beforeSaveTime = DateTime.Now;
			SignUpResponseModel result = await accountController.SignUp(model);

			Assert.AreEqual(true, result.IsAuthenticated);
			Assert.AreEqual(null,result.Message);
			Assert.AreEqual(model.Email       , result.UserData.Email);
			Assert.AreEqual(model.BirthMonth  , result.UserData.BirthMonth);
			Assert.AreEqual(model.BirthYear   , result.UserData.BirthYear);
			Assert.AreEqual(model.Country     , result.UserData.Country);
			Assert.AreEqual(model.Introduction, result.UserData.Introduction);
			Assert.AreEqual(model.Knows       , result.UserData.Knows);
			Assert.AreEqual(model.Learns      , result.UserData.Learns);
			Assert.AreEqual(model.Location    , result.UserData.Location);
			signInManagerMock.Verify();
			userManagerMock.Verify(m => m.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),Times.Never);
			
			//Test for banned user
			model.BirthMonth = 3;//setup AccountRegulator to assign Valid status. Please look DumbAccountRegulator.cs
			accountController.Request         = WebTestsHelper.GetDefaultAccountControllerRequest();
			SignUpResponseModel resultBanned = await accountController.SignUp(model);

			Assert.AreEqual(true,resultBanned.IsAuthenticated);
			Assert.AreEqual(null,resultBanned.Message);
			Assert.AreEqual(model.Email       , resultBanned.UserData.Email);
			Assert.AreEqual(model.BirthMonth  , resultBanned.UserData.BirthMonth);
			Assert.AreEqual(model.BirthYear   , resultBanned.UserData.BirthYear);
			Assert.AreEqual(model.Country     , resultBanned.UserData.Country);
			Assert.AreEqual(model.Introduction, resultBanned.UserData.Introduction);
			Assert.AreEqual(model.Knows       , resultBanned.UserData.Knows);
			Assert.AreEqual(model.Learns      , resultBanned.UserData.Learns);
			Assert.AreEqual(model.Location    , resultBanned.UserData.Location);
			signInManagerMock.Verify();
			userManagerMock.Verify(m => m.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),Times.Never);
			deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Exactly(2));
		}

		[TestMethod]
		public async Task SignUpFailedUserAlreadyExist()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@gmail.com",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 4,
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};
			var entityMock                = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object);

			//Andriy: Define that user already exist.
			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(new AspNetUser() {Email = "pavlo@gmail.com",UserName = "pavlo@gmail.com"});

			var tagValuesMock = DbSetMockHelper.GetDbSetMock(WebTestsHelper.GetTagsValuesData());
			var usersMock     = DbSetMockHelper.GetDbSetMock(new List<User>());

			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, null, null);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			
			SignUpResponseModel response = await accountController.SignUp(model);
			Assert.AreEqual(false, response.IsAuthenticated);
			Assert.AreEqual(WebApiResponseCode.EmailAlreadyInUse,response.Message.Code);
		    userManagerMock.Verify(u=>u.CreateAsync(It.IsAny<AspNetUser>(),It.IsAny<string>()),Times.Never);
			userManagerMock.Verify(u=>u.GenerateEmailConfirmationTokenAsync(It.IsAny<string>()),Times.Never);
			userManagerMock.Verify(u=>u.SendEmailAsync(It.IsAny<string>(),It.IsAny<string>(),It.IsAny<string>()),Times.Never);
		}

		[TestMethod]
		public async Task SignUpFailedErrorDuringCreating()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@gmail.com",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 4,
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};
			var entityMock                = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object);

			
			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(null);

			//Andriy: Define that we got error in ApplicationUserManager
			userManagerMock.Setup(m => m.CreateAsync(It.Is<AspNetUser>(u => u.UserName == model.Email && u.Email == model.Email),It.Is<string>(s=>s==model.Password)))
				.ReturnsAsync(new IdentityResult()).Verifiable();

			var tagValuesMock = DbSetMockHelper.GetDbSetMock(WebTestsHelper.GetTagsValuesData());
			var usersMock     = DbSetMockHelper.GetDbSetMock(new List<User>() {});

			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, null, null);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			
			SignUpResponseModel response = await accountController.SignUp(model);
			Assert.AreEqual(false, response.IsAuthenticated);
			Assert.AreEqual(WebApiResponseCode.UnhandledIssue,response.Message.Code);
		    userManagerMock.Verify();
			userManagerMock.Verify(u=>u.GenerateEmailConfirmationTokenAsync(It.IsAny<string>()),Times.Never);
			userManagerMock.Verify(u=>u.SendEmailAsync(It.IsAny<string>(),It.IsAny<string>(),It.IsAny<string>()),Times.Never);
		}

		[TestMethod]
		public async Task SignUpSuccessFakeAccount()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@fake.fake",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 1,
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};

			var usersTestData       = new List<User>() {};
			var aspNetUsersTestData = new List<AspNetUser>() {};

			var entityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object);
			var sgClientMock              = new Mock<IEmailSender>();
			var deviceTagMock             = new Mock<IDeviceTagManager>();

			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(null);
			userManagerMock.Setup(m => m.CreateAsync(It.Is<AspNetUser>(u => u.UserName == model.Email && u.Email == model.Email),It.Is<string>(s=>s==model.Password)))
				.ReturnsAsync(IdentityResult.Success);
			userManagerMock.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<string>())).ReturnsAsync("token").Verifiable();
				
			var tagValuesMock = DbSetMockHelper.GetDbSetMock<UsersTagsValue>(WebTestsHelper.GetTagsValuesData());
			var usersMock = DbSetMockHelper.GetDbSetMock(usersTestData);
			usersMock.Setup(u => u.Add(It.IsAny<User>())).Verifiable();
			var aspNetUsersMock = DbSetMockHelper.GetDbSetMock(aspNetUsersTestData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser() {Users =new []{new User() {BirthMonth = 10,BirthYear = 1980} } });
			
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.AspNetUsers).Returns(aspNetUsersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();

			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, sgClientMock.Object,null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			
			SignUpResponseModel response = await accountController.SignUp(model);
			Assert.AreEqual(true, response.IsAuthenticated);
			Assert.AreEqual(null,response.Message);
			entityMock.Verify();
			usersMock.Verify();
			sgClientMock.Verify(s => s.SendSignUpEmailConfirmation(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Once);
			deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Once);
		}

		[TestMethod]
		public async Task SignUpSuccessTestAccount()
		{
			SignUpRequestModel model = new SignUpRequestModel()
			{
				Email      = "pavlo@test.com",
				Password   = "and123",
				FirstName  = "Andriy",
				LastName   = "Vdovych",
				Gender     = "M",
				BirthMonth = 1,
				BirthYear  = 1980,
				Country    = 1,
				Location   = "Kyiv",
				Learns     = 1,
				Knows      = 2,
			};

			var usersTestData       = new List<User>() {};
			var aspNetUsersTestData = new List<AspNetUser>() {};

			var entityMock                 = new Mock<IHellolingoEntities>();
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userManagerMock           = new Mock<ApplicationUserManager>(new Mock<IUserStore<AspNetUser,string>>().Object );
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object);
			var sgClientMock              = new Mock<IEmailSender>();
			var deviceTagMock             = new Mock<IDeviceTagManager>();

			userManagerMock.Setup(m => m.FindByNameAsync(It.Is<string>(email => email == model.Email))).ReturnsAsync(null);
			userManagerMock.Setup(m => m.CreateAsync(It.Is<AspNetUser>(u => u.UserName == model.Email && u.Email == model.Email),It.Is<string>(s=>s==model.Password)))
				.ReturnsAsync(IdentityResult.Success);
			userManagerMock.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<string>())).ReturnsAsync("token").Verifiable();
				
			var tagValuesMock = DbSetMockHelper.GetDbSetMock<UsersTagsValue>(WebTestsHelper.GetTagsValuesData());
			var usersMock = DbSetMockHelper.GetDbSetMock(usersTestData);
			usersMock.Setup(u => u.Add(It.IsAny<User>())).Verifiable();
			var aspNetUsersMock = DbSetMockHelper.GetDbSetMock(aspNetUsersTestData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser() {Users =new []{new User() {BirthMonth = 10,BirthYear = 1980} } });
			
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagValuesMock.Object);
			entityMock.Setup(e => e.Users).Returns(usersMock.Object);
			entityMock.Setup(e => e.AspNetUsers).Returns(aspNetUsersMock.Object);
			entityMock.Setup(e => e.GetValidationErrors()).Returns(new DbEntityValidationResult[] {});
			entityMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();

			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, sgClientMock.Object,null, deviceTagMock.Object);
			accountController.Request     = WebTestsHelper.GetDefaultAccountControllerRequest();
			
			SignUpResponseModel response = await accountController.SignUp(model);
			Assert.AreEqual(true, response.IsAuthenticated);
			Assert.AreEqual(null,response.Message);
			entityMock.Verify();
			usersMock.Verify();
			sgClientMock.Verify(s => s.SendSignUpEmailConfirmation(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Once);
			deviceTagMock.Verify(dt => dt.LinkDeviceToUser(It.IsAny<long>(), It.IsAny<int>()), Times.Once);
		}

		[TestMethod]
		public async Task TestPostUpdateProfileSuccessWithoutPassword()
		{
			//Prepare existing user which will update own profile
			string userName             = "test@test.com";
			string updatedEmail         = "updated@test.com";
			string aspNetId             = Guid.NewGuid().ToString();
			string deviceTagCookieValue = "1";

			//init values 
			string email = userName;
			int    userId = 1;
			string firstName = "Andriy";
			string lastName = "Lakhno";
			string gender = "M";
			byte    birthMonth = 2;
			int    birthYear = 1980;
			byte    countryId = 1;
			string location = "Kyiv";
			byte    learnsId = 1;
			byte    knowsId = 2;
			byte? knows2Id = null;
			byte? learns2Id = null;
			string introduction = "Intro";

			var initUserData = new User()
			{
				Id           = userId,
				FirstName    = firstName,
				LastName     = lastName,
				Gender       = gender,
				BirthMonth   = birthMonth,
				BirthYear    = birthYear,
				CountryId    = countryId,
				Location     = location,
				LearnsId     = learnsId,
				KnowsId      = knowsId,
				Introduction = introduction,
				StatusId     = UserStatuses.Valid,
				Tags = new List<UsersTagsValue>()
				{
					new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
					new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
					new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
				},
			};
			//it used in Mock call back to verify values which stored in UsersChanges table
			UsersChanges changesToSave=null;
			var aspNetUsersData = new List<AspNetUser>()
			{
				new AspNetUser()
				{
					Id = aspNetId,
					UserName = userName,
					Email = userName,
					EmailConfirmed = true,
					Users = new[] { initUserData }
				}
			};
			var usersChangesData = new List<UsersChanges>();
			var tagsValuesData = WebTestsHelper.GetTagsValuesData();

			//Prepare EF DbSet Mocks
			var aspUsersSetMock = DbSetMockHelper.GetDbSetMock(aspNetUsersData);
			var changesSetMock = DbSetMockHelper.GetDbSetMock(usersChangesData);
		    var tagsValuesMock = DbSetMockHelper.GetDbSetMock(tagsValuesData);

			//Prepare Linq interfacres

			changesSetMock.Setup(c=>c.Add(It.IsAny<UsersChanges>())).Returns(new UsersChanges()).Callback<UsersChanges>(changes=>changesToSave=changes);
		    
			var entityMock = new Mock<IHellolingoEntities>();
			entityMock.Setup(e => e.AspNetUsers).Returns(aspUsersSetMock.Object);
			entityMock.Setup(e => e.UsersChanges).Returns(changesSetMock.Object);
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagsValuesMock.Object);
			entityMock.Setup(e => e.AspNetUsers.FindAsync(It.Is<string>(s=>s==aspNetId))).Returns(aspUsersSetMock.Object.FirstAsync(u=>u.Id==aspNetId));
			entityMock.Setup(e => e.SaveChangesAsync()).Returns(Task.FromResult(1)).Verifiable();

			//Prepare controller dependencies
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userStoreMock             = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock           = new Mock<ApplicationUserManager>(userStoreMock.Object);
			var sgClientMock    = new Mock<IEmailSender>();
			userManagerMock.Setup(m => m.CheckPasswordAsync(It.IsAny<AspNetUser>(), It.IsAny<string>())).ReturnsAsync(true);
			userManagerMock.Setup(m => m.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(null);
			userManagerMock.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(null);
			userManagerMock.Setup(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<string>())).ReturnsAsync("token");
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, sgClientMock.Object, null);
			//Mock authenticated user data
			accountController.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(UserIdClaimType, aspNetId) }));
			//Mock DeviceTag cookie

			accountController.Request = WebTestsHelper.GetDefaultAccountControllerRequest();
			accountController.Request.Headers.Add("Cookie", $"{CookieHelper.CookieNames.DeviceTag}={deviceTagCookieValue};");
			//Create EditProfileModel
			//All fields which are in UserProfileModel must be updated for User, except password in this test.
			UserProfileModel model = new UserProfileModel()
			{
				Id = 1,
				Email = updatedEmail,
				BirthMonth = 10,
				BirthYear = 1970,
				Country = 3,
				Location = "Lviv",
				Learns = 3,
				Knows = 4,
				Learns2 = 5,
				Knows2 = 6,
				LookToLearnWithGames = false,
				LookToLearnWithTextChat = false,
				LookToLearnWithVoiceChat = false,
				LookToLearnWithMore = false,
				Introduction = "No introduction",
				WantsToHelpHellolingo = false,
				IsSharedTalkMember = true,
				IsLivemochaMember = true,
				Password = null,
				CurrentPassword = "currentPassword"
			};
			//Act
			DateTime beforeSaveTime = DateTime.Now;
			ProfileUpdateResponseModel response = await accountController.PostProfile(model);

			//Assert data saved by EF
			entityMock.Verify(e=>e.SaveChangesAsync(),Times.Exactly(2));

			//Assert that Change Password is not called
			userManagerMock.Verify(m=>m.ChangePasswordAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),Times.Never);
			
			userManagerMock.Verify();
			userManagerMock.Verify(m => m.GenerateEmailConfirmationTokenAsync(It.IsAny<string>()),Times.Once);
			//sgClientMock.Verify(s=>s.SendSignUpEmailConfirmation(It.Is<int>(id=>id==userId), It.Is<string>(e=>e==updatedEmail), It.IsAny<string>(), It.IsAny<string>()), Times.Once);

			//Assert changes data saved
			Assert.AreEqual(changesToSave.UserId                ,aspNetUsersData.First().Users.First().Id);
			Assert.AreEqual(changesToSave.When > beforeSaveTime , true);
			Assert.AreEqual(changesToSave.Email                 , email);
			Assert.AreEqual(changesToSave.DeviceTag.ToString()  , deviceTagCookieValue);
			Assert.AreEqual(changesToSave.ChangeType            , 11);
			Assert.AreEqual(changesToSave.BirthMonth            , birthMonth);
			Assert.AreEqual(changesToSave.BirthYear             , birthYear);
			Assert.AreEqual(changesToSave.Country               , countryId);
			Assert.AreEqual(changesToSave.Introduction          , introduction);
			Assert.AreEqual(changesToSave.KnowsId               , knowsId);
			Assert.AreEqual(changesToSave.Knows2Id              , knows2Id);
			Assert.AreEqual(changesToSave.LearnsId              , learnsId);
		    Assert.AreEqual(changesToSave.Learns2Id             , learns2Id);
			Assert.AreEqual(changesToSave.Location              , location);

			//Assert changes in UserProfile
			Assert.AreEqual( userId                             , aspNetUsersData.First().Users.First().Id                                                             );
			Assert.AreEqual( model.Email                        , aspNetUsersData.First().Email                                                                        );
			Assert.AreEqual( model.Email                        , aspNetUsersData.First().UserName                                                                     );
			Assert.AreEqual( model.BirthMonth                   , aspNetUsersData.First().Users.First().BirthMonth                                                     );
			Assert.AreEqual( model.BirthYear                    , aspNetUsersData.First().Users.First().BirthYear                                                      );
			Assert.AreEqual( model.Country                      , aspNetUsersData.First().Users.First().CountryId                                                      );
			Assert.AreEqual( model.Introduction                 , aspNetUsersData.First().Users.First().Introduction                                                   );
			Assert.AreEqual( model.Knows                        , aspNetUsersData.First().Users.First().KnowsId                                                        );
			Assert.AreEqual( model.Knows2                       , aspNetUsersData.First().Users.First().Knows2Id                                                       );
			Assert.AreEqual( model.Learns                       , aspNetUsersData.First().Users.First().LearnsId                                                       );
		    Assert.AreEqual( model.Learns2                      , aspNetUsersData.First().Users.First().Learns2Id                                                      );
			Assert.AreEqual( model.Location                     , aspNetUsersData.First().Users.First().Location                                                       );
			Assert.AreEqual( null                               , aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithTextChat) );
			Assert.AreEqual( null                               , aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithVoiceChat));
			Assert.AreEqual( null                               , aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithGames)    );
			Assert.AreEqual( null                               , aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithMore)     );
			Assert.AreEqual( null                               , aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.WantsToHelpHellolingo)   );
			Assert.AreEqual( false                              , aspNetUsersData.First().EmailConfirmed                                                               );
			Assert.AreEqual(UserStatuses.PendingEmailValidation , aspNetUsersData.First().Users.First().StatusId                                                       );
			//Assert server responce
			Assert.AreEqual(response.IsUpdated, true);
		}
		
		[TestMethod]
		public async Task TestPostUpdateProfileSuccessTagsOnly()
		{
			//Prepare existing user which will update own profile
			string userName             = "test@test.com";
			string aspNetId             = Guid.NewGuid().ToString();
			string userIdClaimType      = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
			string deviceTagCookieValue = "42";

			//init values 
			string email = userName;
			int    userId = 1;
			string firstName = "Andriy";
			string lastName = "Lakhno";
			string gender = "M";
			byte    birthMonth = 2;
			int    birthYear = 1980;
			byte    countryId = 1;
			string location = "Kyiv";
			byte    learnsId = 1;
			byte    knowsId = 2;
			byte? knows2Id = null;
			byte? learns2Id = null;
			string introduction = "Intro";

			var initUserData = new User()
			{
				Id           = userId,
				FirstName    = firstName,
				LastName     = lastName,
				Gender       = gender,
				BirthMonth   = birthMonth,
				BirthYear    = birthYear,
				CountryId    = countryId,
				Location     = location,
				LearnsId     = learnsId,
				KnowsId      = knowsId,
				Introduction = introduction,
				Tags = new List<UsersTagsValue>()
				{
					new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
					new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
					new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
				},
			};
			//it used in Mock call back to verify values which stored in UsersChanges table
			UsersChanges changesToSave=null;
			var aspNetUsersData = new List<AspNetUser>()
			{
				new AspNetUser()
				{
					Id = aspNetId,
					UserName = userName,
					Email = userName,
					Users = new[] { initUserData }
				}
			};
			var usersChangesData = new List<UsersChanges>();
			var tagsValuesData = new List<UsersTagsValue>()
			{
				new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
			    new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
			};

			//Prepare EF DbSet Mocks
			var aspUsersSetMock = DbSetMockHelper.GetDbSetMock(aspNetUsersData);
			var changesSetMock = DbSetMockHelper.GetDbSetMock(usersChangesData);
			var tagsValuesMock = DbSetMockHelper.GetDbSetMock(tagsValuesData);
			

		    changesSetMock.Setup(c=>c.Add(It.IsAny<UsersChanges>())).Returns(new UsersChanges()).Callback<UsersChanges>(changes=>changesToSave=changes);
			
			var entityMock = new Mock<IHellolingoEntities>();
			entityMock.Setup(e => e.AspNetUsers).Returns(aspUsersSetMock.Object);
			entityMock.Setup(e => e.UsersChanges).Returns(changesSetMock.Object);
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagsValuesMock.Object);
			entityMock.Setup(e => e.AspNetUsers.FindAsync(It.Is<string>(s=>s==aspNetId))).Returns(aspUsersSetMock.Object.FirstAsync(u=>u.Id==aspNetId));
			entityMock.Setup(e => e.SaveChangesAsync()).Returns(Task.FromResult(1)).Verifiable();

			//Prepare controller dependencies
			var lasVisitMock    = new Mock<ILastVisitHelper>();
			var userStoreMock   = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock = new Mock<ApplicationUserManager>(userStoreMock.Object);
			var sgClientMock    = new Mock<IEmailSender>();
			userManagerMock.Setup(m => m.CheckPasswordAsync(It.IsAny<AspNetUser>(), It.IsAny<string>())).Returns(Task.FromResult(true));
			userManagerMock.Setup(u => u.GenerateEmailConfirmationTokenAsync(It.Is<string>(id => id == aspNetId))).ReturnsAsync("token");
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, sgClientMock.Object, null);
			//Mock authenticated user data
			accountController.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(userIdClaimType, aspNetId) }));
			//Mock DeviceTag cookie
			HttpRequestMessage request = WebTestsHelper.GetDefaultAccountControllerRequest();
			request.Headers.Add("Cookie", $"{CookieHelper.CookieNames.DeviceTag}={deviceTagCookieValue};");
			accountController.Request = request;
			//Create EditProfileModel
			//All fields which are in UserProfileModel must be updated for User, except password in this test.
			UserProfileModel model = new UserProfileModel()
			{
				Id = 1,
				Email = email,
				BirthMonth = birthMonth,
				BirthYear = birthYear,
				Country = countryId,
				Location = location,
				Learns = learnsId,
				Knows = knowsId,
				Learns2 = learns2Id,
				Knows2 = knows2Id,
				LookToLearnWithGames = false,
				LookToLearnWithTextChat = false,
				LookToLearnWithVoiceChat = false,
				LookToLearnWithMore = false,
				Introduction = introduction,
				WantsToHelpHellolingo = false,
				IsSharedTalkMember = false,
				IsLivemochaMember = false,
				Password = null,
				CurrentPassword = "currentPassword"
			};
			//Act
			ProfileUpdateResponseModel response = await accountController.PostProfile(model);

			//Assert data saved by EF
			entityMock.Verify(e=>e.SaveChangesAsync(),Times.Exactly(1));

			//Assert changes data saved
			Assert.AreEqual(changesToSave, null);


			
			//Assert changes in UserProfile
			Assert.AreEqual(aspNetUsersData.First().Users.First().Id          , userId);
			Assert.AreEqual(aspNetUsersData.First().Email                     , email);
			Assert.AreEqual(aspNetUsersData.First().UserName                  , email);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthMonth  , birthMonth);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthYear   , birthYear);
			Assert.AreEqual(aspNetUsersData.First().Users.First().CountryId   , countryId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Introduction, introduction);
			Assert.AreEqual(aspNetUsersData.First().Users.First().KnowsId     , knowsId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Knows2Id    , knows2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().LearnsId    , learnsId);
		    Assert.AreEqual(aspNetUsersData.First().Users.First().Learns2Id   , learns2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Location    , location);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithTextChat), null);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithVoiceChat), null);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithGames), null);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.LookToLearnWithMore), null);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.FirstOrDefault(t=>t.Id==UserTags.WantsToHelpHellolingo), null);
			//Assert server responce
			Assert.AreEqual(response.IsUpdated, true);
		}

		[TestMethod]
		public async Task TestPostUpdateProfileFailedWrongPassword()
		{
			//Prepare existing user which will update own profile
			string userName             = "test@test.com";
			string aspNetId             = Guid.NewGuid().ToString();
			string userIdClaimType      = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
			string deviceTagCookieValue = "42";

			//init values 
			string email = userName;
			int    userId = 1;
			string firstName = "Andriy";
			string lastName = "Lakhno";
			string gender = "M";
			byte    birthMonth = 2;
			int    birthYear = 1980;
			byte    countryId = 1;
			string location = "Kyiv";
			byte    learnsId = 1;
			byte    knowsId = 2;
			byte? knows2Id = null;
			byte? learns2Id = null;
			string introduction = "Intro";

			var initUserData = new User()
			{
				Id           = userId,
				FirstName    = firstName,
				LastName     = lastName,
				Gender       = gender,
				BirthMonth   = birthMonth,
				BirthYear    = birthYear,
				CountryId    = countryId,
				Location     = location,
				LearnsId     = learnsId,
				KnowsId      = knowsId,
				Introduction = introduction,
				Tags = new UsersTagsValue[]
				{
					new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
					new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
					new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
				},
			};
			//it used in Mock call back to verify values which stored in UsersChanges table
			UsersChanges changesToSave=null;
			var aspNetUsersData = new List<AspNetUser>()
			{
				new AspNetUser()
				{
					Id = aspNetId,
					UserName = userName,
					Email = userName,
					Users = new[] { initUserData }
				}
			}.AsQueryable();
			var usersChangesData = new List<UsersChanges>().AsQueryable();

			UserProfileModel model = new UserProfileModel()
			{
				Id = 1,
				Email = "andriy.l.a@gamil.com",
				BirthMonth = 10,
				BirthYear = 1970,
				Country = 3,
				Location = "Lviv",
				Learns = 3,
				Knows = 4,
				Learns2 = 5,
				Knows2 = 6,
				LookToLearnWithGames = false,
				LookToLearnWithTextChat = false,
				LookToLearnWithVoiceChat = false,
				LookToLearnWithMore = false,
				Introduction = "No introduction",
				WantsToHelpHellolingo = false,
				IsSharedTalkMember = true,
				IsLivemochaMember = true,
				Password = "newPassword",
				CurrentPassword = "currentPassword"
			};


			//Prepare EF DbSet Mocks
			var aspUsersSetMock = new Mock<DbSet<AspNetUser>>();
			var changesSetMock = new Mock<DbSet<UsersChanges>>();
			//Prepare Linq interfacres
			aspUsersSetMock.As<IDbAsyncEnumerable<AspNetUser>>()
				           .Setup(u => u.GetAsyncEnumerator())
				           .Returns(new FakeDbAsyncEnumerator<AspNetUser>(aspNetUsersData.GetEnumerator()));
			aspUsersSetMock.As<IQueryable<AspNetUser>>()
				           .Setup(u => u.Provider)
				           .Returns(new FakeDbAsyncQueryProvider<AspNetUser>(aspNetUsersData.Provider));
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.Expression).Returns(aspNetUsersData.Expression);
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.ElementType).Returns(aspNetUsersData.ElementType);
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.GetEnumerator()).Returns(aspNetUsersData.GetEnumerator());
			changesSetMock.As<IDbAsyncEnumerable<UsersChanges>>()
				           .Setup(u => u.GetAsyncEnumerator())
				           .Returns(new FakeDbAsyncEnumerator<UsersChanges>(usersChangesData.GetEnumerator()));
			changesSetMock.As<IQueryable<UsersChanges>>()
				           .Setup(u => u.Provider)
				           .Returns(new FakeDbAsyncQueryProvider<UsersChanges>(usersChangesData.Provider));
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.Expression).Returns(usersChangesData.Expression);
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.ElementType).Returns(usersChangesData.ElementType);
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.GetEnumerator()).Returns(usersChangesData.GetEnumerator());
			changesSetMock.Setup(c=>c.Add(It.IsAny<UsersChanges>())).Returns(new UsersChanges()).Callback<UsersChanges>(changes=>changesToSave=changes);
			var entityMock = new Mock<IHellolingoEntities>();
			entityMock.Setup(e => e.AspNetUsers).Returns(aspUsersSetMock.Object);
			entityMock.Setup(e => e.UsersChanges).Returns(changesSetMock.Object);
			entityMock.Setup(e => e.AspNetUsers.FindAsync(It.Is<string>(s=>s==aspNetId))).Returns(aspUsersSetMock.Object.FirstAsync(u=>u.Id==aspNetId));
			entityMock.Setup(e => e.SaveChangesAsync()).Returns(Task.FromResult(1)).Verifiable();

			//Prepare controller dependencies
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userStoreMock             = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock           = new Mock<ApplicationUserManager>(userStoreMock.Object);
			//Mock wrong password check with password from model
			userManagerMock.Setup(m => m.CheckPasswordAsync(It.IsAny<AspNetUser>(), It.Is<string>((p=>p==model.CurrentPassword)))).Returns(Task.FromResult(false)).Verifiable();
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object, null, null);
			//Mock authenticated user data
			accountController.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(userIdClaimType, aspNetId) }));
			//Mock DeviceTag cookie
			HttpRequestMessage request = new HttpRequestMessage();
			request.Headers.Add("Cookie", $"{CookieHelper.CookieNames.DeviceTag}={deviceTagCookieValue};");
			accountController.Request = request;
			
			//Act
			ProfileUpdateResponseModel response = await accountController.PostProfile(model);

			//Verify that userManager.CheckPasswordAsync method called with proper password parameter.
			userManagerMock.Verify();
			//Assert data saved by EF
			entityMock.Verify(e=>e.SaveChangesAsync(),Times.Never);
			//Assert no changes saved.
			Assert.AreEqual(changesToSave, null);
			//Assert no changes in UserProfile
			Assert.AreEqual(aspNetUsersData.First().Users.First().Id          , userId);
			Assert.AreEqual(aspNetUsersData.First().Email                     , email);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthMonth  , birthMonth);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthYear   , birthYear);
			Assert.AreEqual(aspNetUsersData.First().Users.First().CountryId   , countryId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Introduction, introduction);
			Assert.AreEqual(aspNetUsersData.First().Users.First().KnowsId     , knowsId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Knows2Id    , knows2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().LearnsId    , learnsId);
		    Assert.AreEqual(aspNetUsersData.First().Users.First().Learns2Id   , learns2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Location    , location);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithTextChat), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithVoiceChat), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithGames), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithMore), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.WantsToHelpHellolingo), 1);
			//Assert server responce
			Assert.AreEqual(response.IsUpdated, false);
			Assert.AreEqual(response.Message.Code, WebApiResponseCode.WrongPassword);
		}


		// TODOLater: Repair this. This test fails because there is no Request context created for it
		[Ignore]
		[TestMethod]
		public async Task TestUpdateUserPasswordSuccess()
		{
			string aspNetId = Guid.NewGuid().ToString();
			int userId = 1;
			string userIdClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
			UserProfileModel model = new UserProfileModel { Id = userId, Password = "newpaswordtoupdate", CurrentPassword = "currentPassword"};

			var entityMock = new Mock<IHellolingoEntities>();

			var userToChangePsw = new AspNetUser { Id = aspNetId, Users = new List<User>() {new User  {Id=userId} }};
			entityMock.Setup(e => e.AspNetUsers.FindAsync(It.Is<string>(s=>s==aspNetId))).Returns(Task.FromResult(userToChangePsw));

			var userStoreMock   = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock = new Mock<ApplicationUserManager>(userStoreMock.Object);

			userManagerMock.Setup(m => m.CheckPasswordAsync(It.IsAny<AspNetUser>(), It.IsAny<string>())).Returns(Task.FromResult(true));
			userManagerMock.Setup(m => m.ChangePasswordAsync(It.Is<string>((id) => id == aspNetId),
				                                             It.Is<string>((currentPsw) => currentPsw == model.CurrentPassword),
				                                             It.Is<string>((newPsw) => newPsw == model.Password)))
		                   .ReturnsAsync(IdentityResult.Success);



			var accountController = new AccountController(userManagerMock.Object, null, entityMock.Object, null, null,null);
			accountController.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(userIdClaimType, aspNetId) }));
			
			ProfileUpdateResponseModel result = await accountController.PostProfile(model);
			userManagerMock.Verify(m=>m.ChangePasswordAsync(It.Is<string>((id)=>id==aspNetId),
				                                            It.Is<string>((currentPsw)=>currentPsw==model.CurrentPassword),
															It.Is<string>((newPsw)=>newPsw==model.Password)),
							       Times.Once());

			Assert.AreEqual(result.IsUpdated, true,"After update password it must returns isUpdated = true.");
		}

		[TestMethod]
		public async Task TestUpdateUserProfileFailedExistingEmailAndName()
		{
			//Prepare existing user which will update own profile
			string userName             = "test@test.com";
			string aspNetId             = Guid.NewGuid().ToString();
			string userIdClaimType      = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
			string deviceTagCookieValue = "42";

			//init values 
			string email = userName;
			int    userId = 1;
			string firstName = "Andriy";
			string lastName = "Lakhno";
			string gender = "M";
			byte    birthMonth = 2;
			int    birthYear = 1980;
			byte    countryId = 1;
			string location = "Kyiv";
			byte    learnsId = 1;
			byte    knowsId = 2;
			byte? knows2Id = null;
			byte? learns2Id = null;
			string introduction = "Intro";

			var initUserData = new User()
			{
				Id           = userId,
				FirstName    = firstName,
				LastName     = lastName,
				Gender       = gender,
				BirthMonth   = birthMonth,
				BirthYear    = birthYear,
				CountryId    = countryId,
				Location     = location,
				LearnsId     = learnsId,
				KnowsId      = knowsId,
				Introduction = introduction,
				Tags = new List<UsersTagsValue>()
				{
					new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
					new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
					new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
					new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
				},
			};
			//it used in Mock call back to verify values which stored in UsersChanges table
			UsersChanges changesToSave=null;
			var aspNetUsersData = new List<AspNetUser>()
			{
				new AspNetUser()
				{
					Id = aspNetId,
					UserName = userName,
					Email = userName,
					Users = new[] { initUserData }
				}
			}.AsQueryable();
			var usersChangesData = new List<UsersChanges>().AsQueryable();
			var tagsValuesData = new List<UsersTagsValue>()
			{
				new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat },
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithGames    },
			    new UsersTagsValue() {Id = UserTags.LookToLearnWithMore     },
			    new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo   }
			}.AsQueryable();

			//Prepare EF DbSet Mocks
			var aspUsersSetMock = new Mock<DbSet<AspNetUser>>();
			var changesSetMock = new Mock<DbSet<UsersChanges>>();
			var tagsValuesMock = new Mock<DbSet<UsersTagsValue>>();
			//Prepare Linq interfacres
			aspUsersSetMock.As<IDbAsyncEnumerable<AspNetUser>>()
				           .Setup(u => u.GetAsyncEnumerator())
				           .Returns(new FakeDbAsyncEnumerator<AspNetUser>(aspNetUsersData.GetEnumerator()));
			aspUsersSetMock.As<IQueryable<AspNetUser>>()
				           .Setup(u => u.Provider)
				           .Returns(new FakeDbAsyncQueryProvider<AspNetUser>(aspNetUsersData.Provider));
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.Expression).Returns(aspNetUsersData.Expression);
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.ElementType).Returns(aspNetUsersData.ElementType);
			aspUsersSetMock.As<IQueryable<AspNetUser>>().Setup(u => u.GetEnumerator()).Returns(aspNetUsersData.GetEnumerator());
			changesSetMock.As<IDbAsyncEnumerable<UsersChanges>>()
				           .Setup(u => u.GetAsyncEnumerator())
				           .Returns(new FakeDbAsyncEnumerator<UsersChanges>(usersChangesData.GetEnumerator()));
			changesSetMock.As<IQueryable<UsersChanges>>()
				           .Setup(u => u.Provider)
				           .Returns(new FakeDbAsyncQueryProvider<UsersChanges>(usersChangesData.Provider));
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.Expression).Returns(usersChangesData.Expression);
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.ElementType).Returns(usersChangesData.ElementType);
			changesSetMock.As<IQueryable<UsersChanges>>().Setup(u => u.GetEnumerator()).Returns(usersChangesData.GetEnumerator());
			changesSetMock.Setup(c=>c.Add(It.IsAny<UsersChanges>())).Returns(new UsersChanges()).Callback<UsersChanges>(changes=>changesToSave=changes);
			tagsValuesMock.As<IDbAsyncEnumerable<UsersTagsValue>>()
				           .Setup(u => u.GetAsyncEnumerator())
				           .Returns(new FakeDbAsyncEnumerator<UsersTagsValue>(tagsValuesData.GetEnumerator()));
			tagsValuesMock.As<IQueryable<UsersTagsValue>>()
				           .Setup(u => u.Provider)
				           .Returns(new FakeDbAsyncQueryProvider<UsersTagsValue>(usersChangesData.Provider));
			tagsValuesMock.As<IQueryable<UsersTagsValue>>().Setup(u => u.Expression).Returns(usersChangesData.Expression);
			tagsValuesMock.As<IQueryable<UsersTagsValue>>().Setup(u => u.ElementType).Returns(usersChangesData.ElementType);
			tagsValuesMock.As<IQueryable<UsersTagsValue>>().Setup(u => u.GetEnumerator()).Returns(tagsValuesData.GetEnumerator());
			//tagsValuesMock.Setup(t => t.Remove(It.IsAny<UsersTagsValue>())).Callback<UsersTagsValue>((v) => tagsValuesData=tagsValuesData.Where(t=>t.Id!=v.Id));
			var entityMock = new Mock<IHellolingoEntities>();
			entityMock.Setup(e => e.AspNetUsers).Returns(aspUsersSetMock.Object);
			entityMock.Setup(e => e.UsersChanges).Returns(changesSetMock.Object);
			entityMock.Setup(e => e.UsersTagsValues).Returns(tagsValuesMock.Object);
			entityMock.Setup(e => e.AspNetUsers.FindAsync(It.Is<string>(s=>s==aspNetId))).Returns(aspUsersSetMock.Object.FirstAsync(u=>u.Id==aspNetId));
			entityMock.Setup(e => e.SaveChangesAsync()).Returns(Task.FromResult(1)).Verifiable();

			//Prepare controller dependencies
			var lasVisitMock              = new Mock<ILastVisitHelper>();
			var userStoreMock             = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock           = new Mock<ApplicationUserManager>(userStoreMock.Object);
			userManagerMock.Setup(m => m.CheckPasswordAsync(It.IsAny<AspNetUser>(), It.IsAny<string>())).ReturnsAsync(true);
			userManagerMock.Setup(m => m.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser() {});
			userManagerMock.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(new AspNetUser() {});
			var authenticationManagerMock = new Mock<IAuthenticationManager>();
			var applicationSignInManager  = new FakeSignInManager(userManagerMock.Object, authenticationManagerMock.Object)
			{
				PasswordSignInAsyncDelegate = (string un, string psw, bool isPersist, bool isLock) => Task.FromResult(SignInStatus.Success)
			};
			var accountController         = new AccountController(userManagerMock.Object, applicationSignInManager, entityMock.Object, lasVisitMock.Object,null, authenticationManagerMock.Object);
			//Mock authenticated user data
			accountController.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(userIdClaimType, aspNetId) }));
			//Mock DeviceTag cookie
			HttpRequestMessage request = new HttpRequestMessage();
			request.Headers.Add("Cookie", $"{CookieHelper.CookieNames.DeviceTag}={deviceTagCookieValue};");
			accountController.Request = request;
			//Create EditProfileModel
			//All fields which are in UserProfileModel must be updated for User, except password in this test.
			UserProfileModel model = new UserProfileModel()
			{
				Id = 1,
				Email = "andriy.l.a@gamil.com",
				BirthMonth = 10,
				BirthYear = 1970,
				Country = 3,
				Location = "Lviv",
				Learns = 3,
				Knows = 4,
				Learns2 = 5,
				Knows2 = 6,
				LookToLearnWithGames = false,
				LookToLearnWithTextChat = false,
				LookToLearnWithVoiceChat = false,
				LookToLearnWithMore = false,
				Introduction = "No introduction",
				WantsToHelpHellolingo = false,
				IsSharedTalkMember = true,
				IsLivemochaMember = true,
				Password = null,
				CurrentPassword = "currentPassword"
			};
			//Act
			ProfileUpdateResponseModel response = await accountController.PostProfile(model);

			//Assert data saved by EF
			entityMock.Verify(e=>e.SaveChangesAsync(),Times.Never);

			//Assert that Change Password is not called
			userManagerMock.Verify(m=>m.ChangePasswordAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),Times.Never);

			//Assert prevent dubliating email and user name before updating user email and user name
			userManagerMock.Verify(m => m.FindByNameAsync(It.Is<string>((e) => e == model.Email)),Times.Once);
			//It is not called in this test because of using operator &&
			userManagerMock.Verify(m => m.FindByEmailAsync(It.Is<string>((e) => e == model.Email)),Times.Never);
			
			//Assert no changes in UserProfile
			Assert.AreEqual(aspNetUsersData.First().Users.First().Id          , userId);
			Assert.AreEqual(aspNetUsersData.First().Email                     , email);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthMonth  , birthMonth);
			Assert.AreEqual(aspNetUsersData.First().Users.First().BirthYear   , birthYear);
			Assert.AreEqual(aspNetUsersData.First().Users.First().CountryId   , countryId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Introduction, introduction);
			Assert.AreEqual(aspNetUsersData.First().Users.First().KnowsId     , knowsId);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Knows2Id    , knows2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().LearnsId    , learnsId);
		    Assert.AreEqual(aspNetUsersData.First().Users.First().Learns2Id   , learns2Id);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Location    , location);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithTextChat), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithVoiceChat), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithGames), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.LookToLearnWithMore), 1);
			Assert.AreEqual(aspNetUsersData.First().Users.First().Tags.Count(t => t.Id == UserTags.WantsToHelpHellolingo), 1);
			//Assert server responce
			Assert.AreEqual(response.IsUpdated, false);
			Assert.AreEqual(response.Message.Code, WebApiResponseCode.EmailAlreadyInUse);
		}

		private Mock<ApplicationSignInManager> GetApplicationSignInManagerMock(ApplicationUserManager userManager,IAuthenticationManager authenticationManager)
		{
			var signInManagerMock = new Mock<ApplicationSignInManager>(userManager,authenticationManager);
			signInManagerMock.Setup(
				s => s.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<bool>()))
				.ReturnsAsync(SignInStatus.Success);
			signInManagerMock.Setup(s => s.SignInAsync(It.IsAny<AspNetUser>(), It.IsAny<bool>(), It.IsAny<bool>()))
				.Returns(Task.FromResult(0));
			return signInManagerMock;
		}

		[TestMethod]
		public async Task TestDeleteUserAccountSuccess()
		{
			string aspNetUserId = Guid.NewGuid().ToString();
			string aspNetUserName = "b.vdr@outlook.com";
			int userId = 1;
			string userPassword = "password";

			var usersData        = new List<User>() {new User() {Id = userId, StatusId = UserStatuses.Valid} };
			var aspNetUserData  = new List<AspNetUser>() {new AspNetUser()
			{   Id = aspNetUserId,
				Email = aspNetUserName,
				UserName = aspNetUserName,
				Users = usersData
			}};
			var aspNetUsersMock   = DbSetMockHelper.GetDbSetMock(aspNetUserData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.Is<string>(id => id == aspNetUserId))).ReturnsAsync(aspNetUserData.First()).Verifiable();
			var usersMock         = DbSetMockHelper.GetDbSetMock(usersData);
			var dataBaseMock      = new Mock<IHellolingoEntities>();
			dataBaseMock.Setup(d => d.Users).Returns(usersMock.Object);
			dataBaseMock.Setup(d => d.AspNetUsers).Returns(aspNetUsersMock.Object);
			dataBaseMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
			userManagerMock.Setup(u=>u.CheckPasswordAsync(It.Is<AspNetUser>(aspNetUser=>aspNetUser.Id==aspNetUserId),It.Is<string>(p=>p==userPassword))).ReturnsAsync(true).Verifiable();
			var authManagerMock   = new Mock<IAuthenticationManager>();
			authManagerMock.Setup(a=>a.SignOut(It.Is<string>(c=>c==DefaultAuthenticationTypes.ApplicationCookie))).Verifiable();
			var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
			var lastVisitMock     = new Mock<ILastVisitHelper>();   

			var controller = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, null, authManagerMock.Object);
			controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] { new Claim(UserIdClaimType, aspNetUserId) }));
			controller.Request = WebTestsHelper.GetDefaultAccountControllerRequest();

			var model = new DeleteUserRequestModel() {UserId = userId,CurrentPassword = userPassword};
			DeleteUserResponseModel response = await controller.DeleteAccount(model);
			Assert.AreEqual(true, response.IsSuccess);
			Assert.AreEqual(UserStatuses.Deleted, usersData.First().StatusId);
			Assert.AreEqual($"({userId}){aspNetUserName}", aspNetUserData.First().UserName);
			authManagerMock.Verify();
			aspNetUsersMock.Verify();
			userManagerMock.Verify();
			dataBaseMock.Verify();
		}

		[TestMethod]
		public async Task TestDeleteUserAccountModelStateFailed()
		{
		    var dataBaseMock      = new Mock<IHellolingoEntities>();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
			var authManagerMock   = new Mock<IAuthenticationManager>();
			authManagerMock.Setup(a=>a.SignOut(It.Is<string>(c=>c==DefaultAuthenticationTypes.ApplicationCookie))).Verifiable();
			var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
			var lastVisitMock     = new Mock<ILastVisitHelper>();   

			var controller = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, null, null);
			controller.ModelState.AddModelError("test","test");
			var model      = new DeleteUserRequestModel();
			DeleteUserResponseModel response = await controller.DeleteAccount(model);
			Assert.AreEqual(DeleteUserResponseModel.InvalidEntry.IsSuccess, response.IsSuccess);
			authManagerMock.Verify(a=>a.SignOut(It.IsAny<string>()),Times.Never());

		}

		[TestMethod]
		public async Task TestDeleteUserWrongPasswordFailed()
		{
			string aspNetUserId = Guid.NewGuid().ToString();
			string aspNetUserName = "b.vdr@outlook.com";
			int userId = 1;
			string userPassword = "password";

			var usersData        = new List<User>() {new User() {Id = userId, StatusId = UserStatuses.Valid} };
			var aspNetUserData  = new List<AspNetUser>() {new AspNetUser()
			{   Id = aspNetUserId,
				Email = aspNetUserName,
				UserName = aspNetUserName,
				Users = usersData
			}};
			var aspNetUsersMock   = DbSetMockHelper.GetDbSetMock(aspNetUserData);
			aspNetUsersMock.Setup(a => a.FindAsync(It.Is<string>(id => id == aspNetUserId))).ReturnsAsync(aspNetUserData.First()).Verifiable();
			var usersMock         = DbSetMockHelper.GetDbSetMock(usersData);
			var dataBaseMock      = new Mock<IHellolingoEntities>();
			dataBaseMock.Setup(d => d.Users).Returns(usersMock.Object);
			dataBaseMock.Setup(d => d.AspNetUsers).Returns(aspNetUsersMock.Object);
			dataBaseMock.Setup(e => e.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
			var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
			userManagerMock.Setup(u=>u.CheckPasswordAsync(It.Is<AspNetUser>(aspNetUser=>aspNetUser.Id==aspNetUserId),It.Is<string>(p=>p==userPassword))).ReturnsAsync(false).Verifiable();
			var authManagerMock   = new Mock<IAuthenticationManager>();
			authManagerMock.Setup(a=>a.SignOut(It.Is<string>(c=>c==DefaultAuthenticationTypes.ApplicationCookie)));
			var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
			var lastVisitMock     = new Mock<ILastVisitHelper>();   

			var controller = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, null, authManagerMock.Object);
			controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] { new Claim(UserIdClaimType, aspNetUserId) }));
			controller.Request = WebTestsHelper.GetDefaultAccountControllerRequest();

			var model = new DeleteUserRequestModel() {UserId = userId,CurrentPassword = userPassword};
			DeleteUserResponseModel response = await controller.DeleteAccount(model);
			Assert.AreEqual(DeleteUserResponseModel.WrongPassword.IsSuccess, response.IsSuccess);
			Assert.AreEqual(UserStatuses.Valid, usersData.First().StatusId);
			Assert.AreEqual(aspNetUserName, aspNetUserData.First().UserName);
			Assert.AreEqual(aspNetUserName, aspNetUserData.First().Email);
			authManagerMock.Verify(a=>a.SignOut(It.IsAny<string>()),Times.Never);
			aspNetUsersMock.Verify();
			userManagerMock.Verify();
			dataBaseMock.Verify(e => e.SaveChangesAsync(),Times.Never);
		}

		// TODOLater: Repair this! It doesn't because the line "sgClientMock.Setup..." has been commented out due to a change in the signature of this method
		[Ignore]
		[TestMethod]
		public async Task TestSendVerifyEmailSuccess()
		{
			string aspNetUserId = Guid.NewGuid().ToString();
			string email = "b.vdr@outlook.com";
			int userId = 1;
			//string emailSubject = "Confirm your account";
			//string emailBody = $"Please confirm your account by clicking <a href=\"http://localhost/validate-email?id={aspNetUserId}&t=dG9rZW41\">this link</a>.";
			var user = new AspNetUser() {Email = email, Users=new List<User> { new User { Id=userId, StatusId=UserStatuses.PendingEmailValidation} } };

			var dataBaseMock      = new Mock<IHellolingoEntities>();
			var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
		    var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
			userManagerMock.Setup(um=>um.FindByIdAsync(It.Is<string>(id=>id==aspNetUserId))).ReturnsAsync(user).Verifiable();
			userManagerMock.Setup(um=>um.GenerateEmailConfirmationTokenAsync(It.Is<string>(id=>id==aspNetUserId))).ReturnsAsync("token").Verifiable();
		    var authManagerMock   = new Mock<IAuthenticationManager>();
			var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
			var lastVisitMock     = new Mock<ILastVisitHelper>();   
			var sgClientMock      = new Mock<IEmailSender>();
			//sgClientMock.Setup(sg=>sg.SendSignUpEmailConfirmation(It.Is<int>(id=>id==userId), It.Is<string>(e=>e==email), It.Is<string>(s=>s==emailSubject), It.Is<string>(b=>b==emailBody))).Returns(Task.FromResult(0)).Verifiable();
			var controller        = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, sgClientMock.Object, authManagerMock.Object);
			controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] {
				new Claim(UserIdClaimType, aspNetUserId),
				new Claim(CustomClaimTypes.UserId, userId.ToString())
			}));
			controller.Request    = WebTestsHelper.GetDefaultAccountControllerRequest();

			await controller.SendEmailVerification();

			userManagerMock.Verify();

		}

		//[TestMethod]
		//public async Task TestSendVerifyEmailFailed_UserId()
		//{
		//	string aspNetUserId = Guid.NewGuid().ToString();
		//	//string email = "b.vdr@outlook.com";
		//	int userId = 2;
		//	byte userStatus = UserStatuses.Valid;
		//	//string emailSubject = "Confirm your account";
		//	string emailBody = $"Please confirm your account by clicking this link: <a href=\"http://localhost/validate-email?id={aspNetUserId}&t=dG9rZW41\">link</a>";

		//	var dataBaseMock      = new Mock<IHelloLingoEntities>();
		//	var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
		//    var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
		//	var authManagerMock   = new Mock<IAuthenticationManager>();
		//	var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
		//	var lastVisitMock     = new Mock<ILastVisitHelper>();   
		//	var sgClientMock      = new Mock<ISendGridManager>();
		//	var controller        = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, sgClientMock.Object, authManagerMock.Object);
		//	controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] {
		//		new Claim(UserIdClaimType, aspNetUserId),
		//		new Claim(CustomClaimTypes.UserId, userId.ToString())
		//	}));
		//	controller.Request    = WebTestsHelper.GetDefaultAccountControllerRequest();

		//	bool isResult         = await controller.SendEmailVerification();

		//	Assert.AreEqual(false, isResult);
		//	sgClientMock.Verify(sg => sg.SendSignUpEmailConfirmation(It.Is<int>(id => true), It.Is<string>(e => true), It.Is<string>(s => true), It.Is<string>(b => true)), Times.Never);
		//}


		//[TestMethod]
		//public async Task TestSendVerifyEmailFailed()
		//{
		//	string aspNetUserId = Guid.NewGuid().ToString();
		//	string email = "b.vdr@outlook.com";
		//	int userId = 2;
		//	byte userStatus = UserStatuses.Valid;
		//	string emailSubject = "Confirm your account";
		//	string emailBody = $"Please confirm your account by clicking this link: <a href=\"http://localhost/validate-email?id={aspNetUserId}&t=dG9rZW41\">link</a>";

		//	var dataBaseMock      = new Mock<IHelloLingoEntities>();
		//	var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
		//    var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
		//	userManagerMock.Setup(um=>um.FindByIdAsync(It.Is<string>(id=>id==aspNetUserId))).ReturnsAsync(new AspNetUser() {Email = email}).Verifiable();
		//	userManagerMock.Setup(um=>um.GenerateEmailConfirmationTokenAsync(It.Is<string>(id=>id==aspNetUserId))).ReturnsAsync("token").Verifiable();
		//	var authManagerMock   = new Mock<IAuthenticationManager>();
		//	var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
		//	var lastVisitMock     = new Mock<ILastVisitHelper>();   
		//	var sgClientMock      = new Mock<ISendGridManager>();
		//	sgClientMock.Setup(sg => sg.SendSignUpEmailConfirmation(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
		//		        .Throws<Exception>();
		//	var controller        = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, sgClientMock.Object, authManagerMock.Object);
		//	controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] {
		//		new Claim(UserIdClaimType, aspNetUserId),
		//		new Claim(CustomClaimTypes.UserId, userId.ToString())
		//	}));
		//	controller.Request    = WebTestsHelper.GetDefaultAccountControllerRequest();

		//	bool isResult         = await controller.SendEmailVerification();

		//	Assert.AreEqual(false, isResult);
		//	sgClientMock.Verify(sg=>sg.SendSignUpEmailConfirmation(It.Is<int>(id=>id==userId), It.Is<string>(e=>e==email), It.Is<string>(s=>s==emailSubject), It.Is<string>(b=>b==emailBody)),Times.Once);
		//}

		//[TestMethod]
		//public async Task TestUpdatePinnedTiles()
		//{
		//	string aspNetUserId = Guid.NewGuid().ToString();
		//	//string email = "b.vdr@outlook.com";
		//	int userId = 2;
		//	byte userStatus = UserStatuses.Valid;

		//	var filteringInitData = new List<TilesFiltering>() {new TilesFiltering() {UserId = userId, TileId = 1, FilterId = 1}};
		//	var filteringMock = DbSetMockHelper.GetDbSetMock(filteringInitData);
		//	var dataBaseMock      = new Mock<IHellolingoEntities>();
		//	dataBaseMock.Setup(d => d.TilesFilterings).Returns(filteringMock.Object);
		//	var userStoreMock     = new Mock<IUserStore<AspNetUser,string>>();
		//    var userManagerMock   = new Mock<ApplicationUserManager>(userStoreMock.Object);
		//	var authManagerMock   = new Mock<IAuthenticationManager>();
		//	var signInManagerMock = GetApplicationSignInManagerMock(userManagerMock.Object, authManagerMock.Object);
		//	var lastVisitMock     = new Mock<ILastVisitHelper>();   
		//	var sgClientMock      = new Mock<ISendGridManager>();

		//	var controller        = new AccountController(userManagerMock.Object, signInManagerMock.Object, dataBaseMock.Object,lastVisitMock.Object, sgClientMock.Object, authManagerMock.Object);
		//	controller.RequestContext.Principal = new ClaimsPrincipal(new ClaimsIdentity(new [] {
		//		new Claim(UserIdClaimType, aspNetUserId),
		//		new Claim(CustomClaimTypes.UserId, userId.ToString())
		//	}));
		//	controller.Request    = WebTestsHelper.GetDefaultAccountControllerRequest();
		//	var model             = new PostFiltersModel()
		//	{
		//		UserId = userId,
		//		Filters = new List<TileFilterModel>()
		//		{   new TileFilterModel() {FilterId = 2, TileId = 2},
		//			new TileFilterModel() {FilterId = 3, TileId = 3}}
		//	};

		//	await controller.TilesFilteringUpdate(model);
		//	filteringMock.Verify(tf=>tf.RemoveRange(It.Is<IEnumerable<TilesFiltering>>(f=>f.Count()==1)),Times.Once);
		//	filteringMock.Verify(tf=>tf.AddRange(It.Is<IEnumerable<TilesFiltering>>(f=>f.Count()==2&&
		//	                                                                           f.Count(fu=>fu.UserId==userId)==2&&
		//																			   f.Count(ff=>ff.TileId==2)==1&&
		//																			   f.Count(ft=>ft.TileId==3)==1&&
		//																			   f.Count(fu=>fu.TileId==1)==0)),Times.Once);
		//	dataBaseMock.Verify(db=>db.SaveChangesAsync(),Times.Once);

		//}

	}
}