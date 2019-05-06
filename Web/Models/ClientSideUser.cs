namespace Considerate.Hellolingo.WebApp.Models
{
	public class ClientSideUser
	{
		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Gender { get; set; }
		public byte BirthMonth { get; set; }
		public int BirthYear { get; set; }

		public int Age      { get; set; }

		public byte Country { get; set; }
		public string Location { get; set; }

		public byte Learns { get; set; }
		public byte? Learns2 { get; set; }
		public byte? Learns3 { get; set; }
		
		public byte Knows { get; set; }
		public byte? Knows2 { get; set; }
		public byte? Knows3 { get; set; }

		public bool LookToLearnWithTextChat { get; set; }
		public bool LookToLearnWithVoiceChat { get; set; }
		public bool LookToLearnWithGames { get; set; }
		public bool LookToLearnWithMore { get; set; }

		public string Introduction { get; set; }

		public bool WantsToHelpHellolingo { get; set; }
		public bool IsSharedTalkMember { get; set; }
		public bool IsLivemochaMember { get; set; }
		public bool IsSharedLingoMember { get; set; }

		public bool IsEmailConfirmed { get; set; }
		public int UnreadMessagesCount { get; set; }
		public bool IsNoPrivateChat { get; set; }
	}
}