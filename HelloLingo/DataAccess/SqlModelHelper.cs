using System;
using System.Data.Entity.Core.Objects;

namespace Considerate.Hellolingo.DataAccess {
	public class SqlModelHelper
	{
		public static long GetNewDeviceTag() {
			using (HellolingoEntities db = new HellolingoEntities()) {
				var objParam = new ObjectParameter("newDeviceTag", typeof(long));
				db.Configuration_GetNewDeviceTag(objParam);
				return (long)objParam.Value;
			}
		}
		public static long GetNewSessionTag() {
			using (HellolingoEntities db = new HellolingoEntities())
			{
				var objParam = new ObjectParameter("newSessionTag", typeof(long));
				db.Configuration_GetNewSessionTag(objParam);
				return (long)objParam.Value;
			}
		}
	}
}
