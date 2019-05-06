using System.Globalization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading;
using System.Linq;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Tests {
	/// <summary>
	/// Summary description for CultureHelperTest
	/// </summary>
	[TestClass]
	public class TestMvcCultureHelper {

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
		// [ClassInitialize()]
		// public static void MyClassInitialize(TestContext testContext) { }
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
		public void TestGetCultureFromOptions()
		{
			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions(null, "da".Split(',')));
			Assert.AreEqual("xx", CultureHelper.GetCultureFromOptions(null, "da".Split(','), null, "xx"));
			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions(null, "".Split(',')));
			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions(null, null));

			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions("", "da,en;q=0.7".Split(','), null, "xx"));
			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions("", "da,en-gb;q=0.8,en;q=0.7".Split(','), null, "xx"));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("", "da,fr;q=0.8".Split(','), null, "xx"));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("", "da,fr-ch;q=0.8".Split(','), null, "xx"));

			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions("en", "da,en-gb;q=0.8,en;q=0.7".Split(',')));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("fr", "da,en-gb;q=0.8".Split(',')));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("fr-lu", "da,fr;q=0.8".Split(',')));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("fr-LU", "da,fr;q=0.8".Split(',')));

			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions("bogus", "da,en-gb;q=0.8,en;q=0.7".Split(',')));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("bogus", "da,fr-fr;q=0.8".Split(',')));
			Assert.AreEqual("fr", CultureHelper.GetCultureFromOptions("bogus", "da,fr;q=0.8".Split(',')));
			Assert.AreEqual("en", CultureHelper.GetCultureFromOptions("bogus", "".Split(',')));
		}

		[TestMethod]
		public void TestSetCurrentCulture()
		{
			// Test all target cultures for validity
			var targetCultures = CultureHelper.UserLangsToUiCultures.Values.Distinct();
			var validCultures = CultureInfo.GetCultures(CultureTypes.AllCultures);
			foreach (var targetCulture in targetCultures)
				Assert.IsTrue(validCultures.Any(validCulture => validCulture.Name == targetCulture),
					"Target culture {0} is not a valid culture", targetCulture);

			// Some additional tests because, as of this writing, only two target culture are supported
			CultureHelper.SetCurrentCultureInThread("pt-BR");
			Assert.AreEqual("pt-BR", Thread.CurrentThread.CurrentCulture.Name);
			Assert.AreEqual("pt-BR", Thread.CurrentThread.CurrentUICulture.Name);
			CultureHelper.SetCurrentCultureInThread("pt-br");
			Assert.AreEqual("pt-BR", Thread.CurrentThread.CurrentCulture.Name);
			Assert.AreEqual("pt-BR", Thread.CurrentThread.CurrentUICulture.Name);
		}
	}
}
