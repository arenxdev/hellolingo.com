using System.Threading.Tasks;

namespace Considerate.Hellolingo.WebApp.Jobs
{
	public interface IMailNotificationsManager
	{
		Task SendNotificationsOfNewEmail();
		Task SendNotificationsFromQueue();
	}
}
