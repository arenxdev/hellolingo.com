using System.Runtime.CompilerServices;
using System.Security.Principal;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Security.Claims;
using System.Threading.Tasks;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Features.MailBox;
using Considerate.Hellolingo.WebApp.Controllers.WebApi;
using Considerate.Hellolingo.WebApp.Models;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestApiMailBoxController
	{
		[TestMethod]
		public async Task TestPostMessageSuccess()
		{
			//MemberIdTo is valid
			//ReplyIdTo is valid

			HellolingoMailMessage model = new HellolingoMailMessage()
			{
				MemberIdTo = 1,
				ReplyTo    = null,
				Text       = "Hello there!"
			};

			int currentUserId = 5;

			var entitytiesMock = new Mock<IHellolingoEntities>();

			entitytiesMock.Setup(e => e.Mails_Insert(It.IsAny<byte?>(), It.IsAny<int?>(), It.IsAny<long?>(), It.IsAny<int?>(), It.IsAny<string>(), It.IsAny<string>()));

			var mailValidatorMock = new Mock<IMailBoxValidator>();
			
			var controller = new MailBoxController(entitytiesMock.Object,mailValidatorMock.Object);
            controller.User = new GenericPrincipal(new ClaimsIdentity(new [] {
	            new Claim(CustomClaimTypes.UserId, currentUserId.ToString())
			}), null);

			mailValidatorMock.Setup(v => v.IsReplyToValid(It.IsAny<int?>(), It.IsAny<int>(), It.IsAny<int>())).Returns(Result<bool>.True);
			mailValidatorMock.Setup(v => v.IsRecipientValid(It.IsAny<int>())).Returns(Result<bool>.True);

			await controller.PostMessage(model);
			entitytiesMock.Verify(v => v.Mails_Insert(It.Is((byte? reg) => reg == MailRegulationStatuses.PassAndReview),
													It.Is((int? p) => p == currentUserId),
													It.Is((long? p) => p == model.ReplyTo),
													It.Is((int? p) => p == model.MemberIdTo),
													It.Is((string p) => p == null),
													It.Is((string p) => p == model.Text)), Times.Once);
		}
		[TestMethod]
		public async Task TestPostMessageFailed1()
		{
			//MemberIdTo is invalid
			//ReplyIdTo is Invalid

			HellolingoMailMessage model = new HellolingoMailMessage()
			{
				MemberIdTo = 1,
				ReplyTo    = null,
				Text       = "Hello there!"
			};

			int currentUserId = 5;

			var entitytiesMock = new Mock<IHellolingoEntities>();

			entitytiesMock.Setup(e => e.Mails_Insert(It.IsAny<byte?>(), It.IsAny<int?>(), It.IsAny<long?>(), It.IsAny<int?>(), It.IsAny<string>(), It.IsAny<string>()));

			var mailValidatorMock = new Mock<IMailBoxValidator>();
			
			var controller = new MailBoxController(entitytiesMock.Object,mailValidatorMock.Object);
			controller.User = new GenericPrincipal(new ClaimsIdentity(new[] {
				new Claim(CustomClaimTypes.UserId, currentUserId.ToString())
			}), null);

			mailValidatorMock.Setup(v => v.IsReplyToValid(It.IsAny<int?>(), It.IsAny<int>(), It.IsAny<int>())).Returns(Result<bool>.True);
			mailValidatorMock.Setup(v => v.IsRecipientValid(It.IsAny<int>())).Returns(Result<bool>.True);

			await controller.PostMessage(model);

			await controller.PostMessage(model);
			entitytiesMock.Verify(v => v.Mails_Insert(It.IsAny<byte?>(),
													It.IsAny<int?  >(),
													It.IsAny<long? >(),
													It.IsAny<int?  >(),
													It.IsAny<string>(),
													It.IsAny<string>()),Times.Exactly(2));

		}

		[TestMethod]
		public async Task TestPostMessageFailed2()
		{
			//MemberIdTo is valid
			//ReplayIdTo is Invalid

			HellolingoMailMessage model = new HellolingoMailMessage()
			{
				MemberIdTo = 1,
				ReplyTo    = null,
				Text       = "Hello there!"
			};

			int currentUserId = 5;

			var entitytiesMock = new Mock<IHellolingoEntities>();

			entitytiesMock.Setup(e => e.Mails_Insert(It.IsAny<byte?>(), It.IsAny<int?>(), It.IsAny<long?>(), It.IsAny<int?>(), It.IsAny<string>(), It.IsAny<string>()));
			var mailValidatorMock = new Mock<IMailBoxValidator>();
			
			var controller = new MailBoxController(entitytiesMock.Object,mailValidatorMock.Object);
			controller.User = new GenericPrincipal(new ClaimsIdentity(new[] {
				new Claim(CustomClaimTypes.UserId, currentUserId.ToString())
			}), null);

			mailValidatorMock.Setup(v => v.IsReplyToValid(It.IsAny<int?>(), It.IsAny<int>(), It.IsAny<int>())).Returns(Result<bool>.False);
			mailValidatorMock.Setup(v => v.IsRecipientValid(It.IsAny<int>())).Returns(Result<bool>.True);

			await controller.PostMessage(model);

			await controller.PostMessage(model);
			entitytiesMock.Verify(v => v.Mails_Insert(It.IsAny<byte?>(),
													It.IsAny<int?  >(),
													It.IsAny<long? >(),
													It.IsAny<int?  >(),
													It.IsAny<string>(),
													It.IsAny<string>()),Times.Never);

		}

		[TestMethod]
		public async Task TestPostMessageFailed3()
		{
			//MemberIdTo is invalid
			//ReplayIdTo is valid

			HellolingoMailMessage model = new HellolingoMailMessage()
			{
				MemberIdTo = 1,
				ReplyTo    = null,
				Text       = "Hello there!"
			};

			int currentUserId = 5;

		    var entitytiesMock = new Mock<IHellolingoEntities>();

			entitytiesMock.Setup(e => e.Mails_Insert(It.IsAny<byte?>(), It.IsAny<int?>(), It.IsAny<long?>(), It.IsAny<int?>(), It.IsAny<string>(), It.IsAny<string>()));

			var mailValidatorMock = new Mock<IMailBoxValidator>();
			
			var controller = new MailBoxController(entitytiesMock.Object,mailValidatorMock.Object);
            controller.User = new GenericPrincipal(new ClaimsIdentity(new Claim [ ] { new Claim(CustomClaimTypes.UserId, currentUserId.ToString()) }), null);

			mailValidatorMock.Setup(v => v.IsReplyToValid(It.IsAny<int?>(), It.IsAny<int>(), It.IsAny<int>())).Returns(Result<bool>.True);
			mailValidatorMock.Setup(v => v.IsRecipientValid(It.IsAny<int>())).Returns(Result<bool>.False);

			await controller.PostMessage(model);

			await controller.PostMessage(model);
			entitytiesMock.Verify(v => v.Mails_Insert(It.IsAny<byte?>(),
													It.IsAny<int?  >(),
													It.IsAny<long? >(),
													It.IsAny<int?  >(),
													It.IsAny<string>(),
													It.IsAny<string>()),Times.Never);

		}
	}
}
