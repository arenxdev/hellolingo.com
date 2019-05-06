using System.Threading.Tasks;
using SendGrid;

namespace Considerate.Hellolingo.Emails
{
	public class DumbSendGridTransport : ISendGridTransport
	{
		public Task DeliverAsync(SendGridMessage message) => new Task(() => { });
	}
}