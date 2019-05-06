
namespace Considerate.Hellolingo.GenericCommons {

	public class Success : NamedBool {
		public Success(bool value) : base(value) { }
		public Success(string value) : base(value) { }
		public static implicit operator Success(bool value) { return new Success(value); }
		public static implicit operator Success(string value) { return new Success(value); } // Needed for Json Deserialization
	}

	public class IsMatch : NamedBool {
		public IsMatch(bool value) : base(value) { }
		public IsMatch(string value) : base(value) { }
		public static implicit operator IsMatch(bool value) { return new IsMatch(value); }
		public static implicit operator IsMatch(string value) { return new IsMatch(value); } // Needed for Json Deserialization
	}

}

