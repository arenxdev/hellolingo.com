using Considerate.Hellolingo.Regulators;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.WebApp.Tests;
using Considerate.HellolingoMock.TextChat;
using Considerate.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNet.SignalR.Hubs;

namespace Hellolingo.WebApp.Tests {

	[TestClass]
	public class Startup {

		[AssemblyInitialize]
		public static void Start(TestContext context) {
			Injection.Kernel.Bind<ITextChatStorage>().To<DumbTextChatStorage>();
			Injection.Kernel.Bind<IHubConnectionContext<dynamic>>().ToMethod((s) => TestSignalR.GetHubConnectionContext());
			Injection.Kernel.Bind<IAccountRegulator>().To<DumbAccountRegulator>();
		}
	}
}
  