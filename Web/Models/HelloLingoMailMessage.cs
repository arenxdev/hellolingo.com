using System.ComponentModel.DataAnnotations;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class HellolingoMailMessage
	{
		public int MemberIdTo { get; set; }
		public int? ReplyTo { get; set; }

		[Required]
		public string Text { get; set; }
	}
}