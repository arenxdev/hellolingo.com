using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo;
using Considerate.Helpers.JsonConverters;
using Newtonsoft.Json;

namespace Considerate.Helpers {
	namespace Communication {
		// Help to guarantee messages are delivered, and in the right order.
		// To consume this:
		//	 1. Queue message with Enqueue()
		//	 2. Listen to OnMessage event to know what has to be delivered
		//	 3. Acknowledge successful delivery with Ack()
		//   4. Request Queue to resend whichever message you're missing, if needed
		// AckableQueue doesn't to send messages by itself when they aren't acked.
		// AckableQueue will emit an overflow event if it overflows

		[JsonObject(MemberSerialization.OptIn)]
		public class AckableQueue<T> {

			private object thisLock = new object();
			private const int MaxQueueLength = 1000;

			public event Action<List<QueuedMessage<T>>> OnMessages;
			public event Action<OrderId, string> OnUnexpectedAckOrderId;
			public event Action<string> OnUnexpectedResendOrderIds;
			public event Action OnQueueOverflow;

			[JsonProperty] public List<QueuedMessage<T>> Queue { get; private set; } = new List<QueuedMessage<T>>();
			public int NextOrderId { get; private set; } = 1;
			public int LowestQueuedOrderId => NextOrderId - Queue.Count;
			public int HighestQueuedOrderId => NextOrderId - 1;
			public int LatestAckedOrderId { get; private set; } = 0;
			public bool AllAcked => Queue.Count == 0;

			[JsonConstructor]
			public AckableQueue() { }

			public void Reset() {
				lock (thisLock) {
					NextOrderId = 1;
					Queue.Clear();
				}
			}

			public void Enqueue(T message) {
				if (OnMessages == null) throw new LogReadyException(LogTag.OnMessagesListenerRequired);
				if (OnQueueOverflow == null) throw new LogReadyException(LogTag.OnQueueOverflowListenerRequired);
				if (Queue.Count > MaxQueueLength) { OnQueueOverflow.Invoke(); return; }

				lock (thisLock) {
					Queue.Add(new QueuedMessage<T> {
						OrderId = NextOrderId++,
						Message = message
					});
					OnMessages.Invoke(Queue.Skip(Queue.Count - 1).ToList());
				}
			}

			public void RequestResend(OrderId[] orderIds) {
				lock (thisLock) {
					if (OnMessages == null) throw new LogReadyException(LogTag.OnMessagesListenerRequired);
					if (OnUnexpectedResendOrderIds == null) throw new LogReadyException(LogTag.OnUnexpectedResendOrderIdListenerRequired);

					// Collect and send messages to resend
					var messagesToResend = Queue.Where(msg => orderIds.Contains<OrderId>(msg.OrderId)).ToList();
					OnMessages.Invoke(messagesToResend);

					// If we're missing one or more requested messages, something is deeply wrong somewhere
					var missingIds = orderIds.Where(id => messagesToResend.All(msg => msg.OrderId != id)).Select(r => r.Value).ToArray();
					if (missingIds.Length != 0) OnUnexpectedResendOrderIds.Invoke($"Ids [{string.Join(",", missingIds)}] not in existing Ids {string.Join(",", Queue.Select(msg => msg.OrderId))}");
				}
			}

			public void Ack(OrderId orderId) {
				lock (thisLock) {
					if (OnUnexpectedAckOrderId == null) throw new LogReadyException(LogTag.OnUnexpectedAckOrderIdListenerRequired);
					if (orderId == LatestAckedOrderId) return; // No need to ack this again
					LatestAckedOrderId = orderId;

					// Clean queue
					if (orderId >= LowestQueuedOrderId && orderId <= HighestQueuedOrderId) 
						Queue = Queue.Where(m => m.OrderId > orderId).ToList();
					else { // Report off-range orderid
						var cause = Queue.Count == 0 ? "Queue is Empty" : $"OrderId {orderId} not in {LowestQueuedOrderId}-{HighestQueuedOrderId} range";
						OnUnexpectedAckOrderId.Invoke(orderId, cause);
					}
				}
			}
		}

		[JsonObject(MemberSerialization.OptIn)]
		public class QueuedMessage<T> {
			[JsonProperty("orderId")] public int OrderId { get; set; }
			[JsonProperty("message")] public T Message { get; set; }
			public DateTime SubmittedTime = DateTime.Now;
		}

		[JsonConverter(typeof(OrderIdToIntConverter))]
		public class OrderId : NamedInt {
			public OrderId(int value) : base(value) { }
			public OrderId(string value) : base(value) { }
			public static implicit operator OrderId(int value) { return new OrderId(value); }
			public static implicit operator OrderId(string value) { return new OrderId(value); } // Needed for Json Deserialization
		}
	}
}
