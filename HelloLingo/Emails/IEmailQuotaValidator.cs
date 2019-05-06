using Considerate.Hellolingo.UserCommons;
using System.Threading.Tasks;
using SendGrid;

namespace Considerate.Hellolingo.Emails
{
	public interface IEmailQuotaValidator
	{
		QuotaValidationResult ValidateQuota(EmailTypes emailType, SendGridMessage message, int userId);
	}
}