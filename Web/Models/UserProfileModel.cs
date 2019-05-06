using System.ComponentModel.DataAnnotations;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class UserProfileModel:UserProfileBaseModel
	{
		public int Id { get; set; }

		[Required]public string CurrentPassword { get; set; }

		[MinLength(6, ErrorMessage = "PasswordShorterThan6Chars")]
		[MaxLength(99, ErrorMessage = "PasswordLongerThan99Chars")]
		public string Password { get; set; }
	}
}