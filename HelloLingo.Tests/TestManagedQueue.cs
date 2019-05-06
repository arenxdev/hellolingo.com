using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Considerate.Helpers.Communication;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestManageQueue
	{

		// This is obsolete: ManagedQueue has been replaced by AckableQueue

		//[TestMethod]
		//public void ManageQueueTest()
		//{
		//	var message1 = "Message 1";
		//	var message2 = "Message 2";
		//	var message3 = "Message 3";
		//	var message4 = "Message 4";
		//	var eventQueue = new Queue<object>();
		//	List<QueuedMessage<string>> list;

		//	var managedQueue = new ManagedQueue<string>((e) => { Assert.Fail(); });
		//	managedQueue.OnMessages += (msg) => { eventQueue.Enqueue(msg); };
		//	managedQueue.OnAllAcknowledged += (wasRetrying) => { eventQueue.Enqueue("AllDone"); };
		//	managedQueue.OnMaxDelayReached += () => { eventQueue.Enqueue("MaxDelayReached"); };
		//	managedQueue.OnRetryToDeliver += (messages) => { eventQueue.Enqueue("RetryToDeliver"); };
		//	managedQueue.OnUnexpectedAckOrderId += (a, b) => { eventQueue.Enqueue("UnexpectedAckOrderId"); };

		//	// 1. Send + Ack
		//	managedQueue.Enqueue(message1);
		//	managedQueue.Ack(orderId: 1);

		//	list = (List<QueuedMessage<string>>) eventQueue.Dequeue();
		//	Assert.AreEqual(1, list.Count);
		//	Assert.AreEqual(message1, list[0].Message);
		//	Assert.AreEqual(1, list[0].OrderId);
		//	Assert.AreEqual("AllDone", (string)eventQueue.Dequeue());
		//	Assert.AreEqual(0, eventQueue.Count);

		//	// 2. Send, Send, Send, Ack, Ack
		//	managedQueue.Enqueue(message2);
		//	managedQueue.Enqueue(message3);
		//	managedQueue.Enqueue(message4);
		//	managedQueue.Ack(orderId: 2);
		//	managedQueue.Ack(orderId: 4);

		//	list = (List<QueuedMessage<string>>)eventQueue.Dequeue();
		//	Assert.AreEqual(message2, list[0].Message);
		//	list = (List<QueuedMessage<string>>)eventQueue.Dequeue();
		//	Assert.AreEqual(message3, list[0].Message);
		//	list = (List<QueuedMessage<string>>)eventQueue.Dequeue();
		//	Assert.AreEqual(message4, list[0].Message);
		//	Assert.AreEqual("AllDone", (string)eventQueue.Dequeue());
		//	Assert.AreEqual(0, eventQueue.Count);

		//}

	}

}
