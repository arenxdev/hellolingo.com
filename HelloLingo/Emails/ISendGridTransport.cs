using System.Threading.Tasks;
using SendGrid;

namespace Considerate.Hellolingo.Emails
{
	public interface ISendGridTransport
	{
		Task DeliverAsync(SendGridMessage message);
	}
}