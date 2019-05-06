using System.Collections.Generic;
using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class UserProfileChangedData
	{
		public UsersChanges ChangedValues { get; set; }
		public List<string> ChangedProperties { get; set; }
		public bool IsTagsUpdated { get; set; }
		public bool IsEmailValid { get; set; } = true;
	}
}