using System.Collections.Generic;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Regulators;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;

namespace Considerate.Hellolingo.Emails
{
	public interface IEmailSender
	{
		Task SendCustomMail(string emailAddress, string emailSubject, string htmlBody, string textBody, UserId userid);
		Task SendSignUpEmailConfirmation(int userId, string emailAddress, string firstName, string lastName, string emailConfirmationUrl, bool isUpdate = false);
		Task SendPasswordRecoveryMail(int newUserId, string emailAddress, string emailSubject, string emailBody);
		Task SendContactUsMail(int userId, string helloLingoAdminEmail, string replyTo, string emailSubject, string emailBody);
		Task SendMessageNotifications(EmailNotificationModel[] toArray);
	}
}
