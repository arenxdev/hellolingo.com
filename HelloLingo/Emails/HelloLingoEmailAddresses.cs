using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Considerate.Hellolingo.Emails
{
	public class HellolingoEmailAddresses
	{
		public static string Admin
		{
			get
			{
				string adminEmail = "admin@hellolingo.com";
				return adminEmail;
			}
		}
		public const string Default            = "hello@hellolingo.com";
		public const string DefaultDisplayName = "Hellolingo";
		public const string SignUp             = "hello@hellolingo.com";
        public const string PasswordRecovery   = "hello@hellolingo.com";
	}
}
