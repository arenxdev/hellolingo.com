using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Features.MailBox;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Considerate.Hellolingo.Tests
{
	[TestClass]
	public class TestsMailBoxValidator
	{
		[TestMethod]
		public void TestIsMemberIdValid()
		{
			var positiveStatuses = new byte[]
			{
				UserStatuses.Valid, UserStatuses.PendingEmailValidation, UserStatuses.PendingSignUpReview,
				UserStatuses.TemporarilyDisabled
			};
			foreach (var s in positiveStatuses)
			{
				TestUserPositiveStatus(s);
			}
		}

		private void TestUserPositiveStatus(byte status)
		{
			int memberId = 3;
			var users = new List<User>()
			{
				new User()
				{
					Id = memberId,
					Status = new UsersStatus() {Id =status,},
				}
			}.AsQueryable();

			var usersSetMock =new Mock<DbSet<User>>();
		    usersSetMock.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
            usersSetMock.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
            usersSetMock.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
            usersSetMock.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());
			usersSetMock.Setup(m => m.AsNoTracking()).Returns(usersSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Users).Returns(usersSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsRecipientValid(memberId);

			Assert.AreEqual(result.Value,true);
		}


		[TestMethod]
		private void TestSendingToDeletedUser() {
			int memberId = 3;
			var users = new List<User> {
				new User { Id = memberId, Status = new UsersStatus() {Id = UserStatuses.Deleted} }
			}.AsQueryable();

			var usersSetMock = new Mock<DbSet<User>>();
			usersSetMock.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
			usersSetMock.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
			usersSetMock.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
			usersSetMock.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());
			usersSetMock.Setup(m => m.AsNoTracking()).Returns(usersSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Users).Returns(usersSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsRecipientValid(memberId);

			Assert.AreEqual(true, result.Value);
			Assert.AreEqual(result.Reports[0].Tag, LogTag.MailToDeletedUser);
		}

		[TestMethod]
		public void TestsIsReplyToValidForNull()
		{
			int memberId = 3;
			int toId = 2;
			var mails = new List<Mail>()
			{
				new Mail()
				{
					Id = 2,
					FromId = memberId,
					ToId = toId,
					ReplyToMail = 10,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsReplyToValid(null, memberId, toId);

			Assert.AreEqual(result.Value, true);
		}

		[TestMethod]
		public void TestsIsReplyToValid()
		{
			int fromId = 4, toId = 3;
			var mails = new List<Mail>
			{
				new Mail {
					Id = 5,
					ReplyToMail = 10,
					FromId = toId,
					ToId = fromId,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsReplyToValid(5, fromId, toId);

			Assert.AreEqual(true, result.Value);
		}

		[TestMethod]
		public void TestsIsReplyToNotValid()
		{
			int memberId = 3;
			int toId = 4;
			var mails = new List<Mail>()
			{
				new Mail()
				{
					Id = 5,
					ReplyToMail = 10,
					FromId = 3,
					ToId = toId,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsReplyToValid(5, memberId, toId);

			Assert.AreEqual(result.Value, false);
			Assert.AreEqual(result.Reports[0].Tag, LogTag.ReplyToInvalidMailId);
		}

		[TestMethod]
		public void TestIsUserMessageSuccess1()
		{
			int memberId = 3;
			int messageId = 5;
			var mails = new List<Mail>()
			{
				new Mail()
				{
					Id = 5,
					ReplyToMail = 10,
					FromId = 3,
					ToId = 4,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsValidOwner(messageId, memberId);

			Assert.AreEqual(result.Value, true);
		}

			[TestMethod]
		public void TestIsUserMessageSuccess2()
		{
			int memberId = 3;
			int messageId = 5;
			var mails = new List<Mail>()
			{
				new Mail {
					Id = 5,
					ReplyToMail = 10,
					FromId = 10,
					ToId = 3,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsValidOwner(messageId, memberId);

			Assert.AreEqual(result.Value, true);
		}

			[TestMethod]
		public void TestIsUserMessageFailed()
		{
			int memberId = 3;
			int messageId = 5;
			var mails = new List<Mail>()
			{
				new Mail {
					Id = 5,
					ReplyToMail = 10,
					FromId = 10,
					ToId = 6,
				}
			}.AsQueryable();

			var mailsSetMock =new Mock<DbSet<Mail>>();
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Provider).Returns(mails.Provider);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.Expression).Returns(mails.Expression);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.ElementType).Returns(mails.ElementType);
			mailsSetMock.As<IQueryable<Mail>>().Setup(m => m.GetEnumerator()).Returns(mails.GetEnumerator());
			mailsSetMock.Setup(m => m.AsNoTracking()).Returns(mailsSetMock.Object);

			var entitiesMock = new Mock<IHellolingoEntities>();
			entitiesMock.Setup(e => e.Mails).Returns(mailsSetMock.Object);

			var validator = new MailBoxValidator(entitiesMock.Object);

			var result = validator.IsValidOwner(messageId, memberId);

			Assert.AreEqual(result.Value, false);
		}
	}
}