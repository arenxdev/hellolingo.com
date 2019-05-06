using System;
using Considerate.Helpers;

namespace Considerate.Hellolingo.DataAccess {

	// PublicUserLight carries less info than the full-blown PublicUser and is more suitable for being displayed in lists

	public class PublicUserLight {

		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Gender { get; set; }
		public int? Age { get; set; }
		public byte Country { get; set; }
		public byte Knows { get; set; }
		public byte Learns { get; set; }
		public byte? Learns2 { get; set; }
		public byte? Knows2 { get; set; }

		public PublicUserLight(User user) {
			Id = user.Id;
			FirstName = user.FirstName;
			LastName = user.LastName;
			Gender = user.Gender;
			Age = AgeInYearsHelper.GetAgeFrom(user.BirthYear, user.BirthMonth);
			Country = user.CountryId;
			Knows = user.KnowsId;
			Learns = user.LearnsId;
			Knows2 = user.Knows2Id;
			Learns2 = user.Learns2Id;
		}

	}

}
