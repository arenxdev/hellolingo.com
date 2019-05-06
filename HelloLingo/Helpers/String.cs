using System;
using System.Web;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Considerate.Helpers {

    public static class String {

		// Don't initialize this close to where you use it (like in RandomString, 
		// because you could get the same result for difference instances)!!!
		private static readonly Random Random = new Random();

		public static string ToProper(string input) {
			return Regex.Replace(input, @"\b[a-z]", m => m.Value.ToUpper());
		}

		public static string RemoveAllCrLfs(string input) {
			return Regex.Replace(input, "[\n\r]", string.Empty); // remove all carriage return and line feed
		}

		public static string CleanExcessiveSpacing(string input) {
			return Regex.Replace(input, " +", " ");
		}

		public static string SetFirstCharToUpper(string input) {
			return input.First().ToString().ToUpper() + input.Substring(1);
		}

		public static string RandomText(int wordCount = 10) {
			string[] strings = {"Hello!", "My", "Name", "Is", "Alice", "Bob.", "Carol.", "Denis.", "How", "Are", "Things", "Going?"};
			var results = Enumerable.Repeat(strings, wordCount).Select(s => s[Random.Next(s.Length)]).ToArray();
			return results.Aggregate((current, next) => $"{current} {next}");
		}

		public static string RandomString(int length = 10) {
			const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var random = new Random();
			return new string(Enumerable.Repeat(chars, length)
			  .Select(s => s[random.Next(s.Length)]).ToArray());
		}
	}

}

