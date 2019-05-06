namespace MailBox {
	export class MessagesHistoryDirective implements ng.IDirective {
		constructor() { }
		link = ($scope, element, attr, ctrl) => { };
		$scope = {};
		controller = Ctrl;
		controllerAs = "ctrl";
		bindToController = {
			messages     : "=",
			loadMessages : "&"
		};
		templateUrl = "mailbox-message-history.tpl";
		restrict = "E";
		replace = true;
	}

	export class Ctrl {
		static $inject = ["$scope", "$http", "$filter", "userService", "statesService"];
		user: IAuthUser;
		messages: IMailMessage[];
		loadMessages: () => void;

		loadNextMessages() { this.loadMessages(); }

		get shownMessages() { return this.$filter("filter")(this.messages, (message: IMailMessage) => { return message.content ? true : false; }) }
		get asMoreHistory() { return this.shownMessages != null && this.shownMessages.length !== this.messages.length; }

		constructor($scope: ng.IScope, private $http, private $filter:ng.IFilterService, private userService: Authentication.IUserService, private statesService: Services.StatesService) {
			this.user = this.userService.getUser(); // The user is referred to by the view
			if (!this.user) {
				statesService.go(States.login.name);
			}
		}

		
	}
}