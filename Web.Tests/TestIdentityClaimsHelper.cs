using System.Security.Claims;
using System.Security.Principal;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestIdentityClaimsHelper
	{
		[TestMethod]
		public void GetUserIdFromClaimTest()
		{
			int userId = 1456;
			IIdentity userIdentity = new ClaimsIdentity(new []{ new Claim(CustomClaimTypes.UserId, userId.ToString()) });
			int claimUserId = userIdentity.GetClaims().Id;
			Assert.AreEqual(userId,claimUserId);
		}

		[TestMethod]
		[ExpectedException(typeof(LogReadyException))]
		public void GetUserIdFromWrongClaimTypeFailedTest()
			{
			int userId = 1456;
			IIdentity userIdentity = new ClaimsIdentity(new[] { new Claim("claim", userId.ToString()) });
			int claimUserId = userIdentity.GetClaims().Id;
			Assert.AreEqual(0, claimUserId);
		}

		[TestMethod]
		[ExpectedException(typeof(LogReadyException))]
		public void GetUserIdFromNotClaimIdentityFailedTest()
			{
			int userId = 1434;
			IIdentity userIdentity2 = new GenericIdentity(CustomClaimTypes.UserId, userId.ToString());
			int claimUserId2 = userIdentity2.GetClaims().Id;
			Assert.AreEqual(0, claimUserId2);
		}

	}
}
