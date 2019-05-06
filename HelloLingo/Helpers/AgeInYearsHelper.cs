using System;

namespace Considerate.Helpers
{
	public static class AgeInYearsHelper
	{
		public static int GetAgeFrom(int year, short month) => new DateTime(year, month, 1).GetAgeInYears();

		public static int GetAgeInYears(this DateTime fromDate) => fromDate.GetAgeInYears(DateTime.Now);
		public static int GetAgeInYears(this DateTime dateOfBirth, DateTime dateFor) {
			DateTime zeroTime = new DateTime(1, 1, 1);
			TimeSpan span = dateFor - dateOfBirth;

			// because we start at year 1 for the Gregorian 
			// calendar, we must subtract a year here.
			int years = (zeroTime + span).Year - 1;
			return years;
		}
	}
}
