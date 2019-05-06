using System;
using System.Net;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.WebApp.Controllers.WebApi;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Considerate.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HelloLingoWeb.Test.EF
{
	[TestClass]
	public class TestMemberController
	{
		//[Ignore] // Andriy: I can't run this test anymore b/c controller.GetProfile() now uses UserManager
		[TestMethod]
		public async  Task TestGetMemberById()
		{
			User userSharedTalk;
			using (var db=new HellolingoEntities())
			{
				userSharedTalk = await db.Users.FindAsync(1);
			}
			var controller = new MemberController();
			controller.User = new GenericPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(CustomClaimTypes.UserId, userSharedTalk.Id.ToString()) }), null);

			var foundMember = await controller.GetProfile(new MemberController.GetProfileRequest {Id = 1});
			Assert.AreEqual(userSharedTalk.Id,foundMember.Id, $"{nameof(foundMember.Id)} is wrong.");
			Assert.AreEqual(userSharedTalk.FirstName,foundMember.FirstName, $"{nameof(foundMember.FirstName)} is wrong.");
			Assert.AreEqual(userSharedTalk.LastName,foundMember.LastName, $"{nameof(foundMember.LastName)} is wrong.");
			Assert.AreEqual(userSharedTalk.CountryId,foundMember.Country, $"{nameof(foundMember.Country)} is wrong.");
			Assert.AreEqual(userSharedTalk.Location,foundMember.Location, $"{nameof(foundMember.Location)} is wrong.");
			Assert.AreEqual(userSharedTalk.KnowsId,foundMember.Knows, $"{nameof(foundMember.Knows)} is wrong.");
			Assert.AreEqual(userSharedTalk.LearnsId,foundMember.Learns, $"{nameof(foundMember.Learns)} is wrong.");
			Assert.AreEqual(userSharedTalk.Introduction,foundMember.Introduction, $"{nameof(foundMember.Introduction)} is wrong.");
			Assert.AreEqual(new DateTime(userSharedTalk.BirthYear,userSharedTalk.BirthMonth,1).GetAgeInYears(DateTime.Now), foundMember.Age, $"{nameof(foundMember.Age)} is wrong.");
			Assert.IsTrue(foundMember.IsSharedTalkMember);


			User userNewUser;
			using (var db=new HellolingoEntities())
			{
				userNewUser = await db.Users.FindAsync(5870);
			}
			var controller2 = new MemberController();
			controller.User = new GenericPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(CustomClaimTypes.UserId, userNewUser.Id.ToString()) }), null);

			var foundMember2 = await controller2.GetProfile(new MemberController.GetProfileRequest {Id = 5870});
			Assert.AreEqual(userNewUser.Id,foundMember2.Id, $"{nameof(foundMember2.Id)} is wrong.");
			Assert.AreEqual(userNewUser.FirstName,foundMember2.FirstName, $"{nameof(foundMember2.FirstName)} is wrong.");
			Assert.AreEqual(userNewUser.LastName,foundMember2.LastName, $"{nameof(foundMember2.LastName)} is wrong.");
			Assert.AreEqual(userNewUser.CountryId,foundMember2.Country, $"{nameof(foundMember2.Country)} is wrong.");
			Assert.AreEqual(userNewUser.Location,foundMember2.Location, $"{nameof(foundMember2.Location)} is wrong.");
			Assert.AreEqual(userNewUser.KnowsId,foundMember2.Knows, $"{nameof(foundMember2.Knows)} is wrong.");
			Assert.AreEqual(userNewUser.LearnsId,foundMember2.Learns, $"{nameof(foundMember2.Learns)} is wrong.");
			Assert.AreEqual(userNewUser.Introduction,foundMember2.Introduction, $"{nameof(foundMember2.Introduction)} is wrong.");
			Assert.AreEqual(new DateTime(userNewUser.BirthYear,userNewUser.BirthMonth,1).GetAgeInYears(DateTime.Now), foundMember2.Age, $"{nameof(foundMember2.Age)} is wrong.");
			Assert.IsFalse(foundMember2.IsSharedTalkMember);

			var controller3 = new MemberController();
			try
			{
				await controller3.GetProfile(new MemberController.GetProfileRequest {Id = 0});
			}
			catch (HttpException e)
			{
				Assert.AreEqual((int)HttpStatusCode.BadRequest, e.GetHttpCode());
			}
		}
	}
}
