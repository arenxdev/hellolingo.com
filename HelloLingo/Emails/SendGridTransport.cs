using System;
using System.Threading.Tasks;
using SendGrid;

namespace Considerate.Hellolingo.Emails
{
	public class SendGridTransport : ISendGridTransport
	{
		private const string ApiKeyHellolingo = "*******";

		private string SendGridApiKey => ApiKeyHellolingo;

		private readonly Web _transport;

		public SendGridTransport()
		{
			_transport = new Web(SendGridApiKey);
		}

		public async Task DeliverAsync(SendGridMessage message)
		{
			await _transport.DeliverAsync(message);
		}
	}
}