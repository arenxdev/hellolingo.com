using System.Web.Http.ExceptionHandling;

namespace Considerate.Hellolingo.WebApp.Helpers
{

	public class WebApiExceptionLogger : ExceptionLogger {

		public override void Log(ExceptionLoggerContext context) {

			Helpers.Log.Error( 
				LogTag.UnhandledWebApiException,
				context.Request,
				context.Exception.GetBaseException(),
				true
			);

		}
	}

}