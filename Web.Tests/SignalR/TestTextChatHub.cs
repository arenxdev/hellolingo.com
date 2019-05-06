using System.Collections;
using System.Threading.Tasks;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Hellolingo.WebApp.Tests.SignalR;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Considerate.HellolingoMock.TextChat;
using Microsoft.AspNet.SignalR.Hubs;
using Considerate.Helpers;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Tests {

	public class TestTextChatHub
	{
		private readonly TextChatHub _hub;
		private HubCallerContext _aliceContext;
		private HubCallerContext _bobContext;
		private HubCallerContext _carolContext;
		private HubCallerContext _carolContextBis;

		private readonly Queue _events = TestSignalR.TextChatClient.Events;
		private string _aliceUserId;
		private string _carolUserId;

		public TestTextChatHub()
		{
			_hub = new OverridedTextChatHub(Injection.Kernel.Get<TextChatHubCtrl>());
		}

		public async Task JoinAndChat() {

			// Substitute Mock object on Hub
			_hub.Clients = (IHubCallerConnectionContext<ITextChatHubClient>) TextChatHubCtrl.Instance.Clients;

			// Prepare users contexts
			PrepareContexts();

			// Alice:  Enter, Join 'English'
			_hub.Context = _aliceContext ;
			await _hub.OnConnected();
			//_hub.Ack(2); // This ack should have no effect, b/c there is no 3 to acknowledge yet
			_hub.JoinRoom(Resources.Alice.Message.RoomId);
			//_hub.Ack(1); _hub.Ack(4); // Not need to ack 2, 3 , b/c the managed queue bundled 2-5 together after we acked 1.

			// Evaluate 
			Assert.AreEqual($"0 initial user(s) added", _events.Dequeue());
			var aliceEvent = (dynamic)_events.Dequeue();
			_aliceUserId = aliceEvent.userId;
			Assert.AreEqual($"{Resources.Alice.FirstName} joined the chat", aliceEvent.message);
			Assert.AreEqual($"0 initial user(s) added to '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);

			// Bob: Enter, Join 'English', Chat
			_hub.Context = _bobContext;
			await _hub.OnConnected();
			_hub.JoinRoom(Resources.Bob.Message.RoomId);

			// Ack all messagess
			//_hub.Ack(1); _hub.Ack(4); 
			//_hub.Context = _aliceContext; _hub.Ack(5); _hub.Ack(6);

			// Evaluate
			Assert.AreEqual($"1 initial user(s) added", _events.Dequeue());
			var evt = (dynamic)_events.Dequeue();
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", evt.message); // One received by Bob
			evt = _events.Dequeue();
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", evt.message); // One received by Alice
			Assert.AreEqual($"{evt.userId} joined '{Resources.English.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"1 initial user(s) added to '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
		Assert.AreEqual(0, _events.Count);

			// Alice: Chat in English Room
			_hub.Context = _aliceContext;
			await _hub.SetTypingActivityIn(Resources.Alice.Message.RoomId);
			await _hub.PostTo(Resources.Alice.Message.RoomId, Resources.Alice.Message.Text);
			await _hub.SetTypingActivityIn(Resources.Alice.Message.RoomId);
			_hub.JoinRoom(Resources.French.RoomId);
			await _hub.SetTypingActivityIn(Resources.French.RoomId);

			// Ack all messagess
			_hub.Context = _bobContext; //_hub.Ack(5); _hub.Ack(9);
			_hub.Context = _aliceContext; //_hub.Ack(7); _hub.Ack(13);

			// Evaluate
			Assert.AreEqual($"{_aliceUserId} is typing in '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is typing in '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is done typing", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is done typing", _events.Dequeue());
			Assert.AreEqual($"{Resources.Alice.Message.FirstName} said '{Resources.Alice.Message.Text}' in '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is typing in '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is typing in '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"0 initial user(s) added to '{Resources.French.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is done typing", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is done typing", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} is typing in '{Resources.French.RoomId}'", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);

			// Bob: Chat in English Room
			_hub.Context = _bobContext;
			await _hub.PostTo(Resources.Bob.Message.RoomId, Resources.Bob.Message.Text);

			// Ack all messagess
			_hub.Context = _aliceContext; //_hub.Ack(14);

			// Evaluate
			Assert.AreEqual($"{Resources.Bob.Message.FirstName} said '{Resources.Bob.Message.Text}' in '{Resources.Bob.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);
		}

		public async Task DuplicateConnections() {

			// Carol: Enter, Join English
			_hub.Context = _carolContext;
			await _hub.OnConnected();
			_hub.JoinRoom(Resources.English.RoomId);

			// Ack all messagess
			_hub.Context = _aliceContext; //_hub.Ack(15); _hub.Ack(16);
			_hub.Context = _bobContext; //_hub.Ack(10); _hub.Ack(11);
			_hub.Context = _carolContext; //_hub.Ack(1); _hub.Ack(4);
			
			// Evaluate
			Assert.AreEqual($"2 initial user(s) added", _events.Dequeue());
			var carolEvent = (dynamic)_events.Dequeue();
			_carolUserId = carolEvent.userId;
			Assert.AreEqual($"{Resources.Carol.FirstName} joined the chat", carolEvent.message);
			Assert.AreEqual($"{Resources.Carol.FirstName} joined the chat", ((dynamic)_events.Dequeue()).message);
			Assert.AreEqual($"{Resources.Carol.FirstName} joined the chat", ((dynamic)_events.Dequeue()).message);
			Assert.AreEqual($"{carolEvent.userId} joined 'english'", _events.Dequeue()); 
			Assert.AreEqual($"{carolEvent.userId} joined 'english'", _events.Dequeue()); 
			Assert.AreEqual($"2 initial user(s) added to '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);

			// Carol: Enter with new tab, Join English
			_hub.Context = _carolContextBis;
			await _hub.OnConnected();
			_hub.JoinRoom(Resources.English.RoomId);

			// Ack all messages. No one else than Carol receive a message, because Carol already has an active connection to the hub
			_hub.Context = _carolContextBis; //_hub.Ack(1); _hub.Ack(3);

			Assert.AreEqual($"2 initial user(s) added", _events.Dequeue());
			Assert.AreEqual($"2 initial user(s) added to '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);

		}

		public async void Disconnection()
		{
			// Alice: Disconnect
			_hub.Context = _aliceContext;
			await _hub.OnDisconnected(true);

			// Ack all messagess
			_hub.Context = _bobContext; //_hub.Ack(12); _hub.Ack(13);
			_hub.Context = _carolContext; //_hub.Ack(5); _hub.Ack(6);
			_hub.Context = _carolContextBis; //_hub.Ack(4); _hub.Ack(5);

			// Evaluate
			// Andiry: Notify all other users that user left room
			Assert.AreEqual($"{_aliceUserId} left '{Resources.English.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} left '{Resources.English.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} left '{Resources.English.RoomId}'", _events.Dequeue());

		    // Andiry: Notify all other users that user left chat
			Assert.AreEqual($"{_aliceUserId} left", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} left", _events.Dequeue());
			Assert.AreEqual($"{_aliceUserId} left", _events.Dequeue());

				// Send command to disconnected clinet
			Assert.AreEqual("Client reset requested", _events.Dequeue());

			Assert.AreEqual(0, _events.Count);
		}

		public void ExplicitLeaveRoom()
		{
			// Carol: One of her connections leaveRoom
			_hub.Context = _carolContext;
			_hub.LeaveRoom(Resources.English.RoomId);

			// Evaluate
			Assert.AreEqual(0, _events.Count);

			// Carol: her other connection leaveRoom
			_hub.Context = _carolContextBis;
			_hub.LeaveRoom(Resources.English.RoomId);

			// Ack all messagess
			_hub.Context = _bobContext; //_hub.Ack(14);

			// Evaluate
			Assert.AreEqual($"{_carolUserId} left '{Resources.English.RoomId}'", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);
		}

		public async Task PostToWrongRoomFails()
		{
			_hub.Context = _carolContext;
			await _hub.PostTo(Resources.English.RoomId, Resources.Bob.Message.Text);
			Assert.AreEqual(0, _events.Count);
		}

		private void PrepareContexts() {

			// Alice Context
			_aliceContext = Resources.Alice.GetAliceContext();

			// Bob Context
			_bobContext = Resources.Bob.GetBobContext();

			// Carol Context
			_carolContext = Resources.Carol.GetCarolContext();

			// Carol Context (2nd connection from same user)
			_carolContextBis = Resources.Carol.GetCarolBisContext();
		}
	}
}
