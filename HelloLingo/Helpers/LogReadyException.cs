using System;
using Considerate.Hellolingo;
using Newtonsoft.Json;

namespace Considerate.Helpers {

	public class LogReadyException: Exception
	{
		private static string TagDataToString(LogTag tag, object data) => tag + (data == null ? "" : " = " + JsonConvert.SerializeObject(data));

		public LogReadyException(LogTag logTag, object data = null) : base(TagDataToString(logTag, data)) { }
	}

}

