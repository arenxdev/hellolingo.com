using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.Tests
{
	[TestClass]
	public class TestTextChatDbStorage
	{
		[TestMethod]
		public void AddMessageTest()
		{
			var storage = new TextChatDbStorage();
			var message = new TextChatMessage
			{
				UserId = 1,
				FirstName = "Bernard",
				LastName = "V",
				RoomId = "english",
				Text = "AddMessageTest = Hello World!",
				Visibility = MessageVisibility.Everyone,
				DeviceTag = 0
			};
			storage.AddMessageAsync(message);

			// check last message
			DataAccess.TextChat savedMessage;
			using (var db = new HellolingoEntities())
			{
				savedMessage = db.TextChats.OrderByDescending(a => a.ID).FirstOrDefault();
			}

			Assert.IsNotNull(savedMessage);
			Assert.AreEqual(message.When, savedMessage.When);
			// ReSharper disable once PossibleInvalidOperationException
			Assert.AreEqual(message.UserId, new UserId(savedMessage.UserId.Value));
			Assert.AreEqual(0, savedMessage.DeviceTag, "DeviceTag must be null");
			Assert.AreEqual(message.FirstName, savedMessage.FirstName);
			Assert.AreEqual(message.RoomId.ToString(), savedMessage.RoomId);
			Assert.AreEqual(message.Text, savedMessage.Text);
			Assert.AreEqual((byte) message.Visibility, savedMessage.Visibility);
		}

		[TestMethod]
		public void GetHistoryTest()
		{
			var roomId = "french";
			var storage = new TextChatDbStorage();
			var message = new TextChatMessage
			{
				UserId = 1,
				FirstName = "Alice",
				LastName = "V",
				RoomId = roomId,
				Text = "GetHistoryTest = Hello World!",
				Visibility = MessageVisibility.Everyone,
				DeviceTag = 0
			};
			storage.AddMessageAsync(message);

			var messages = storage.GetHistory(roomId, new List<MessageVisibility> {MessageVisibility.Everyone}, 3);
			var lastMessage = messages.LastOrDefault();

			Assert.IsTrue(messages.Count <= 3);
			Assert.IsNotNull(lastMessage);
			Assert.AreEqual(message.When, lastMessage.When);
			Assert.IsTrue(message.UserId == lastMessage.UserId);
			Assert.AreEqual(message.FirstName, lastMessage.FirstName);
			Assert.AreEqual(message.RoomId, lastMessage.RoomId);
			Assert.AreEqual(message.Text, lastMessage.Text);
			Assert.AreEqual(message.Visibility, lastMessage.Visibility);
		}
	}
}