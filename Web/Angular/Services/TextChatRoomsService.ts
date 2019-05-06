namespace Services {
	export class TextChatRoomsService {

		private localUser:IAuthUser;
		private chatRooms: { [roomId: string]: TextChatRoomModel };
		get rooms() { return this.chatRooms; }

		static $inject = ["$cookies", "userService"];
		constructor(private $cookies: ng.cookies.ICookiesService, private userService: Authentication.IUserService) { }

		initiateRoomService() {
			this.chatRooms = {};
			this.localUser = this.userService.getUser(); // Moved here from constructor, because it has to run each time the chat is iniatilized. Indeed, the user may have logged out and signed in with another user. Without this the localUser would be incorrect
		}

		addRoom(roomModel: TextChatRoomModel): TextChatRoomModel {
			this.addRoomIdToCookies(roomModel);
			return this.chatRooms[roomModel.roomId] = roomModel;
		}

		deleteRoom(roomId: string): void {
			delete this.chatRooms[roomId];
			this.removeRoomIdFromCookies(roomId);
		}

		privateRoomIdFrom = (partnerId: UserId) => partnerId < this.localUser.id ? `${partnerId}-${this.localUser.id}` : `${this.localUser.id}-${partnerId}`;

		partnerIdFrom = (privateRoomId: RoomId) => {
			const userIds = privateRoomId.split("-").map((userId) => Number(userId));
			return this.localUser.id === userIds[0] ? userIds[1] : userIds[0];
		};

		validatePrivateRoomId = (roomId: RoomId) => {
			try {
				const partnerId = this.partnerIdFrom(roomId);
				return !isNaN(partnerId) && partnerId !== this.localUser.id && this.privateRoomIdFrom(partnerId) === roomId;
			} catch (e) { return false; }
		}

		getRoomsFromPreviousSession(): { [roomId: string]: TextChat.IRoomCookieState } {
			const cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
			const cookiedRooms = angular.fromJson(cookieValue);
			return cookiedRooms ? cookiedRooms : {};
		}

		private addRoomIdToCookies(room: TextChatRoomModel): void {
			const cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
			const cookiedRooms = cookieValue ? angular.fromJson(cookieValue) : {} as { [roomId: string]: TextChat.IRoomCookieState };
			cookiedRooms[room.roomId] = {
				stateName: room.state,
				text: room.text
			} as TextChat.IRoomCookieState;
			this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
		}

		public removeRoomIdFromCookies(roomId: string): void {
			const cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
			if (!cookieValue) return;
			const cookiedRooms = angular.fromJson(cookieValue) as TextChat.IRoomCookieState;
			delete cookiedRooms[roomId]; // = null;
			this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
		}
	}
}