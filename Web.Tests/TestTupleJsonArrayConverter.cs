using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Helpers.Communication;
using Considerate.Helpers.JsonConverters;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestTupleJsonArrayConverter
	{
		[TestMethod]
		public void SerializationTest()
		{
			var tuple = Tuple.Create(1, "2", true);
			var complexTuple = Tuple.Create(new List<string> { "first", "second"}, 2, true);
			var supercomplexTuple = Tuple.Create(new List<TextChatUser> {new TextChatUser {Id = 123, Age = 42}});
			
			var serializedTuple = JsonConvert.SerializeObject(tuple, new TupleJsonArrayConverter());
			Assert.AreEqual("[1,\"2\",true]", serializedTuple);

			var serializedComplexTuple = JsonConvert.SerializeObject(complexTuple, new TupleJsonArrayConverter());
			Assert.AreEqual("[[\"first\",\"second\"],2,true]", serializedComplexTuple);

			var serializedSupercomplexTuple = JsonConvert.SerializeObject(supercomplexTuple, new TupleJsonArrayConverter());
			var serializedUserList =
				JsonConvert.SerializeObject(new List<TextChatUser> {new TextChatUser {Id = 123, Age = 42}});
			Assert.AreEqual($"[{serializedUserList}]", serializedSupercomplexTuple);
		}

		[TestMethod]
		public void DeserializationTest()
		{
			var arrayString = "[1, \"2\", true]";
			var complexArrayString = "[[\"first\", \"second\"], 2, true]";
			//var supercomplexArrayString = ""; // Tuple.Create(new List<TextChatUser> { new TextChatUser { UserId = 123, Age = 42 } });

			var deserializedTuple = JsonConvert.DeserializeObject<Tuple<int, string, bool>>(arrayString, new TupleJsonArrayConverter());
			Assert.AreEqual(1, deserializedTuple.Item1);
			Assert.AreEqual("2", deserializedTuple.Item2);
			Assert.AreEqual(true, deserializedTuple.Item3);

			var deserializedComplexTuple = JsonConvert.DeserializeObject<Tuple<List<string>, string, bool>>(complexArrayString, new TupleJsonArrayConverter());
			Assert.AreNotEqual(null, deserializedComplexTuple.Item1);
			Assert.AreEqual(2, deserializedComplexTuple.Item1.Count);
			Assert.AreEqual("first", deserializedComplexTuple.Item1[0]);
			Assert.AreEqual("second", deserializedComplexTuple.Item1[1]);
			Assert.AreEqual("2", deserializedComplexTuple.Item2);
			Assert.AreEqual(true, deserializedComplexTuple.Item3);

			//var deserializedSupercomplexTuple = JsonConvert.SerializeObject(supercomplexTuple, new TupleJsonArrayConverter());
		}

		[TestMethod]
		public void HubInvokersSerialization()
		{
			var message = new AddInitialUsersInvoker(new List<ITextChatUser>());

			var json = JsonConvert.SerializeObject(message);
			var serializedInvoker = JObject.Parse(json);

			Assert.AreEqual(serializedInvoker["method"].ToString(), message.MethodName);
			Assert.AreEqual(Regex.Replace(serializedInvoker["args"].ToString(), @"[\s]", ""), "[[]]");
		}


		[TestMethod]
		public void ManagedMessagesSerialization()
		{
			var message = new QueuedMessage<HubClientInvoker> { Message = new AddInitialUsersInvoker(new List<ITextChatUser>()) };

			var json = JsonConvert.SerializeObject(message);

			var serializedMessage = JObject.Parse(json);

			var serializedInvoker = serializedMessage["message"];
			Assert.AreEqual(serializedInvoker["method"].ToString(), message.Message.MethodName);
			Assert.AreEqual(Regex.Replace(serializedInvoker["args"].ToString(), @"[\s]", ""), "[[]]");
		}


		[TestMethod]
		public void SerializeTextChatMessageTest()
		{
			var userId    = 4              ;
			var roomId    = "55-178"       ;
			var firstName = "John"         ;
			var lastName  = "Brawn"        ;
			var text      = "Message text.";

			var messageToSerialize = new TextChatMessage() {RoomId = roomId, FirstName = firstName, LastName = lastName, Text = text, UserId = userId};

			string serializedMessage = JsonConvert.SerializeObject(messageToSerialize);
			
			Assert.AreEqual("{\"userId\":4,\"roomId\":\"55-178\",\"firstName\":\"John\",\"lastName\":\"Brawn\",\"text\":\"Message text.\"}", 
				            serializedMessage);

			var textMessageInTuple = Tuple.Create(new List<ITextChatMessage> {messageToSerialize});
			string textMessageInTupleJson = JsonConvert.SerializeObject(textMessageInTuple, new TupleJsonArrayConverter());

			Assert.AreEqual($"[[{serializedMessage}]]", textMessageInTupleJson);
		}

		[TestMethod]
		public void SerializeTextChatMessageWithUSerIdNullTest()
		{
			var roomId    = "55-178"       ;
			var firstName = "John"         ;
			var lastName  = "Brawn"        ;
			var text      = "Message text.";

			var messageToSerialize = new TextChatMessage() {RoomId = roomId, FirstName = firstName, LastName = lastName, Text = text};

			string serializedMessage = JsonConvert.SerializeObject(messageToSerialize);
			
			Assert.AreEqual("{\"userId\":null,\"roomId\":\"55-178\",\"firstName\":\"John\",\"lastName\":\"Brawn\",\"text\":\"Message text.\"}", 
				            serializedMessage);

			var textMessageInTuple = Tuple.Create(new List<ITextChatMessage> {messageToSerialize});
			string textMessageInTupleJson = JsonConvert.SerializeObject(textMessageInTuple, new TupleJsonArrayConverter());

			Assert.AreEqual($"[[{serializedMessage}]]", textMessageInTupleJson);
		}

		[TestMethod]
		public void DeserializeTextChatMessageTest()
		{
			UserId    userId          = 4                                                                                                               ;
			RoomId    roomId          = "55-178"                                                                                                        ;
			FirstName firstName       = "John"                                                                                                          ;
			LastName  lastName        = "Brawn"                                                                                                         ;
			string    text            = "Message text."                                                                                                 ;
			var       jsonString      = "{\"userId\":4,\"roomId\":\"55-178\",\"firstName\":\"John\",\"lastName\":\"Brawn\",\"text\":\"Message text.\"}" ;
			var       jsonTupleString = $"[{jsonString},10]";

			ITextChatMessage deserializedMessage = JsonConvert.DeserializeObject<TextChatMessage>(jsonString);

			Assert.AreEqual(userId   , deserializedMessage.UserId);
			Assert.AreEqual(roomId   , deserializedMessage.RoomId);
			Assert.AreEqual(firstName, deserializedMessage.FirstName);
			Assert.AreEqual(lastName , deserializedMessage.LastName);
			Assert.AreEqual(text     , deserializedMessage.Text);

			Assert.AreEqual((int)userId      , (int)deserializedMessage.UserId);
			Assert.AreEqual((string)roomId   , (string)deserializedMessage.RoomId);
			Assert.AreEqual((string)firstName, (string)deserializedMessage.FirstName);
			Assert.AreEqual((string)lastName , (string)deserializedMessage.LastName);

			var deserializedTuple = JsonConvert.DeserializeObject<Tuple<TextChatMessage, UserId>>(jsonTupleString, new TupleJsonArrayConverter());

			Assert.AreEqual(userId   , deserializedTuple.Item1.UserId);
			Assert.AreEqual(roomId        , deserializedTuple.Item1.RoomId);
			Assert.AreEqual(firstName     , deserializedTuple.Item1.FirstName);
			Assert.AreEqual(lastName      , deserializedTuple.Item1.LastName);
			Assert.AreEqual(text          , deserializedTuple.Item1.Text);
			Assert.AreEqual(new UserId(10), deserializedTuple.Item2);

		}

		[TestMethod]
		public void DeserializeTextChatMessageWithUserIdNullTest()
		{
			
			RoomId    roomId          = "55-178"                                                                                                        ;
			FirstName firstName       = "John"                                                                                                          ;
			LastName  lastName        = "Brawn"                                                                                                         ;
			string    text            = "Message text."                                                                                                 ;
			var       jsonString      = "{\"userId\":null,\"roomId\":\"55-178\",\"firstName\":\"John\",\"lastName\":\"Brawn\",\"text\":\"Message text.\"}" ;
			var       jsonTupleString = $"[{jsonString},10]";

			ITextChatMessage deserializedMessage = JsonConvert.DeserializeObject<TextChatMessage>(jsonString);

			Assert.AreEqual(new UserId(0), deserializedMessage.UserId);
			Assert.AreEqual(roomId       , deserializedMessage.RoomId);
			Assert.AreEqual(firstName    , deserializedMessage.FirstName);
			Assert.AreEqual(lastName     , deserializedMessage.LastName);
			Assert.AreEqual(text         , deserializedMessage.Text);

			Assert.AreEqual(0                , (int)deserializedMessage.UserId);
			Assert.AreEqual((string)roomId   , (string)deserializedMessage.RoomId);
			Assert.AreEqual((string)firstName, (string)deserializedMessage.FirstName);
			Assert.AreEqual((string)lastName , (string)deserializedMessage.LastName);

			var deserializedTuple = JsonConvert.DeserializeObject<Tuple<TextChatMessage, UserId>>(jsonTupleString, new TupleJsonArrayConverter());

			Assert.AreEqual(new UserId(0) , deserializedTuple.Item1.UserId);
			Assert.AreEqual(roomId        , deserializedTuple.Item1.RoomId);
			Assert.AreEqual(firstName     , deserializedTuple.Item1.FirstName);
			Assert.AreEqual(lastName      , deserializedTuple.Item1.LastName);
			Assert.AreEqual(text          , deserializedTuple.Item1.Text);
			Assert.AreEqual(new UserId(10), deserializedTuple.Item2);

		}


		[TestMethod]
		public void DeserializeTextChatMessageWithoutUserIdNullTest()
		{
			
			RoomId    roomId          = "55-178"                                                                                                        ;
			FirstName firstName       = "John"                                                                                                          ;
			LastName  lastName        = "Brawn"                                                                                                         ;
			string    text            = "Message text."                                                                                                 ;
			var       jsonString      = "{\"roomId\":\"55-178\",\"firstName\":\"John\",\"lastName\":\"Brawn\",\"text\":\"Message text.\"}" ;
			var       jsonTupleString = $"[{jsonString},10]";

			ITextChatMessage deserializedMessage = JsonConvert.DeserializeObject<TextChatMessage>(jsonString);

			Assert.AreEqual(null, deserializedMessage.UserId);
			Assert.AreEqual(roomId       , deserializedMessage.RoomId);
			Assert.AreEqual(firstName    , deserializedMessage.FirstName);
			Assert.AreEqual(lastName     , deserializedMessage.LastName);
			Assert.AreEqual(text         , deserializedMessage.Text);

			Assert.AreEqual(null             , deserializedMessage.UserId);
			Assert.AreEqual((string)roomId   , (string)deserializedMessage.RoomId);
			Assert.AreEqual((string)firstName, (string)deserializedMessage.FirstName);
			Assert.AreEqual((string)lastName , (string)deserializedMessage.LastName);

			var deserializedTuple = JsonConvert.DeserializeObject<Tuple<TextChatMessage, UserId>>(jsonTupleString, new TupleJsonArrayConverter());

			Assert.AreEqual(null          , deserializedTuple.Item1.UserId);
			Assert.AreEqual(roomId        , deserializedTuple.Item1.RoomId);
			Assert.AreEqual(firstName     , deserializedTuple.Item1.FirstName);
			Assert.AreEqual(lastName      , deserializedTuple.Item1.LastName);
			Assert.AreEqual(text          , deserializedTuple.Item1.Text);
			Assert.AreEqual(new UserId(10), deserializedTuple.Item2);

		}
	}
}
