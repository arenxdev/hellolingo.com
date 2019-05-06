using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.I18N;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Helpers;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Jobs
{
	public class MailNotificationsManager:IMailNotificationsManager 
	{

		const int CountOfEmailToNotifyPerInterval = 5;

		private readonly IEmailSender _sgManager;
		private readonly IHellolingoEntities _db;

		public MailNotificationsManager(IEmailSender sgManager,IHellolingoEntities db)
		{
			_sgManager = sgManager;
			_db        = db;
		}

		// Send Emails notifications for Hellolingo mails received by users
		public async Task SendNotificationsOfNewEmail()
		{
			// Collect emails to be notified
			var emailsToNotify = await _db.GetMailsToNotify(CountOfEmailToNotifyPerInterval);

			// Mark emails as notified
			await SetRecordStatusesTo(emailsToNotify, NotifyStatuses.Notified);

			// Prepare model for notification
			var modelToNotify = emailsToNotify.Select(m => new EmailNotificationModel {
				UserIdTo = m.ToId, UserIdFrom = m.FromId,
				EmailTo = m.UserTo.AspNetUser.Email, FirstNameTo = m.UserTo.FirstName, LastNameTo = m.UserTo.LastName,
				FirstNameFrom = m.UserFrom.FirstName, LastNameFrom = m.UserFrom.LastName,
				TargetCulture = m.UserTo.AspNetUser.UiCulture
			}).ToArray();

			// Notify by email
			if (modelToNotify.Any()) {
				await _sgManager.SendMessageNotifications(modelToNotify);
				Log.Info(LogTag.MessageNotificationsSent, new { userIds = modelToNotify.Select(m => m.UserIdTo).ToArray() });
			}
		}

		public async Task SendNotificationsFromQueue() 
		{
			var initialCulture = Thread.CurrentThread.CurrentCulture;

			var itemsToNotify = _db.Notifies.Where(r => r.Status == NotifyStatuses.ToNotify && r.NotifyOn < DateTime.Now).ToList();

			foreach (var item in itemsToNotify) {
				Log.Info(LogTag.ProcessingEmailNotificationQueue, new {item.UserId, item.Subject});

				if (string.IsNullOrEmpty(item.Subject)) throw new LogReadyException(LogTag.SubjectShouldNotBeNull);
				if (string.IsNullOrEmpty(item.HtmlBody)) throw new LogReadyException(LogTag.HtmlBodyShouldNotBeNull);
				if (string.IsNullOrEmpty(item.TextBody)) throw new LogReadyException(LogTag.TextBodyShouldNotBeNull);

				// Add "Can't See email" to the top of the message for static mailing
				//const string htmlFile = @"Images\Emails\Launch-All.html";
				//var openLink = $"<a href=\"https://www.hellolingo.com/{htmlFile}\">";
				//var closeLink = "</a>";
				//var cantSeeEmailMessage = EmailResources.CantSeeEmail.Replace("#OpenLink#", openLink).Replace("#CloseLink#", closeLink);
				//item.HtmlBody = cantSeeEmailMessage + item.HtmlBody;

				Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(item.User.AspNetUser.UiCulture ?? "en");

				var email = item.User.AspNetUser.Email;
				var textBody = item.TextBody.Replace("#FirstName#", item.User.FirstName)
					.Replace("#CopyrightContent#", $"{StringsFoundation.CopyrightLine}\n{StringsFoundation.PrivacyPolicy} : https://www.hellolingo.com/privacy-policy\n{StringsFoundation.TermsOfUse} : https://www.hellolingo.com/terms-of-use\n")
					.Replace("#BestRegards#", StringsFoundation.WarmestRegardsFromHellolingoCommunity);
				var htmlBody = item.HtmlBody.Replace("#FirstName#", item.User.FirstName)
					.Replace("#CopyrightContent#", $"{StringsFoundation.CopyrightLine}<BR><A HREF=\"https://www.hellolingo.com/privacy-policy\">{StringsFoundation.PrivacyPolicy}</A> | <A HREF=\"https://www.hellolingo.com/terms-of-use\">{StringsFoundation.TermsOfUse}</A>")
					.Replace("#BestRegards#", StringsFoundation.WarmestRegardsFromHellolingoCommunity);

				Log.Info(LogTag.SendCustomMail, new {email, item.Subject, textBody});
				await _sgManager.SendCustomMail(email, item.Subject, htmlBody, textBody, item.UserId);

				item.Status = NotifyStatuses.Notified;
				await _db.SaveChangesAsync();
			}

			Thread.CurrentThread.CurrentUICulture = initialCulture;
		}

		private async Task SetRecordStatusesTo(IEnumerable<INotifiable> itemsToNotify, byte notifyStatus) 
		{
			itemsToNotify.ToList().ForEach(m => m.NotifyStatus = notifyStatus);
			await _db.SaveChangesAsync();
		}

		public static void StartNotificationJob()
		{
			Log.Info(LogTag.MailNotificationsJobStarted);
			try
			{
				IMailNotificationsManager manager = Injection.Kernel.Get<IMailNotificationsManager>();
				manager.SendNotificationsOfNewEmail().Wait();
				manager.SendNotificationsFromQueue().Wait();

			} catch (Exception ex)
			{
				Log.Error(LogTag.MailNotificationsJobFailed, ex);
			}

		}
	}
}