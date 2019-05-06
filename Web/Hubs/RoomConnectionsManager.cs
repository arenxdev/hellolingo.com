using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.TextChat;

namespace Considerate.Hellolingo.WebApp.Hubs
{
	public class RoomsConnectionsManager
	{

		private readonly MultiValueDictionary<RoomId, ConnectionId> _roomsConnections =
		  new MultiValueDictionary<RoomId, ConnectionId>();

		public void Reset() => _roomsConnections.Clear();

		public MultiValueDictionary<RoomId, ConnectionId> All => _roomsConnections;
		public int Count => _roomsConnections.Count();
		public int ValuesCount => _roomsConnections.Values.Sum(value => value.Count());

		public void AddConnection(RoomId roomId, ConnectionId connectionId) {
			// Somehow, despite the check for existing connections in the dictionary, we end up with a "An item with the same key has already been added."
			// This has been especially observed when the server is restarted and clients reconnect.
			// This leads to some clients note able to reconnect all rooms, and possibly silent errors with the rooms they're in.
			// So, we suppress the error with a try-catch block. That shouldn't cause any side effects
			try { 
				if (!HasConnection(roomId, connectionId))
					_roomsConnections.Add(roomId, connectionId);
			} catch {}
		}

		public bool HasConnection(RoomId roomId, ConnectionId connectionId) => _roomsConnections.Keys.Contains(roomId) && _roomsConnections[roomId].Contains(connectionId);
		public bool HasConnections(RoomId roomId, IEnumerable<ConnectionId> connectionId) => _roomsConnections.Keys.Contains(roomId) && _roomsConnections[roomId].Any(connectionId.Contains);

		public IEnumerable<ConnectionId> GetConnections(RoomId roomId, ConnectionId except = null)
		{
		  // An inexistent room can be requested when the first user enters it (because we requests the list of connections before adding the user's connection to the room)
		  if(!_roomsConnections.ContainsKey(roomId)) return new List<ConnectionId>();
		  return _roomsConnections [ roomId ].Where(r => except == null || r != except).ToList(); //without ToList(), result looks like it's null?!
		}

		public void RemoveConnection(ConnectionId connectionId, RoomId roomId)
		  => _roomsConnections.Remove(roomId, connectionId);

		public bool RemoveConnectionFromAllRooms(ConnectionId connectionId)
		{
			var nullRoomIdEncountered = false;
			start_over:
			foreach (var roomId in _roomsConnections.Keys)
			{
				// The production server started to report a dictionary key (roomId below) that was null. It consequently failed and no user was removed from the chat or any rooms.
				// Though I tried to use the contain method with a null roomId, the dev environment didn't complain at all!
				// Note that MultiValueDictionary is an experimental collection from Microsoft. Hence, it might not be fully stable
				// So, we need some more info to understand what's going on here.
				if (roomId != null)
					if (_roomsConnections.Contains(roomId, connectionId)) {
						_roomsConnections.Remove(roomId, connectionId);
						goto start_over; // Because you can't enumerate a collection that has just been modified
					}
				else nullRoomIdEncountered = true;
			}
			return nullRoomIdEncountered;
		}

		public IEnumerable<RoomId> GetConnectionRooms(ConnectionId connectionId) => 
			_roomsConnections.Where(room => room.Value.Contains(connectionId)).Select(r=>r.Key);

	}
}