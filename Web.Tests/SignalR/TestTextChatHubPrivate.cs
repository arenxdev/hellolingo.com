using System.Collections;
using System.Threading.Tasks;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Hubs;
using Microsoft.AspNet.SignalR.Hubs;
using Considerate.HellolingoMock.TextChat;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests.SignalR
{
	public class TestTextChatHubPrivate
	{
		private readonly TextChatHub _hub;
		private HubCallerContext _aliceContext;
		private HubCallerContext _bobContext;

		//Andriy: Mock calls to client-side 
		private readonly Queue _events;

		private UserId _aliceUserId;
		private UserId _bobUserId;

		string privateRoomId = $"{Resources.Alice.UserId}-{Resources.Bob.UserId}";
		readonly TextChatClient TextChatClient = new TextChatClient();

		public TestTextChatHubPrivate()
		{
		//Andriy: it's for override GetUserFromClaims method in TextChatHub class
			_hub = new OverridedTextChatHub(new TextChatHubCtrl(GetHubConnectionContext(), new TextChatController()));
			_events = TextChatClient.Events;
		}

		private IHubCallerConnectionContext<ITextChatHubClient> GetHubConnectionContext()
		{

			var mockClients = new Mock<IHubCallerConnectionContext<ITextChatHubClient>>();
			mockClients.Setup(m => m.All).Returns(TextChatClient);
			mockClients.Setup(m => m.Caller).Returns(TextChatClient);

			mockClients.Setup(m => m.Client(Resources.Alice.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Alice.ConnectionIdBis)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Bob.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Carol.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Client(Resources.Carol.ConnectionIdBis)).Returns(TextChatClient);

			// It's quite likely there is no need for the setup below since the usage SignalR Groups has been replaced by ManagedQueues
			mockClients.Setup(m => m.Group(Resources.English.RoomId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.English.RoomId, Resources.Alice.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.English.RoomId, Resources.Alice.ConnectionIdBis)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.English.RoomId, Resources.Bob.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.English.RoomId, Resources.Carol.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.English.RoomId, Resources.Carol.ConnectionIdBis)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId, Resources.Alice.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId, Resources.Alice.ConnectionIdBis)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId, Resources.Bob.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId, Resources.Carol.ConnectionId)).Returns(TextChatClient);
			mockClients.Setup(m => m.Group(Resources.French.RoomId, Resources.Carol.ConnectionIdBis)).Returns(TextChatClient);

			return mockClients.Object;
		}

		public async Task ReinviteUserAfterReconnect()
		{
			_hub.Context = _bobContext;
			await _hub.OnDisconnected(true);
			_hub.Context = _aliceContext;

			//Alica notifed that Bob left English room
			Assert.AreEqual($"{_bobUserId} left '{Resources.Bob.Message.RoomId}'", _events.Dequeue());
			//_hub.Ack(13);

			
			//Alica notifed that Bob left private room
			Assert.AreEqual($"{_bobUserId} left '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(14);



			//Alica notifed that Bob left chat
			Assert.AreEqual($"{_bobUserId} left", _events.Dequeue());
			//_hub.Ack(15);

			//Andriy: It's not clear who should get this message
			//Assert.AreEqual($"{_bobUserId} left", _events.Dequeue());

			//Send to disconnected Bob's client
			Assert.AreEqual($"Client reset requested", _events.Dequeue());
			//Should be empty
			Assert.AreEqual(0, _events.Count);

			await ConnectUserAgain();
			await PostToReconectedUser();
		}

		private async Task PostToReconectedUser()
		{
			_hub.Context = _aliceContext;

			string aliceMessage = "Hello again, Bob!";
			await _hub.PostTo(privateRoomId, aliceMessage);

			Assert.AreEqual($"{Resources.Alice.FirstName} said '{aliceMessage}' in '{privateRoomId}'", _events.Dequeue());


			_hub.Context = _bobContext;
			//_hub.Ack(5);

			//Bob joins invitation
			_hub.JoinRoom(privateRoomId);

			//Alice got notification that Alice joined
			Assert.AreEqual($"{_bobUserId} joined '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(6);

			
			//Bob receved data from server
			Assert.AreEqual($"1 initial user(s) added to '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(7);

			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			//_hub.Ack(8);

			//Ack Alice message
			_hub.Context = _aliceContext;
			//_hub.Ack(18);

			//Should be empty
			Assert.AreEqual(0, _events.Count);
		}

		public async Task ReJoinPrivateChat()
		{
			_hub.Context = _aliceContext;
			
			//Alice leaves private room
			_hub.LeaveRoom(privateRoomId);

			//Bob recieves notification 
			Assert.AreEqual($"{_aliceUserId} left '{privateRoomId}'", _events.Dequeue());
			_hub.Context = _bobContext;

			var bobMessage = "Get back, Alice!";

			await _hub.PostTo(privateRoomId, bobMessage);

			Assert.AreEqual($"{Resources.Bob.FirstName} said '{bobMessage}' in '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(8);
			_hub.Context = _aliceContext;
			//_hub.Ack(10);
			

			//Alice joins room second time
			_hub.JoinRoom(privateRoomId);

			//Bob got notification that Alice joined
			Assert.AreEqual($"{_aliceUserId} joined '{privateRoomId}'", _events.Dequeue());

			//Alice gets data from server
			Assert.AreEqual($"1 initial user(s) added to '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(11);
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			//_hub.Ack(12);

			//Ack Bob message
			_hub.Context = _bobContext;
			//_hub.Ack(9);
			
			//Should be empty
			Assert.AreEqual(0, _events.Count);
		}

		private async Task ConnectUserAgain()
		{
			_hub.Context = _bobContext;
			await _hub.OnConnected();
			_hub.JoinRoom(Resources.Bob.Message.RoomId);
			//_hub.Ack(1); _hub.Ack(4);

			Assert.AreEqual($"1 initial user(s) added", _events.Dequeue());
			var bobEvent = (dynamic)_events.Dequeue();
			_bobUserId = bobEvent.userId;
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", bobEvent.message);
			bobEvent = ( dynamic )_events.Dequeue();
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", bobEvent.message);
			Assert.AreEqual($"{_bobUserId}", bobEvent.userId);
			Assert.AreEqual($"{_bobUserId} joined '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"1 initial user(s) added to '{Resources.Bob.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());

			_hub.Context = _aliceContext;
			//_hub.Ack(16);
			
			//_hub.Ack(17); //Ack Bob added to English room
		}

		public async Task JoinChat()
		{
			PrepareContextPrivate();

			//Alice connected Chat,  joins room chat
			_hub.Context = _aliceContext;
			await _hub.OnConnected();
			//_hub.Ack(2); //Andriy: Ack do nothing.... 
			_hub.JoinRoom(Resources.Alice.Message.RoomId);
			//_hub.Ack(1); //Andriy: Ack connecting to chat
			//_hub.Ack(4); //Andriy: Ack Join chat  room
			Assert.AreEqual($"0 initial user(s) added", _events.Dequeue());

			var aliceEvent = (dynamic)_events.Dequeue();
			_aliceUserId = aliceEvent.userId;
			Assert.AreEqual($"{Resources.Alice.FirstName} joined the chat", aliceEvent.message);
			Assert.AreEqual($"0 initial user(s) added to '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			Assert.AreEqual(0, _events.Count);

			//Bob joins Chat, connected room.
			_hub.Context = _bobContext;
			await _hub.OnConnected();
			_hub.JoinRoom(Resources.Bob.Message.RoomId);

			//_hub.Ack(1); _hub.Ack(4);

			Assert.AreEqual($"1 initial user(s) added", _events.Dequeue()); //Andriy: Alice is alredy there.
			var bobEvent = (dynamic)_events.Dequeue();
			_bobUserId = bobEvent.userId;
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", bobEvent.message);//Recieved from Bob
			bobEvent = ( dynamic )_events.Dequeue();
			Assert.AreEqual($"{Resources.Bob.FirstName} joined the chat", bobEvent.message); //Recieved from Alice
			Assert.AreEqual($"{_bobUserId}", bobEvent.userId);
			Assert.AreEqual($"{_bobUserId} joined '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual($"1 initial user(s) added to '{Resources.Bob.Message.RoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());

			//Ack Alice Manage Queue
			_hub.Context = _aliceContext;

			//Ack Alice Manage Queue
			//_hub.Ack(5); //Ack Bob added to chat

			//Andriy:It's not clear now for me now. It seems that Manage queue doesn't allow to send new messages to client before got some expected number of Acks.
			//Clean queue. Alice got notification that Bob connected to english room
			//Assert.AreEqual($"{_bobUserId} joined '{Resources.Alice.Message.RoomId}'", _events.Dequeue());
			//_hub.Ack(6); //Ack Bob added to English room

			//Should be empty
			Assert.AreEqual(0, _events.Count);
		}

		public void JoinPrivateRoom()
		{
			//Bob joins to private room
			_hub.Context = _bobContext;
			_hub.JoinRoom(privateRoomId);
			Assert.AreEqual($"{_bobUserId} joined '{privateRoomId}'", _events.Dequeue());
			Assert.AreEqual($"1 initial user(s) added to '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(6);
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			//_hub.Ack(7);

			//Alice got notification that Bob joined
			_hub.Context = _aliceContext;
			//_hub.Ack(8);
			//_hub.Ack(9);
			
			////Should be empty
			Assert.AreEqual(0, _events.Count);
		}

		public async Task InitiatePrivateChat()
		{
			//Alice joined to new created private room
			_hub.Context = _aliceContext;
			_hub.JoinRoom(privateRoomId);
			//_hub.Ack(7);
			Assert.AreEqual($"0 initial user(s) added to '{privateRoomId}'", _events.Dequeue());
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());

			string aliceMessage = "Hi Bob!";
			await _hub.PostTo(privateRoomId, aliceMessage);

			//Bob got message from Alice and invitation is poped up on client
			_hub.Context = _bobContext;
			//_hub.Ack(5);
		
			Assert.AreEqual($"{Resources.Alice.FirstName} said '{aliceMessage}' in '{privateRoomId}'",_events.Dequeue());

			//Should be empty
			Assert.AreEqual(0, _events.Count);
		}

		private void PrepareContextPrivate()
		{
			//Alice context
			_aliceContext = Resources.Alice.GetAliceContext();

			//Bob context
			_bobContext = Resources.Bob.GetBobContext();
		}

		public void LeaveAndRejoinRoom()
		{
			_hub.Context = _aliceContext;

			//Alice leaves private room
			_hub.LeaveRoom(privateRoomId);

			//Bob recieves notification 
			Assert.AreEqual($"{_aliceUserId} left '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(18);

			_hub.Context = _bobContext;

			_hub.Context = _aliceContext;
			
			//Alice joined to new created private room
			_hub.JoinRoom($"{privateRoomId}");
		    //_hub.Ack(19);
			
			//Alica see opened chat on screen
			Assert.AreEqual($"{_aliceUserId} joined '{privateRoomId}'",_events.Dequeue());
			Assert.AreEqual($"1 initial user(s) added to '{privateRoomId}'", _events.Dequeue());
			//_hub.Ack(20);
			Assert.AreEqual("Initial Messages Added", _events.Dequeue());
			//_hub.Ack(21);

			_hub.Context = _bobContext;
			//_hub.Ack(8);
			//_hub.Ack(9);

			//Should be empty
			Assert.AreEqual(0, _events.Count);
		}
	}
}
