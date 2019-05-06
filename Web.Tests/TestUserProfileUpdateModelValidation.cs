using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.ComponentModel.DataAnnotations;
using Considerate.Hellolingo.WebApp.Models;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestUserProfileUpdateModelValidation
	{
		[TestMethod]
		public void UserProfileModelTest()
		{
			// Testing required values
			IList<ValidationResult> result;
			result = ValidatorHelper.ValidateModel(new UserProfileModel());
			Assert.AreEqual(result.Count, 5);


			// Testing valid model
			IList<ValidationResult> result1;
			result1 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
			});
			Assert.AreEqual(result1.Count, 0, $"Model must be valid, Errors: {string.Join(":", result1)}");

			// Testing not valid new password
			IList<ValidationResult> result2;
			result2 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Password = "123",
			});
			Assert.AreEqual(result2.Count, 1, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result2)}");
			IList<ValidationResult> result3;
			result3 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Password = "f8O19Dq8vTjGFWJX1aQpKPfVQ8kTQTAn6MY7acznNnVoXQXLCvuTRrNxSfi7YuLlEfOO5mZGcdePGgrpeY3NAViIrhFvxXiEVqMa",
			});
			Assert.AreEqual(result3.Count, 1, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result3)}");

			IList<ValidationResult> result4;
			result4 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Password = "f8O19Dq8vTjGFWJX1aQpKPfVQ8kTQTAn6MY7acznNnVoXQXLCvuTRrNxSfi7YuLlEfOO5mZGcdePGgrpeY3NAViIrhFvxXiEVqMa",
			});
			Assert.AreEqual(result4.Count, 1, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result4)}");

			IList<ValidationResult> result5;
			result5 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Learns2 = 2,
				Knows2 = 2,
				Password = "f8O19Dq8vTjGFWJX1aQpKPfVQ8kTQTAn6MY7acznNnVoXQXLCvuTRrNxSfi7YuLlEfO",
			});
			Assert.AreEqual(result5.Count, 2, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result5)}");

			IList<ValidationResult> result6;
			result6 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Learns2 = 3,
				Knows2 = 2,
				Password = "f8O19Dq8vTjGFWJX1aQpKPfVQ8kTQTAn6MY7acznNnVoXQXLCvuTRrNxSfi7YuLlEfO",
			});
			Assert.AreEqual(result6.Count, 1, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result6)}");

			IList<ValidationResult> result7;
			result7 = ValidatorHelper.ValidateModel(new UserProfileModel()
			{
				BirthMonth = 4,
				BirthYear = 1980,
				Email = "b.vdr@outlook.com",
				CurrentPassword = "12345678",
				Knows = 1,
				Learns = 2,
				Learns2 = 3,
				Knows2 = null,
				Password = "f8O19Dq8vTjGFWJX1aQpKPfVQ8kTQTAn6MY7acznNnVoXQXLCvuTRrNxSfi7YuLlEfO",
			});
			Assert.AreEqual(result7.Count, 0, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result7)}");

			//Test error from production log:
			IList<ValidationResult> result8;
			result8 = ValidatorHelper.ValidateModel(new UserProfileModel()
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
				Location = "",
				Introduction = "I am just a spanish normal guy who tries to learn japanese in his free time.If you want to know more about me just drop me a message.\"El saber no ocupa lugar\"",
				LookToLearnWithTextChat = true,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,

			});
			Assert.AreEqual(result8.Count, 0, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", result8)}");

			IList<ValidationResult> resultLocationWithoutDots;
			string locationWithoutDots = "Kyiv";
			var modelWithoutDotLocation = new UserProfileModel()
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
				Location = locationWithoutDots,
				Introduction =
					"I am just a spanish normal guy who tries to learn japanese in his free time.If you want to know more about me just drop me a message.\"El saber no ocupa lugar\"",
				LookToLearnWithTextChat = true,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,

			};
			resultLocationWithoutDots = ValidatorHelper.ValidateModel(modelWithoutDotLocation);
			Assert.AreEqual(resultLocationWithoutDots.Count, 0, $"Model must be not valid with errors number: {1}, Errors: {string.Join(":", resultLocationWithoutDots)}");
			Assert.AreEqual(locationWithoutDots, modelWithoutDotLocation.Location, "Wrong location cleaning.");
		}
	}
}

