using System.Threading.Tasks;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp
{
	public class AsyncConfig
	{
		public static void LogUnobservedTaskExceptions()
		{
			TaskScheduler.UnobservedTaskException += (sender, eventArgs) => {
				Log.Error(LogTag.UnobservedTaskException, eventArgs.Exception.InnerException);
			};
		}
	}
}
