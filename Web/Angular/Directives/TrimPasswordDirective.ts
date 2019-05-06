class TrimPasswordDirective implements ng.IDirective {

	restrict = "A";
	require = "?ngModel";
	priority = 10;
	compile() {
		return (scope, element, attrs, ngModel:ng.INgModelController) => {
			element.bind("input paste", () => {
				var s = ngModel.$viewValue;
				if (s === "") {
					ngModel.$setViewValue(undefined);
					ngModel.$render();
				}
			});
		};
	}
}