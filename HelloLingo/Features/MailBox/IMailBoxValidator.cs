namespace Considerate.Hellolingo.Features.MailBox
{
	public interface IMailBoxValidator
	{
		Result<bool> IsRecipientValid(int recipientId);
		Result<bool> IsReplyToValid(int? replyTo, int fromId, int toId);
		Result<bool> IsValidOwner(int mailId, int userId);
	}
}