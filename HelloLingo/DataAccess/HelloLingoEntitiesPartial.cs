using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Considerate.Hellolingo.DataAccess
{
	public partial class HellolingoEntities:IHellolingoEntities
	{
		public async Task<Mail[]> GetMailsToNotify(int count = 5) =>
			await Mails.Where(m => m.NotifyStatus == Enumerables.NotifyStatuses.ToNotify).OrderByDescending(m => m.ToId).Take(count).ToArrayAsync();

		public async Task TagUser(int userId, int tagId) {
			using (var db = new HellolingoEntities()) {
				var user = await db.Users.FindAsync(userId);
				var tagValue = await db.UsersTagsValues.FindAsync(tagId);
				user.Tags.Add(tagValue);
				await db.SaveChangesAsync();
			}
		}

		public async Task UntagUser(int userId, int tagId) {
			using (var db = new HellolingoEntities()) {
				var user = await db.Users.FindAsync(userId);
				var tagValue = await db.UsersTagsValues.FindAsync(tagId);
				user.Tags.Remove(tagValue);
				await db.SaveChangesAsync();
			}
		}
	}
}
