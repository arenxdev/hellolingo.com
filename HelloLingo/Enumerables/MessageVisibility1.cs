


// ################################################################################################
// # This code is auto-generated                                                                  #
// ################################################################################################


using System.Runtime.Serialization;

namespace Considerate.Hellolingo.Enumerables
{
	[DataContract]
	public enum MessageVisibility
	{
		[EnumMember] Nobody = 0,
		[EnumMember] Everyone = 1,
		[EnumMember] Sender = 5,
		[EnumMember] News = 10,
		[EnumMember] Ephemeral = 11,
		[EnumMember] Moderators = 50,
		[EnumMember] System = 99
	}
}