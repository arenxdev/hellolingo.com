using System;
using Considerate.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests
{
	[TestClass]
	public class TestAgeHelper
	{
		[TestMethod]
		public void TestGetAgeInYears()
		{
			DateTime currentDate = new DateTime(2016,3,7);

			DateTime dOfBirth1 = new DateTime(1980,2,1);
			Assert.AreEqual(36, dOfBirth1.GetAgeInYears(currentDate));

			DateTime dOfBirth2 = new DateTime(1980,1,1);
			Assert.AreEqual(36, dOfBirth2.GetAgeInYears(currentDate));

			DateTime dOfBirth3 = new DateTime(1980,3,1);
			Assert.AreEqual(36, dOfBirth3.GetAgeInYears(currentDate));

			DateTime dOfBirth4 = new DateTime(1980,4,1);
			Assert.AreEqual(35, dOfBirth4.GetAgeInYears(currentDate));

		}
	}
}
