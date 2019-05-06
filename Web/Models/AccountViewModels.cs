using System.ComponentModel.DataAnnotations;
using Considerate.Hellolingo.I18N;

namespace Considerate.Hellolingo.Models
{

    public class ResetPasswordViewModel
    {
		[Required]
		[EmailAddress]
		[Display(Name = nameof(StringsFoundation.YourEmail), ResourceType = typeof(StringsFoundation))]
		public string Email { get; set; }

		[Required]
        [DataType(DataType.Password)]
		[Display(Name = nameof(StringsFoundation.NewPassword), ResourceType = typeof(StringsFoundation))]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = nameof(StringsFoundation.RetypePassword), ResourceType = typeof(StringsFoundation))]
		public string ConfirmPassword { get; set; }

        public string Code { get; set; }

		public bool InvalidEmail = false;
		public bool PasswordsDiffer = false;
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
		[Display(Name = nameof(StringsFoundation.YourEmail), ResourceType = typeof(StringsFoundation))]
        public string Email { get; set; }

		public bool InvalidEmail = false;
	}
}
