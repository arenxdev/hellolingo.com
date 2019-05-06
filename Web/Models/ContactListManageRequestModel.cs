using System.ComponentModel.DataAnnotations;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class ContactListManageRequestModel
	{
		[Required]
		public int ContactUserId { get; set; }

		public string SourceState { get; set; }
	}
}