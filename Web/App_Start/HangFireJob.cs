using System;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.WebApp.Jobs;
using Hangfire;
using Hangfire.Logging;
using Hangfire.Logging.LogProviders;
using Owin;

namespace Considerate.Hellolingo.WebApp.App_Start
{
	public class HangFireJob
	{
		public static void ConfigureHangFire(IAppBuilder app)
		{
			// Configure Hangfire to use NoOpLogger, which prevents it to hook to our Log4Net and pollutes the logs with unformatted records
			// Hangfire.Logging.LogProvider.SetCurrentLogProvider(null); This is supposed to disable logging, but it doesn't, so I use the next line instead.
			LogProvider.SetCurrentLogProvider(new ColouredConsoleLogProvider());

			// Configure the Sql Storage
			GlobalConfiguration.Configuration.UseSqlServerStorage("HangFireConnectionString");

			// Atlernative approach that disable the creation of the schema (so that it can be delegated to something else):
			// GlobalConfiguration.Configuration.UseSqlServerStorage("HangFireConnectionString", new SqlServerStorageOptions() { PrepareSchemaIfNecessary = false });

			//app.UseHangfireDashboard(); // The dashboard is limited to localhost access
			app.UseHangfireServer();

			// Add Jobs
			RecurringJob.AddOrUpdate("clean-mail-quoatas", () => EmailCountersStorage.CleanEmailQuotaCounters(), "0 * * * *" /* At every hour, on the hour: "http://crontab.guru/#0_*_*_*_*" */);
			RecurringJob.AddOrUpdate("message-notification", () => MailNotificationsManager.StartNotificationJob(), "*/2 * * * *" /* every 2 mins */);
		}

	}

}
