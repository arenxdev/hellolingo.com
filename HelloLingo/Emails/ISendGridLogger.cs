using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Considerate.Hellolingo.Emails
{
	public interface ISendGridLogger
	{
		Task LogEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId = 0);
		Task LogQuotaExceedEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId);
	}
}
