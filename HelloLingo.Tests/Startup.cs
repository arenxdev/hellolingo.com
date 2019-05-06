using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.TextChat;
using Considerate.HellolingoMock.TextChat;
using Considerate.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class Startup {

		[AssemblyInitialize]
		public static void Start(TestContext context) {
			Injection.Kernel.Bind<ITextChatStorage>().To<DumbTextChatStorage>();
			Injection.Kernel.Bind<IEmailSender>().To<EmailSender>();
			Injection.Kernel.Bind<ISendGridLogger>().To<DumbSendGridLogger>().WithConstructorArgument("");
			Injection.Kernel.Bind<ISendGridTransport>().To<DumbSendGridTransport>();
			Injection.Kernel.Bind<IEmailQuotaValidator>().To<DumbEmailQuotaValidator>();
		}
	}
}
