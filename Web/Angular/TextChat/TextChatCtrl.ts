/// <reference path="../../Scripts/typings/signalr/signalr.d.ts" />

class TextChatCtrl {
	public static audioCallRequestTimeoutInMs = 2 * 60 * 1000; // 2 mins

	private initializing = true;

	private localUser: IAuthUser;

	private pendingStateRequest: TextChat.IStateDef;
	private previousStateDef: TextChat.IStateDef;

	private chatRequests: { [userId: number]: IChatRequest } = {};
	private audioCallRequests = new Set<string>(false);
	private audioMessages: Services.IAudioMessagesResources;

	private showChatRequestMessageInProfile: boolean = false;

	private mutedUsers: Array<number> = [];

	private emitTyping = true;
	private previousPostedText: string;

	private sounds = {
		messageAdded: new Audio("/Content/Sounds/IncomingMessage.mp3"),
		invitation: new Audio("/Content/Sounds/IncomingUser.mp3")
	};

	// =============== CONSTRUCTOR =============== 

	static $inject = ["$scope", "$log", "$cookies", "$timeout", "$state", "$uibModal", "spinnerService", "chatUsersService", "userService",
		"serverConnectionService", "textHubService", "simpleWebRtcService", "countersService", "statesService", "textChatSettings", "serverResources",
		"contactsService", "textChatRoomsService", "$location","$filter"];
	constructor(private $scope: TextChat.ITextChatScope, private $log: Services.EnhancedLog, private $cookies: ng.cookies.ICookiesService,
		private $timeout: ng.ITimeoutService, private $state: ng.ui.IStateService, private $uibModal: ng.ui.bootstrap.IModalService,
		private spinnerService: Services.SpinnerService, private chatUsersService: Services.ChatUsersService, private userService: Authentication.IUserService,
		private connection: Services.ServerSocketService, private chatHub: Services.TextChatHubService, private rtc: Services.RtcService,
		private countersService: Services.ITaskbarCounterService, private statesService: Services.StatesService, private textChatSettings: Services.ITextChatSettingsService,
		private serverResources: Services.IServerResourcesService, private contactsService: Services.IContactsService, private roomsService: Services.TextChatRoomsService,
		private $location: ng.ILocationService, private $filter: ng.IFilterService
	) {

		// --------------- CONTROLLER PREPARATION ---------------

		this.localUser = userService.getUser();
		this.roomsService.initiateRoomService();

		// Listen to state changes
		$scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, (event, toState, toStateParams) => this.onStateChangeSuccess(event, toState, toStateParams));
		$scope.$on(StatesHelper.UiStateEventNames.$stateChangeStart, (event, toState, toParam, fromState, fromParams) => this.onStateChangeStart(event, toState, toParam, fromState, fromParams));
		$scope.$on("$destroy", () => { this.disconnectAll(); this.$log.signalRInfo("OnTextChatDetroy"); });

		// Assign scope members - View properties
		$scope.rooms = this.roomsService.rooms;
		$scope.privateChatStatuses = [];
		$scope.hasPrivateChatStatuses = () => Object.keys(this.$scope.privateChatStatuses).length >= 1 ;
		$scope.currentRoomId = () => this.currentRoomId();
		$scope.undockedRooms = [];
		$scope.firstName = this.localUser.firstName;
		$scope.lastName = this.localUser.lastName;
		$scope.loading = true;
		$scope.inactive = false;
		$scope.chatRequests = this.chatRequests;
		$scope.countries = this.serverResources.getCountries();
		$scope.languages = Languages.langsById;
		$scope.isAudioCallAllowed = this.isAudioCallAllowed;
        $scope.newUsersCount = () => { let cnt = 0; angular.forEach(this.chatUsersService.onlineUsers, (user: TextChatUser) => { if (user.recentlyJoinedRooms.indexOf(Config.lobbySpecialRoom.name) !== -1) cnt++; }); return cnt; };
        $scope.newUsersCountPerRoom = (roomId:RoomId) => { let cnt = 0; angular.forEach(this.chatUsersService.onlineUsers, (user: TextChatUser) => { if (user.recentlyJoinedRooms.indexOf(roomId) !== -1) cnt++; }); return cnt; };
		$scope.isUserMuted = (userId: UserId) => this.isUserMuted(userId);
		$scope.isRoomShown = (room: TextChatRoomModel) => this.currentRoomId() === room.roomId;
		$scope.isLobbyTabShown = () => $state.includes(States.textChatLobby.name);
		$scope.isChatHistoryTabShown = () => $state.includes(States.textChatHistory.name);
		$scope.isPrivateInviteShown = (userId: UserId) => $state.includes(States.textChatInvite.name) && Number(($state.params as TextChat.IChatInviteParams).userId) === Number(userId);

		// Assign scope members - View methods
		$scope.leaveRoom = this.leaveRoom;
		$scope.reconnectRoom = this.reconnectRoom;
		$scope.joinPrivateRoom = (withUser: IUser) => this.statesService.go(States.textChatRoomPrivate.name, { userId: withUser.id, firstName: withUser.firstName });
		$scope.requestChat = (withUser: ITextChatUser) => this.requestChat(withUser);
		$scope.undockRoom = this.undockRoom;
		$scope.dockRoom = this.dockRoom;
		$scope.onRoomInputKeyDown = (keyCode: Number, roomId: string) => this.onRoomInputKeyDown(keyCode, roomId);

		$scope.privateChatHistoryUrl = this.$state.href(States.textChatHistory.name);
		$scope.lobbyUrl = this.$state.href(States.textChatLobby.name);
		$scope.openSettings = this.openSettings;
		$scope.ignoreChatRequest = (userId: number) => this.ignoreChatRequest(userId);
		$scope.selectPrivateChatStatus = (status: ITextChatTracker) => this.openChatTrackerItem(status);

		$scope.onTextPostedInRoom = this.onTextPostedInRoom;

		$scope.showUserModal = this.showUserModal;
		$scope.switchUserMute = this.switchUserMute;

		$scope.requestAudioCall = this.requestAudioCall;
		$scope.cancelAudioCall = this.cancelAudioCall;
		$scope.acceptAudioCall = this.acceptAudioCall;
		$scope.declineAudioCall = this.declineAudioCall;
		$scope.hangoutAudioCall = this.hangUpAudioCall;

		$scope.closeChat = () => this.statesService.closeState(States.textChat.name);

		// Get audio message resources
		this.serverResources.getAudioChatResources().then((translations: Services.IAudioMessagesResources) => this.audioMessages = translations);

		this.loadMutedUsers(); // Load list of muted users
		this.restoreRoomsFromCookies();

		// Initialize hub and connection
		this.attachHubHandlers();
		this.attachServerConnectionHandlers();
		this.connection.start();
	}

	private attachHubHandlers() {
		this.chatHub.onSetInitialCountOfUsers((countOfUsers)    => this.chatUsersService.countOfUsers = countOfUsers);
		this.chatHub.onUpdateCountOfUsers((roomId, count)       => this.chatUsersService.countOfUsers.forPublicRooms[roomId] = count);
		this.chatHub.onAddPrivateChatStatus((status)            => this.digestChatTrackerData(status));
		this.chatHub.onAddInitialUsers((users)                  => this.addInitialUsers(users));
		this.chatHub.onAddUser((user)                           => this.addUserToChat(user));
		this.chatHub.onAddInitialUsersTo((roomId, users)        => this.addInitialUsersTo(roomId, users));
		this.chatHub.onAddUserTo((roomId, userId)               => this.addUserTo(roomId, userId));
		this.chatHub.onAddInitialMessages((messages)            => this.addInitialMessages(messages));
		this.chatHub.onAddMessage((message)                     => this.addMessage(message));
		this.chatHub.onRequestAudioCall((roomId)                => this.audioCallRequested(roomId));
		this.chatHub.onCancelAudioCall((roomId)                 => this.audioCallCancelled(roomId));
		this.chatHub.onDeclineAudioCall((roomId, reason)        => this.audioCallDeclined(roomId, reason));
		this.chatHub.onHangoutAudioCall((roomId, userId)        => this.audioCallHangouted(roomId, userId));
		this.chatHub.onPrivateChatRequestResponse((listOfRooms) => this.$scope.$broadcast("onPrivateChatRequestResponseReceived", listOfRooms));
		this.chatHub.onLeaveRoom((roomId: RoomId) => {
			this.leaveRoom(roomId, /* dueToInactivity */ true);
			this.notifyOfMessageAddition(roomId); // Visual notification for the user
			this.$log.appInfo("InactiveUserBootedOutOfRoom", { userId: this.localUser.id, roomId });
		});
		this.chatHub.onRemoveUser((userId)  => {
			var privateRoomId = this.roomsService.privateRoomIdFrom(userId);
			var privateRoom = this.roomsService.rooms[privateRoomId];
			if (privateRoom) {
				if (privateRoom.audioCallState && privateRoom.audioCallState !== AudioCallState.connected)
					this.audioCallDeclined(privateRoomId, "leftRoom");
			} else {
				this.audioCallCleanup(privateRoomId);
			}
			// TODOLater: removeuser could return the user that got popped out of the 25, so that we remove its chat request with a line based on the below one
			//if (this.chatRequests[userId]) this.chatRequests[userId].isMissed = true;
			this.chatUsersService.removeUser(userId);
		});
		this.chatHub.onRemoveUserFrom((roomId, userId) => {
			this.chatUsersService.unMarkRecentUser(this.chatUsersService.getUser(userId), roomId);
			const room = this.roomsService.rooms[roomId];
			// TODOLATER: I think we no longer can receive a RemoveUserFrom for a room we're not in. This was a previous problem that no longer applies. We should log an event if a room is missing. If it doesn't happen in production, remove this check
			if (room) { // We check the room exists because we can receive updates about private rooms we are not in.
				room.accessor.removeUser(userId);
				if (room.isPrivate && room.audioCallState && room.audioCallState !== AudioCallState.connected) // if the room has non-connected voice chat, cancel it;
					this.audioCallDeclined(roomId, "leftRoom");
			} else if (!/^\d+-\d+$/.exec(roomId)) // If the room is missing, it must be private.
				this.$log.signalRError("RemoveUserFromMissingRoomError", roomId);
			else {
				this.audioCallCleanup(roomId);
			}
		});
		this.chatHub.onMarkUserAsTyping((roomId, userId) => {
			// This check is necessary, due to the user receiving is own typingIn while not listed among the users
			if (userId !== this.localUser.id && !this.isUserMuted(userId))
				this.chatUsersService.getUser(userId).roomTypingIn = roomId;
		});
		this.chatHub.onUnmarkUserAsTyping((userId) => {
			const user = this.chatUsersService.getUser(userId);
			// The "If" below is needed b/c the requested user might be the local user, and it's not listed in users
			if (user) user.roomTypingIn = undefined;
		});
		this.chatHub.onAudioCallConnected((roomId, userId) => {
			// End the local call if it has been connected in another session
			var isSameUser = userId === this.localUser.id;
			if (!this.roomsService.rooms[roomId] || isSameUser && this.roomsService.rooms[roomId].audioCallState !== AudioCallState.connected)
				this.audioCallCleanup(roomId);
		});

		this.chatHub.onSetUserIdle((userId) => {
			// Since June 1st 2017, this is no longer used to set others idle. We automatically disconnect idle members
			// So, this listener will always receive an "Idle" message for the local user, and disconnects it
			if (this.localUser.id === userId) {
				this.$scope.inactive = true;
				this.disconnectAll();
				this.$scope.loading = false; // Clear the loader.
			}
		});

	}

	private onConnectionDisconnected = () => this.$scope.loading = true;
	private onConnectionReconnected = () => this.$scope.loading = false;
	private onConnectionFatalError = () => this.statesService.closeState(States.textChat.name);
	private onconnectionStarted = () => {
		this.chatUsersService.clearAllUsers();
		this.audioCallRequests = new Set<string>(false);
		this.reconnectExistingRooms();
		this.applyPendingStateRequest();
		this.$scope.loading = false;
	}

	private connectionHandlers = [
		{ event: this.connection.eventFatalError,   handler: this.onConnectionFatalError },
		{ event: this.connection.eventDisconnected, handler: this.onConnectionDisconnected },
		{ event: this.connection.eventReconnected,  handler: this.onConnectionReconnected },
		{ event: this.connection.eventStarted,      handler: this.onconnectionStarted }
	];

	private attachServerConnectionHandlers = () =>
		this.connectionHandlers.forEach(eventHandler => eventHandler.event.on(eventHandler.handler));
	private detachServerConnectionHandlers = () =>
		this.connectionHandlers.forEach(eventHandler => eventHandler.event.off(eventHandler.handler));

	private reconnectExistingRooms() {
		angular.forEach(this.roomsService.rooms, (room: TextChatRoomModel) => {
			room.accessor.reset();
			this.chatHub.subscribeToRoom(room.roomId);
		});
	}

	private restoreRoomsFromCookies() {
		const rooms = this.roomsService.getRoomsFromPreviousSession();
		for (let roomId in rooms) {
			const room = rooms[roomId];
			try { // Validate roomId. It can be wrong if it's a room opened by another user on the same device, or if it's simply corrupted.
				if (room.stateName === States.textChatRoomPrivate.name && !this.roomsService.validatePrivateRoomId(roomId))
					throw Error();
				if (roomId !== "hellolingo" && roomId !== "english") // Don't restore the Hellolingo room
					this.joinRoom(roomId, room.text, room.stateName, /* subscribe */ false);
			} catch (e) {
				this.$log.appInfo("dumpFailingRoomFromCookie", { roomId, room });
				this.roomsService.removeRoomIdFromCookies(roomId); // clear the potentially corrupted bits from the cookie
			}
		}
    }

    addInitialUsers(users: ITextChatUser[]) {
		this.chatUsersService.clearAllUsers();
	    var usersWhoHaveJustLeft = new Array<UserId>();
        angular.forEach(users, (userObj: ITextChatUser) => {
			const user = new TextChatUser(userObj);
			user.isPinned = this.contactsService.isUserInContacts(user.id);
			this.chatUsersService.addUser(user);
			if (user.hasJustLeft) usersWhoHaveJustLeft.push(user.id);
        });
		// Now that all users have been added, remove users marked as "hasJustLeft". Don't do it before all users have been added (because the ratio of removed users that are preserved in the list is based on how many online users there are)
		for (let userId of usersWhoHaveJustLeft)
		this.chatUsersService.removeUser(userId);
		this.chatUsersService.sortBy();
    }

	private disconnectAll() {
		this.connection.stop();
		this.chatHub.detachAllHandlers(); // This is ok to use as long as nothing else than this controller attach handlers to the chatHub
		this.detachServerConnectionHandlers();
	}

	currentRoomId(): RoomId {
		// Check is we're viewing a room
		const validStates = [States.textChatRoomCustom.name, States.textChatRoomDualLang.name, States.textChatRoomPrivate.name, States.textChatRoomPublic.name];
		if (validStates.indexOf(this.$state.current.name) === -1) return undefined;

		const params = this.$state.params as TextChat.IRoomStateParams;
		let roomId = params.roomId;
		if (params.userId) roomId = this.roomsService.privateRoomIdFrom(params.userId);
		if (params.langA) roomId = params.langA + "+" + params.langB;
		return roomId;
	}

	// =============== CONTROLLER METHODS ===============

	private showRoom = (roomId) => this.setStateTo(this.roomsService.rooms[roomId]);
	private setStateTo = (room: TextChatRoomModel) => this.$location.url(room.url);
	private chatStatusFor = (userId: UserId) => {
		for(let status of this.$scope.privateChatStatuses)
			if (status.partner.id === userId) return status;
		return null;
	}

	private leaveRoom = (roomId: RoomId, dueToInactivity = false) => {
		const room = this.roomsService.rooms[roomId];
		if (!room) return; // Leaving a room can be requested by the server, so there is a chance it's gone already

		this.chatHub.leaveRoom(roomId);

		if (dueToInactivity) room.isInactive = true;
		else {
			room.accessor.dispose();

			if (room.isUndocked) {
				room.isUndocked = false;
				this.$scope.undockedRooms.splice(this.$scope.undockedRooms.indexOf(room), 1);
				if (this.$scope.undockedRooms.length === 0) $(window).unbind("resize", this.undockedStateWindowResizeHandler);
			}

			if (room.isPrivate && room.audioCallState) this.cancelAudioCall(roomId, "leftRoom");

			this.chatUsersService.unMarkRecentUsersIn(roomId);
			this.roomsService.deleteRoom(roomId);

			this.setToValidState(); // Find another room to go to now that the current one is closed
		}
	};

	private reconnectRoom = (roomId: RoomId) => {
		var room = this.roomsService.rooms[roomId];
		room.accessor.reset();
		room.isInactive = false;
		this.chatHub.subscribeToRoom(roomId);
	}

	private setToValidState() {
		for (let roomId in this.roomsService.rooms)
			if (!this.roomsService.rooms[roomId].isUndocked) { this.showRoom(roomId); return; }
		this.$state.go(States.textChatLobby.name);
	}

	private requestChat(user: ITextChatUser) {

		this.showChatRequestMessageInProfile = true;

		// Handle the presence of an existing request (happens if the partner also set a request, I believe)
		const status = this.chatStatusFor(user.id);
		if (status) {
			if (status.statusId === TextChat.TrackerStatus.Invited || status.statusId === TextChat.TrackerStatus.IgnoredInvite || status.statusId === TextChat.TrackerStatus.AcceptedInvite)
				this.$scope.joinPrivateRoom(status.partner);
			else 
				this.$log.appError("UnexpectedExistingStatusInChatRequest", { status});
			return;
		}

		this.chatHub.requestPrivateChat(user.id); 
		
		// Add the request to the chat to history
		const partner = this.chatUsersService.getUser(user.id);
		const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
		if (partner) {
			this.$scope.privateChatStatuses.push({ partner, statusId: TextChat.TrackerStatus.Inviting, statusAt: this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") } as ITextChatTracker);
			partner.isPrivatePartner = true; // That's not exactly a real private partner yet, but this property defines which button is shown (between "view chat" and "request chat")
		}
		else this.$log.appError("AddChatRequestToHistoryFailedOnMissingPartner", { userId: user.id });
	}

	private undockedStateWindowResizeHandler = () => {
		if ($(window).innerWidth() <= 960)
			angular.forEach(this.roomsService.rooms, (room: TextChatRoomModel) => {
				if (room.isUndocked) this.dockRoom(room.roomId);
			});
	}

	private undockRoom = (roomId: RoomId) => {
		if (angular.element(window).width() < 960) return false; // Leave if the conditions aren't good enough to open a new pane
		const room = this.roomsService.rooms[roomId];
		if (room.accessor) room.accessor.dispose();
		room.isUndocked = true;
		this.$scope.undockedRooms.push(room);
		if (room.accessor && !room.accessor.loading)  // If the room is loading, then there is already a subscribe in progress
			this.chatHub.subscribeToRoom(roomId); // TodoLater: Hack to avoid large scale refactoring: "rejoin" room to get data for new acessor
		$(window).bind("resize", this.undockedStateWindowResizeHandler);
		this.$state.go(States.textChatLobby.name); // Show the lobby now that this room is undocked
		return true; // Room undocked successfully
	}

	private dockRoom = (roomId: RoomId) => {
		const room = this.roomsService.rooms[roomId];
		room.isUndocked = false;
		room.newMessagesCount = 0;
		room.accessor.dispose();
		this.$scope.undockedRooms.splice(this.$scope.undockedRooms.indexOf(room), 1);
		this.chatHub.subscribeToRoom(roomId); // TodoLater: Hack to avoid large scale refactoring: "rejoin" room to get data for new acessor
		this.setStateTo(room);
		if (this.$scope.undockedRooms.length === 0) $(window).unbind("resize", this.undockedStateWindowResizeHandler);
	}

	private joinRoom(roomId: RoomId, roomText: string, roomStateName: string, subscribe = true) {
		// Add room to local service
		const params = States.textChatRoomPrivate.name === roomStateName  ? { firstName: roomText, userId: this.roomsService.partnerIdFrom(roomId) } : (
					   States.textChatRoomDualLang.name === roomStateName ? { langA: roomId.split("+")[0], langB: roomId.split("+")[1] } :
																			{ roomId: roomId }) as TextChat.IRoomStateParams;
		const roomUrl = this.statesService.href(this.statesService.get(roomStateName), params);
		const room = this.roomsService.addRoom(new TextChatRoomModel(roomId, roomText, roomUrl, roomStateName, params.userId));

		if (params.userId) {
			// Update private chat history
			const status = this.chatStatusFor(params.userId);
			const partner = this.chatUsersService.getUser(params.userId);
			if (status) {
				switch (status.statusId) {
					case TextChat.TrackerStatus.Invited: status.statusId = TextChat.TrackerStatus.AcceptedInvite; break;
					case TextChat.TrackerStatus.IgnoredInvite: status.statusId = TextChat.TrackerStatus.AcceptedInvite; break;
				}
				if (partner) partner.isPrivatePartner = true;
			} else {
				const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
				if (partner) this.$scope.privateChatStatuses.push({ partner, statusId: TextChat.TrackerStatus.AllCaughtUp, statusAt: this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") } as ITextChatTracker);
			}

			// Remove pending chat requests
			delete this.chatRequests[params.userId];

			// Activate any audio call request
			if (this.audioCallRequests.contains(roomId)) {
				this.audioCallRequested(roomId);
				this.audioCallRequests.remove(roomId);
			}
		}

		// Join room on the server
		if (subscribe) this.chatHub.subscribeToRoom(roomId);

		this.$timeout(() => {
			room.accessor.initForFirstVisit();
			room.accessor.loading = true;
		}, 0);

		// if no other room isUndocked, undock it automatically, unless we're in the process of opening the text chat
		if (!this.initializing && this.$scope.undockedRooms.length === 0) {
			if (this.undockRoom(roomId))
				this.$timeout(() => this.$state.go(States.textChatLobby.name) , 0); // Prevent invisible lobby if a page is loaded straight into a private room like /text-chat/with/1/Bernard
		}
	}

	private notifyOfMessageAddition(roomId: string) {
		const params = this.$state.params as TextChat.IRoomStateParams;
		if (params.roomId !== roomId && params.langA+"+"+params.langB !== roomId && (!params.userId || params.userId.toString() !== this.roomsService.partnerIdFrom(roomId).toString())) // toString() b/c params are stored as strings
			this.roomsService.rooms[roomId].newMessagesCount++;
		if (Runtime.TextChatSettings.playMessageAddedSound)
			this.sounds.messageAdded.play();
	}

	private setMessageOrigin(msg: ITextChatMessage) {
		msg.origin = msg.firstName === "[News]" ? MessageOrigin.news : MessageOrigin.otherUser;
	}

    // =============== VIEW EVENT HANDLERS ===============

    private onStateChangeStart(event, toState, toParam: TextChat.IRoomStateParams, fromState, fromParam: TextChat.IRoomStateParams) {

        if (this.$state.includes(States.textChat.name) === false) return;

        // Unmark last seen messages in chatRoom
		if (this.currentRoomId())
			if (this.roomsService.rooms[this.currentRoomId()]) // We may have left the room just now
				if (this.roomsService.rooms[this.currentRoomId()].accessor) // The room may still be initializing
				this.roomsService.rooms[this.currentRoomId()].accessor.resetLastSeenMark();

        // Unmark users who recently joined
		if (fromState.name === States.textChatLobby.name) this.chatUsersService.unmarkRecentUsers();
		if (fromParam && fromParam.roomId) this.chatUsersService.unMarkRecentUsersIn(fromParam.roomId);
		if (fromParam && fromParam.langA) this.chatUsersService.unMarkRecentUsersIn(fromParam.langA + "+" + fromParam.langB);
		if (fromParam && fromParam.userId) this.chatUsersService.unMarkRecentUsersIn(this.roomsService.privateRoomIdFrom(fromParam.userId));

		// Prevent going to undocked room states
		if (this.roomsService.rooms[toParam.roomId] && this.roomsService.rooms[toParam.roomId].isUndocked) {
			this.spinnerService.showSpinner.show = false;
			event.preventDefault();
		}

		this.previousStateDef = { state: fromState, params: fromParam }
    }

    private onStateChangeSuccess = (event, toState, toStateParams) => {
		var stateDef: TextChat.IStateDef = { state: toState, params: toStateParams }
		if (this.connection.state === Services.ServerSocketState.Disconnected || this.connection.state === Services.ServerSocketState.Connecting) {
			this.pendingStateRequest = stateDef;
			return;
		} else this.applyStateChange(stateDef);
    }

	applyStateChange(stateDef: TextChat.IStateDef) {
		this.chatHub.setUserActive();
		if (this.$state.includes(States.textChat.name) === false) return; // Exit if this feature isn't the target
		this.countersService.resetCounter(Services.Counters.TextChat); // Reset State-wide counter

		// Handle visits to the invitations tab
		if (stateDef.state.name === States.textChatLobby.name) { /* Nothing to do */ }
		// Handle visits to the invitations tab
		else if (stateDef.state.name === States.textChatHistory.name)
			delete this.$scope.invitingUser;
		else if (stateDef.state.name === States.textChatInvite.name) {
			const userId = (stateDef as TextChat.IChatInviteStateDef).params.userId;
			this.$scope.invitingUser = { id: userId } as ITextChatUser;
		}
		// Handle chat rooms
		else if ([States.textChatRoomCustom, States.textChatRoomPublic, States.textChatRoomPrivate, States.textChatRoomDualLang]
			.some(state => stateDef.state.name === state.name)) {
			this.applyRoomStateChange(stateDef);
        }

		// Initialization of the text chat is over once the first state has been applied
		this.initializing = false;
	}

	applyRoomStateChange(stateDef: TextChat.IRoomStateDef) {
		let roomId: string;
		if (stateDef.state.name === States.textChatRoomPrivate.name) roomId = this.roomsService.privateRoomIdFrom(stateDef.params.userId);
		else if (stateDef.state.name === States.textChatRoomDualLang.name) roomId = stateDef.params.langA + "+" + stateDef.params.langB;
		else roomId = stateDef.params.roomId;

		// Make sure no one enters a public/custom room with a tampered with url that doesn't match a supported language/restrictions
		if ((stateDef.state.name === States.textChatRoomPublic.name && Languages[roomId] == null && Config.TopicChatRooms[roomId] == null) ||
			(stateDef.state.name === States.textChatRoomCustom.name && !Config.Regex.secretRoom.test(roomId)) ) {
			this.$log.appWarn("MalformedRoomRequested", { roomId, stateName: stateDef.state.name });
			this.$state.go(States.textChatLobby.name);
			return;
		}

		// Make sure no one enters a dual language room with a tampered with url that doesn't match a supported languages
		if (stateDef.state.name === States.textChatRoomDualLang.name && (Languages[stateDef.params.langA] == null || Languages[stateDef.params.langB] == null)) {
			this.$log.appWarn("MalformedRoomRequested", { langA: stateDef.params.langA, langB: stateDef.params.langB, stateName: stateDef.state.name });
			this.$state.go(States.textChatLobby.name);
			return;
		}

		// Join room if needed
		if (!this.roomsService.rooms[roomId]) {
			var roomText = roomId;
			if (stateDef.state.name === States.textChatRoomPublic.name) {
				const language = Languages[roomId];
				const topic = Config.TopicChatRooms[roomId];
				roomText = language ? language.text : topic.text;
			} else if (stateDef.state.name === States.textChatRoomPrivate.name) {
				roomText = stateDef.params.firstName;
			} else if (stateDef.state.name === States.textChatRoomDualLang.name) {
				roomText = Languages[stateDef.params.langA].text + " + " + Languages[stateDef.params.langB].text;
			}
			this.joinRoom(roomId, roomText, stateDef.state.name);
		}

		// Mark private room as caught up
		if (stateDef.state.name === States.textChatRoomPrivate.name) {
			this.chatHub.markAllCaughtUp(Number(stateDef.params.userId)); 
		}

		let room = this.roomsService.rooms[roomId];
		room.newMessagesCount = 0; // Reset message counter on the room:
	}

	private onTextPostedInRoom = (roomId: string, message: string) => {
		if (!this.roomsService.rooms[roomId].isPrivate) this.chatUsersService.unMarkRecentUsersIn(roomId);
        this.chatHub.postTo(roomId, message);
		this.emitTyping = this.previousPostedText !== message;
		this.previousPostedText = message;
	};

    // =============== HUB CLIENT METHODS ===============

    private addUserTo(roomId, userId: UserId) {
		const room = this.roomsService.rooms[roomId];
        if (!room) return; //Andriy: this case is possible when user is currently not in private room, but his connection is in private room connection list

        const user = this.chatUsersService.getUser(userId);
        if (!user) {
            // We unfortunately have cases, on the server, where a user is in a room, but not in the chat, or vice versa. That, inevitably causes some issues if we don't catch it
            this.$log.signalRWarn("UserIdNotFoundInAddUserTo", { userId: userId });
            return;
        }
		user.recentlyJoinedRooms.push(roomId);
        room.accessor.addUser(user);
    }

    private addInitialUsersTo(roomId: RoomId, initialUsers: UserId[]) {
        // Wrapped in a try-catch because this is called by SignalR, which swallow errorsand prevent them from being logged remotely :-(
		var room = this.roomsService.rooms[roomId];
		if (!room) return; // Happens when the user has closed the room before the list of users arrived to the client

        // Timeout is there to try to deal with the occasional issue on first load of the chat: "AddInitialUsersTo = TypeError: Cannot read property 'addUser' of undefined"
		this.$timeout(() => {
			angular.forEach(initialUsers, (userId: UserId) => {
				const user = this.chatUsersService.getUser(userId);
				if (user) {
					user.recentlyJoinedRooms = [];
					room.accessor.addUser(user);
				} else {
					// We unfortunately have cases, on the server, where a user is in a room, but not in the chat, or vice versa. That, inevitably causes some issues if we don't catch it
					this.$log.signalRWarn("UserIdNotFoundInAddInitialUsersTo", { userId: userId });
				}
			});
			// Add the local user to the user list
			const user: TextChatUser = this.localUser as any;
			user.isSelf = true;
			user.recentlyJoinedRooms = [];
			this.roomsService.rooms[roomId].accessor.addUser(user);
        });
    }

	private digestChatTrackerData(trackers: ITextChatTracker[]) {
		this.$scope.privateChatStatuses = [];
		angular.forEach(trackers, status => {

			if (this.isUserMuted(status.partner.id)) return;
			if (this.userService.getUser().isNoPrivateChat && status.statusId === TextChat.TrackerStatus.Invited) return; 

			status.partner.isPinned = this.contactsService.isUserInContacts(status.partner.id); // This should seriously be handled by the chatUsersService or another user service and not computed independtly all the time. 
			this.$scope.privateChatStatuses.push(status);

			var chatUser = this.chatUsersService.getUser(status.partner.id);
			if (chatUser) {
				// Rethrow invites when the partner is present
				if (status.statusId === TextChat.TrackerStatus.Invited || status.statusId === TextChat.TrackerStatus.InviteAccepted) this.addChatRequest(status.partner, Number(status.statusId));
				else if (status.statusId !== TextChat.TrackerStatus.IgnoredInvite) chatUser.isPrivatePartner = true;
			}

			// Rethrow unread messages
			if (status.statusId === TextChat.TrackerStatus.UnreadMessages) {
				const room = this.roomsService.rooms[this.roomsService.privateRoomIdFrom(status.partner.id)];
				if (room) room.newMessagesCount = 1;
				else this.addChatRequest(status.partner, Number(status.statusId));
			}

		});
	}

	private addInitialMessages(messages: ITextChatMessage[]) {
        this.$timeout(() => {
            angular.forEach(messages, (msg: ITextChatMessage) => {
				if (!this.isUserMuted(msg.userId)) {
					this.setMessageOrigin(msg); // TODOLATER: Optimally, the message send would have the origin initialized properly
					const room = this.roomsService.rooms[msg.roomId];
					if (!room) return; // Happens when the user has closed the room before the list of users arrived to the client
					room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text, true);
					room.accessor.resetLastSeenMark();
				}
            });
            // Enable rooms view
            // Unfortunately, we can't target a particular room, because initialMessages doesn't group messages by room. 
            // Rooms are only indicated within individiual messages. There can be many rooms in the list of messages,
            // or even none if a room has no message. Hence, we need to enable all rooms. That's quite suboptimal. 
            angular.forEach(this.roomsService.rooms, (room: TextChatRoomModel) => room.accessor.loading = false);

            //Enable Chat view
            this.spinnerService.showSpinner.show = false;
            this.$scope.$apply();
        });
    }

    private addMessage = (msg: ITextChatMessage) => {
		// Remove typing indicator
		var user = this.chatUsersService.getUser(msg.userId);
		if (user) user.roomTypingIn = undefined;
		else this.$log.appWarn("UserNotFoundInAddMessage", { msg });

		if (this.isUserMuted(msg.userId)) {
			this.$log.appInfo("MutedChatMessage", { mutedUserId: msg.userId, roomId: msg.roomId, text: msg.text });
			return;
		}

		// Get JSON from text, if any
		let json: JsonMessage = null;
		try { json = JSON.parse(msg.text); } catch (e) { }

		// Process Chat Request, if any
		const partner = this.getPartnerFromRoomId(msg.roomId);
		if (json && json.chatRequest) {
			const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
			if (!this.userService.getUser().isNoPrivateChat)
				this.$scope.privateChatStatuses.push({ partner, statusId: TextChat.TrackerStatus.Invited, statusAt: this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") } as ITextChatTracker);
			this.addChatRequest(partner, TextChat.TrackerStatus.Invited);
		}
		else // Add message 
		{
			const room = this.roomsService.rooms[msg.roomId];

			// Process Chat AcceptedRequest
			if (json && json.chatRequestAccepted) {
				if (!room) this.addChatRequest(partner, TextChat.TrackerStatus.InviteAccepted);
				partner.isPrivatePartner = true;
			}

			// Post the the message
			if (room) {
				this.setMessageOrigin(msg); // TODOLater: Optimally, the message send would have the origin initialized properly
				this.notifyOfMessageAddition(msg.roomId);
				room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text);
				this.increaseNotificationCount();

				// If room is currently visible or undocked, mark as allCaughtUp
				if (room.isPrivate && (msg.roomId === this.currentRoomId() || room.isUndocked))
					this.chatHub.markAllCaughtUp(msg.userId);
			} else {
				const status = this.chatStatusFor(msg.userId);
				// Add a chat request it if there isn't an ignored or unanswered invite for that user
				if (!status || (status.statusId !== TextChat.TrackerStatus.Invited && status.statusId !== TextChat.TrackerStatus.IgnoredInvite))
					this.addChatRequest(partner, TextChat.TrackerStatus.UnreadMessages);
			}
	    }

    }

	addChatRequest(user: ITextChatUser, trackerStatusId: number) {
		if (this.userService.getUser().isNoPrivateChat) return;

		// Add the request
		this.chatRequests[user.id] = {
			user, trackerStatusId,
			url: trackerStatusId === TextChat.TrackerStatus.Invited
				? this.$state.href(States.textChatInvite.name, { userId: user.id } as TextChat.IChatInviteParams)
				: this.$state.href(States.textChatRoomPrivate.name, { userId: user.id, firstName: user.firstName } as TextChat.IPrivateRoomStateParams)
		};

		// Notify user
		if (Runtime.TextChatSettings.playUserNewInvitation) this.sounds.invitation.play();
		this.increaseNotificationCount();
	}

    ignoreChatRequest(userId: number) {
		delete this.chatRequests[userId];
		const status = this.chatStatusFor(userId);
		status.statusId = TextChat.TrackerStatus.IgnoredInvite;
        this.$state.go(this.previousStateDef.state.name, this.previousStateDef.params);
		this.chatHub.ignoreChatInvite(userId);
    }

	openChatTrackerItem(status: ITextChatTracker) {
		if (status.statusId === TextChat.TrackerStatus.Invited || status.statusId === TextChat.TrackerStatus.IgnoredInvite)
			this.$state.go(States.textChatInvite.name, { userId: status.partner.id } as TextChat.IChatInviteParams);
		else
			this.$scope.joinPrivateRoom(status.partner);
	};

    private getPartnerFromRoomId = (roomId: RoomId) => {
        const partnerId = this.roomsService.partnerIdFrom(roomId);
        return this.chatUsersService.getUser(partnerId);
    };

	private showUserModal = (userOrItsId: UserId | ITextChatUser, hideChatButton?: boolean) => {

		let user: ITextChatUser;
		if (angular.isObject(userOrItsId)) user = <ITextChatUser>userOrItsId;
		else user = <ITextChatUser>{ id: <UserId>userOrItsId };

		this.showChatRequestMessageInProfile = false;

		this.$uibModal.open({
			templateUrl: "modal-profile-view.tpl",
			controllerAs: "modalCtrl",
			controller: () => <IModalProfileViewCtrl>{
				user: user as ILightUser,
				showButtons: () =>  !this.showChatRequestMessageInProfile,
				hasViewChatButton: () => !this.isUserMuted(user.id) && !hideChatButton && user.isPrivatePartner,
				hasRequestChatButton: () => !this.isUserMuted(user.id) && !hideChatButton && !user.isPrivatePartner,
				hasLightMailButton: () => !this.isUserMuted(user.id),
				switchUserMute: () => this.switchUserMute(user.id),
				requestChat: (user) => this.requestChat(user),
				hasChatRequestedMessage: () => this.showChatRequestMessageInProfile,
				isMuted: () => this.isUserMuted(user.id)
			}
        });
    }

    addUserToChat(args: ITextChatUser) {
	    const user = new TextChatUser(args);
	    user.isPinned = this.contactsService.isUserInContacts(user.id);
        user.isSelf = user.id === this.localUser.id;
        this.chatUsersService.addUser(user);
		this.$scope.privateChatStatuses.forEach((status) => {
			if (status.partner.id === user.id) {
				user.isPrivatePartner = true;
				if (status.statusId === TextChat.TrackerStatus.Invited || status.statusId === TextChat.TrackerStatus.InviteAccepted)
					this.addChatRequest(user, status.statusId); // Rethrow invites when the partner is present
			}
		});
		user.recentlyJoinedRooms.push(Config.lobbySpecialRoom.name);
    }

    // ======= Audio call methods ====

    requestAudioCallTimeout: ng.IPromise<void>;

    private isAudioCallAllowed(roomId) {
        // Check if any other room currently has audioCall activity
        for (let id in this.roomsService.rooms) {
            if (this.roomsService.rooms[id].audioCallState) {
                this.renderAudioCallChatMessage(roomId, "busy");
                return false;
            }
        }

        return true;
    }

    requestAudioCall = (roomId: RoomId) => {
        if (!this.isAudioCallAllowed(roomId)) return;

        this.$log.appInfo("RequestAudioCallStarted", { roomId });
        this.roomsService.rooms[roomId].audioCallState = AudioCallState.initializing;

        var onPeerCreatedCallback = (peer) => this.peerCreatedHandler(this.roomsService.rooms[roomId], peer);
        this.rtc.startRoomAudioCall(roomId, onPeerCreatedCallback, true)
            .then(() => {
                this.$log.appInfo("SendingRequestAudioCall", { roomId });
                this.chatHub.requestAudioCall(roomId);
                this.requestAudioCallTimeout = this.$timeout((roomId: RoomId) => {
                    const room = this.roomsService.rooms[roomId];
                    if (room.audioCallState !== AudioCallState.initializing) return;
                    this.cancelAudioCall(roomId, "timeout");
                }, TextChatCtrl.audioCallRequestTimeoutInMs, true, roomId);
            }, (cause) => {
                this.$log.appWarn("AbortingRequestAudioCall", { cause });
                this.roomsService.rooms[roomId].audioCallState = null;
                this.renderAudioCallChatMessage(roomId, `unsupported_${cause}`);
            });
    }

	acceptAudioCall = (roomId: RoomId) => {
        this.$log.appInfo("AudioCallAcceptRequest", { roomId });
        this.audioCallRequests.remove(roomId);
        var onPeerCreatedCallback = (peer) => this.peerCreatedHandler(this.roomsService.rooms[roomId], peer);
        this.rtc.startRoomAudioCall(roomId, onPeerCreatedCallback, false)
            .then(	() => { this.$log.appInfo("AudioCallAccepted", { roomId }); },
					() => { this.declineAudioCall(roomId, "unsupported_device"); } );
    }

	declineAudioCall = (roomId: RoomId, reason = "declined") => {
        this.$log.appInfo("DeclineAudioCall", { roomId, reason });
        this.audioCallCleanup(roomId);
        if (reason !== "declined") this.renderAudioCallChatMessage(roomId, `decline_${reason}`);
        this.chatHub.declineAudioCall(roomId, reason);
    }

	cancelAudioCall = (roomId: RoomId, reason: Services.FinishCallReason = "cancelled") => {
        this.$log.appInfo("CancelAudioCall", { roomId, reason });
        this.audioCallCleanup(roomId);
        this.rtc.stopAudioCall(reason);
        this.chatHub.cancelAudioCall(roomId);
    }

	hangUpAudioCall = (roomId: RoomId) => {
        this.$log.appInfo("HangUpAudioCall", { roomId });
        this.finishAudioCall(roomId);
        this.chatHub.hangoutAudioCall(roomId);
    }

	// ======= Audio call hub message handlers ====

    private audioCallRequested = (roomId: RoomId) => {
        this.$log.appInfo("AudioCallRequested", { roomId });
		const partnerId = this.roomsService.partnerIdFrom(roomId);
		if (this.isUserMuted(partnerId)) {
			this.$log.appInfo("AudioCallMutedFor", { roomId, partnerId });
			return;
		}

		this.audioCallRequests.add(roomId);

        const room = this.roomsService.rooms[roomId];
        if (room) {
            this.notifyOfMessageAddition(roomId);
        } else { // room is missing if the request has been made to a user who's not in the room
            var partner = this.getPartnerFromRoomId(roomId);
            this.addChatRequest(partner, TextChat.TrackerStatus.UnreadMessages);
            this.increaseNotificationCount();
            return;
        }

        // Send 'busy' if the user already have ongoing audio call
        if (this.rtc.roomId && this.rtc.roomId !== roomId) {
            this.declineAudioCall(roomId, "busy");
            return;
        }

        // Check capabilities and reply accordingly
        this.rtc.checkCapabilities().then(
            () => {
                room.audioCallState = AudioCallState.requested;
                this.increaseNotificationCount();
            },
            (reason) => this.declineAudioCall(roomId, `unsupported_${reason}`)
        );
    }

	private audioCallCancelled(roomId: RoomId) {
        this.$log.appInfo("AudioCallCancelled", { roomId });
        this.decreaseNotificationCount();
        this.audioCallCleanup(roomId);
    }

    private audioCallDeclined(roomId: RoomId, reason: string) {
        this.$log.appInfo("AudioCallDeclined", { roomId });

        const room = this.roomsService.rooms[roomId];
        if (!room || this.audioCallRequests.contains(roomId)) { // This happens if the callee has declined the call through another connection
            this.audioCallCleanup(roomId);
            return;
        }

        this.audioCallCleanup(roomId);

        reason = `peer_${reason}`;

        // Map Reason to message
        var messageKey = reason;
        if (reason.indexOf("unsupported") > -1) messageKey = "peer_unsupported";
        if (reason.indexOf("leftRoom") > -1) messageKey = "peer_disconnected";
        this.renderAudioCallChatMessage(roomId, messageKey);

        // Stop the audio call;
        this.rtc.stopAudioCall(<Services.FinishCallReason>reason);
    }

    private audioCallHangouted(roomId: RoomId, userId: UserId) {
        this.$log.appInfo("AudioCallHungUp", { roomId });
        if (userId === this.localUser.id) return;
        if (!this.roomsService.rooms[roomId]) return;
        this.finishAudioCall(roomId, "peer_hangout");
    }

    finishAudioCall(roomId: RoomId, reason: Services.FinishCallReason = "hangout") {
        const room = this.roomsService.rooms[roomId];
        if (room && (!room.audioCallState || room.audioCallState === AudioCallState.finishing)) return;
        var eventData: any = { roomId: roomId, userId: this.localUser.id, reason: reason };
        this.$log.appInfo("AudioCallFinishing", eventData);
        this.audioCallCleanup(roomId);
        if (room) room.audioCallState = AudioCallState.finishing;
        this.renderAudioCallChatMessage(roomId, reason);
        this.rtc.stopAudioCall(reason).then(() => {
            if (room) room.audioCallState = null;
            this.$log.appInfo("AudioCallFinished", eventData);
        });
    }

    private cancelAudioCallTimeout() {
        if (this.requestAudioCallTimeout) {
            this.$timeout.cancel(this.requestAudioCallTimeout);
            this.requestAudioCallTimeout = null;
        }
    }

    private renderAudioCallChatMessage(roomId: RoomId, reason: string) {
        var messageText: string;

		switch (reason) {
			case "busy": messageText = this.audioMessages.busy; break;
			case "unsupported_device": messageText = this.audioMessages.unsupportedDevice; break;
			case "unsupported_browser": messageText = this.audioMessages.unsupportedBrowser; break;
			case "unsupported_join": messageText = this.audioMessages.unsupportedJoin; break;
			case "decline_unsupported_device": messageText = this.audioMessages.declineUnsupportedDevice; break;
			case "decline_unsupported_browser": messageText = this.audioMessages.declineUnsupportedBrowser; break;
			case "decline_busy": messageText = this.audioMessages.declineBusy; break;
			case "peer_declined": messageText = this.audioMessages.peerDeclined; break;
			case "peer_unsupported": messageText = this.audioMessages.peerUnsupported; break;
			case "peer_busy": messageText = this.audioMessages.peerBusy; break;
			case "hangout": messageText = this.audioMessages.hangout; break;
			case "peer_hangout": messageText = this.audioMessages.peerHangout; break;
			case "peer_disconnected": messageText = this.audioMessages.peerDisconnected; break;
			default: this.$log.appError("FailedToMapReasonToMessage", { reason }); return;
        }

        // Display the message in the chat
        var text = JSON.stringify({ audioMessage: messageText });
        this.$timeout(() => this.roomsService.rooms[roomId].accessor.addMessage(MessageOrigin.system, null, null, null, text)); // Timeout b/c automated responses arrive too soon when activateAudioCallRequestFor() is triggered
    }

    private audioCallCleanup(roomId: RoomId) {
        this.cancelAudioCallTimeout();
		const room = this.roomsService.rooms[roomId];
        if (room) room.audioCallState = null;

        // Clean the private room audioState
        if (this.audioCallRequests.contains(roomId)) {
            this.audioCallRequests.remove(roomId);
        }
    }

    private peerCreatedHandler(room: TextChatRoomModel, peer) {
		this.$log.appInfo("PeerCreatedHandler", { roomId: room.roomId });

		if (!room.audioCallState) {
            this.$log.appError("RoomAudioCallStateMissing", { roomId: room.roomId, userId: this.localUser.id });
			return;
		}

        if (room.audioCallState !== AudioCallState.connected) {
            this.$log.appInfo("AudioCallConnected", { roomId: room.roomId, userId: this.localUser.id });
            this.cancelAudioCallTimeout();
            room.audioCallState = AudioCallState.connected;
            room.accessor.addMessage(MessageOrigin.system, null, null, null, JSON.stringify({ audioStarted: this.audioMessages.youreConnected }));
            this.chatHub.audioCallConnected(room.roomId);
        } else 
            this.$log.appError("UnexpectedRoomAudioCallState", { roomId: room.roomId, audioCallState: room.audioCallState });

        if (!peer || !peer.pc) {
            this.$log.appError("MissingAudioPeerHanlder", { roomId: room.roomId });
	        return;
        }

        peer.pc.on("iceConnectionStateChange", (event) => {
			this.$log.appInfo("IceConnectionStateChange", { state: peer.pc.iceConnectionState });
            if (peer.pc.iceConnectionState === "closed" || peer.pc.iceConnectionState === "failed") {
                if (!room.audioCallState) {
					this.$log.appWarn("MissingAudioCallStateOnIceClose", { roomId: room.roomId, iceState: peer.pc.iceConnectionState });
					return;
                }
				if (peer.pc.iceConnectionState === "failed") this.$log.appInfo("IceConnectionFailed", { roomId: room.roomId, audioCallState: room.audioCallState });
                this.finishAudioCall(room.roomId, "peer_disconnected");
            } else 
				this.$log.appWarn("UnhandledIceConnectionState", { state: peer.pc.iceConnectionState, audioCallState: room.audioCallState });
        });
    }

	// ======= Unsorted Methods ====

    increaseNotificationCount() {
        if (this.$state.includes(States.textChat.name) === false) {
            const counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            this.countersService.setCounterValue(Services.Counters.TextChat, counterVal + 1);
        }
    }

    decreaseNotificationCount() {
        if (this.$state.includes(States.textChat.name) === false) {
            const counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            if (counterVal > 0) this.countersService.setCounterValue(Services.Counters.TextChat, counterVal - 1);
        }
    }

	onRoomInputKeyDown(keyCode: Number, roomId: string) {
		// Handle navigation between rooms with up and down keys.
		const sortedRoomIds = Object.keys(this.roomsService.rooms);
		if (sortedRoomIds.length >= 2 && (keyCode === 38 || keyCode === 40)) {
			// Move undocked rooms to the end of the array
			const fxMoveRoomToEnd = room => sortedRoomIds.push(sortedRoomIds.splice(sortedRoomIds.indexOf(room.roomId), 1)[0]);
			this.$scope.undockedRooms.forEach(fxMoveRoomToEnd);

			const roomIdIndex = sortedRoomIds.indexOf(roomId);
			//Arrow Up = 38 
			if (keyCode === 38 && roomIdIndex > 0) {
				if (this.roomsService.rooms[roomId].isUndocked)
					this.roomsService.rooms[sortedRoomIds[roomIdIndex - 1]].accessor.setFocusOnInput();
				this.showRoom(sortedRoomIds[roomIdIndex - 1]);
				this.$scope.$apply();
			}

			// Arrow Down = 40
			if (keyCode === 40 && roomIdIndex < sortedRoomIds.length - 1) {
				const nextRoomIndex = roomIdIndex + 1;
				const selectedRoom = this.roomsService.rooms[sortedRoomIds[nextRoomIndex]];
				if (!selectedRoom.isUndocked) this.showRoom(sortedRoomIds[nextRoomIndex]);
				else selectedRoom.accessor.setFocusOnInput();
				this.$scope.$apply();
			}
		}

		// Mark user as typing
		if (keyCode !== 13 && keyCode !== 38 && keyCode !== 40 && this.emitTyping) this.chatHub.setTypingActivityIn(roomId);
	}

	switchUserMute = (userId: UserId) => {
		var [logTag, action, event] = this.isUserMuted(userId) ?
			["ChatUserUnmuted", (id) => this.removeMutedUserIdFromCookies(id), "UnmutedUser"] :
			["ChatUserMuted",   (id) => this.addMutedUserIdToCookies(id)     , "MutedUser"];
		this.$log.appInfo(logTag as any, { userId });
		this.chatHub.postChatEventTo(this.currentRoomId() ? this.currentRoomId() : "none", event, userId);
		action(userId);
	};

	addMutedUserIdToCookies(userId: UserId) {
		let cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
		if (!cookiesValueString)
			cookiesValueString = "[]";
		let mutedUsers = JSON.parse(cookiesValueString) as Array<number>;
		if (!mutedUsers.some((id) => id === userId))
			mutedUsers.push(userId);
		this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
		this.loadMutedUsers(); // reload users in memory
	}

	isUserMuted(userId: UserId) {
		return this.mutedUsers.some((id) => id === userId);
	}

	removeMutedUserIdFromCookies(userId: UserId) {
		let cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
		if (cookiesValueString) {
			let mutedUsers = JSON.parse(cookiesValueString) as Array<number>;
			const indx = mutedUsers.indexOf(userId);
			if (indx !== -1) {
				mutedUsers.splice(indx, 1);
				this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
			}
		}
		this.loadMutedUsers(); // reload users in memory
	}

	loadMutedUsers() {
		let cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
		if (cookiesValueString)
			this.mutedUsers = JSON.parse(cookiesValueString) as Array<number>;
	}

	openSettings = () => {
		const settings: Services.ITextChatSettings = {
			isAudioNotificationOn: Runtime.TextChatSettings.playMessageAddedSound.valueOf(),
			isPrivateChatOn: !this.userService.getUser().isNoPrivateChat
		};
		const settingsResult = this.textChatSettings.openSettings(settings);
		settingsResult.then((settings: Services.ITextChatSettings) => {
			Runtime.TextChatSettings.playMessageAddedSound = settings.isAudioNotificationOn;
			this.userService.setNoPrivateChat(!settings.isPrivateChatOn);
		});
	}

	applyPendingStateRequest() {
		if (this.pendingStateRequest)
			this.applyStateChange(this.pendingStateRequest);
		this.pendingStateRequest = null;
	}

}

// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬ CLASSES AND ENUMS FOR THIS CONTROLLER ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

class MessageOrigin {
    static self = "Self";
    static otherUser = "OtherUser";
    static news = "News";
    static system = "System";
};

class TextChatUser implements ITextChatUser {
    constructor(user: ITextChatUser) {
        for (let prop in user) this[prop] = user[prop];
    }
    id: UserId;
    isSelf: boolean = false;
    firstName: FirstName;
    lastName: LastName;
    country: number;
    location: string;
    gender: string;
    age: number;
    isSharedTalkMember: boolean;
    knows: LangId;
    learns: LangId;
    knows2: LangId;
    learns2: LangId;
    roomTypingIn: RoomId;
    recentlyJoinedRooms: RoomId[] = [];
    hasJustLeft: boolean;
    isPinned = false;
    isPrivatePartner = false;
}

class ListOfUsersPublicRooms {
	userId: UserId;
	roomIds: RoomId[];
	isNoPrivateChat: boolean;
}
