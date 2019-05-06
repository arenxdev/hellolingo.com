using System;
using Considerate.Hellolingo;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Regulators;
using Considerate.Hellolingo.UserCommons;

namespace Hellolingo.WebApp.Tests
{
	public class DumbAccountRegulator:IAccountRegulator
	{
		public LogReports RegulateNewUser(string email, string password, User user, DeviceTag deviceTag, string clientIpAddress)
		{
			//Andriy: I can't setup regulator for now with Ninject properly. So I use this approach for now:
			switch (user.BirthMonth) {
				case 1:	user.StatusId = UserStatuses.PendingEmailValidation; break;
				case 2:	user.StatusId = UserStatuses.Valid; break;
				case 3:	user.StatusId = UserStatuses.Valid; user.Banned = true; break;
				case 4:	user.StatusId = UserStatuses.PendingSignUpReview; break;
				default: throw new Exception("Can't assign user status. Unexpected BirthMonth.");
			}
			var result = new LogReports();
			return result;
		}
	}
}