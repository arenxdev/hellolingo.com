using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Validation;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.WebApp.Jobs;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestMessageNotificationManager
	{
		private List<Mail> mailDataForSuccessTest = new List<Mail> {
			new Mail
			{
				ToId = 1,
				FromId = 2,
				Message = "message1",
				NotifyStatus = 5,
				UserTo = new User
				{
					Id = 1,
					FirstName = "N",
					LastName = "T",
					AspNetUser = new AspNetUser {Email = "test1@com.com"}
				},
				UserFrom = new User
				{
					Id = 2,
					FirstName = "S",
					LastName = "L",
					AspNetUser = new AspNetUser {Email = "test4@com.com"}
				}
			},
			new Mail
			{
				ToId = 3,
				FromId = 4,
				Message = "message2",
				NotifyStatus = 5,
				UserTo = new User
				{
					Id = 3,
					FirstName = "r",
					LastName = "s",
					AspNetUser = new AspNetUser {Email = "test2@com.com"}
				},
				UserFrom = new User
				{
					Id = 4,
					FirstName = "q",
					LastName = "f",
					AspNetUser = new AspNetUser {Email = "test3@com.com"}
				}
			}
		};

		//[TestMethod]
		//public async Task NotificationsSentTest()
		//{
		//	var dbMock = new Mock<IHellolingoEntities>();
		//	dbMock.Setup(d => d.GetMailsToNotify()).ReturnsAsync(mailDataForSuccessTest.AsQueryable());
		//	var sgManagerMock = new Mock<ISendGridManager>();
		//	var mnManager = new MailNotificationsManager(sgManagerMock.Object,dbMock.Object);
		//	await mnManager.SendNotificationOfNewEmail();
		//	sgManagerMock.Verify(s=>s.SendMessageNotifications(It.Is<EmailNotificationModel[]>((n)=>VerifySentNotifications(n))),Times.Once);
		//	dbMock.Verify(d=>d.SaveChangesAsync(),Times.Once);
		//}

		private bool VerifySentNotifications(EmailNotificationModel[] emailNotificationModels)
		{
			return emailNotificationModels.Length == 2 &&
				   emailNotificationModels[0].EmailTo == mailDataForSuccessTest[0].UserTo.AspNetUser.Email &&
			       emailNotificationModels[1].EmailTo == mailDataForSuccessTest[1].UserTo.AspNetUser.Email;
		}

		//[TestMethod]
		//public async Task NotificationsNotSentTest()
		//{
		//	var dbMock = new Mock<IHellolingoEntities>();
		//	dbMock.Setup(d => d.GetMailsToNotify()).ReturnsAsync(new Mail[] {}.AsQueryable());
		//	dbMock.Setup(d=>d.SaveChangesAsync()).ReturnsAsync(0).Verifiable();
		//	var sgManagerMock = new Mock<ISendGridManager>();

		//	var mnManager = new MailNotificationsManager(sgManagerMock.Object,dbMock.Object);
		//	await mnManager.SendNotificationOfNewEmail();
		//	sgManagerMock.Verify(s=>s.SendMessageNotifications(It.IsAny<EmailNotificationModel[]>()),Times.Never);
		//}

		//[TestMethod]
		//public void CreateHtmlTextTest()
		//{
		//	var dbMock = new Mock<IHellolingoEntities>();
		//	dbMock.Setup(d => d.GetMailsToNotify()).ReturnsAsync(mailDataForSuccessTest.AsQueryable());
		//	var sgManagerMock = new Mock<ISendGridManager>();
		//	var mnManager = new MailNotificationsManager(sgManagerMock.Object,dbMock.Object);
		//	string fileName = "hello.html";
		//	string htmlBody = "<h1>Hello world</h1>";

		//	string htmlCreatedText = mnManager.CreateHtmlText(fileName, htmlBody);
		//	string expectedHtml = "If you cannot view this email properly, please click <a href=\"https://www.hellolingo.com/hello.html\"> here </a><h1>Hello world</h1>";
		//	Assert.AreEqual(expectedHtml, htmlCreatedText);
		//}
	}
}

