using System;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.HellolingoMock.TextChat;

namespace Considerate.Hellolingo.WebApp.Tests.SignalR
{
	// Andriy: Purpose of this class is override GetUserFromClaims method to be able test TextChatHub class
	public class OverridedTextChatHub : TextChatHub
	{
		public OverridedTextChatHub(TextChatHubCtrl ctrlHub) : base(ctrlHub) { }
	
		protected override Task<TextChatUser> PublicProfile(UserId id)
		{
			TextChatUser chatUser;
			switch (id)
			{
				case 1: chatUser = new TextChatUser() {FirstName = Resources.Alice.FirstName, LastName = Resources.Alice.LastName, Knows = Resources.Alice.Knows, Learns = Resources.Alice.Learns, Id = Resources.Alice.UserId}; break;
				case 2: chatUser = new TextChatUser(){FirstName = Resources.Bob.FirstName, LastName = Resources.Alice.LastName, Knows = Resources.Bob.Knows, Learns = Resources.Bob.Learns, Id = Resources.Bob.UserId        }; break;
				case 3: chatUser = new TextChatUser(){FirstName = Resources.Carol.FirstName, LastName = Resources.Alice.LastName, Knows = Resources.Carol.Knows, Learns = Resources.Carol.Learns, Id = Resources.Carol.UserId  }; break;
				default: throw new Exception("Not expected User ID.");
			}
			return Task.FromResult(chatUser);
		}
		
		protected override Task<User> GetLocalUser()
		{
			User user = null;
			switch (LocalUserId)
			{
				case 1: user = new User() { Id = 1, FirstName = Resources.Alice.FirstName, LastName = Resources.Alice.LastName, Status = new UsersStatus() { Id = UserStatuses.Valid } }; break;
				case 2: user = new User() { Id = 2, FirstName = Resources.Bob.FirstName, LastName = Resources.Bob.LastName, Status = new UsersStatus() { Id = UserStatuses.Valid } }; break;
				case 3: user = new User() { Id = 3,FirstName = Resources.Carol.FirstName, LastName = Resources.Carol.LastName,  Status = new UsersStatus() { Id = UserStatuses.Valid } }; break;
				default: throw new Exception("Not expected User ID."); 
			}
			return Task.FromResult(user);
		}
		
	}
}
