using System.Linq;
using Considerate.Hellolingo.DataAccess;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Considerate.Hellolingo.Tests {

	[TestClass]
	public class TestDatabase {

		[TestMethod]
		public void TestFind()
		{
			var db = new HellolingoEntities();
			var result = db.ListedUsers_GetBy(
				//Andriy: I made count 100, because test throws exception. I don't know, whether  this exception by intention or not.
				//Bernard: ^ Fixed: Entity Framework doesn't support default values for stored procedure parameters, so enforced it with a check in the stored procedure.
				count: null, 
				belowId: null, 
				knows: null, 
				learns: null, 
				firstName: null, 
				lastName: null, 
				country: null, 
				location: null,
				minAge: null,
				maxAge: null,
				tag: null
			);
			var list = result.ToList();
			Assert.AreNotEqual(0, list.Count);
		}

	}

}
