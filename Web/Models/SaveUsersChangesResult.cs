using System.Collections.Generic;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class SaveUsersChangesResult
	{
		public SaveUsersChangesResult(bool isChangesSaved, List<string> changedProperties = null)
		{
			IsChangesSaved = isChangesSaved;
			ChangedProperties = changedProperties;
		}
		public bool IsChangesSaved { get; private set; }
		public List<string> ChangedProperties { get; private set; }
		public bool MailInvalid { get; set; } = false;
	}
}