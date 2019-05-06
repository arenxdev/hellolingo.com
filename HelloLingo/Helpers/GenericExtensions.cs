using System;
using System.Linq;
using System.Threading.Tasks;

namespace Considerate.Helpers {

	public static class Extensions {

		public static bool In<T>(this T item, params T[] items) => items?.Contains(item) ?? false;
		public static bool NotIn<T>(this T item, params T[] items) => !items?.Contains(item) ?? true;

		// Use this extension if you want to make sure an async task is fired and the code immediately continues without waiting for it
		// But don't use it, because if there is an issue, it will raise an UnobservedTaskException with little context for you to figure out where this error comes from.
		public static void Forget(this Task task) { }

		public static T ToEnum<T>(this int enumInt) {
			if (!Enum.IsDefined(typeof (T), enumInt))
				throw new Exception($"Integer Enum '{enumInt}' is not defined.");
			return (T) Enum.ToObject(typeof(T), enumInt);
		}

	}

}

