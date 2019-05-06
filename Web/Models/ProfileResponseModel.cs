using System.Collections.Generic;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class ProfileResponseModel:LoginResponseModel
	{
		public static readonly ProfileResponseModel Unauthenticated = new ProfileResponseModel();
		public int UnreadMessagesCount { get; set; } = 0;
		public IEnumerable<TileFilterModel> TileFilters { get; set; }
	}
}
