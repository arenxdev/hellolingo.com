using System;
using Considerate.Helpers.JsonConverters;
using Newtonsoft.Json;

namespace Considerate.Hellolingo {

	[JsonConverter(typeof(ToStringConverter))]
	public class NamedBool : IComparable<bool>, IEquatable<bool>
	{
		internal virtual bool Value { get; }

		protected NamedBool() { }
		protected NamedBool(bool val) { Value = val; }
		protected NamedBool(string val) { Value = val == bool.TrueString; }

		public static implicit operator bool (NamedBool val) { return val.Value; }

		public static bool operator ==(NamedBool a, bool b) { return a?.Value == b; }
		public static bool operator ==(NamedBool a, NamedBool b) { return a?.Value == b?.Value; }
		public static bool operator !=(NamedBool a, bool b) { return !(a == b); }
		public static bool operator !=(NamedBool a, NamedBool b) { return !(a == b); }

		public bool Equals(bool other) { return Equals(new NamedBool(other)); }
		public override bool Equals(object other) {
			if ((other.GetType() != GetType() && other.GetType() != typeof(bool))) return false;
			return Equals(new NamedBool(other.ToString()));
		}
		private bool Equals(NamedBool other) {
			if (ReferenceEquals(null, other)) return false;
			if (ReferenceEquals(this, other)) return true;
			return string.Equals(Value, other.Value);
		}

		public int CompareTo(bool other) { return (this.Value == other) ? 0 : 1; }
		public int CompareTo(NamedBool other) { return this.Value == other.Value ? 0 : 1; }

		public override int GetHashCode() { return Value ? 0 : 1; }

		public override string ToString() { return Value ? bool.TrueString : bool.FalseString; }
	}

	[JsonConverter(typeof(ToStringConverter))]
	public class NamedString : IComparable<string>, IEquatable<string>
	{
		internal virtual string Value { get; }

		protected NamedString() { }
		protected NamedString(string val) { Value = val; }

		public static implicit operator string (NamedString val) { return val.Value; }

		public static bool operator ==(NamedString a, string b) { return a?.Value == b; }
		public static bool operator ==(NamedString a, NamedString b) { return a?.Value == b?.Value; }
		public static bool operator !=(NamedString a, string b) { return !(a == b); }
		public static bool operator !=(NamedString a, NamedString b) { return !(a == b); }

		public bool Equals(string other) { return Equals(new NamedString(other)); }
		public override bool Equals(object other) {
			if ((other.GetType() != GetType() && other.GetType() != typeof(string))) return false;
			return Equals(new NamedString(other.ToString()));
		}
		private bool Equals(NamedString other) {
			if (ReferenceEquals(null, other)) return false;
			if (ReferenceEquals(this, other)) return true;
			return string.Equals(Value, other.Value);
		}

		public int CompareTo(string other) { return string.CompareOrdinal(this.Value, other); }
		public int CompareTo(NamedString other) { return string.CompareOrdinal(this.Value, other.Value); }

		public override int GetHashCode() { return Value?.GetHashCode() ?? 0; }

		public override string ToString() { return Value; }
	}

	[JsonConverter(typeof(ToStringConverter))]
	public class NamedInt : IComparable<int>, IEquatable<int>
	{
		internal int Value { get; }

		protected NamedInt() { }
		protected NamedInt(int val) { Value = val; }
		protected NamedInt(string val) { Value = Convert.ToInt32(val); }

		public static implicit operator int (NamedInt val) { return val.Value; }

		public static bool operator ==(NamedInt a, int b) { return a?.Value == b; }
		public static bool operator ==(NamedInt a, NamedInt b) { return a?.Value == b?.Value; }
		public static bool operator !=(NamedInt a, int b) { return !(a==b); }
		public static bool operator !=(NamedInt a, NamedInt b) { return !(a==b); }

		public bool Equals(int other) { return Equals(new NamedInt(other)); }
		public override bool Equals(object other) {
			if ((other.GetType() != GetType() && other.GetType() != typeof(string))) return false;
			return Equals(new NamedInt(other.ToString()));
		}
		private bool Equals(NamedInt other) {
			if (ReferenceEquals(null, other)) return false;
			if (ReferenceEquals(this, other)) return true;
			return Equals(Value, other.Value);
		}

		public int CompareTo(int other) { return Value - other; }
		public int CompareTo(NamedInt other) { return Value - other.Value; }

		public override int GetHashCode() { return Value.GetHashCode(); }

		public override string ToString() { return Value.ToString(); }
	}

	[JsonConverter(typeof(ToStringConverter))]
	public class NamedLong : IComparable<long>, IEquatable<long> {

		internal long Value { get; }

		protected NamedLong() { }
		protected NamedLong(long val) { Value = val; }
		protected NamedLong(string val) { Value = Convert.ToInt64(val); }

		public static implicit operator long (NamedLong val) { return val.Value; }

		public static bool operator ==(NamedLong a, long b) { return a?.Value == b; }
		public static bool operator ==(NamedLong a, NamedLong b) { return a?.Value == b?.Value; }
		public static bool operator !=(NamedLong a, long b) { return !(a==b); }
		public static bool operator !=(NamedLong a, NamedLong b) { return !(a==b); }

		public bool Equals(long other) { return Equals(new NamedLong(other)); }
		public override bool Equals(object other) {
			if ((other.GetType() != GetType() && other.GetType() != typeof(string))) return false;
			return Equals(new NamedLong(other.ToString()));
		}
		private bool Equals(NamedLong other) {
			if (ReferenceEquals(null, other)) return false;
			if (ReferenceEquals(this, other)) return true;
			return Equals(Value, other.Value);
		}

		public int CompareTo(long other) { var result = Value - other; return (result < 0) ? -1 : (result == 0 ? 0 : 1); }
		public int CompareTo(NamedLong other) { var result = Value - other.Value; return (result < 0) ? -1 : (result == 0 ? 0 : 1); }

		public override int GetHashCode() { return Value.GetHashCode(); }
		
		public override string ToString() { return Value.ToString(); }
	}

}