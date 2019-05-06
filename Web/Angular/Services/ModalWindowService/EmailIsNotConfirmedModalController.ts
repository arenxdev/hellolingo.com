module Services {
	export class EmailIsNotConfirmedModalController {

		emailAddress: string;
		verificationEmailSent = false;
		verificationEmailSentFail = false;

		static $inject = ["$uibModalInstance", "$state", "userService"];
		constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private $state: ng.ui.IStateService,
		         	private userService: Authentication.IUserService) {
			this.emailAddress = userService.getUser().email;
		}

		resendEmail() {
			this.verificationEmailSent = true;
			this.userService.resendEmailVerification().then((isSent: boolean) => {
				this.verificationEmailSentFail = !isSent;
			});
		}

		goToProfile() {
			this.$state.go(States.profile.name);
			this.$uibModalInstance.close(true);
		}
	}
}