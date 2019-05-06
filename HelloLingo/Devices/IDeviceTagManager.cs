using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Considerate.Hellolingo.UserCommons;

namespace Considerate.Hellolingo.Management
{
	public interface IDeviceTagManager
	{
		Task LinkDeviceToUser(long deviceTag, int userId);
	}
}
