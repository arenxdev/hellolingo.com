/// <reference path="../validations/validation.ts" />
module Profile {
	export class ProfileFormValidation {
		enabled = false;
		errors = <Validation.FormValidationErrors>{};
		validationErrors:Services.IAccountValidationErrors;
		constructor(private formCtrl: IProfileFormController, private profile: IUserProfile, serverResources:Services.IServerResourcesService) {
			serverResources.getAccountValidationErrors()
				.then((errorTransaltions: Services.IAccountValidationErrors) => { this.validationErrors = errorTransaltions; });
		}

		get isLearnsValid() {
			const isValid = this.enabled ? angular.isNumber(this.profile.learns) : true;
			if (!isValid) {
				this.errors["learns"] = {};
			}
			return isValid;
		}
		get isKnowsValid() {
			const isValid = this.enabled ? angular.isNumber(this.profile.knows) : true;
			if (!isValid) {
				this.errors["knows"] = {};
			}
			return isValid;
		}
		get isBirthDateValid() {
			const isValid = this.enabled ? this.profile.birthMonth && this.profile.birthYear : true;
			if (!isValid) {
				this.errors["birthDate"] = {};
			}
			return isValid;
		}
		get isLocationValid() {
			const isValid = this.enabled ? angular.isNumber(this.profile.country) && this.formCtrl.location.$valid : true;
			if (!isValid) {
				this.errors["location"] = {};
			}
			return isValid;
		}

		get isIntroductionValid() {
			const isValid = this.enabled ? this.formCtrl.introduction.$valid : true;
			if (!isValid) {
				this.errors["location"] = this.formCtrl.introduction.$error;
			}
			return isValid;
		}

		get isEmailValid() {
			const isValid = this.enabled ? this.formCtrl.email.$valid : true;
			if (!isValid) {
				this.errors["email"] = this.formCtrl.email.$error;
			}
			return isValid;
		}
		get isPasswordValid() {
			const isValid = this.enabled ? this.formCtrl.password.$valid : true;
			if (!isValid)
				this.errors["password"] = this.formCtrl.password.$error;
			return isValid;
		}
		get isReTypedPasswordValid() {
			const isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.profile.password === this.profile.reTypePassword);
			if (!isValid) {
				this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
			}
			return isValid;
		}

		get validationReport() { return {
			isLearnsValid: this.isLearnsValid,
			isKnowsValid: this.isKnowsValid,
			isBirthDateValid: this.isBirthDateValid,
			isLocationValid: this.isLocationValid,
			isIntroductionValid: this.isIntroductionValid,
			isEmailValid: this.isEmailValid,
			isPasswordValid: this.isPasswordValid,
			isReTypedPasswordValid: this.isReTypedPasswordValid
		} }

		get isFormValid() {
			this.errors = {};
			return !this.enabled ? true :
				                   this.isLearnsValid && this.isKnowsValid && this.isBirthDateValid && this.isLocationValid
				                && this.isIntroductionValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
		}

		get profileClientError() {
			//Andriy: Currently it's only for password errors, but it could be extended for others, just not clear how to show more then one errror message on sign up form.
			if (Object.keys(this.errors).length === 0)
				return undefined;
			const passwordErrors = this.errors["password"];
			let errorText;
			if (passwordErrors) {
				if (passwordErrors["minlength"]) errorText = this.validationErrors.passwordMinError;
				else if (passwordErrors["maxlength"]) errorText = this.validationErrors.passwordMaxError;
				else errorText = this.validationErrors.defaultError;
			} else {
				errorText = this.validationErrors.defaultError;
			}
			return errorText;
		}
	}
}