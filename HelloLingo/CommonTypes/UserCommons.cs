
using System;
using Considerate.Helpers.JsonConverters;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.UserCommons
{
	public class FirstName : NamedString {
		public FirstName(string value) : base(value) { }
		public static implicit operator FirstName(string value) { return new FirstName(value); }
	}

	public class LastName : NamedString {
		public LastName(string value) : base(value) { }
		public static implicit operator LastName(string value) { return new LastName(value); }
	}

	public class LangId : NamedInt {
		public LangId(int value) : base(value) { }
		public LangId(string value) : base(value) { }
		public static implicit operator LangId(int value) { return new LangId(value); }
		public static implicit operator LangId(string value) { return new LangId(value); } // Needed for Json Deserialization
	}

	[JsonConverter(typeof(UserIdToIntConverter))]
	public class UserId : NamedInt {
		public UserId(int value) : base(value) { }
		public UserId(string value) : base(value) { }
		public static implicit operator UserId(int value) { return new  UserId(value); }
		public static implicit operator UserId(string value) { return new UserId(value); } // Needed for Json Deserialization
	}

	public class DeviceTag : NamedLong {
		public DeviceTag(long value) : base(value) { }
		public static implicit operator DeviceTag(long value) { return new DeviceTag(value); }
	}

	public class Propagate : NamedBool {
		public Propagate(bool value) : base(value) { }
		public static implicit operator Propagate(bool value) { return new Propagate(value); }
	}

}

