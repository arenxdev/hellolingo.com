using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public static class EmailConfirmationHelper
	{
		public const string ConfirmationParameterName = "validation";
		public const string ConfirmationSuccess       = "success";
		public const string ConfirmationFailed        = "failed";

		public static string TokenEncode(string str)
		{
			var encbuff = Encoding.UTF8.GetBytes(str);
			return HttpServerUtility.UrlTokenEncode(encbuff);
		}

		public static string TokenDecode(string str)
		{
			var decbuff = HttpServerUtility.UrlTokenDecode(str);
			return decbuff != null ? Encoding.UTF8.GetString(decbuff) : null;
		}
	}
}
