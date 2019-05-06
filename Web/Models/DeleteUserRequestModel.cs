using System.ComponentModel.DataAnnotations;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class DeleteUserRequestModel
	{
		[Required]
		public int UserId { get; set; }

		[Required]
		public string CurrentPassword { get; set; }
	}
}