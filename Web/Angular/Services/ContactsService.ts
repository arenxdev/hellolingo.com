
module Services {
	export interface IContactsService {
		contacts: Contacts.IContactUser[];
		add(member: Contacts.IContactUser): void;
		remove(contactUserId: UserId): void;
		isUserInContacts(userId: UserId): boolean;
	}


	export class ContactsService implements IContactsService {
		static $inject = ["$http", "$q", "$state", "authService"];
		private contactList: Contacts.IContactUser[] = [];
		constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $state: ng.ui.IStateService, private authService: Authentication.IAuthenticationService) {
			if (!this.authService.isAuthenticated()) return;
			this.getContacts().then(contacts => Array.prototype.push.apply(this.contactList, contacts));
		}

		private getContacts(): ng.IPromise<Contacts.IContactUser[]> {
			return (<ng.IPromise<Contacts.IContactUser[]>> this.$http.get(Config.EndPoints.getContactsList).then(res => this.$q.resolve(res.data)));
		}

		get contacts() {
			return this.contactList;
		}

		add(member: Contacts.IContactUser) {
			this.contactList.push(member);
			return this.$http.post(Config.EndPoints.postContactsAdd,
								   { contactUserId: member.id, sourceState: this.$state.current.name.replace("root.", "") });
		}

		remove(contactUserId: UserId) {
			this.contactList.splice(this.contactList.indexOf(this.contactList.filter(member => member.id === contactUserId)[0]), 1);
			return this.$http.post(Config.EndPoints.postContactsRemove, { contactUserId, sourceState: this.$state.current.name });
		}

		isUserInContacts(userId: UserId) {
			return this.contactList.filter(member => member.id === userId).length === 1;
		}
	}
}