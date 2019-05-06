using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Regulators;

namespace Considerate.HellolingoMock.TextChat {

	public class DumbTextChatStorage: ITextChatStorage {

		public Task AddMessageAsync(ITextChatMessage msg) { return null; }

		public List<ITextChatMessage> GetHistory(RoomId roomId, List<MessageVisibility> withVisibilities, int messageCount)
		{
			return new List<ITextChatMessage>
			{
				Resources.Alice.Message,
				Resources.Bob.Message
			};
		}

		public List<IPrivateChatStatus> GetPrivateChatStatuses(int userId) => null;

		public bool IsWhitelistedPrivateRoom(RoomId roomId)
		{
			return false;
		}

	}
}
