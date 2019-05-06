using Considerate.Hellolingo.WebApp.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestUserProfileLocationCleanUp
	{
		private UserProfileModel GetProfileModelWithoutLocation()
		{
			return new UserProfileModel() 
			{
				BirthMonth = 12,
				BirthYear = 1987,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 2,
				Learns = 4,
				Learns2 = 1,
				Knows2 = 6,
				Password = "f8O19D",
				Country = 106,
				Introduction =
					"I am just a spanish normal guy who tries to learn japanese in his free time.If you want to know more about me just drop me a message.\"El saber no ocupa lugar\"",
				LookToLearnWithTextChat = true,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,

			};
		}

		[TestMethod]
		public void TestLocationCleanUp()
		{
			string locationInput    = "Washington D. C.";
			string locationExpected = "Washington D. C.";

			var model = GetProfileModelWithoutLocation();
			model.Location = locationInput;
			var results = ValidatorHelper.ValidateModel(model);

			Assert.AreEqual(locationExpected, model.Location, "Wrong location cleaning.");
		}

		[TestMethod]
		public void TestLocationCleanUp2()
		{
			string locationInput    = "Washington D. C...";
			string locationExpected = "Washington D. C.";

			var model = GetProfileModelWithoutLocation();
			model.Location = locationInput;
			var results = ValidatorHelper.ValidateModel(model);

			Assert.AreEqual(locationExpected, model.Location, "Wrong location cleaning.");
		}

		[TestMethod]
		public void TestLocationCleanUp3()
		{
			string locationInput    = "...Washington D. C...";
			string locationExpected = "Washington D. C.";

			var model = GetProfileModelWithoutLocation();
			model.Location = locationInput;
			var results = ValidatorHelper.ValidateModel(model);

			Assert.AreEqual(locationExpected, model.Location, "Wrong location cleaning.");
		}

		[TestMethod]
		public void TestLocationCleanUp4()
		{
			string locationInput    = "...Washington D... C...";
			string locationExpected = "Washington D... C.";

			var model = GetProfileModelWithoutLocation();
			model.Location = locationInput;
			var results = ValidatorHelper.ValidateModel(model);

			Assert.AreEqual(locationExpected, model.Location, "Wrong location cleaning.");
		}
	}
}