using System.ComponentModel.DataAnnotations;
using Considerate.Hellolingo.WebApp.Helpers.CustomValidationAttributed;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class UserProfileBaseModel
	{
		[Required]
		[EmailAddress]
		[MaxLength(256, ErrorMessage = "EmailLongerThan256Chars")]
		public string Email { get; set; }

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
