using System;
using SendGrid;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using Considerate.Helpers;

namespace Considerate.Hellolingo.Emails
{
	public static class EmailCountersStorage
	{
		public static Dictionary<string, int> EmailVerificationsByEmail  = new Dictionary<string, int>();
		public static Dictionary<int, int>    EmailVerificationsByUserId = new Dictionary<int, int>();
		public static Dictionary<string, int> EmailVerificationsTotal    = new Dictionary<string, int>();
		public static Dictionary<string, int> TotalByEmail               = new Dictionary<string, int>();
		public static int                     TextChatAlertsTotal        = 0;
		public static int                     Total                      = 0;
		
		public static void CleanEmailQuotaCounters()
		{
			EmailVerificationsByEmail  = new Dictionary<string, int>();
			EmailVerificationsByUserId = new Dictionary<int, int>();
			EmailVerificationsTotal    = new Dictionary<string, int>();
			TotalByEmail               = new Dictionary<string, int>();
			TextChatAlertsTotal        = 0;
			Total                      = 0;
		}
	}

	public class EmailQuotaValidator : IEmailQuotaValidator
	{
		private readonly int EmailValidationByEmailQuota ;
		private readonly int EmailValidationByUserIdQuota;
		private readonly int EmailValidationsTotalQuota  ;
		private readonly int TotalByEmailQuota           ;
		private readonly int TextChatAlertsTotalQuota    ;
		private readonly int EmailsTotalQuota            ;

		public EmailQuotaValidator()
		{
			EmailValidationByEmailQuota  = int.Parse(ConfigurationManager.AppSettings["EmailValidationByEmail"]);
			EmailValidationByUserIdQuota = int.Parse(ConfigurationManager.AppSettings["EmailValidationByUserId"]);
			EmailValidationsTotalQuota   = int.Parse(ConfigurationManager.AppSettings["EmailValidationsTotal"]);
			TotalByEmailQuota            = int.Parse(ConfigurationManager.AppSettings["TotalByEmail"]);
			TextChatAlertsTotalQuota     = int.Parse(ConfigurationManager.AppSettings["TextChatAlertsTotal"]);
			EmailsTotalQuota             = int.Parse(ConfigurationManager.AppSettings["EmailsTotal"]);
		}

		public EmailQuotaValidator(int emailValidationByEmailQuota, int emailValidationByUserIdQuota, int emailValidationsTotalQuota, int totalByEmailQuota, int textChatAlertsQuota, int emailsTotalQuota)
		{
			EmailValidationByEmailQuota  = emailValidationByEmailQuota;
			EmailValidationByUserIdQuota = emailValidationByUserIdQuota;
			EmailValidationsTotalQuota   = emailValidationsTotalQuota;
			TotalByEmailQuota            = totalByEmailQuota;
			TextChatAlertsTotalQuota     = textChatAlertsQuota;
			EmailsTotalQuota             = emailsTotalQuota;
		}

		public QuotaValidationResult ValidateQuota(EmailTypes emailType, SendGridMessage message, int userId)
		{
			switch(emailType)
			{
				case EmailTypes.EmailValidation:            return ValidateEmailVerificationMessage(message, userId);
				case EmailTypes.PasswordRecovery:           return ValidatePasswordRecoveryMessage(message,userId);
				case EmailTypes.MessageNotification:        return ValidateMessageNotification(message,userId);
				case EmailTypes.CustomMail:                 return QuotaValidationResult.Success;
				case EmailTypes.ContactUsNotification :

				default: throw new LogReadyException(LogTag.UnexpectedEmailTypeOnQuotaValidator,new {EmailType = emailType });
			}
		}

		private QuotaValidationResult ValidateMessageNotification(SendGridMessage message, int userId)
		{
			string emailAddress = message.To.First().Address;

			PrepareCountersIfNeeded(emailAddress,userId);

			EmailCountersStorage.TotalByEmail[emailAddress] += 1;
			EmailCountersStorage.Total += 1;

			QuotaValidationResult totalByEmailResult =  CheckTotalByEmail(emailAddress);
			if(totalByEmailResult.IsValid == false) return totalByEmailResult;

			QuotaValidationResult totalResult =  CheckTotal();
			if(totalResult.IsValid == false) return totalResult;
			
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult ValidatePasswordRecoveryMessage(SendGridMessage message, int userId)
		{
	        string emailAddress = message.To.First().Address;

			PrepareCountersIfNeeded(emailAddress, userId);

			EmailCountersStorage.TotalByEmail[emailAddress] += 1;
			EmailCountersStorage.Total += 1;

			QuotaValidationResult totalByEmailResult =  CheckTotalByEmail(emailAddress);
			if(totalByEmailResult.IsValid == false) return totalByEmailResult;

			QuotaValidationResult totalResult =  CheckTotal();
			if(totalResult.IsValid == false) return totalResult;
			
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult ValidateEmailVerificationMessage(SendGridMessage message, int userId)
		{
			string emailAddress = message.To.First().Address;

			PrepareCountersIfNeeded(emailAddress, userId);

			EmailCountersStorage.EmailVerificationsByEmail[emailAddress] += 1;
			EmailCountersStorage.EmailVerificationsByUserId[userId] += 1;
			EmailCountersStorage.EmailVerificationsTotal[emailAddress] += 1;
			EmailCountersStorage.TotalByEmail[emailAddress] += 1;
			EmailCountersStorage.Total += 1;

			QuotaValidationResult emailValidationByEmailResult = CheckEmailValidationWithEmail(emailAddress);
			if(emailValidationByEmailResult.IsValid == false) return emailValidationByEmailResult;

			QuotaValidationResult emailValidationByUserIdResult = CheckEmailValidationWithUserId(userId);
			if(emailValidationByUserIdResult.IsValid == false) return emailValidationByUserIdResult;

			QuotaValidationResult emailValidationTotalResult = CheckEmailValidationsTotal(emailAddress);
			if(emailValidationTotalResult.IsValid == false) return emailValidationTotalResult;

			QuotaValidationResult totalByEmailResult =  CheckTotalByEmail(emailAddress);
			if(totalByEmailResult.IsValid == false) return totalByEmailResult;

			QuotaValidationResult totalResult =  CheckTotal();
			if(totalResult.IsValid == false) return totalResult;

			return QuotaValidationResult.Success;
		}

		private static void PrepareCountersIfNeeded(string emailAddress, int userId)
		{
			//Andriy: It's not always necessary to initialize all counters. It's done for simplifying code.
			if(!EmailCountersStorage.EmailVerificationsByEmail.Keys.Contains(emailAddress))
				EmailCountersStorage.EmailVerificationsByEmail.Add(emailAddress, 0);
			if(!EmailCountersStorage.EmailVerificationsByUserId.Keys.Contains(userId))
				EmailCountersStorage.EmailVerificationsByUserId.Add(userId, 0);
			if(!EmailCountersStorage.EmailVerificationsTotal.Keys.Contains(emailAddress))
				EmailCountersStorage.EmailVerificationsTotal.Add(emailAddress, 0);
			if(!EmailCountersStorage.TotalByEmail.Keys.Contains(emailAddress))
				EmailCountersStorage.TotalByEmail.Add(emailAddress, 0);
		}

		private QuotaValidationResult CheckTotal()
		{
			if(EmailCountersStorage.Total > EmailsTotalQuota)
			{
				var quotaExceedData = QuotaExceedData.Create(EmailQuotaType.TotalSentEmails, EmailsTotalQuota, EmailCountersStorage.Total);
				return QuotaValidationResult.GetValidationExccedResult(quotaExceedData);
			}
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult CheckTotalByEmail(string emailAddress)
		{
			int totalByEmailValue = EmailCountersStorage.TotalByEmail[emailAddress];
			if(totalByEmailValue > TotalByEmailQuota)
			{
				var quotaExceedData = QuotaExceedData.Create(EmailQuotaType.SameEmailAddress, TotalByEmailQuota, totalByEmailValue);
				return QuotaValidationResult.GetValidationExccedResult(quotaExceedData);
			}
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult CheckEmailValidationWithEmail(string emailAddress)
		{
			int emailValidationValue = EmailCountersStorage.EmailVerificationsByEmail[emailAddress];
			if(emailValidationValue > EmailValidationByEmailQuota)
			{
				var quotaExceedData = QuotaExceedData.Create(EmailQuotaType.EmailVerificationByEmail, EmailValidationByEmailQuota, emailValidationValue);
				return QuotaValidationResult.GetValidationExccedResult(quotaExceedData);
			}
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult CheckEmailValidationWithUserId(int userId)
		{
			int userValidationValue = EmailCountersStorage.EmailVerificationsByUserId[userId];
			if(userValidationValue > EmailValidationByUserIdQuota)
			{
				var quotaExceedData = QuotaExceedData.Create(EmailQuotaType.EmailVerificationByUserId, EmailValidationByUserIdQuota, userValidationValue);
				return QuotaValidationResult.GetValidationExccedResult(quotaExceedData);
			}
			return QuotaValidationResult.Success;
		}

		private QuotaValidationResult CheckEmailValidationsTotal(string emailAddress)
		{
			int totalValidationsValue = EmailCountersStorage.EmailVerificationsTotal[emailAddress];
			if(totalValidationsValue > EmailValidationsTotalQuota)
			{
				var quotaExceedData = QuotaExceedData.Create(EmailQuotaType.EmailVerificationGlobally, EmailValidationsTotalQuota, totalValidationsValue);
				return QuotaValidationResult.GetValidationExccedResult(quotaExceedData);
			}
			return QuotaValidationResult.Success;
		}
	}

}

