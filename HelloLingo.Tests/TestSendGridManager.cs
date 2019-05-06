using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.TextChat;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using SendGrid;
using Considerate.HellolingoMock.DbContext;

namespace Considerate.Hellolingo.Tests
{
	[TestClass]
	public class TestSendGridManager
	{
		[TestMethod]
		public async Task TestPasswordRecoveryMailSend()
		{
			var sgLoggerMock = new Mock<ISendGridLogger>();
			var sgTransportMock = new Mock<ISendGridTransport>();
			var sgValidatorMock = new Mock<IEmailQuotaValidator>();
			sgValidatorMock.Setup(v=>v.ValidateQuota(It.IsAny<EmailTypes>(),It.IsAny<SendGridMessage>(), It.IsAny<int>())).Returns(QuotaValidationResult.Success).Verifiable();
			var sgClient = new EmailSender(sgLoggerMock.Object,sgTransportMock.Object,sgValidatorMock.Object);
			int userId = 3;
			string email = "bernard@hellolingo.com";
			string subject = "subject";
			string body = "body";
			await sgClient.SendPasswordRecoveryMail(userId,email,subject,body);
			
			sgLoggerMock.Verify(l=>l.LogEmailToDisk(It.Is<EmailTypes>(t=>t==EmailTypes.PasswordRecovery),
				                                    It.Is<string>(e=>e==email),
													It.Is<string>(s=>s==subject),
													It.Is<string>(b=>b==body),
													It.Is<int>(u=>u==userId)),Times.Once);

			sgTransportMock.Verify(l=>l.DeliverAsync(It.Is<SendGridMessage>(m=>m.To.First().Address==email&&
			                                                                   m.Subject==subject&&
													                           m.Html==body)),Times.Once);
		}

		[TestMethod]
		public async Task TestSignUpMailSend()
		{
			var sgLoggerMock = new Mock<ISendGridLogger>();
			var sgTransportMock = new Mock<ISendGridTransport>();
			var sgValidatorMock = new Mock<IEmailQuotaValidator>();
			sgValidatorMock.Setup(v=>v.ValidateQuota(It.IsAny<EmailTypes>(),It.IsAny<SendGridMessage>(), It.IsAny<int>())).Returns(QuotaValidationResult.Success).Verifiable();
			var sgClient = new EmailSender(sgLoggerMock.Object,sgTransportMock.Object, sgValidatorMock.Object);
			int userId = 3;
			string email = "bernard@hellolingo.com";
			await sgClient.SendSignUpEmailConfirmation(userId,email,"firstname","lastname","url",false);
			
			sgLoggerMock.Verify(l=>l.LogEmailToDisk(It.Is<EmailTypes>(t=>t==EmailTypes.EmailValidation),
				                                    It.Is<string>(e=>e==email),
													It.IsAny<string>(),
													It.IsAny<string>(),
													It.Is<int>(u=>u==userId)),Times.Once);

			sgTransportMock.Verify(l=>l.DeliverAsync(It.Is<SendGridMessage>(m=>m.To.First().Address==email)),Times.Once);

		}

		[TestMethod]
		public async Task TestContactUsMailSend()
		{
			var sgLoggerMock = new Mock<ISendGridLogger>();
			var sgTransportMock = new Mock<ISendGridTransport>();
			var sgValidatorMock = new Mock<IEmailQuotaValidator>();
			sgValidatorMock.Setup(v=>v.ValidateQuota(It.IsAny<EmailTypes>(),It.IsAny<SendGridMessage>(), It.IsAny<int>())).Returns(QuotaValidationResult.Success).Verifiable();
			var sgClient = new EmailSender(sgLoggerMock.Object,sgTransportMock.Object, sgValidatorMock.Object);
			int userId = 3;
			string emailAdmin = "admin@hellolingo.com";
			string emailUser = "user@test.com";
			string subject = "subject";
			string body = "body";
			await sgClient.SendContactUsMail(userId,emailAdmin,emailUser,subject,body);
			
			sgLoggerMock.Verify(l=>l.LogEmailToDisk(It.Is<EmailTypes>(t=>t==EmailTypes.ContactUsNotification),
				                                    It.Is<string>(e=>e==emailAdmin),
													It.Is<string>(s=>s==subject),
													It.Is<string>(b=>b==body),
													It.Is<int>(u=>u==userId)),Times.Once);

			sgTransportMock.Verify(l=>l.DeliverAsync(It.Is<SendGridMessage>(m=>m.To.First().Address     == emailAdmin&&
			                                                                   m.ReplyTo.First().Address == emailUser&&                                                             
			                                                                   m.Subject == subject&&
													                           (m.Html==body||m.Text==body))),Times.Once);
		}

		[TestMethod]
		public async Task TestSendMessageNotifications()
		{
			var sgLoggerMock = new Mock<ISendGridLogger>();
			var sgTransportMock = new Mock<ISendGridTransport>();
			var sgValidatorMock = new Mock<IEmailQuotaValidator>();
			sgValidatorMock.Setup(v => v.ValidateQuota(It.IsAny<EmailTypes>(), It.IsAny<SendGridMessage>(), It.IsAny<int>())).Returns(QuotaValidationResult.Success).Verifiable();
			var sgClient = new EmailSender(sgLoggerMock.Object,sgTransportMock.Object, sgValidatorMock.Object);
			var emailNotification = new EmailNotificationModel
			{
				FirstNameFrom ="Andriy",
				FirstNameTo ="Andriy",
				EmailTo = "test@email.com",
				LastNameFrom ="SomeLastName",
				LastNameTo = "SomeLastName",
				UserIdTo = 1,
				UserIdFrom = 2,
				TargetCulture = "en"
			};
			await sgClient.SendMessageNotifications(new EmailNotificationModel[] { emailNotification});
			sgTransportMock.Verify(t => t.DeliverAsync(It.IsAny<SendGridMessage>()), Times.Once);
			
		}

		[TestMethod]
		public async Task TestSendMessageNotificationsFrench()
		{
			var sgLoggerMock = new Mock<ISendGridLogger>();
			var sgTransportMock = new Mock<ISendGridTransport>();
			var sgValidatorMock = new Mock<IEmailQuotaValidator>();
			sgValidatorMock.Setup(v => v.ValidateQuota(It.IsAny<EmailTypes>(), It.IsAny<SendGridMessage>(), It.IsAny<int>())).Returns(QuotaValidationResult.Success).Verifiable();
			var sgClient = new EmailSender(sgLoggerMock.Object,sgTransportMock.Object, sgValidatorMock.Object);
			var emailNotification = new EmailNotificationModel
			{
				FirstNameFrom ="Andriy",
				FirstNameTo ="Andriy",
				EmailTo = "test@email.com",
				LastNameFrom = "SomeLastName",
				LastNameTo = "SomeLastName",
				UserIdTo = 1,
				UserIdFrom = 2,
				TargetCulture = "fr"
			};
			await sgClient.SendMessageNotifications(new EmailNotificationModel[] { emailNotification});
			sgTransportMock.Verify(t => t.DeliverAsync(It.IsAny<SendGridMessage>()), Times.Once);
			
		}
	}
}
