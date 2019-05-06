/// <reference path="../../validations/validation.ts" />
module Authentication {

	export class SignUpFormValidation {
		enabled = false;
		errors = <Validation.FormValidationErrors>{};
		validationErrors: Services.IAccountValidationErrors;

		constructor(private formCtrl: ISignUpFormController, private serverResources: Services.IServerResourcesService) {
			serverResources.getAccountValidationErrors()
				.then((errorTransaltions: Services.IAccountValidationErrors) => { this.validationErrors = errorTransaltions; });
		}

		get isEmailValid() {
			const isValid = this.enabled ? this.formCtrl.email.$valid : true;
			if (!isValid)
				this.errors["email"] = this.formCtrl.email.$error;
			return isValid;
		}

		get isEmailCheckedValid() {
			const isValid = this.enabled ? this.formCtrl.isEmailChecked.$valid : true;
			if (!isValid)
				this.errors["isEmailChecked"] = this.formCtrl.isEmailChecked.$error;
			return isValid;
		}

		get isPasswordValid() {
			const isValid = this.enabled ? this.formCtrl.password.$valid : true;
			if (!isValid)
				this.errors["password"] = this.formCtrl.password.$error;
			return isValid;
		}

		get isReTypedPasswordValid() {
			const isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.formCtrl.password.$modelValue === this.formCtrl.reTypedPassword.$modelValue);
			if (!isValid) {
				this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
			}
			return isValid;
		}

		get isFormValid() {
			this.errors = {};
			return !this.enabled ? true : this.isEmailCheckedValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
		}
		
		get signUpClientError() {
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



	export class ProfileFormValidation {
		enabled = false;
		constructor(private formCtrl: IProfileFormController, private user: ISignUpUser) { }

		get isLearnsValid() { return this.enabled ? this.user.learns : true; }
		get isKnowsValid() { return this.enabled ? this.user.knows : true; }
		get isNameValid() { return this.enabled ? this.isFirstNameValid && this.isLastNameValid : true; }
		get isFirstNameValid() { return this.formCtrl.firstName.$valid && this.formCtrl.firstName.$modelValue.length >= 2; }
		get isLastNameValid() { return this.formCtrl.lastName.$valid; }
		get isGenderValid() { return this.enabled ? this.user.gender : true; }
		get isBirthDateValid() { return this.enabled ? this.user.birthMonth && this.user.birthYear : true; }
		get isCountryValid() { return this.enabled ? this.user.country !== undefined : true; }

		get isFormValid() {
			return !this.enabled ? true :
				this.isLearnsValid && this.isKnowsValid && this.isNameValid
				&& this.isBirthDateValid && this.isCountryValid && this.isGenderValid;
		}
	}

	
	
	
}