using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.UserCommons;

namespace Considerate.Hellolingo.Regulators
{
	public interface IAccountRegulator
	{
		LogReports RegulateNewUser(string email, string password, User user, DeviceTag deviceTag, string clientIpAddress);
	}
}