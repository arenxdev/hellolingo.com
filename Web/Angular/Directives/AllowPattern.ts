
class AllowPattern implements ng.IDirective {
	require = "ngModel";
	link = (scope, element, attrs, modelCtrl) => {

		modelCtrl.$parsers.push((inputValue: string) => {

			// Clean the string from characters that don't match the allowed pattern
			var regex = new RegExp(attrs.allowPattern.replace("[", "[^")); // Negate allowed characters
			var cleanedInput = inputValue.replace(regex, "");

			// Apply the cleanup while keeping selection / caret position
			if (cleanedInput !== inputValue) {
				const el = element[0];
				const start = el.selectionStart;
				const end = el.selectionEnd + cleanedInput.length - inputValue.length;
				modelCtrl.$setViewValue(cleanedInput);
				modelCtrl.$render();
				el.setSelectionRange(start, end);
			}
			return cleanedInput;
		});
	}
}