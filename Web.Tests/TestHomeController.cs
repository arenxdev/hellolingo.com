using System.Web.Mvc;
using Considerate.Hellolingo.WebApp.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.WebApp.Tests.Controllers {
	[TestClass]
	public class TestHomeController {
		//[TestMethod]
		//[Ignore] // CAN TEST BECAUSE THERE IS NO REAL HTTPREQUEST, SO NO COOKIES... SIGNS OF BAD DESIGN :-(
		public void Index() {
			// Arrange
			HomeController controller = new HomeController();

			// Act
			ViewResult result = controller.Index() as ViewResult;

			// Assert
			Assert.IsNotNull(result);
		}

	}
}
