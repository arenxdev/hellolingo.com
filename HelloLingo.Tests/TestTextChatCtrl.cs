using System;
using System.Linq;
using System.Collections.Generic;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestTextChatCtrl {

		private static readonly UserId AliceUserId = 1;
		private static readonly FirstName AliceName = "Alice";
		private static readonly LangId AliceKnows = 1;
		private static readonly LangId AliceLearns = 2;
		private const string AliceMessageText = "Hi! This is Alice.";
		private static readonly TextChatUser AliceTextChatUser = new TextChatUser() {FirstName = AliceName, LastName = "A.", Knows = AliceKnows, Learns = AliceLearns, Id = AliceUserId};

		private static readonly UserId BobUserId = 2;
		private static readonly FirstName BobName = "Bob";
		private static readonly LangId BobKnows = 2;
		private static readonly LangId BobLearns = 1;
		private const string BobMessageText = "Hi! This is Bob";
		private static readonly TextChatUser BobTextChatUser = new TextChatUser() { FirstName = BobName, LastName = "B.", Knows = BobKnows, Learns = BobLearns, Id = BobUserId};

		private static readonly UserId CarolUserId = 3;
		private static readonly FirstName CarolName = "Carol";
		private static readonly LangId CarolKnows = 2;
		private static readonly LangId CarolLearns = 3;
		private static readonly TextChatUser CarolTextChatUser = new TextChatUser() { FirstName = CarolName, LastName = "C.", Knows = CarolKnows, Learns = CarolLearns, Id = CarolUserId};


		private static readonly RoomId EnglishRoomId = "english";

		[TestMethod]
	    
		public void Events() {
			var validUser = new User { Id = AliceUserId, Status = new UsersStatus { Id=UserStatuses.Valid} };
			var sgClientMock = new Mock<IEmailSender>();
			var controller = new TextChatController(/*sgClientMock.Object*/);
			var events = new Queue<string>();
			
			var aliceChatUser = new TextChatUser {FirstName = AliceName, LastName = "A.", Knows = AliceKnows, Learns = AliceLearns, Id =AliceUserId };
			var message = new TextChatMessage{UserId  = AliceUserId, FirstName = AliceName, RoomId = EnglishRoomId, Text = AliceMessageText, Visibility = MessageVisibility.Nobody };
			UserId aliceUserId=null;

			controller.OnUserJoinedRoom += (roomId, userId) => { aliceUserId = userId; events.Enqueue($"{userId} joined {roomId}"); };
			controller.OnPostedMessage += (msg) => { events.Enqueue(msg.Text); };
      

			controller.JoinChat(AliceUserId, aliceChatUser);
			controller.JoinRoom(AliceUserId, EnglishRoomId);
			controller.PostTo  (validUser, message).Wait();

			Assert.AreEqual($"{aliceUserId} joined {EnglishRoomId}", events.Dequeue());
			Assert.AreEqual(AliceMessageText, events.Dequeue());
			Assert.AreEqual(0, events.Count);
		}

    [TestMethod]
		public void ConsecutiveJoinAndLeave() {
		    var sgClientMock = new Mock<IEmailSender>();
			var controller = new TextChatController(/*sgClientMock.Object*/);
			var events = new Queue<string>();
			var aliceChatUser = new TextChatUser() {FirstName = AliceName, LastName = "A.", Knows = AliceKnows, Learns = AliceLearns, Id =AliceUserId};
			UserId aliceUserId = null;

			// Listen to events
			controller.OnUserJoinedRoom += (roomId, userId) => {
				events.Enqueue($"{userId} joined {roomId}");
				aliceUserId = userId;
			};
			controller.OnUserLeftRoom += (roomId, userId) => { events.Enqueue($"{userId} left {roomId}"); };
			controller.OnUserLeft += (userId) => { events.Enqueue($"{userId} left"); };

			// Alice's actions
			controller.JoinChat( AliceUserId, aliceChatUser);
			controller.JoinRoom( AliceUserId, EnglishRoomId);
			controller.LeaveChat(AliceUserId);

			// Check results
			Assert.AreEqual($"{aliceUserId} joined {EnglishRoomId}", events.Dequeue());
			Assert.AreEqual($"{aliceUserId} left {EnglishRoomId}", events.Dequeue());
			Assert.AreEqual($"{aliceUserId} left", events.Dequeue());

			// Alice's actions again
			controller.JoinChat( AliceUserId, aliceChatUser);
			controller.JoinRoom( AliceUserId, EnglishRoomId);
			controller.LeaveChat(AliceUserId);

			// Check results
			Assert.AreEqual($"{aliceUserId} joined {EnglishRoomId}", events.Dequeue());
			Assert.AreEqual($"{aliceUserId} left {EnglishRoomId}", events.Dequeue());
			Assert.AreEqual($"{aliceUserId} left", events.Dequeue());
			Assert.AreEqual(0, events.Count);
		}

		[TestMethod]
		public void JoinChat() {
			var sgClientMock = new Mock<IEmailSender>();
			var controller = new TextChatController(/*sgClientMock.Object*/);

			// Alice's actions
			controller.JoinChat(AliceUserId, AliceTextChatUser);
			controller.JoinRoom(AliceUserId, EnglishRoomId);

			// Bob's actions
			controller.JoinChat(BobUserId, BobTextChatUser);
			controller.JoinRoom(BobUserId, EnglishRoomId);

			// Carol's actions
			controller.JoinChat(CarolUserId, CarolTextChatUser);
			var tuple = controller.JoinRoom(CarolUserId, EnglishRoomId);
			var listOfUsersGuid = tuple.Item1;
			var listOfMessages = tuple.Item2;

			// Check results
			Assert.AreEqual(2, listOfUsersGuid.Count); // 2 because Carol was excluded from the list
			Assert.IsNotNull(listOfMessages);
			Assert.IsNull(listOfMessages.FirstOrDefault(a => a.RoomId != EnglishRoomId));

		}

		[TestMethod]
		public void LeaveRoomTest()
		{
			var sgClientMock = new Mock<IEmailSender>();
			var controller = new TextChatController(/*sgClientMock.Object*/);
			
			
			controller.JoinChat( AliceUserId, AliceTextChatUser );
			controller.JoinChat( BobUserId, BobTextChatUser );
			controller.JoinChat( CarolUserId, CarolTextChatUser );
			controller.JoinRoom( AliceUserId, EnglishRoomId );
			controller.JoinRoom( BobUserId, EnglishRoomId );
			controller.JoinRoom( CarolUserId, EnglishRoomId );
			Assert.AreEqual<int>( 3, controller.GetState().Rooms[EnglishRoomId].Count, "Chat Room should contain 3 users." );
			controller.LeaveRoom( AliceUserId, EnglishRoomId );
			Assert.AreEqual<int>( 2, controller.GetState().Rooms[EnglishRoomId].Count, "Chat Room should contain 2 users." );
			controller.LeaveRoom( BobUserId, EnglishRoomId );
			controller.LeaveRoom( CarolUserId, EnglishRoomId );
			Assert.IsFalse(controller.GetState().Rooms.ContainsKey(EnglishRoomId), "Chat Room must not exist." );
		}

		[TestMethod]
		public void JoinAndLeavePrivateRoomTest()
		{
			var sgClientMock = new Mock<IEmailSender>();
			var controller = new TextChatController(/*sgClientMock.Object*/);
			
			controller.JoinChat( AliceUserId, AliceTextChatUser );
			controller.JoinChat( BobUserId, BobTextChatUser );
			controller.JoinRoom( AliceUserId, EnglishRoomId );
			controller.JoinRoom( BobUserId, EnglishRoomId );
			Assert.AreEqual<int>( 2, controller.GetState().Rooms[EnglishRoomId].Count, "Chat Room should contain 2 users." );

			//User join to private room
			RoomId privateRoomId = $"{AliceUserId}-{BobUserId}";
			controller.JoinRoom(AliceUserId, privateRoomId);
			Assert.AreEqual<int>(1, controller.GetState().Rooms [ privateRoomId ].Count, "Private chat Room must contain 1 user.");

			//Single user leave private room
			controller.LeaveRoom(AliceUserId,privateRoomId);
		    Assert.AreEqual<int>( 1, controller.GetState().Rooms.Count, "Chat Model must contain 1 room (English)." );
			Assert.IsFalse(controller.GetState().Rooms.Keys.Contains(privateRoomId), $"Private room {privateRoomId} must not exist." );

			//Add new private room and 2 users joined to room
			controller.JoinRoom(AliceUserId,privateRoomId);
			Assert.AreEqual<int>(1, controller.GetState().Rooms [ privateRoomId ].Count, "Private chat Room must contain 1 user.");
			controller.JoinRoom(BobUserId, privateRoomId);
			Assert.AreEqual<int>(2, controller.GetState().Rooms [ privateRoomId ].Count, "Private chat Room must contain 2 users.");
			
			//First user leave private room
			controller.LeaveRoom(AliceUserId,privateRoomId);
		    Assert.AreEqual<int>( 2, controller.GetState().Rooms.Count, "Chat Model must contain 2 rooms." );
			Assert.IsTrue(controller.GetState().Rooms.Keys.Contains(privateRoomId), $"Private room {privateRoomId} must exist." );
			Assert.AreEqual<int>(1, controller.GetState().Rooms[privateRoomId].Count, "Private chat Room must contain 1 user.");

			//Second user leave private room
			controller.LeaveRoom(BobUserId,privateRoomId);
		    Assert.AreEqual<int>( 1, controller.GetState().Rooms.Count, "Chat Model must contain 1 room (English)." );
			Assert.IsFalse(controller.GetState().Rooms.Keys.Contains(privateRoomId), $"Private room {privateRoomId} must not exist." );

			//User created, joined private room and leave chat
			controller.JoinRoom(AliceUserId, privateRoomId);
			controller.LeaveChat(AliceUserId);
			Assert.AreEqual<int>( 1, controller.GetState().Rooms.Count, "Chat Model must contain 1 room (English)." );
			Assert.IsFalse(controller.GetState().Rooms.Keys.Contains(privateRoomId), $"Private room {privateRoomId} must not exist." );
		}
	}


}