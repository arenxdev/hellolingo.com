using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;

namespace Considerate.Hellolingo.Features.MailBox
{
	public class MailBoxValidator : IMailBoxValidator
	{
		private IHellolingoEntities Db { get; }

		public MailBoxValidator(IHellolingoEntities db) {
			Db = db;
		}

		public Result<bool> IsRecipientValid(int recipientId)
		{
			var user = Db.Users.AsNoTracking().FirstOrDefault(u => u.Id == recipientId);
			
			if (user == null)
				return new Result<bool>(false, new LogReport(LogTag.MailToInexistentUser, new { UserId = recipientId }, LogLevel.Error));
			if (user.StatusId == UserStatuses.Deleted)
				return new Result<bool>(true, new LogReport(LogTag.MailToDeletedUser, new { UserId = recipientId }, LogLevel.Info));

			return Result<bool>.True; 
		}

		public Result<bool> IsReplyToValid(int? replyTo, int fromId, int toId)
		{
			if (replyTo.HasValue == false) return Result<bool>.True;

			// Currently check only ToId. Please advice should we check here only ToId or we should check both ToId/FromId of replied message. 
			var toIdData = from m in Db.Mails.AsNoTracking()
							// Andriy : I think it should be: where m.Id == replyTo.Value && ( m.ToId == fromId || m.FromId == toId)
							// Bernard: That seems correct as is to me. E.g.: If Alice sent and mail to Bob, then when Bob replies,
							//		    the ReplyTo mail must be from Bob (m.ToId == fromId) to Alice (m.FromId == toId)
						   where m.Id == replyTo.Value && m.ToId == fromId && m.FromId == toId
				           select m.ToId;

			if(toIdData.Any())
				return Result<bool>.True ;

			return new Result<bool>(false, new LogReport(LogTag.ReplyToInvalidMailId, new { ReplyTo = replyTo, SenderId = toId , RecipientId = toId }, LogLevel.Error));
		}

		public Result<bool> IsValidOwner(int mailId, int userId)
		{
			var partiesIds = from m in Db.Mails.AsNoTracking()
				           where m.Id == mailId
				           select new {m.FromId, m.ToId};
			
			if(!partiesIds.Any())
				return new Result<bool>(false, new LogReport(LogTag.InexistentMailIdRequested, new { MailId = mailId }, LogLevel.Error));

			if (partiesIds.First().FromId != userId && partiesIds.First().ToId != userId)
				return new Result<bool>(false, new LogReport(LogTag.UnauthorizedMailContentRequested, new { MailId = mailId }, LogLevel.Warn));

			return Result<bool>.True;
		}
	}


}
