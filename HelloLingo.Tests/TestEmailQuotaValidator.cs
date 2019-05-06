using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SendGrid;
using System.Net.Mail;
using Considerate.Hellolingo.Emails;

namespace Considerate.Hellolingo.Tests
{
	[TestClass]
	public class TestEmailQuotaValidator
	{
		[TestInitialize]
		public void CleanCounters()
		{
			EmailCountersStorage.CleanEmailQuotaCounters();
		}

		private void VerifyCleanedCounters()
		{
			Assert.AreEqual(0, EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(0, EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(0, EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(0, EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0, EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(0, EmailCountersStorage.Total);
		}

		[TestMethod]
		public void EmailValidationByEmailSuccessTest()
		{
			VerifyCleanedCounters();
			var emailType = EmailTypes.EmailValidation;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress("hello@world.com") } };
			var userId = 2;

			int emailValidationByEmailQuota  = 1;
			int emailValidationByUserIdQuota = 1;
			int emailValidationsTotalQuota   = 1;
			int totalByEmailQuota            = 1;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 1;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(true, result.IsValid);
			Assert.AreEqual(null,result.ExceedData);

			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}


		[TestMethod]
		public void EmailValidationByEmailFailedTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.EmailValidation;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(false,result.IsValid);
			Assert.AreEqual(0,result.ExceedData.Quota);
			Assert.AreEqual(1,result.ExceedData.Value);
			Assert.AreEqual(EmailQuotaType.EmailVerificationByEmail, result.ExceedData.QuotaType);
			
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail[email]);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);



		}

		[TestMethod]
		public void EmailValidationByUserIdFailedTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.EmailValidation;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 1;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(false,result.IsValid);
			Assert.AreEqual(0,result.ExceedData.Quota);
			Assert.AreEqual(1,result.ExceedData.Value);
			Assert.AreEqual(EmailQuotaType.EmailVerificationByUserId, result.ExceedData.QuotaType);
			
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail[email]);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId[userId]);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);



		}

		[TestMethod]
		public void EmailValidationTotalFailedTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.EmailValidation;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 1;
			int emailValidationByUserIdQuota = 1;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(false,result.IsValid);
			Assert.AreEqual(0,result.ExceedData.Quota);
			Assert.AreEqual(1,result.ExceedData.Value);
			Assert.AreEqual(EmailQuotaType.EmailVerificationGlobally, result.ExceedData.QuotaType);
			
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail[email]);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId[userId]);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal[email]);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}

		[TestMethod]
		public void ContactUsFailedTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.ContactUsNotification;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(false,result.IsValid);
			Assert.AreEqual(0,result.ExceedData.Quota);
			Assert.AreEqual(1,result.ExceedData.Value);
			
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(0,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(1,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}

		[TestMethod]
		public void ContactUsSuccessTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.ContactUsNotification;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 1;
			int emailsTotalQuota             = 1;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(true,result.IsValid);
			Assert.AreEqual(null,result.ExceedData);
			
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(0,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(1,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}


		[TestMethod]
		public void SimpleMailingSuccessTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.CustomMail;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(true,result.IsValid);
			Assert.AreEqual(null,result.ExceedData);
			
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(0,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(0,EmailCountersStorage.TotalByEmail.Count);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(0,EmailCountersStorage.Total);
		}

		[TestMethod]
		public void PasswordRecoveryFailedTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.PasswordRecovery;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 0;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 0;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(false,result.IsValid);
			Assert.AreEqual(0,result.ExceedData.Quota);
			Assert.AreEqual(1,result.ExceedData.Value);
			Assert.AreEqual(EmailQuotaType.SameEmailAddress, result.ExceedData.QuotaType);
			
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail[email]);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}

		[TestMethod]
		public void PasswordRecoverySuccessTest()
		{
			VerifyCleanedCounters();
			string email ="hello@world.com";
			var emailType = EmailTypes.PasswordRecovery;
			var message  = new SendGridMessage() { To=new MailAddress[] {new MailAddress(email) } };
			var userId = 2;

			int emailValidationByEmailQuota  = 0;
			int emailValidationByUserIdQuota = 0;
			int emailValidationsTotalQuota   = 0;
			int totalByEmailQuota            = 1;
			int textChatAlertsQuota          = 0;
			int emailsTotalQuota             = 1;

			EmailQuotaValidator validator = new EmailQuotaValidator(emailValidationByEmailQuota,emailValidationByUserIdQuota,emailValidationsTotalQuota,totalByEmailQuota,textChatAlertsQuota,emailsTotalQuota);
			QuotaValidationResult result =  validator.ValidateQuota(emailType,message,userId);
			Assert.AreEqual(true,result.IsValid);
			Assert.AreEqual(null,result.ExceedData);
			
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByEmail.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsByUserId.Count);
			Assert.AreEqual(1,EmailCountersStorage.EmailVerificationsTotal.Count);
			Assert.AreEqual(1,EmailCountersStorage.TotalByEmail[email]);
			Assert.AreEqual(0,EmailCountersStorage.TextChatAlertsTotal);
			Assert.AreEqual(1,EmailCountersStorage.Total);
		}

	}
}
