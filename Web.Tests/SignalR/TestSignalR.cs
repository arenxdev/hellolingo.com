using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Hellolingo.WebApp.Tests.SignalR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Considerate.HellolingoMock.TextChat;
using Considerate.Helpers;
using Considerate.Helpers.Communication;
using Microsoft.AspNet.SignalR.Hubs;
using Moq;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Tests {

	[TestClass]
	public class TestSignalR {

		// IMPORTANT !!!! If you're debugging this, you should disable the following processes that are on timers. They will interfere with your debugging sessions:
		//	1. _waitingForAck.Start() in ManagedQueues.cs (though disabling 4. will also disable this on)
		//	2. _heartBeatTimer.Start() in TextChatHubMaster.cs
		//	3. _healthReportTimer.Start() in TextChatHubMaster.cs
		//	4. _activityTimer.Start() in ActivityTracker.cs

		// Dependent Tests are bad practices... but for now, it's hard to deal with the SignalR hub architecture differently having thost tests running sequentially
		// This is more of an integration test than a unit test. It relies heavily on the entire signalR stack.

		public static readonly TextChatClient TextChatClient = new TextChatClient();

		[ClassInitialize]
		public static void SetupTest(TestContext context)
		{
			Injection.Kernel.Bind<IEmailSender>().ToMethod((c)=>new Mock<IEmailSender>().Object);
		}

		[TestMethod]

		public async Task TestDependentTests()
		{
			var testTextChatHub = new TestTextChatHub();
			await testTextChatHub.JoinAndChat();
			await testTextChatHub.DuplicateConnections();
			testTextChatHub.Disconnection();
			testTextChatHub.ExplicitLeaveRoom();

			await testTextChatHub.PostToWrongRoomFails();
		}

		[TestMethod]
		//TODOLATER: Test no longer work, because it requires an authenticated user
		public async Task TestPrivateChatRoom()
		{
			var testTextChatHubPrivate = new TestTextChatHubPrivate();

			//User joined to chat joined English room
			await testTextChatHubPrivate.JoinChat();

			//User invites to private chat
			await testTextChatHubPrivate.InitiatePrivateChat();

			//USer accepts invittion
			testTextChatHubPrivate.JoinPrivateRoom();

			//Reinvite user after leaving private chat
			await testTextChatHubPrivate.ReJoinPrivateChat();

			//Reinvite user after reconnect from chat
			await testTextChatHubPrivate.ReinviteUserAfterReconnect();

			testTextChatHubPrivate.LeaveAndRejoinRoom();
		}

		public static IHubCallerConnectionContext<dynamic> GetHubConnectionContext() {
			var mockClients = new Mock<IHubCallerConnectionContext<dynamic>>();
			mockClients.Setup(m => m.All).Returns(TextChatClient);
			mockClients.Setup(m => m.Caller).Returns(TextChatClient);

			mockClients.Setup(m => m.Client(Resources.Alice.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Alice.ConnectionIdBis)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Bob.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Carol.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Carol.ConnectionIdBis)).Returns(TextChatClient);

			return mockClients.Object;

		}

	}

	public class TextChatClient : ITextChatHubClient {
		public Queue Events { get; set; } = new Queue();

		public void LeaveRoom(RoomId roomId) { }
		public void Pong(int? orderIds) {}
		public void ResetClient() {}

		public void Do(List<QueuedMessage<HubClientInvoker>> messages)
		{
			foreach(var message in messages)
			{
				var call = message.Message;

				switch(call.MethodName)
				{
					case "AddInitialUsers":
						var addInitialUsersInvoker = call as AddInitialUsersInvoker;
						Events.Enqueue($"{addInitialUsersInvoker?.Args.Item1.Count} initial user(s) added");
					break;
					case "AddUser":
						var addUserInvoker = call as AddUserInvoker;
						Events.Enqueue(new { message = $"{addUserInvoker?.Args.Item1.FirstName} joined the chat", userId = addUserInvoker.Args.Item1.Id.ToString() });
					break;
					case "RemoveUser":
						var removeUserInvoker = call as RemoveUserInvoker;
						Events.Enqueue($"{removeUserInvoker?.Args.Item1} left");
					break;
					case "AddInitialUsersTo":
						var addInitialUsersToInvoker = call as AddInitialUsersToInvoker;
						Events.Enqueue($"{addInitialUsersToInvoker?.Args.Item2.Count} initial user(s) added to '{addInitialUsersToInvoker?.Args.Item1}'");
					break;
					case "AddUserTo":
						var addUserToInvoker = call as AddUserToInvoker;
						Events.Enqueue($"{addUserToInvoker?.Args.Item2} joined '{addUserToInvoker?.Args.Item1}'");
					break;
					case "RemoveUserFrom":
						var removeUserFromInvoker = call as RemoveUserFromInvoker;
						Events.Enqueue($"{removeUserFromInvoker?.Args.Item2} left '{removeUserFromInvoker?.Args.Item1}'");
					break;
					case "AddInitialMessages":
						Events.Enqueue("Initial Messages Added");
					break;
					case "AddMessage":
						var addMessageInvoker = call as AddMessageInvoker;
						Events.Enqueue($"{addMessageInvoker?.Args.Item1.FirstName} said '{addMessageInvoker?.Args.Item1.Text}' in '{addMessageInvoker?.Args.Item1.RoomId}'");
					break;
					case "MarkUserAsTyping":
						var markUserAsTypingInvoker = call as MarkUserAsTypingInvoker;
						Events.Enqueue($"{markUserAsTypingInvoker?.Args.Item2} is typing in '{markUserAsTypingInvoker?.Args.Item1}'");
						break;
					case "UnmarkUserAsTyping":
						var unmarkUserAsTypingInvoker = call as UnmarkUserAsTypingInvoker;
						Events.Enqueue($"{unmarkUserAsTypingInvoker?.Args.Item1} is done typing");
					break;
					case "ResetClient":
						Events.Enqueue($"Client reset requested");
					break;
				}
			}
		}

		public Task Invoke(string method, params object[] args)
		{
			if (method.ToLowerInvariant() == "Do".ToLowerInvariant())
			{
				Do(args[0] as List<QueuedMessage<HubClientInvoker>>);
				}
			else if (method.ToLowerInvariant() == "ResetClient".ToLowerInvariant())
			{
				Events.Enqueue($"Client reset requested");
			}
			return Task.CompletedTask;
		}

	}
}
