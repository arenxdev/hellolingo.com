namespace Contacts {

	export class DashboardWidget {
		restrict = "E";
		link() { };
		scope = {};
		controller = DashboardWidgetController;
		controllerAs = "widget";
		templateUrl = "dashboard-widget.tpl";
	}

	export class DashboardWidgetController {
		static $inject = ["$scope", "$uibModal", "contactsService", "serverResources", "$state"];

		constructor(private $scope, private $uibModal: ng.ui.bootstrap.IModalService, private contactsService: Services.ContactsService, 
			private serverResources: Services.IServerResourcesService, private $state:ng.ui.IStateService) {
			this.$scope.languages = Languages.langsById;
			this.$scope.countries = this.serverResources.getCountries();
			this.$scope.contacts = this.contactsService.contacts;
		}

		chooseMember(user: ILightUser) {
			this.$uibModal.open({
				templateUrl: "modal-profile-view.tpl",
				controllerAs: "modalCtrl",
				controller: () => <IModalProfileViewCtrl>{ user, showButtons: () => true, hasViewChatButton: () => true }
			});
		}

		sortUsersGetter = (user: ILightUser) => { return user.firstName }
		
		sortUsersByKnows() { this.sortUsersGetter = (user: ILightUser) => { return Languages.langsById[Number(user.knows)].text } }
		sortUsersByLearns() { this.sortUsersGetter = (user: ILightUser) => { return Languages.langsById[Number(user.learns)].text } }
	}

	
}