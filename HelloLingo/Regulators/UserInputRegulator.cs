using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Considerate.Helpers;

namespace Considerate.Hellolingo.Regulators
{
	public class UserInputRegulator
	{

		public class RegexSet {
			public string Name { get; }
			private Regex MatchingRegex { get; }
			private List<Regex> ExclusionRegexes { get; }

			public RegexSet(string name, string regexString, List<string> exclusions = null) {
				Name = name;
				MatchingRegex = new Regex(regexString, RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

				if (exclusions != null) {
					ExclusionRegexes = new List<Regex>();
					foreach (var s in exclusions)
						ExclusionRegexes.Add(new Regex(s));
				}
			}

			public bool IsMatch(string stringToTest)
			{
				var isMatch = MatchingRegex.IsMatch(stringToTest);
				return isMatch && (!ExclusionRegexes?.Any(excluded => excluded.IsMatch(stringToTest)) ?? true);
			}
		}

		public static string CleanExcessiveUppercases(string input, int pardonedUppercase = 2, decimal maxUppercaseRatio = 0.5m)
		{
			var maxUppercase = input.Length*maxUppercaseRatio + pardonedUppercase;
			var uppercases = 0;
			foreach (var c in input) {
				if (char.IsUpper(c)) uppercases++;
				if (uppercases > maxUppercase)
					return input.ToLowerInvariant();
			}
			return input;
		}

		/// <summary>
		///	Convert {maxRepetition}+ same characters into {reduceTo} characters. e.g. ({reduceTo}=2): Hiiiiiii => Hii
		/// </summary>
		public static string PreventRepetitiveCharacters(string input, int maxRepetition = 3, int reduceTo = 3)
		{
			var sb = new StringBuilder();
			var previousLowerCaseChar = new char();
			var currentSequence = ""; // Hold the current sequence of identical characters 
			var count = 0;
			var skipMode = false;
			foreach (var currentChar in input)
			{
				if (@"\/".Contains(currentChar)) skipMode = true; // It means we're in what looks to be a url. We need to skip modifications until the end of it
				if (@" .".Contains(currentChar)) skipMode = false; // We're out of the url. Let's process things again

				var currentLowercaseChar = char.ToLower(currentChar);
				if (!skipMode && !char.IsDigit(currentChar) && currentLowercaseChar == previousLowerCaseChar) {
					currentSequence += currentChar;
					count++;
				} else {
					sb.Append(count > maxRepetition ? currentSequence.Substring(0, reduceTo) : currentSequence);
					currentSequence = currentChar.ToString();
					count = 1;
					previousLowerCaseChar = currentLowercaseChar;
				}
			}
			sb.Append(count > maxRepetition ? currentSequence.Substring(0, reduceTo) : currentSequence);
			return sb.ToString();

			// Some c++ code could do magic here if we need performamnce. e.g.:
			//fixed (char* pString = longString)
			//{
			//	char* pChar = pString;
			//	for (int i = 0; i < strLength; i++) {
			//		c = *pChar;
			//		pChar++;
			//	}
			//}
		}

		private static string NormalizeSignUpInputs(string str)
		{
			var result = PreventRepetitiveCharacters(str);
			result = String.CleanExcessiveSpacing(result);
			result = CleanExcessiveUppercases(result);
			result = String.SetFirstCharToUpper(result);
			return result;
		}

		public static string CleanSignUpFirstName(string firstName)
		{
			var trimmed = firstName.Trim(' ', '\\', '-');
			if (string.IsNullOrEmpty(trimmed) || string.IsNullOrWhiteSpace(trimmed))
				return null;

			var result = NormalizeSignUpInputs(trimmed);
			return result;
		}

		public static string CleanSignUpLastName(string lastName)
		{
			var trimmed = lastName.TrimEnd(' ', '-');
			trimmed = trimmed.TrimStart('.', ' ', '-');
			if (string.IsNullOrEmpty(trimmed) || string.IsNullOrWhiteSpace(trimmed))
			{
				return null;
			}
			var result = NormalizeSignUpInputs(trimmed);
			return result;
		}

		public static string CleanSignUpLocation(string location)
		{
			var result = location.TrimStart('.', ',', '\'', '(', ')', '&', ' ', '\\', '-')
								 .TrimEnd(',', '\'', '(', '&', ' ', '\\', '-');

			result = new Regex(@"\.\.+$").Replace(result, "."); // Remove multiple dots at the end of the string

			if (string.IsNullOrWhiteSpace(result)) return null;

			return NormalizeSignUpInputs(result);
		}
	}
}
