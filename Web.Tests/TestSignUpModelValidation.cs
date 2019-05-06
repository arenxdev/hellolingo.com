using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Considerate.Hellolingo.WebApp.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestSignUpModelValidation
	{
		[TestMethod]
		public void SignUpRequestModelTest()
		{
			IList<ValidationResult> result;

			// Testing required values
			result = ValidatorHelper.ValidateModel(new SignUpRequestModel());
			Assert.IsTrue(result.Count == 8);

			// Testing too small, too short
			result = ValidatorHelper.ValidateModel(new SignUpRequestModel {
				BirthMonth = 0, BirthYear = 1919, Country = 0, Email = "a@", FirstName = "a",
				IsSharedTalkMember = true, Gender = "X", Knows = 0, LastName = "b", Learns = 0,
				LookToLearnWithGames = true, LookToLearnWithMore = true, LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true, Password = "12345", WantsToHelpHellolingo = true
			});
			Assert.IsTrue(result[0].ErrorMessage == "The Email field is not a valid e-mail address."); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "PasswordShorterThan6Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "FirstNameShorterThan2Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "GenderNotFOrM"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "MonthNotBetween1And12"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "YearNotBetween1920And2099"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "KnowsAndLearnsAreIdentical"); result.RemoveAt(0);
			Assert.IsTrue(result.Count == 0);

			// Testing too high, too long
			result = ValidatorHelper.ValidateModel(new SignUpRequestModel {
				BirthMonth = 13, BirthYear = 2119, Country = 0,
				Email = "test@emai.com" + new string('a',257),
				FirstName = "Bernard" + new string('a', 257),
				IsSharedTalkMember = true, Gender = "F", Knows = 1, Learns = 2,
				LastName = "Vanderydt" + new string('a', 257),
				LookToLearnWithGames = true, LookToLearnWithMore = true, LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true, WantsToHelpHellolingo = true,
				Password = "123456" + new string('a', 257),
			});
			Assert.IsTrue(result[0].ErrorMessage == "EmailLongerThan256Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "PasswordLongerThan99Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "FirstNameLongerThan25Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "LastNameLongerThan40Chars"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "MonthNotBetween1And12"); result.RemoveAt(0);
			Assert.IsTrue(result[0].ErrorMessage == "YearNotBetween1920And2099"); result.RemoveAt(0);
			Assert.IsTrue(result.Count == 0);

			// Testing good stuff
			result = ValidatorHelper.ValidateModel(new SignUpRequestModel {
				BirthMonth = 4, BirthYear = 1999, Country = 100,
				Email = "test@emai.com", Password = "123456Password",
				FirstName = "Bernard", LastName = "Vanderydt",
				IsSharedTalkMember = true, Gender = "F", Knows = 1, Learns = 2,
				LookToLearnWithGames = true, LookToLearnWithMore = true, LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true, WantsToHelpHellolingo = true,
			});
			Assert.IsTrue(result.Count == 0);


			TestUserInputCleanUp();

		}

		private void TestUserInputCleanUp()
		{
			IList<ValidationResult> result;
            //Validate FirstName, LastName, Location cleanUp
			var modelToValidate = new SignUpRequestModel
			{
				BirthMonth = 4,
				BirthYear = 1999,
				Country = 100,
				Email = "test@emai.com",
				Password = "123456Password",
				FirstName = @"   -\\--  (*@#$%^&*()_+(%^%^&%^$%^$^%$BE'R^\-NARD  \\-- ",
				LastName = @" -\\-- (..*@#$%^&*()_+(%^%^&%^$%^$^%$V.ander^\- ydt^$%^$^%...  \- ",
				Location = @" &()',  K(y)i&',v ,()'&   ",
				IsSharedTalkMember = true,
				Gender = "F",
				Knows = 1,
				Learns = 2,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,
			};

			result = ValidatorHelper.ValidateModel(modelToValidate);
			string expFirstName = @"Ber\-nard";
			string expLastName = @"V.ander\- ydt...";
			string expLocation = @"K(y)i&',v";
			Assert.IsTrue(modelToValidate.FirstName == expFirstName,
				$"First name cleanup is failed. Result: {modelToValidate.FirstName}, expected: {expFirstName}");
			Assert.IsTrue(modelToValidate.LastName == expLastName,
				$"Last name cleanup is failed. Result: {modelToValidate.LastName}, expected: {expLastName}");
			Assert.IsTrue(modelToValidate.Location == expLocation,
				$"Location cleanup is failed. Result: {modelToValidate.Location}, expected: {expLocation}");

			//Validate FirstName, LastName, Location cleanUp with only restricted symbols
	        var modelToValidateWithRestrictedSymbols = new SignUpRequestModel
			{
				BirthMonth = 4,
				BirthYear = 1999,
				Country = 100,
				Email = "test@emai.com",
				Password = "123456Password",
				FirstName = @"%^&*()_+(%^%^&%^$%",
				LastName = @"$%^&*()_+(%^%^",
				Location = @" &()',  ()&', ,()'&   ",
				IsSharedTalkMember = true,
				Gender = "F",
				Knows = 1,
				Learns = 2,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,
			};

			result = ValidatorHelper.ValidateModel(modelToValidateWithRestrictedSymbols);
		    Assert.IsTrue(result.Count == 2, $"Validation result must be without Errors. Actual: {result.Count} errors. ");
			Assert.IsTrue(result[0].ErrorMessage == $"The field {nameof(modelToValidateWithRestrictedSymbols.FirstName)} is invalid.");
			Assert.IsTrue(result[1].ErrorMessage == $"The field {nameof(modelToValidateWithRestrictedSymbols.LastName)} is invalid.");
			Assert.IsTrue(modelToValidateWithRestrictedSymbols.Location == null, $"Location cleanup is failed. Result: {modelToValidateWithRestrictedSymbols.Location}, expected: null");


			//Validate FirstName, LastName, Location cleanUp with empty strings
	        var modelToValidateWithEmptyStrings = new SignUpRequestModel
			{
				BirthMonth = 4,
				BirthYear = 1999,
				Country = 100,
				Email = "test@emai.com",
				Password = "123456Password",
				FirstName = @"   ",
				LastName = @"   ",
				Location = @"   ",
				IsSharedTalkMember = true,
				Gender = "F",
				Knows = 1,
				Learns = 2,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,
			};

			result = ValidatorHelper.ValidateModel(modelToValidateWithEmptyStrings);
				Assert.IsTrue(result.Count == 2, $"Validation result must be without Errors. Actual: {result.Count} errors. ");
			Assert.IsTrue(result[0].ErrorMessage == $"The field {nameof(modelToValidateWithRestrictedSymbols.FirstName)} is invalid.");
			Assert.IsTrue(result[1].ErrorMessage == $"The field {nameof(modelToValidateWithRestrictedSymbols.LastName)} is invalid.");
			Assert.IsTrue(modelToValidateWithEmptyStrings.Location == null,
				$"Location cleanup is failed. Result: {modelToValidateWithEmptyStrings.Location}, expected: null");





			//Validate model with Location equals null.
			var modelWithLocationNull = new SignUpRequestModel()
			{
				BirthMonth = 4,
				BirthYear = 1999,
				Country = 100,
				Email = "test@emai.com",
				Password = "123456Password",
				FirstName = "BERNARD",
				LastName = "Vanderydt",
				IsSharedTalkMember = true,
				Gender = "F",
				Knows = 1,
				Learns = 2,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,
			};

			var noErrors = ValidatorHelper.ValidateModel(modelWithLocationNull).ToList();
			Assert.IsTrue(noErrors.Count == 0, $"Validation result must be without Errors. Actual: {noErrors.Count} errors. ");
			Assert.IsNull(modelWithLocationNull.Location, "Location must be null");

			//Validate model with Location equals empty string.
			var modelWithLocationEmptyString = new SignUpRequestModel()
			{
				BirthMonth = 4,
				BirthYear = 1999,
				Country = 100,
				Location = "",
				Email = "test@emai.com",
				Password = "123456Password",
				FirstName = "BERNARD",
				LastName = "Vanderydt",
				IsSharedTalkMember = true,
				Gender = "F",
				Knows = 1,
				Learns = 2,
				LookToLearnWithGames = true,
				LookToLearnWithMore = true,
				LookToLearnWithTextChat = true,
				LookToLearnWithVoiceChat = true,
				WantsToHelpHellolingo = true,
			};

			var noErrorsForEmptyString = ValidatorHelper.ValidateModel(modelWithLocationEmptyString).ToList();
			Assert.IsTrue(noErrorsForEmptyString.Count == 0,
				$"Validation result must be without errors and equal null. Actual: {noErrorsForEmptyString.Count} errors. ");
			Assert.IsNull(modelWithLocationEmptyString.Location, "Location must be null");
		}
		
	}
}