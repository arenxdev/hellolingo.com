using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestCountedString {

		public class MyMessageFragment : CountedString {
			public MyMessageFragment(string value) : base(value) { }
			public static implicit operator MyMessageFragment(string val) { return new MyMessageFragment(val); }
		}

		[TestMethod]
		public void CountedString()
		{
			CountedString countedString = "Hello";
			AssertCountedString(countedString);

			MyMessageFragment messageFragment = "Hello";
			AssertCountedString(messageFragment);
		}

		private static void AssertCountedString(CountedString countedString)
		{
			var eventQueue = new Queue<string>();
			countedString.OnIncremented += (str) => eventQueue.Enqueue($"'{str.GetWithoutCounting()}' used {str.UsageCount} time(s)");

			Assert.AreEqual(0, countedString.UsageCount);
			Assert.AreEqual("Hello World!", countedString + " World!");
			Assert.AreEqual(1, countedString.UsageCount);
			Assert.AreEqual("'Hello' used 1 time(s)", eventQueue.Dequeue());
			Assert.AreEqual("Hello World!", countedString + " World!");
			Assert.AreEqual(2, countedString.UsageCount);
			Assert.AreEqual("'Hello' used 2 time(s)", eventQueue.Dequeue());
			Assert.AreEqual("Hello World!", countedString + " World!");
			Assert.AreEqual(3, countedString.UsageCount);
			Assert.AreEqual("'Hello' used 3 time(s)", eventQueue.Dequeue());
			Assert.AreEqual("Hello World!", countedString + " World!");
			Assert.AreEqual(4, countedString.UsageCount);
			Assert.AreEqual("'Hello' used 4 time(s)", eventQueue.Dequeue());
			Assert.AreEqual("Hello World!", countedString.GetWithoutCounting() + " World!");
			Assert.AreEqual(4, countedString.UsageCount);
			Assert.AreEqual(0, eventQueue.Count);
		}
	}

}
