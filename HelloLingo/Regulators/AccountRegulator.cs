using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers;
using Ninject;

namespace Considerate.Hellolingo.Regulators
{
	public class AccountRegulator:IAccountRegulator
	{
		private IEmailSender _sgManager;
		private IEmailSender SgManager => _sgManager ?? ( _sgManager = Injection.Kernel.Get<IEmailSender>() );

		public AccountRegulator() { }

		public AccountRegulator(IEmailSender emailSender)
		{
			_sgManager = emailSender;
		}
				
		public LogReports RegulateNewUser(string email, string password, User user, DeviceTag deviceTag, string ipAddress) {

			var result = new LogReports();

			// Set initial userStatus
			user.StatusId = UserStatuses.PendingEmailValidation;
				
			if (email.EndsWith("@fake.fake")) {
				result.Add(new LogReport(LogTag.EmailValidationBypassedForTestEmail, new { email } ));
				user.StatusId = UserStatuses.Valid;
			}

			return result;
		}
	}
}
