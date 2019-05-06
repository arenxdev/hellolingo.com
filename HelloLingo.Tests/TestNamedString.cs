using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web;
using Considerate.Helpers;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestNamedString {

		public class MyFirstType : NamedString {
			public MyFirstType(string value) : base(value) { }
			public static implicit operator MyFirstType(string val) { return new MyFirstType(val); }
		}

		public class MySecondType : NamedString
		{
			public MySecondType(string value) : base(value) { }
			public static implicit operator MySecondType(string val) { return new MySecondType(val); }
		}

		[TestMethod]
		public void NamedString()
		{
			MyFirstType varA = "Hello";
			MySecondType varB = "Hello";
			MyFirstType varC = "Hi";
			MyFirstType varD = "Hello";
			MyFirstType varE = varA;

            Assert.AreEqual(varA, "Hello");
			Assert.AreNotEqual(varA, varB);
			Assert.AreEqual(varA.ToString(), "Hello");

			Assert.IsTrue(varA.Equals(varB));
			Assert.IsTrue(varA.Equals(varB));

			Assert.IsTrue(varA == varB);
			Assert.IsTrue(varA == "Hello");
			Assert.IsTrue(varA.ToString() == "Hello");

			Assert.IsTrue(varA != varC);
			Assert.IsTrue(varA != "Bye");
			Assert.IsTrue(varA.ToString() != "Bye");

			Assert.IsFalse(ReferenceEquals(varA, varD));
			Assert.IsTrue(ReferenceEquals(varA, varE));

			Assert.AreNotEqual(typeof (MyFirstType), typeof (MySecondType));
		}

	}

}
