using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Management;
using Considerate.Hellolingo.Regulators;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Hellolingo.WebApp.Jobs;
using Considerate.Helpers;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Considerate.Hellolingo.WebApp {
	public class IoCConfig {
		public static void BindDependencies() {
			Injection.Kernel.Bind<ITextChatStorage>().To<TextChatDbStorage>();
			Injection.Kernel.Bind<IHubConnectionContext<ITextChatHubClient>>()
				.ToMethod((unused) => GlobalHost.ConnectionManager.GetHubContext<TextChatHub, ITextChatHubClient>().Clients);
			Injection.Kernel.Bind<TextChatController>().To<TextChatController>();
			Injection.Kernel.Bind<IAccountRegulator>().To<AccountRegulator>();
			Injection.Kernel.Bind<IHellolingoEntities>().To<HellolingoEntities>();
			Injection.Kernel.Bind<IEmailSender>().To<EmailSender>();
			Injection.Kernel.Bind<ISendGridLogger>().To<SendGridLogger>().WithConstructorArgument(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath);
			Injection.Kernel.Bind<ISendGridTransport>().To<SendGridTransport>();
			Injection.Kernel.Bind<IEmailQuotaValidator>().To<EmailQuotaValidator>();
			Injection.Kernel.Bind<IMailNotificationsManager>().To<MailNotificationsManager>();
			Injection.Kernel.Bind<IDeviceTagManager>().To<DeviceTagManager>();
		}
	}
}
