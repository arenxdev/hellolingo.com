using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using Considerate.Hellolingo.TextChat;
using Considerate.HellolingoMock.TextChat;
using Considerate.Helpers;
using Ninject;
using String = Considerate.Helpers.String;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestTextChat 
	{

		[TestMethod]
		public void LastMessage() {
			var chatModel = Injection.Kernel.Get<ChatModel>();

			// Check for inexistant message
			RoomId randomRoom = String.RandomText();
			Assert.AreEqual(null, chatModel.LastMessageIn(randomRoom), "Last Message From room that doesn't exist");

			// Check for known message
			chatModel.AddUserToChat(Resources.Alice.Message.UserId, Resources.Alice.TextChatUser);
			chatModel.AddUserToRoom(Resources.Alice.Message.UserId, Resources.Alice.Message.RoomId);
			chatModel.AddMessageAsync(Resources.Alice.Message);
			Assert.AreEqual(Resources.Alice.Message, chatModel.LastMessageIn(Resources.English.RoomId), "Last Message From User");
		}

		[TestMethod]
		public void LoadHistory() {
			var chatModel = Injection.Kernel.Get<ChatModel>();

			// Put Alice in a  room
			chatModel.AddUserToChat(Resources.Alice.UserId, Resources.Alice.TextChatUser);
			chatModel.AddUserToRoom(Resources.Alice.UserId, Resources.English.RoomId);

			// Check the for the expected history
			var messages = chatModel.LatestMessagesIn(Resources.English.RoomId, 10 /* Loading 10 messages */);
			var lastMessage = messages.LastOrDefault();
			Assert.IsNotNull(lastMessage);
			Assert.AreEqual(Resources.Bob.Message.UserId, lastMessage.UserId);
			Assert.AreEqual(Resources.Bob.Message.FirstName, lastMessage.FirstName);
			Assert.AreEqual(Resources.Bob.Message.RoomId, lastMessage.RoomId);
			Assert.AreEqual(Resources.Bob.Message.Text, lastMessage.Text);
			Assert.AreEqual(Resources.Bob.Message.Visibility, lastMessage.Visibility);
		}

		[TestMethod]
		public void IsActiveWriter()
		{
			var chatModel = Injection.Kernel.Get<ChatModel>();

			// Put Alice in a room
            chatModel.AddUserToChat(Resources.Alice.UserId, Resources.Alice.TextChatUser);
			chatModel.AddUserToRoom(Resources.Alice.UserId, Resources.English.RoomId);

			// Check Alice isn't typing
			Assert.AreEqual(false, chatModel.IsTypingInRoom(Resources.Alice.TextChatUser, Resources.English.RoomId));

			// Make Alice write
			chatModel.SetAsTyping(Resources.Alice.TextChatUser.Id, Resources.English.RoomId, null, null);

			// Check Alice is typing
			Assert.AreEqual(true, chatModel.IsTypingInRoom(Resources.Alice.TextChatUser, Resources.English.RoomId));
		}
	}

}
