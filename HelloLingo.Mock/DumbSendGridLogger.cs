using System.Threading.Tasks;
using Considerate.Hellolingo.Emails;

namespace Considerate.HellolingoMock.TextChat {

	public class DumbSendGridLogger : ISendGridLogger {
		public Task LogEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId = 0) => new Task(() => { });
		public Task LogQuotaExceedEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId) => new Task(() => { });
	}
}
