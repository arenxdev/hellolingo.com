using System.Linq;
using Considerate.Hellolingo.Enumerables;
using Considerate.Helpers;

namespace Considerate.Hellolingo.DataAccess {

	public partial class PublicUser {

		public PublicUser() { }
		public PublicUser(User user)
		{
			Id = user.Id;
			FirstName = user.FirstName;
			LastName = user.LastName;
			Gender = user.Gender;
			Age = AgeInYearsHelper.GetAgeFrom(user.BirthYear, user.BirthMonth);
			Country = user.CountryId;
			Location = user.Location;
			Knows = user.KnowsId;
			Learns = user.LearnsId;
			Knows2 = user.Knows2Id;
			Learns2 = user.Learns2Id;
			Introduction = user.Introduction;
			IsSharedTalkMember = user.Tags.Any(t => t.Id == UserTags.FormerSharedTalkMember); // Show SharedTalk members to other SharedTalk members only
			IsLivemochaMember = user.Tags.Any(t => t.Id == UserTags.LivemochaMember); // Show Livemocha members to other Livemocha members only
			IsSharedLingoMember = user.Tags.Any(t => t.Id == UserTags.SharedLingoMember); // Show Livemocha members to other Livemocha members only
		}

		public byte? Learns2 { get; set; }
		public byte? Knows2 { get; set; }
		public bool IsSharedTalkMember { get; set; }
		public bool IsLivemochaMember { get; set; }
		public bool IsSharedLingoMember { get; set; }
	}

}
