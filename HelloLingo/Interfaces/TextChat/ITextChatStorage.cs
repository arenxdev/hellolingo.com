using System.Collections.Generic;
using System.Threading.Tasks;
using Considerate.Hellolingo.Regulators;

namespace Considerate.Hellolingo.TextChat {

	public interface ITextChatStorage {

		Task AddMessageAsync(ITextChatMessage msg);
		List<ITextChatMessage> GetHistory(RoomId roomId, List<Enumerables.MessageVisibility> withVisibilities, int messageCount);
		List<IPrivateChatStatus> GetPrivateChatStatuses(int userId);

	}

}