module TextChat {

	export class TextChatLobbyCtrl {

		static $inject = ["$scope", "$uibModal", "chatUsersService", "$state", "userService", "serverResources", "textChatRoomsService"];
		constructor($scope: ng.IScope, private $uibModal: ng.ui.bootstrap.IModalService, private chatUsersService: Services.ChatUsersService,
			private $state: ng.ui.IStateService, private userService: Authentication.IUserService,
			private serverResources: Services.IServerResourcesService, private roomsService: Services.TextChatRoomsService) {

			// Watch for changes in the count of users
			$scope.$watchCollection(() => this.chatUsersService.countOfUsers, (newCounts: Services.ICountOfUsers) => {
				this.privateUsersCount = newCounts.inPrivateRooms;
				this.secretRoomsUsersCount = newCounts.inSecretRooms;
			});
			$scope.$watchCollection(() => this.chatUsersService.countOfUsers.forPublicRooms, (newCounts: { [roomId: string]: number }) => {
				angular.forEach(this.allRooms, (room: ILobbyRoom) => room.countOfUsers = newCounts[room.roomId] );
				this.filteredRooms = this.getFilteredListOfRooms();
			});

			$scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, (event, toState, toStateParams) => delete this.selectedUserId);

			$scope.$on("onPrivateChatRequestResponseReceived", (e, listOfRooms: ListOfUsersPublicRooms) => {
				this.showRequestingChatLoaderInProfile = false;
				if (listOfRooms.isNoPrivateChat) {
					this.selectedUserListOfRooms = <[{ title: string, url: string }]>[];
					listOfRooms.roomIds.forEach(roomId => {
						var title: string = null, url: string;
						if (angular.isDefined(Config.TopicChatRooms[roomId])) title = Config.TopicChatRooms[roomId].text;
						else if (angular.isDefined(Languages[roomId])) title = Languages[roomId].text;
						else if (roomId.indexOf("+") !== -1) {
							var [langA, langB] = roomId.split('+');
							title = Languages[langA].text + " + " + Languages[langB].text;
							url = this.$state.href(this.$state.get(States.textChatRoomDualLang.name), { langA, langB });
						}
						if (url == null) url = this.$state.href(this.$state.get(States.textChatRoomPublic.name), { roomId });
						if (title) this.selectedUserListOfRooms.push({ title, url });
					});
				} else {
					this.showChatRequestMessageInProfile = true;
				}
			});

		}

		languages = Languages.langsById;
		countries = this.serverResources.getCountries();
		lobbyRoomId = Config.lobbySpecialRoom.name;

		allRooms: Array<ILobbyRoom> = this.getListOfRooms();
		filteredRooms: Array<ILobbyRoom> = this.getFilteredListOfRooms();
		isRoomJoined = (roomId: RoomId) => this.joinedRooms[roomId];
		isPrivateRoomJoined = (partnerId: UserId) => this.joinedRooms[this.roomsService.privateRoomIdFrom(partnerId)] != null;
		joinedRooms: { [roomId: string]: TextChatRoomModel };

		onlineUsers = this.chatUsersService.onlineUsers;
		justLeftUsers = this.chatUsersService.justLeftUsers;

		privateUsersCount: number;
		secretRoomsUsersCount: number;
		totalUsersCount = () => this.onlineUsers.length + this.justLeftUsers.length + Math.round(this.onlineUsers.length /5);

		selectedUserId: UserId;
		selectedUserListOfRooms: [{ title: string, url: string }] = null;

		showRequestingChatLoaderInProfile: Boolean;
		showChatRequestMessageInProfile: Boolean;

		currentTierFilter = 2;

		unMarkRecentUser = (user: TextChatUser) => this.chatUsersService.unMarkRecentUser(user, Config.lobbySpecialRoom.name);
		onUserClick = (userId) => {
			this.selectedUserId = this.selectedUserId === userId ? undefined : userId;
			this.showChatRequestMessageInProfile = false;
			this.showRequestingChatLoaderInProfile = false;
			this.selectedUserListOfRooms = null;
		};

		requestChat: (user) => void; // From directive bindings
		onRequestChat = (userObj: { user: TextChatUser}) => {
			this.showRequestingChatLoaderInProfile = true;
			this.selectedUserId = userObj.user.id;
			this.requestChat(userObj);
		}

		getListOfRooms(): Array<ILobbyRoom> {
			const user = this.userService.getUser();
			const rooms = new Array<ILobbyRoom>();
			const userLangIds = [user.knows, user.knows2, user.learns, user.learns2].filter(n => n !== null && n !== undefined);

			// Add rooms for each language the user has
			angular.forEach(userLangIds, (langId: LangId) => {
				var language = Languages.langsById[langId];
				var roomUrl = this.$state.href(States.textChatRoomPublic.name, { roomId: language.name } as IRoomStateParams);
				rooms.push({ roomId: language.name, roomLabel: language.text, roomUrl, tier: 1 });
			});

			//// Add dual language rooms for each language the user has
			var addedRoomIds = new Array<RoomId>();
			angular.forEach(userLangIds, (langIdA: LangId) => {
				angular.forEach(userLangIds, (langIdB: LangId) => {
					// Let's not create dual language rooms with the same language and limit rooms combination to major languages, because combination of smaller languages won't work anytime soon, if ever
					if (langIdA === langIdB || langIdA > 11 || langIdB > 11) return;

					const [langA, langB] = langIdA < langIdB ? [Languages.langsById[langIdA], Languages.langsById[langIdB]] : [Languages.langsById[langIdB], Languages.langsById[langIdA]];

					// Check if we have already added that room
					var roomId: RoomId = langA.name + "+" + langB.name;
					if (addedRoomIds.indexOf(roomId) !== -1) return;
					addedRoomIds.push(roomId);

					var roomUrl = this.$state.href(States.textChatRoomDualLang.name, { langA: langA.name, langB: langB.name } as IRoomStateParams);
					rooms.push({ roomId, roomLabel: langA.text + " + " + langB.text, roomUrl,  tier: 1 });
				});
			});

			// Add Hellolingo room
			//var roomUrl = this.$state.href(States.textChatRoomPublic.name, { roomId: Config.TopicChatRooms.hellolingo.name } as IRoomStateParams);
			//rooms.push({ roomId: Config.TopicChatRooms.hellolingo.name, roomLabel: Config.TopicChatRooms.hellolingo.text, roomUrl: roomUrl, tier: 1 });

			// Add other rooms
			var otherRooms = new Array<ILobbyRoom>();
			angular.forEach(Languages.langsById, (lang: ILanguage) => {
				if (userLangIds.some(id => Languages.langsById[id].name === lang.name)) return;
				var roomUrl = this.$state.href(States.textChatRoomPublic.name, { roomId: lang.name } as IRoomStateParams);
				otherRooms.push({ roomId: lang.name, roomLabel: lang.text, roomUrl: roomUrl, tier: 3 });
			});
			otherRooms = otherRooms.sort((a, b) => a.roomLabel <= b.roomLabel ? -1 : 1);

			return rooms.concat(otherRooms);
		}

		getFilteredListOfRooms() {
			return this.allRooms.filter(room => room.tier <= this.currentTierFilter || (this.currentTierFilter === 2 && room.countOfUsers >= 2));
		}

		switchFilter = () => {
			this.currentTierFilter = (this.currentTierFilter % 3) + 1; // Increment by 1, but restart to 1 if it goes over 3
			this.filteredRooms = this.getFilteredListOfRooms();
		};

		sortUsersByName() {
			this.chatUsersService.unmarkRecentUsers();
			this.chatUsersService.sortBy(Services.UsersSortingOptions.Name);
		}
		sortUsersByKnows() {
			this.chatUsersService.unmarkRecentUsers();
			this.chatUsersService.sortBy(Services.UsersSortingOptions.Knows);
		}
		sortUsersByLearns() {
			this.chatUsersService.unmarkRecentUsers();
			this.chatUsersService.sortBy(Services.UsersSortingOptions.Learns);
		}
		sortUsersByCountry() {
			this.chatUsersService.unmarkRecentUsers();
			this.chatUsersService.sortBy(Services.UsersSortingOptions.Country);
		}

	}
}