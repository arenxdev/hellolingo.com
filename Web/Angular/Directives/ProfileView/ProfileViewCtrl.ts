class ProfileViewCtrl {
	static $inject = ["$scope","$http", "$timeout", "statesService", "contactsService", "serverResources"];
	constructor(private $scope, private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private statesService: Services.StatesService,
		        private contactsService: Services.ContactsService, private serverResources: Services.IServerResourcesService) {

		$scope.$watch(() => this.user, () => {
			// There shouldn't be a need for this check, but when this.user often goes missing. It wreaks complete havoc on the server because of a flood of errors.
			// Let's stay on the safe side and not remove that check
			if (this.user)
				this.getMemberData(this.user.id); // This loads the profile, regardless of any data existing in user, because we need the extended data, like the introduction text anyway.
		});
	}

	user: IUser; // From directive bindings
	languages = Languages.langsById;
	countries = this.serverResources.getCountries();
	showNotification: boolean;	
	notification : string;	
	notificationTimeout: ng.IPromise<boolean>;
	listOfRooms: [{ title: string, url: string }];
	hasListOfRooms = () => Array.isArray(this.listOfRooms);

	goToMailbox() {
		if (angular.isFunction(this.$scope.$parent.$close)) this.$scope.$parent.$close(); // Closes a modal that wraps this controller... But that's horrible as it may also close anything that has a close method!
		this.statesService.go(States.mailboxUser.name, { id: this.user.id, isNew: "new" });
	}

	goToChat() {
		if (angular.isFunction(this.$scope.$parent.$close)) this.$scope.$parent.$close();
		this.statesService.go(States.textChatRoomPrivate.name, { userId: this.user.id, firstName: this.user.firstName });
	}

	getMemberData(memberId: number) {
		this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
			.success((member: IUser) => { for (let attrName in member) { this.user[attrName] = member[attrName]; } }) // Merge Users instead of replacing them, because we could use properties, such as isSelf
			.error((errorData) => { throw new Error(errorData) });
	}

	onPinClick(pinMsg, unpinMsg) {
		if (this.isUserPinned()) {
			this.user.isPinned = false;
			this.contactsService.remove(this.user.id);
			this.notify(unpinMsg);
		} else {
			this.user.isPinned = true;
			this.contactsService.add(this.user);
			this.notify(pinMsg);
		}
	}

	isUserPinned() {
		return !!this.user && this.contactsService.isUserInContacts(this.user.id);
	}

	notify(message: string) {
		this.$timeout.cancel(this.notificationTimeout);
		this.notificationTimeout = this.$timeout(() => this.showNotification = false, 3000);
		this.notification = message;
		this.showNotification = true;
	}

}