interface IContactUsScope extends ng.IScope {
	contactMessage: IContactUsMessage;
	isAuthenticated: boolean;
	subject: string;
	isEmailInvalid: boolean;
	isMessageInvalid: boolean;
	contactForm;
}

interface IContactUsMessage {
	message: string;
	email: string;
	subject: string;
	uri: string;
}

class ContactUsCtrl {
	public static $inject = ["$scope", "$http", "$location", "authService", "statesService"];

	constructor(private $scope: IContactUsScope, private $http: ng.IHttpService, private $location: ng.ILocationService,
		private authService: Authentication.IAuthenticationService, private statesService: Services.StatesService) {

		this.$scope.isAuthenticated = authService.isAuthenticated();
		this.$scope.contactMessage = {} as IContactUsMessage;
		this.disableValidation();
	}

	send() {
		if (!this.validateForm()) return;

		this.$http.post(Config.EndPoints.postContactUsMessage, this.$scope.contactMessage)
			.then(() => { this.statesService.closeState(States.contactUs.name); },
			(errorData) => { throw new Error(errorData); });
	}

	validateForm() {
		this.$scope.isEmailInvalid = this.$scope.contactForm.email && !this.$scope.contactForm.email.$valid;
		this.$scope.isMessageInvalid = !this.$scope.contactForm.message.$valid;
		return !this.$scope.isEmailInvalid && !this.$scope.isMessageInvalid;
	}

	disableValidation() {
		this.$scope.isEmailInvalid = false;
		this.$scope.isMessageInvalid = false;
	}
}