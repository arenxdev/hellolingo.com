module TextChat {
	export interface ITextChatScope extends ng.IScope {
		rooms: { [roomId: string]: TextChatRoomModel };
		privateChatStatuses: ITextChatTracker[];
		hasPrivateChatStatuses: () => boolean;
		firstName: string;
		lastName: string;
		loading: boolean;
		inactive: boolean;
		closeChat: () => void;
		leaveRoom: (roomId: RoomId) => any;
		reconnectRoom: (roomId: RoomId) => any;
		onTextPostedInRoom: (roomId: RoomId, msg: string) => any;
		joinPrivateRoom: (user: ITextChatUser) => void;
		requestChat: (user: ITextChatUser) => void;
		currentRoomId: () => RoomId;
		chatRequests: { [userId: number]: IChatRequest };
		newUsersCount: () => number;
		newUsersCountPerRoom: (roomId: RoomId) => number;
		privateChatHistoryUrl: string;
		invitingUser: ITextChatUser;
		ignoreChatRequest: (userId: number) => void;
		selectPrivateChatStatus: (status: ITextChatTracker) => void;
		getActiveRoom: () => string;
		countries: ICountry[];
		languages: ILanguage[];
		lobbyUrl: string;
		openSettings: () => void;
		showUserModal: (userId: UserId, isInPrivateRoom: boolean) => void;
		isAudioCallAllowed: (roomId: RoomId) => boolean;
		requestAudioCall: (roomId: RoomId) => void;
		cancelAudioCall: (roomId: RoomId) => void;
		acceptAudioCall: (roomId: RoomId) => void;
		declineAudioCall: (roomId: RoomId) => void;
		hangoutAudioCall: (roomId: RoomId) => void;
		undockedRooms: TextChatRoomModel[];
		undockRoom: (roomId: RoomId) => void;
		dockRoom: (roomId: RoomId) => void;
		onRoomInputKeyDown: (keyCode: Number, roomId: string) => void;
		isUserMuted: (userId: UserId) => boolean;
		switchUserMute: (userId: UserId) => void;
		isRoomShown: (room: TextChatRoomModel) => boolean;
		isLobbyTabShown: () => boolean;
		isChatHistoryTabShown: () => boolean;
		isChatHistoryTabSelected: () => boolean;
		isPrivateInviteShown: (userId: UserId) => boolean;
	}

	export interface ILobbyRoom {
		roomId: string;
		roomLabel: string;
		roomUrl: string;
		tier: number;
		countOfUsers?: number;
	}

	export interface IStateDef {
		state: State;
		params: any;
	}

	export interface IRoomStateDef extends IStateDef {
		params: IRoomStateParams
	}

	export interface IChatInviteStateDef extends IStateDef {
		params: IChatInviteParams
	}

	export interface IRoomStateParams {
		roomId?: string;
		userId?: number;
		firstName?: string;
		langA?: string;
		langB?: string;
	}

	export interface IPrivateRoomStateParams {
		userId: number;
		firstName: string;
	}

	export interface IChatInviteParams {
		userId: UserId;
	}

	export interface IRoomCookieState {
		stateName: string;
		text: string;
	}

	export const enum TrackerStatus {
		// Commented out are statuses that exists on the server but the client doesn't use

		Inviting = 1,
		InviteAccepted = 2,
		//InviteIgnored = 3,
		//InviteDeclined = 4,
		//SeenInviteResponse = 5,
		//AutoBlocked = 9,
		UnreadMessages = 10,
		AllCaughtUp = 11,
		Invited = 21,
		AcceptedInvite = 22,
		IgnoredInvite = 23,
		//DeclinedInvite = 24
	}

}