using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Considerate.Hellolingo.Emails
{
	public enum EmailQuotaType
	{
		EmailVerificationByEmail =1,
		EmailVerificationByUserId = 2,
		SameEmailAddress = 3,
		EmailVerificationGlobally = 4,
		TotalSentEmails = 6
	}
}
