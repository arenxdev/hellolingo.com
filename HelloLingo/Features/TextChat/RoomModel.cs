using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.UserCommons;

namespace Considerate.Hellolingo.TextChat {

	public class RoomModel
	{
		public Dictionary<UserId, RoomUser> Users { get; } = new Dictionary<UserId, RoomUser>();
		public List<ITextChatMessage> Messages { get; set; }

		public bool ValidHistory { get; set; } = false;
		public bool HasUser(UserId userId) { return Users.ContainsKey(userId); }
		public void AddUser(UserId userId) { Users.Add(userId, new RoomUser()); }
		public void RemoveUser(UserId userId) { Users.Remove(userId); }

		public void AddMessage(ITextChatMessage msg) { Messages.Add(msg); }
		public ITextChatMessage LastMessage => Messages.LastOrDefault();

	}

	public class RoomUser 
	{
		public DateTime LastActive = DateTime.Now;
	}
}
