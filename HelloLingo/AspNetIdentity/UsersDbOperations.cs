using System.Data.Entity;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.AspNetIdentity
{
	public class UsersDbOperations
	{
		// Not used 
		//public async Task<AspNetUser> UpdateUserWithAspNetUserId(AspNetUser aspNetUser, int userId)
		//{
		//	using (var db = new HelloLingoEntities())
		//	{
		//		var user = await db.Users.FindAsync(userId);
		//		if (user == null) return null;
		//		aspNetUser.Users = new[] {user};
		//		db.Entry(aspNetUser).State = EntityState.Modified;
		//		await db.SaveChangesAsync();
		//		return aspNetUser;
		//	}
		//}
	}
}