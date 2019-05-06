using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Considerate.Helpers;
using SendGrid;
using System.Globalization;
using System.Threading;
using System;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.I18N;
using Considerate.Hellolingo.UserCommons;
using Ninject;

namespace Considerate.Hellolingo.Emails
{
	public class EmailSender:IEmailSender
	{
		private const string DateTimeFormat = "MM-dd HH:mm:ss";
		private readonly ISendGridLogger _sgLogger;
		private readonly ISendGridTransport _sgTransport;
		private readonly IEmailQuotaValidator _quotaValidator;

		private IHellolingoEntities _db;
		private IHellolingoEntities Db => _db ?? ( _db = Injection.Kernel.Get<IHellolingoEntities>() );

		public EmailSender(ISendGridLogger sgLogger, ISendGridTransport sgTransport, IEmailQuotaValidator quotaValidator)
		{
			_sgLogger    = sgLogger;
			_sgTransport = sgTransport;
			_quotaValidator = quotaValidator;
		}

		public EmailSender(ISendGridLogger sgLogger, ISendGridTransport sgTransport, IEmailQuotaValidator quotaValidator, IHellolingoEntities db)
			: this(sgLogger, sgTransport, quotaValidator) { _db = db; }


		private async Task SendImportantMail(EmailTypes emailType, SendGridMessage message, int userId)
		{
			message.EnableBypassListManagement();
			await SendMail(emailType, message, userId);
		}

		private async Task SendMail(EmailTypes emailType, SendGridMessage message, int userId)
		{
			if(message.To.Length != 1)
				throw new LogReadyException(LogTag.UnsupportedUsageOfSendMail, new { userId, emailType });

		    var toEmail = message.To.First().Address;
			if(toEmail.EndsWith("@test.com") && toEmail.EndsWith("@fake.fake"))
				return;

			QuotaValidationResult result = _quotaValidator.ValidateQuota(emailType,message, userId);
			if(result.IsValid) {
				await _sgTransport.DeliverAsync(message);
				await _sgLogger.LogEmailToDisk(emailType, message.To.First().Address, message.Subject, message.Html ?? message.Text, userId);
			} else
				await SendQuotaExceedNotification(result, emailType, message, userId);
		}

		private async Task SendMail(EmailTypes emailType, SendGridMessage message)
		{
			await _sgTransport.DeliverAsync(message);
			await _sgLogger.LogEmailToDisk(emailType, message.To.First().Address, message.Subject, message.Html ?? message.Text);
		}

	   	private async Task SendQuotaExceedNotification(QuotaValidationResult quotaExceededResult, EmailTypes emailType, SendGridMessage message, int userId)
		{
			//Andriy: Send email notification only if quota exceeded first time.
			if(quotaExceededResult.ExceedData.Value == quotaExceededResult.ExceedData.Quota + 1)
			{
				var notificationMessage = new SendGridMessage
				{
					From = new MailAddress(HellolingoEmailAddresses.Default, "HL"),
					To = new[] { new MailAddress(HellolingoEmailAddresses.Admin) },
					Subject = $"{emailType} quota exceeded",
				};

				string template = @"
				<style>
				  body { font: 12px arial; }
				  table { border-collapse: collapse; font-size: 13px;}
				  td { border: solid lightgrey 1px; padding: 2px 5px; }
				  td:nth-child(2) { font-weight: bold }
				  .everyone { font-weight:bold; color: green }
				  .ephemeral { font-weight:bold; color: orange }
				  .sender { font-weight:bold; color: red }
				  .button { 
					padding: 8px; border-radius: 8px;
					color: black; text-decoration: none;
					line-height: 36px;
				  }
				  .button-green { background-color: green; border: solid 3px green }
				  .button-red { background-color: red; border: solid 3px red }
				</style>

				<h3>Emails quota exceeded</h3>
				<table>
				  <tr><td>When</td><td>#When#</td></tr>
				  <tr><td>Email type</td><td>#EmailType#</td></tr>
                  <tr><td>Quota type</td><td>#QuotaType#</td></tr>
                  <tr><td>Quota value</td><td>#QuotaValue#</td></tr>
                  <tr><td>Email address</td><td>#EmailAddress#</td></tr>
                  <tr><td>Email subject</td><td>#EmailSubject#</td></tr>
				</table>
                <h4>Email body</h4>
                <div>#EmailBody#</div>";
				string notificationHtml = template.Replace("#When#", DateTime.Now.ToString(DateTimeFormat))
					                                .Replace("#EmailType#", emailType.ToString())
													.Replace("#QuotaType#",quotaExceededResult.ExceedData.QuotaType.ToString())
													.Replace("#QuotaValue#", quotaExceededResult.ExceedData.Quota.ToString())
					                                .Replace("#EmailAddress#", message.To.First().Address)
					                                .Replace("#EmailSubject#",  message.Subject)
													.Replace("#EmailBody#",  message.Html??message.Text);


				notificationMessage.Html = notificationHtml;
				await _sgTransport.DeliverAsync(notificationMessage);
			}
			await _sgLogger.LogQuotaExceedEmailToDisk(emailType, message.To.FirstOrDefault()?.Address, message.Subject, message.Html ?? message.Text, userId);
		}

		public async Task SendCustomMail(string emailAddress, string emailSubject, string htmlBody, string textBody, UserId userId)
		{
			var message = new SendGridMessage
			{
				From = new MailAddress(HellolingoEmailAddresses.Default, HellolingoEmailAddresses.DefaultDisplayName),
				To = new[] { new MailAddress(emailAddress) },
				Subject = emailSubject,
				Html = htmlBody,
				Text = textBody
			};

			await SendMail(EmailTypes.CustomMail, message, userId);
		}

		public async Task SendSignUpEmailConfirmation(int userId, string emailAddress, string firstname, string lastname, string emailConfirmationUrl, bool isUpdate = false)
		{
			// Prepare templates
			var htmlTemplate =
				"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">" +
				"<HTML><HEAD><META http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></HEAD>" +
				"<BODY><TABLE width=600 style=\"text-align:left; font-family:Arial, Helvetica;font-size:13\">" +
				"<TR><TD height=\"1\" style=\"border:none; text-align:left\"><img src=\"http://www.hellolingo.com/Images/Logos/hellolingo-full-darken-166x40.png\" width=\"166\" height=\"40\" style=\"border-width:0px; vertical-align:middle;\" /></TD></TR>" +
				"<TR><TD style=\"font-size:18\"><BR>#WelcomeToHellolingo#<BR></TD></TR>" +
				"<TR><TD style=\"font-size:13\"><BR>#Greetings#<BR><BR>#ClickToConfirmAccount#<BR><BR>#BestRegards#<BR><BR></TD></TR>" +
				$"<TR><TD height=\"1\" style=\"border:solid 1px;text-align:center; font-family:Arial,Helvetica; font-size:10; color=Grey\">{StringsFoundation.CopyrightLine}<BR><A HREF=\"https://www.hellolingo.com/privacy-policy\">{StringsFoundation.PrivacyPolicy}</A> | <A HREF=\"https://www.hellolingo.com/terms-of-use\">{StringsFoundation.TermsOfUse}</A></TD></TR>" +
				"</TABLE></BODY></HTML>";
			var textTemplate =
				"===============================================================\n" +
				"=== #WelcomeToHellolingo#\n" +
				"===============================================================\n\n" +
				"#Greetings#\n\n" +
				"#ClickToConfirmAccount#\n" +
				"#EmailConfirmationUrl#" +
				"\n\n" +
				"#BestRegards#\n" +
				"\n\n\n" +
				"---------------------------------------------------------------\n" +
				$"{StringsFoundation.CopyrightLine}\n" +
				$"{StringsFoundation.PrivacyPolicy} : https://www.hellolingo.com/privacy-policy\n" +
				$"{StringsFoundation.TermsOfUse} : https://www.hellolingo.com/terms-of-use\n";

			// Compile message with filled templates
			var message = new SendGridMessage {
				From = new MailAddress(HellolingoEmailAddresses.Default, HellolingoEmailAddresses.DefaultDisplayName),
				To = new[] { new MailAddress(emailAddress, firstname + " " + lastname) },
				Subject = isUpdate ? StringsFoundation.AccountActivation : StringsFoundation.WelcomeToHellolingo,
				Text = textTemplate
					.Replace("#WelcomeToHellolingo#", isUpdate ? StringsFoundation.AccountActivation : StringsFoundation.WelcomeToHellolingo )
					.Replace("#Greetings#", StringsFoundation.HiFirstName.Replace("#FirstName#", firstname))
					.Replace("#ClickToConfirmAccount#", StringsFoundation.ConfirmYourAccountByClickingHere.Replace("<a href=\"#EmailConfirmationUrl#\">","").Replace("</a>",""))
					.Replace("#EmailConfirmationUrl#", emailConfirmationUrl)
					.Replace("#BestRegards#", StringsFoundation.WarmestRegardsFromHellolingoCommunity)
					.Replace("<B>", "").Replace("</B>", ""), // Remove html tags inserted in the fillers
				Html = htmlTemplate
					.Replace("#WelcomeToHellolingo#", isUpdate ? StringsFoundation.AccountActivation : StringsFoundation.WelcomeToHellolingo)
					.Replace("#Greetings#", StringsFoundation.HiFirstName.Replace("#FirstName#", HttpUtility.HtmlEncode(firstname)))
					.Replace("#ClickToConfirmAccount#", StringsFoundation.ConfirmYourAccountByClickingHere)
					.Replace("#EmailConfirmationUrl#", emailConfirmationUrl)
					.Replace("#BestRegards#", StringsFoundation.WarmestRegardsFromHellolingoCommunity)
			};

			await SendImportantMail(EmailTypes.EmailValidation, message, userId);
		}

		public async Task SendPasswordRecoveryMail(int newUserId, string emailAddress, string emailSubject, string emailBody)
		{
			var message = new SendGridMessage {
				From    = new MailAddress(HellolingoEmailAddresses.PasswordRecovery, HellolingoEmailAddresses.DefaultDisplayName),
				To      = new [] {new MailAddress(emailAddress)},
				Subject = emailSubject,
				Html    = emailBody,
			};
			
			await SendImportantMail(EmailTypes.PasswordRecovery, message, newUserId);
		}

		public async Task SendContactUsMail(int userId, string helloLingoAdminEmail, string replyTo, string emailSubject, string emailBody)
		{
			var message = new SendGridMessage {
				From = new MailAddress(HellolingoEmailAddresses.Default, HellolingoEmailAddresses.DefaultDisplayName),
				To = new[] { new MailAddress(helloLingoAdminEmail) },
				Text = emailBody,
				Subject = emailSubject
			};
			if(!string.IsNullOrEmpty(replyTo))
				message.ReplyTo = new[] { new MailAddress(replyTo) };
			await SendImportantMail(EmailTypes.ContactUsNotification, message, userId);
		}

		private string VisibilityToColor(MessageVisibility visibility)
		{
			switch(visibility) {
				case MessageVisibility.Nobody:
				case MessageVisibility.Sender: return "red";
				case MessageVisibility.Ephemeral: return "orange";
				case MessageVisibility.Everyone: return "lightgreen";
				default: return "white";
			}

		}

		public async Task SendMessageNotifications(EmailNotificationModel[] notifications)
		{
			var initialCulture = Thread.CurrentThread.CurrentCulture;

			foreach (var model in notifications)
			{
				Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(model.TargetCulture ?? "en");
				
				// Prepare templates
				var htmlTemplate =
					"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">" +
					"<HTML><HEAD><META http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"></HEAD>" +
					"<BODY><TABLE width=600 style=\"text-align:left; font-family:Arial, Helvetica;font-size:13\">" +
					"<TR><TD height=\"1\" style=\"border:none; text-align:left\"><a href=\"https://www.hellolingo.com/mailbox/user/#SenderId#/\"><img src=\"http://www.hellolingo.com/Images/Emails/banner-new-mail-600.png\" width=\"600\" height=\"98\" style=\"border-width:0px; vertical-align:middle;\" /></a></TD></TR>" +
					"<TR><TD style=\"font-size:13\"><BR>#Greetings#<BR><BR>#MessageNotification#<BR><BR><A href=\"https://www.hellolingo.com/mailbox/user/#SenderId#/\">#LinkToMailbox#</A><BR><BR>#BestRegards#<BR><BR></TD></TR>" +
					$"<TR><TD height=\"1\" style=\"border:solid 1px;text-align:center; font-family:Arial,Helvetica; font-size:10; color=Grey\">{StringsFoundation.CopyrightLine}<BR><A HREF=\"https://www.hellolingo.com/privacy-policy\">{StringsFoundation.PrivacyPolicy}</A> | <A HREF=\"https://www.hellolingo.com/terms-of-use\">{StringsFoundation.TermsOfUse}</A></TD></TR>" +
					"</TABLE></BODY></HTML>";
				var textTemplate =
					"===============================================================\n" +
					"=== HELLOLINGO\n" +
					"===============================================================\n\n" +
					"#Greetings#\n\n" +
					"#MessageNotification#\n\n" +
					"#LinkToMailbox#\n" +
					"https://www.hellolingo.com/mailbox/user/#SenderId#/" +
					"\n\n" +
					"#BestRegards#\n" +
					"\n\n\n" +
					"---------------------------------------------------------------\n" +
					$"{StringsFoundation.CopyrightLine}\n" +
					$"{StringsFoundation.PrivacyPolicy} : https://www.hellolingo.com/privacy-policy\n" +
					$"{StringsFoundation.TermsOfUse} : https://www.hellolingo.com/terms-of-use\n";

				// Compile message with filled templates
				var message = new SendGridMessage {
					From    = new MailAddress(HellolingoEmailAddresses.Default, HellolingoEmailAddresses.DefaultDisplayName),
					To      = new[] { new MailAddress(model.EmailTo, model.FirstNameTo + " " + model.LastNameTo) },
					Subject = EmailResources.NotificationSubject.Replace("#SenderFullName#", model.FirstNameFrom + " " + model.LastNameFrom),
					Text    = textTemplate
						.Replace("#Greetings#"          , StringsFoundation.HiFirstName.Replace("#FirstName#", model.FirstNameTo))
						.Replace("#MessageNotification#", EmailResources.NotificationMessage.Replace("#SenderFullName#", model.FirstNameFrom + " " + model.LastNameFrom))
						.Replace("#LinkToMailbox#"      , EmailResources.NotificationLinkToMailbox)
						.Replace("#BestRegards#"        , StringsFoundation.WarmestRegardsFromHellolingoCommunity)
						.Replace("#SenderId#"           , model.UserIdFrom.ToString())
						.Replace("<B>"                  , "") // Remove html tags inserted in the fillers
						.Replace("</B>"                 , ""),
					Html = htmlTemplate
						.Replace("#Greetings#"          , StringsFoundation.HiFirstName.Replace("#FirstName#", HttpUtility.HtmlEncode(model.FirstNameTo)))
						.Replace("#MessageNotification#", EmailResources.NotificationMessage.Replace("#SenderFullName#", HttpUtility.HtmlEncode(model.FirstNameFrom + " " + model.LastNameFrom)))
						.Replace("#LinkToMailbox#"      , EmailResources.NotificationLinkToMailbox)
						.Replace("#BestRegards#"        , StringsFoundation.WarmestRegardsFromHellolingoCommunity)
						.Replace("#SenderId#"           , model.UserIdFrom.ToString())
				};

				// Send the message
				await SendMail(EmailTypes.MessageNotification, message, model.UserIdTo);
			}
			Thread.CurrentThread.CurrentUICulture = initialCulture;
		}

	}
}
