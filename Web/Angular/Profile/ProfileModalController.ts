module Profile {
	export class ProfileModalController {
		static $inject = ["$scope", "$uibModalInstance", "submitForm", "serverValidation"];

		constructor($scope: ng.IScope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private submitForm, private serverValidation: IServerValidationResult) {

		}
		validationDisabled = true;
		password: string;

		get isFormValid() { return this.validationDisabled ? true : angular.isDefined(this.password) && this.password !== ""; }

		save() {
			if (this.validationDisabled)
				this.validationDisabled = false;
			if (this.isFormValid) {
				this.submitForm(this.password, this.$uibModalInstance);
			}
		}
	}
}