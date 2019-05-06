using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;


namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestMailboxSprocs {

		[TestMethod]
		// DISCLAIMER: THIS IS NOT A PROPER UNIT TEST
		// It accesses the database
		// It relies on pre-populated data in that database
		// But it's a good demo
		public void MailboxSprocsTest()
		{
			var userId1 = 1;
			var userId2 = 2;
			var db = new HellolingoEntities();

			// Insert a new mail (that User1 sends to user2)
			db.Mails_Insert(
				regulationStatus: MailRegulationStatuses.AutoPass, // This means that the regulation has cleared this message: No manual step / moderation required
				fromId          : userId1,                         // Who send the mail
				replyToMail      : null,                           // Defines to which mailId this mail a directly reply to, if any
				toId            : userId2,                         // Who receives the mail
				subject         : null,                            // Subject can be ignored. It will be filled with the beginning of the message.
				message         : "Hello, This is a mail demo. Bye bye!"
			);

			// Check that user1 has the sent message in his mailbox
			var mailFor1 = db.Mails_GetList(userId1).FirstOrDefault(); // The right message should be the first one, because the list is ordered with latest first
			Assert.AreEqual(userId1, mailFor1.FromId);
			Assert.AreEqual("true", mailFor1.Lead);	// Lead = true: It means that this message is the latest one of all the messages sent between user1 and user2
			Assert.AreEqual(null, mailFor1.ReplyToMail);
			Assert.AreEqual(MailStatuses.Sent, mailFor1.Status);	
			Assert.AreEqual("Hello, This is a mail demo. Bye bye!", mailFor1.Subject); // Subject should be the first 100 characters of message
			Assert.AreEqual(userId2, mailFor1.ToId);

			// Check that user2 has the received message in his mailbox
			var mailFor2 = db.Mails_GetList(userId2).FirstOrDefault(); // The right message should be the first one, because the list is ordered with latest first
			Assert.AreEqual(userId1, mailFor2.FromId);
			Assert.AreEqual("true", mailFor2.Lead); // Lead = true: It means that this message is the latest one of all the messages sent between user1 and user2
			Assert.AreEqual(null, mailFor2.ReplyToMail);
			Assert.AreEqual(MailStatuses.New, mailFor2.Status);
			Assert.AreEqual("Hello, This is a mail demo. Bye bye!", mailFor2.Subject); // Subject should be the first 100 characters of message
			Assert.AreEqual(userId2, mailFor2.ToId);

			// Archive users emails
			var mails = db.Mails_GetList(userId1).ToList();
			foreach (var mail in mails) db.Mails_Archive(userId1, mail.Id);
			mails = db.Mails_GetList(userId2).ToList();
			foreach (var mail in mails) db.Mails_Archive(userId2, mail.Id);

			// Get the list for user1. It should be empty b/c all mails have been archived
			mails = db.Mails_GetList(userId1).ToList();
			Assert.AreEqual(0, mails.Count(r => r.Status != MailStatuses.Archived));

		}

	}

}
