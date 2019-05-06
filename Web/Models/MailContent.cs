
namespace Considerate.Hellolingo.WebApp.Models
{
	public class MailContent
	{
		public MailContent() {}
		public MailContent(MailContent content) {
			Id      = content.Id;
			Message = content.Message;
		}

		public long   Id      { get; set; }
		public string Message { get; set; }
	}
}
