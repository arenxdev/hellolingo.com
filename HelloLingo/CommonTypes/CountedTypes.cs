using System;
using System.Diagnostics;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers.JsonConverters;
using Newtonsoft.Json;

namespace Considerate.Hellolingo {

	[JsonConverter(typeof(ToStringConverter))]
	public class CountedString : NamedString {

		public event Action<CountedString> OnIncremented;

		public CountedString(string val) : base(val) { }
		public static implicit operator CountedString(string val) { return new CountedString(val); }

		public int UsageCount { get; private set; }

		internal override string Value {
			get {
				UsageCount++;
				OnIncremented?.Invoke(this);
				return base.Value;
			}
		}

		public string GetWithoutCounting() {
			return base.Value;
		}

	}
}