using SendGrid;
using System.Linq;
using Considerate.Helpers;

namespace Considerate.Hellolingo.Emails
{
	
	public class DumbEmailQuotaValidator : IEmailQuotaValidator
	{
		public QuotaValidationResult ValidateQuota(EmailTypes emailType, SendGridMessage message, int userId) => QuotaValidationResult.Success;
	}

}

