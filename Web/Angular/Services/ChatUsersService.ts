module Services {

	export interface ICountOfUsers { forPublicRooms: { [roomId: string]: number }, inPrivateRooms: number, inSecretRooms: number } 

	export enum UsersSortingOptions { Default, Name, Knows, Learns, Country }

	export class ChatUsersService {

		static quittersRatio = 1/10;

		static $inject = ["$timeout", "userService", "$filter", "serverResources", "$log"];
		constructor(private $timeout: ng.ITimeoutService, private userService: Authentication.IUserService, private $filter: ng.IFilterService, private serverResources: IServerResourcesService, private $log: EnhancedLog) {
			// Clear all the typing indicators because they sometimes persist forever...
			setInterval(() => this.forEachUser((user: TextChatUser) => {
				user.roomTypingIn = undefined; // This doesn't apply immediately :-( It applies only if the user is active on the interface (some sort of $scope.apply taking places...)
			}), 5 * 60 * 1000 /* 5 min */);
		}

		public onlineUsers: Array<TextChatUser> = [];
		public justLeftUsers: Array<TextChatUser> = [];

		public countOfUsers: ICountOfUsers = { forPublicRooms: {}, inPrivateRooms: 0, inSecretRooms: 0 };

		private derivedUserLists = [this.onlineUsers, this.justLeftUsers] as TextChatUser[][];
		private countries = this.serverResources.getCountries();

		clearAllUsers() {
			// This initialization approach protects from losing bindings somehwere else
			angular.copy([], this.onlineUsers); 
			angular.copy([], this.justLeftUsers); 

			// Fake users for debugging purposes. Do not remove!
			//var someUsers: { [userId: number]: TextChatUser } = { };
			//someUsers[101] = new TextChatUser(<ITextChatUser>{ id: 101, isSelf: false, firstName: "Alice", lastName: "Acupuncturist", country: 100, location: "", gender: "F", age: 20, isSharedTalkMember: false, knows: 1, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[102] = new TextChatUser(<ITextChatUser>{ id: 102, isSelf: false, firstName: "Bob", lastName: "Babysitter", country: 101, location: "", gender: "M", age: 21, isSharedTalkMember: false, knows: 1, learns: 3, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[103] = new TextChatUser(<ITextChatUser>{ id: 103, isSelf: false, firstName: "Carol", lastName: "Cartoonist", country: 102, location: "", gender: "F", age: 22, isSharedTalkMember: true, knows: 1, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[104] = new TextChatUser(<ITextChatUser>{ id: 104, isSelf: false, firstName: "Dave", lastName: "Dentist", country: 103, location: "", gender: "M", age: 23, isSharedTalkMember: false, knows: 1, learns: 5, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[105] = new TextChatUser(<ITextChatUser>{ id: 105, isSelf: false, firstName: "Eve", lastName: "Etymologist", country: 104, location: "", gender: "F", age: 24, isSharedTalkMember: false, knows: 1, learns: 6, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[106] = new TextChatUser(<ITextChatUser>{ id: 106, isSelf: false, firstName: "Frank", lastName: "Fishermen", country: 105, location: "", gender: "M", age: 25, isSharedTalkMember: true, knows: 1, learns: 7, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[107] = new TextChatUser(<ITextChatUser>{ id: 107, isSelf: false, firstName: "Grace", lastName: "Geographer", country: 106, location: "", gender: "F", age: 26, isSharedTalkMember: false, knows: 1, learns: 8, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[108] = new TextChatUser(<ITextChatUser>{ id: 108, isSelf: false, firstName: "Henry", lastName: "Hammersmiths", country: 107, location: "", gender: "M", age: 27, isSharedTalkMember: false, knows: 1, learns: 9, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[109] = new TextChatUser(<ITextChatUser>{ id: 109, isSelf: false, firstName: "Isabel", lastName: "Interpreter", country: 108, location: "", gender: "F", age: 28, isSharedTalkMember: true, knows: 1, learns: 10, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[110] = new TextChatUser(<ITextChatUser>{ id: 110, isSelf: false, firstName: "Jack", lastName: "Jeweler", country: 109, location: "", gender: "M", age: 29, isSharedTalkMember: false, knows: 1, learns: 11, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[111] = new TextChatUser(<ITextChatUser>{ id: 111, isSelf: false, firstName: "Kelly", lastName: "Knitter", country: 110, location: "", gender: "F", age: 30, isSharedTalkMember: false, knows: 2, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[112] = new TextChatUser(<ITextChatUser>{ id: 112, isSelf: false, firstName: "Larry", lastName: "Landscaper", country: 111, location: "", gender: "M", age: 31, isSharedTalkMember: false, knows: 2, learns: 3, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[113] = new TextChatUser(<ITextChatUser>{ id: 113, isSelf: false, firstName: "Megan", lastName: "Mayor", country: 112, location: "", gender: "F", age: 32, isSharedTalkMember: true, knows: 2, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[114] = new TextChatUser(<ITextChatUser>{ id: 114, isSelf: false, firstName: "Nathan", lastName: "Neurosurgeon", country: 113, location: "", gender: "M", age: 33, isSharedTalkMember: false, knows: 2, learns: 5, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[115] = new TextChatUser(<ITextChatUser>{ id: 115, isSelf: false, firstName: "Oscar", lastName: "Outfitter", country: 114, location: "", gender: "M", age: 34, isSharedTalkMember: false, knows: 3, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[116] = new TextChatUser(<ITextChatUser>{ id: 116, isSelf: false, firstName: "Peggy", lastName: "Plumber", country: 115, location: "", gender: "F", age: 35, isSharedTalkMember: true, knows: 3, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[117] = new TextChatUser(<ITextChatUser>{ id: 117, isSelf: false, firstName: "Quincy", lastName: "Quartermaster", country: 116, location: "", gender: "M", age: 36, isSharedTalkMember: true, knows: 3, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[118] = new TextChatUser(<ITextChatUser>{ id: 118, isSelf: false, firstName: "Rebecca", lastName: "Reporter", country: 117, location: "", gender: "F", age: 37, isSharedTalkMember: false, knows: 3, learns: 5, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[119] = new TextChatUser(<ITextChatUser>{ id: 119, isSelf: false, firstName: "Scott", lastName: "Reporter", country: 118, location: "", gender: "M", age: 38, isSharedTalkMember: false, knows: 4, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[120] = new TextChatUser(<ITextChatUser>{ id: 120, isSelf: false, firstName: "Tyler", lastName: "Steward", country: 119, location: "", gender: "M", age: 39, isSharedTalkMember: true, knows: 4, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[121] = new TextChatUser(<ITextChatUser>{ id: 121, isSelf: false, firstName: "Ursula", lastName: "Tattooist", country: 120, location: "", gender: "F", age: 40, isSharedTalkMember: false, knows: 4, learns: 3, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[122] = new TextChatUser(<ITextChatUser>{ id: 122, isSelf: false, firstName: "Victoria", lastName: "Umpire", country: 121, location: "", gender: "F", age: 41, isSharedTalkMember: false, knows: 5, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[123] = new TextChatUser(<ITextChatUser>{ id: 123, isSelf: false, firstName: "Walter", lastName: "Valet", country: 122, location: "", gender: "M", age: 42, isSharedTalkMember: false, knows: 5, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[124] = new TextChatUser(<ITextChatUser>{ id: 124, isSelf: false, firstName: "Xandra", lastName: "Wrestler", country: 123, location: "", gender: "F", age: 43, isSharedTalkMember: true, knows: 5, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[125] = new TextChatUser(<ITextChatUser>{ id: 125, isSelf: false, firstName: "Yanis", lastName: "Yardmaster", country: 124, location: "", gender: "M", age: 44, isSharedTalkMember: false, knows: 5, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[126] = new TextChatUser(<ITextChatUser>{ id: 126, isSelf: false, firstName: "Zach", lastName: "Zoologist", country: 125, location: "", gender: "M", age: 45, isSharedTalkMember: false, knows: 6, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[201] = new TextChatUser(<ITextChatUser>{ id: 201, isSelf: false, firstName: "Alice", lastName: "Acupuncturist", country: 100, location: "", gender: "F", age: 20, isSharedTalkMember: false, knows: 1, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[202] = new TextChatUser(<ITextChatUser>{ id: 202, isSelf: false, firstName: "Bob", lastName: "Babysitter", country: 101, location: "", gender: "M", age: 21, isSharedTalkMember: false, knows: 1, learns: 3, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[203] = new TextChatUser(<ITextChatUser>{ id: 203, isSelf: false, firstName: "Carol", lastName: "Cartoonist", country: 102, location: "", gender: "F", age: 22, isSharedTalkMember: true, knows: 1, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[204] = new TextChatUser(<ITextChatUser>{ id: 204, isSelf: false, firstName: "Dave", lastName: "Dentist", country: 103, location: "", gender: "M", age: 23, isSharedTalkMember: false, knows: 1, learns: 5, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[205] = new TextChatUser(<ITextChatUser>{ id: 205, isSelf: false, firstName: "Eve", lastName: "Etymologist", country: 104, location: "", gender: "F", age: 24, isSharedTalkMember: false, knows: 1, learns: 6, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[206] = new TextChatUser(<ITextChatUser>{ id: 206, isSelf: false, firstName: "Frank", lastName: "Fishermen", country: 105, location: "", gender: "M", age: 25, isSharedTalkMember: true, knows: 1, learns: 7, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[207] = new TextChatUser(<ITextChatUser>{ id: 207, isSelf: false, firstName: "Grace", lastName: "Geographer", country: 106, location: "", gender: "F", age: 26, isSharedTalkMember: false, knows: 1, learns: 8, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[208] = new TextChatUser(<ITextChatUser>{ id: 208, isSelf: false, firstName: "Henry", lastName: "Hammersmiths", country: 107, location: "", gender: "M", age: 27, isSharedTalkMember: false, knows: 1, learns: 9, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[209] = new TextChatUser(<ITextChatUser>{ id: 209, isSelf: false, firstName: "Isabel", lastName: "Interpreter", country: 108, location: "", gender: "F", age: 28, isSharedTalkMember: true, knows: 1, learns: 10, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[210] = new TextChatUser(<ITextChatUser>{ id: 210, isSelf: false, firstName: "Jack", lastName: "Jeweler", country: 109, location: "", gender: "M", age: 29, isSharedTalkMember: false, knows: 1, learns: 11, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[211] = new TextChatUser(<ITextChatUser>{ id: 211, isSelf: false, firstName: "Kelly", lastName: "Knitter", country: 110, location: "", gender: "F", age: 30, isSharedTalkMember: false, knows: 2, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[212] = new TextChatUser(<ITextChatUser>{ id: 212, isSelf: false, firstName: "Larry", lastName: "Landscaper", country: 111, location: "", gender: "M", age: 31, isSharedTalkMember: false, knows: 2, learns: 3, learns2: 21, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[213] = new TextChatUser(<ITextChatUser>{ id: 213, isSelf: false, firstName: "Megan", lastName: "Mayor", country: 112, location: "", gender: "F", age: 32, isSharedTalkMember: true, knows: 2, learns: 4, learns2: 22, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[214] = new TextChatUser(<ITextChatUser>{ id: 214, isSelf: false, firstName: "Nathan", lastName: "Neurosurgeon", country: 113, location: "", gender: "M", age: 33, isSharedTalkMember: false, knows: 2, learns: 5, learns2: 23, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[215] = new TextChatUser(<ITextChatUser>{ id: 215, isSelf: false, firstName: "Oscar", lastName: "Outfitter", country: 114, location: "", gender: "M", age: 34, isSharedTalkMember: false, knows: 3, learns: 1, learns2: 25, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[216] = new TextChatUser(<ITextChatUser>{ id: 216, isSelf: false, firstName: "Peggy", lastName: "Plumber", country: 115, location: "", gender: "F", age: 35, isSharedTalkMember: true, knows: 3, learns: 2, learns2: 25, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[217] = new TextChatUser(<ITextChatUser>{ id: 217, isSelf: false, firstName: "Quincy", lastName: "Quartermaster", country: 116, location: "", gender: "M", age: 36, isSharedTalkMember: true, knows: 3, knows2: 29, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[218] = new TextChatUser(<ITextChatUser>{ id: 218, isSelf: false, firstName: "Rebecca", lastName: "Reporter", country: 117, location: "", gender: "F", age: 37, isSharedTalkMember: false, knows: 3, knows2: 27, learns: 5, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[219] = new TextChatUser(<ITextChatUser>{ id: 219, isSelf: false, firstName: "Scott", lastName: "Reporter", country: 118, location: "", gender: "M", age: 38, isSharedTalkMember: false, knows: 4, knows2: 26, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[220] = new TextChatUser(<ITextChatUser>{ id: 220, isSelf: false, firstName: "Tyler", lastName: "Steward", country: 119, location: "", gender: "M", age: 39, isSharedTalkMember: true, knows: 4, knows2: 25, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[221] = new TextChatUser(<ITextChatUser>{ id: 221, isSelf: false, firstName: "Ursula", lastName: "Tattooist", country: 120, location: "", gender: "F", age: 40, isSharedTalkMember: false, knows: 4, knows2: 25, learns: 3, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[222] = new TextChatUser(<ITextChatUser>{ id: 222, isSelf: false, firstName: "Victoria", lastName: "Umpire", country: 121, location: "", gender: "F", age: 41, isSharedTalkMember: false, knows: 5, knows2: 21, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[223] = new TextChatUser(<ITextChatUser>{ id: 223, isSelf: false, firstName: "Walter", lastName: "Valet", country: 122, location: "", gender: "M", age: 42, isSharedTalkMember: false, knows: 5, knows2: 23, learns: 2, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: true });
			//someUsers[224] = new TextChatUser(<ITextChatUser>{ id: 224, isSelf: false, firstName: "Xandra", lastName: "Wrestler", country: 123, location: "", gender: "F", age: 43, isSharedTalkMember: true, knows: 5, knows2: 22, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[225] = new TextChatUser(<ITextChatUser>{ id: 225, isSelf: false, firstName: "Yanis", lastName: "Yardmaster", country: 124, location: "", gender: "M", age: 44, isSharedTalkMember: false, knows: 5, learns: 4, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//someUsers[226] = new TextChatUser(<ITextChatUser>{ id: 226, isSelf: false, firstName: "Zach", lastName: "Zoologist", country: 125, location: "", gender: "M", age: 45, isSharedTalkMember: false, knows: 6, knows2: 21, learns: 1, roomTypingIn: undefined, isPinned: false,  isPrivatePartner: false });
			//angular.copy(Object.keys(someUsers).map(val => someUsers[val]), this.onlineUsers);
			//angular.copy(Object.keys(someUsers).map(val => someUsers[val]), this.justLeftUsers);
		}

		private forEachUser(fn: (user: TextChatUser) => void) {
			angular.forEach(this.derivedUserLists, (list) => {
				angular.forEach(list, (user) => fn(user) );
			});
		}

		private removeUserFromLists(userId) {
			var user: TextChatUser;
			angular.forEach(this.derivedUserLists, (users) => {
				for (let i = users.length - 1; i >= 0; i--) {
					if (users[i] == null || users[i] == undefined) { // Something set a null value in the array :-(
						this.$log.appWarn("UndefinedListItemsInRemoveUserFromLists" /* Stop logging this: It's way too long: , { derivedUserLists: this.derivedUserLists, users } */);
						users.splice(i, 1); // Cleanup the problem
						continue; 
					}
					if (users[i].id === userId) user = users.splice(i, 1)[0];
				}
			});
			return user;
		}

		addUser(user: TextChatUser) {
			this.removeUserFromLists(user.id);
			// Always insert before the first non-pinned user
			var index = this.onlineUsers.length;
			for (let i = 0; i <= this.onlineUsers.length - 1 ; i++) 
				if (this.onlineUsers[i].isPinned === false) { index = i; break; }
			this.onlineUsers.splice(index, 0, user);
		}

		removeUser(userId: UserId) {
			var user = this.removeUserFromLists(userId);
			this.justLeftUsers.unshift(user);
			while (this.justLeftUsers.length - 1 >= (this.onlineUsers.length) * ChatUsersService.quittersRatio) {
				this.justLeftUsers.pop();
			}

		}

		sortBy(sortingOption: UsersSortingOptions = null) {
			var sorter = (user: TextChatUser):string|number => {
				switch (sortingOption) {
					case UsersSortingOptions.Name:    return user.firstName;
					case UsersSortingOptions.Knows:   return Languages.langsById[Number(user.knows)].text;
					case UsersSortingOptions.Learns:  return Languages.langsById[Number(user.learns)].text;
					case UsersSortingOptions.Country: return this.countries[user.country].text;
					default:                          return -user.id;
				}
			};

			angular.forEach(this.derivedUserLists, (list) => {
				let sortedPinnedUsers = this.$filter("orderBy")(this.$filter("filter")(list, {isPinned: true}), sorter);
				let sortedNormalUsers = this.$filter("orderBy")(this.$filter("filter")(list, {isPinned: false}), sorter);
				angular.copy(sortedPinnedUsers.concat(sortedNormalUsers), list);
			});
		}

		getUser(userId: Number):TextChatUser {
			var theUser:TextChatUser;
			this.forEachUser((user: TextChatUser) => { if (user.id === userId) theUser = user; });
			return theUser;
		}

		unmarkRecentUsers = () => this.forEachUser((user: TextChatUser) => this.unMarkRecentUser(user, Config.lobbySpecialRoom.name) ); 
		unMarkRecentUsersIn = (roomId: RoomId) => this.forEachUser( (user: TextChatUser) => this.unMarkRecentUser(user, roomId));
		unMarkRecentUser(user: TextChatUser, roomId: RoomId) {
			const roomIndex = user.recentlyJoinedRooms.indexOf(roomId);
			if (roomIndex !== -1)
				user.recentlyJoinedRooms.splice(roomIndex, 1);
		}

	}
}