namespace Validation {

	//Andriy: This will overwrite the default Angular email validator with more strict rules
	export class ValidationEmailDirective {
		//Regex tested against 15K existing addresses and adjusted for new TLDs. No need to support IP Adresses
		emailRegexp = /^[_a-z0-9]+[a-z0-9.+-]*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,15}$/i;
		require = "ngModel";
		restrict = "A";
		link = (scope, elm, attrs, ctrl) => {
			const emailRegExpLocal = this.emailRegexp;
			if (ctrl && ctrl.$validators.email) {
				ctrl.$validators.email = (modelValue) => {
					return ctrl.$isEmpty(modelValue) || emailRegExpLocal.test(modelValue);
				};
			}
		}
	}
}