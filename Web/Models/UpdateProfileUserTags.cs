using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Considerate.Hellolingo.Enumerables;

namespace Considerate.Hellolingo.WebApp.Models
{
	class UpdateProfileUserTags
	{
		public static int [ ] Tags => new [ ]
		{
			UserTags.LookToLearnWithGames,
			UserTags.LookToLearnWithMore,
			UserTags.LookToLearnWithTextChat,
			UserTags.LookToLearnWithVoiceChat,
			UserTags.WantsToHelpHellolingo
		};
	}
}
