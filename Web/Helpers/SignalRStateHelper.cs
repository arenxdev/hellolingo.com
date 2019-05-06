using System;
using System.Collections.Generic;
using System.IO;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Helpers.Communication;
using Considerate.Helpers.JsonConverters;
using Newtonsoft.Json;
using static System.Threading.Thread;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public static class SignalRStateHelper
	{
		private static readonly string ApplicationPhysicalPath = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath;
		private static readonly string BackupPath = $@"{ApplicationPhysicalPath}..\Backups\State\";
		private static readonly string SignalRStateFilePath = $@"{BackupPath}SignalRState.json";

		private readonly static JsonSerializerSettings settings = new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Auto, Converters = new []{ new MultiValueDictionaryConverter() }};

		private static readonly TextChatHubCtrl ChatHubCtrl = TextChatHubCtrl.Instance;

		public static void SaveState()
		{
			try {
				Directory.CreateDirectory(BackupPath);

				// Save SignalR State
				var signalRState = new SignalRState {
					UsersConnections = ChatHubCtrl.UsersConnections.All,
					RoomsConnections = ChatHubCtrl.RoomsConnections.All,
					ChatModelState = ChatHubCtrl.ChatCtrl.GetState(),
					ManagedQueueState = ChatHubCtrl.MessageQueues,
				};
				
				File.WriteAllText(SignalRStateFilePath, JsonConvert.SerializeObject(signalRState, settings));
				Log.Info(LogTag.SavedStateAt, NowDateTimeString);

			} catch (Exception ex) {
				Log.Error(LogTag.SaveSignalRStateFailed, ex);
				throw;
			} 
		}

		private static string NowDateTimeString => DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss");

		private class SignalRState {
			public Dictionary<UserId, HashSet<ConnectionId>> UsersConnections { get; set; }
			public MultiValueDictionary<RoomId, ConnectionId> RoomsConnections { get; set; }
			public ChatModelState ChatModelState { get; set; }
			public Dictionary<ConnectionId, AckableQueue<HubClientInvoker>> ManagedQueueState { get; set; }
		}

	}
}