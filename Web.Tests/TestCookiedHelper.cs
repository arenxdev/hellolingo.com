using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web;
using Considerate.Hellolingo.WebApp.Helpers;
using Http.TestLibrary;

namespace Considerate.Hellolingo.WebApp.Tests {
	[TestClass]
	public class TestCookieHelper {

		private TestContext _testContextInstance;

		/// <summary>
		///Gets or sets the test context which provides
		///information about and functionality for the current test run.
		///</summary>
		public TestContext TestContext {
			get {
				return _testContextInstance;
			}
			set {
				_testContextInstance = value;
			}
		}
		
		#region Additional test attributes
		//
		// You can use the following additional attributes as you write your tests:
		//
		// Use ClassInitialize to run code before running the first test in the class
		[ClassInitialize()]
		public static void MyClassInitialize(TestContext testContext) { }
		//
		// Use ClassCleanup to run code after all tests in a class have run
		// [ClassCleanup()]
		// public static void MyClassCleanup() { }
		//
		// Use TestInitialize to run code before running each test 
		// [TestInitialize()]
		// public void MyTestInitialize() { }
		//
		// Use TestCleanup to run code after each test has run
		// [TestCleanup()]
		// public void MyTestCleanup() { }
		//
		#endregion

		[TestMethod]
		public void TestSetAndGetCookies()
		{
			using (new HttpSimulator("/", @"c:\inetpub\").SimulateRequest())
			{
				var request = HttpContext.Current.Request.RequestContext.HttpContext.Request;
				string result;
				
				// Test UiCulture Cookie
				CookieHelper.Set(CookieHelper.CookieNames.UiCulture, "fr", request);
				result = CookieHelper.GetValue(CookieHelper.CookieNames.UiCulture, request);
                Assert.AreEqual("fr", result);

				// Test DeviceTag Cookie
				CookieHelper.Set(CookieHelper.CookieNames.DeviceTag, 1L, request);
				result = CookieHelper.GetValue(CookieHelper.CookieNames.DeviceTag, request);
				Assert.AreEqual("1", result);

			}
		}

	}
}
