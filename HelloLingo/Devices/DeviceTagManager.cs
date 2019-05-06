 using System.Data.Entity.Migrations;
using System.Linq;
using System.Threading.Tasks;
 using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.Management
{
    public class DeviceTagManager:IDeviceTagManager
    {
		public async Task LinkDeviceToUser(long deviceTag, int userId) {
			// Store in database
			using (var db = new HellolingoEntities()) {
				db.UsersDevices.AddOrUpdate(new UsersDevice {DeviceTag = deviceTag, UserId = userId, LastIPV4  = 0L});
				await db.SaveChangesAsync();
			}
		}

	}
}
