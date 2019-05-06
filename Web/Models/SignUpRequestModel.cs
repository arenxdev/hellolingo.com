using System.ComponentModel.DataAnnotations;
using Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class SignUpRequestModel//:UserProfileBaseModel
    {
		[Required]
		[EmailAddress]
		[MaxLength(256, ErrorMessage = "EmailLongerThan256Chars")]
		public string Email { get; set; }

		[Required]
		[MinLength(6, ErrorMessage = "PasswordShorterThan6Chars")]
		[MaxLength(99, ErrorMessage = "PasswordLongerThan99Chars")]
		public string Password { get; set; }

		[CleanUpUserFirstName]
		//[Required]
		[MinLength(2, ErrorMessage = "FirstNameShorterThan2Chars")]
		[MaxLength(25, ErrorMessage = "FirstNameLongerThan25Chars")]
		public string FirstName { get; set; }

		[CleanUpUserLastName]
		//[Required]
		[MinLength(1, ErrorMessage = "LastNameShorterThan1Char")]
		[MaxLength(40, ErrorMessage = "LastNameLongerThan40Chars")]
		public string LastName { get; set; }

		[Required]
		[RegularExpression(@"^[FM]{1}$", ErrorMessage = "GenderNotFOrM")]
		public string Gender { get; set; }

		[Required]
		[Range(1, 12, ErrorMessage = "MonthNotBetween1And12")]
		public byte BirthMonth { get; set; }

		[Required]
		[Range(1920, 2099, ErrorMessage = "YearNotBetween1920And2099")]
		public int BirthYear { get; set; }

		[Required]
		public byte Country { get; set; }

		[CleanUpUserLocation]
		[MaxLength(40, ErrorMessage = "LocationLongerThan40Chars")]
		public string Location { get; set; }

		[Required] public byte Learns { get; set; }
		public byte? Learns2 { get; set; }
		public byte? Learns3 { get; set; }

		[Required] public byte Knows { get; set; }
		public byte? Knows2 { get; set; }
		public byte? Knows3 { get; set; }

		[Required] public bool LookToLearnWithTextChat { get; set; }
		[Required] public bool LookToLearnWithVoiceChat { get; set; }
		[Required] public bool LookToLearnWithGames { get; set; }
		[Required] public bool LookToLearnWithMore { get; set; }

		[MaxLength(4000, ErrorMessage = "IntroductionLongerThan5000Chars")]
		public string Introduction { get; set; }

		[Required] public bool IsSharedTalkMember { get; set; }
		[Required] public bool IsLivemochaMember { get; set; }
		[Required] public bool IsSharedLingoMember { get; set; }
		[Required] public bool WantsToHelpHellolingo { get; set; }
	}
}