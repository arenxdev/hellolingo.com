interface ISwitchScope extends angular.IScope {
	type: string;
	ngDisabled: boolean;
	name: string;

	ngChecked?: any;

	checked: boolean;
	uniqueId: string;
	class: string;
	onLabel: string;
	offLabel: string;
	handleClick: (e: angular.IAngularEvent) => any;
	modelCtrl: angular.INgModelController;
}

interface ISwitchAttrs extends angular.IAttributes {
	ngModel?;
	ngToggle?;
	ngTrueValue?;
	ngFalseValue?;
	ngChecked?;
}

/* Use ng-model or ng-checked + ng-toggle, but not ng-model + ng-toggle */
class SwitchDirective implements ng.IDirective {
	private static uniqueId = 1;

	static $inject = ["$parse"];
	constructor(private $parse: ng.IParseService) { }

	restrict = "AE";
	require = "?ngModel";
	replace = true;
	scope = {
		ngDisabled: "=",
		ngChecked: "=",
		name: "@",
		onLabel: "@",
		offLabel: "@"
	};
	template = ["<label for=\"{{::uniqueId}}\" class=\"switch\">",
					"<input type=\"checkbox\" id=\"{{::uniqueId}}\" class=\"switch-input\"",
							"ng-click=\"$event.stopPropagation()\" ng-model=\"checked\" ng-disabled=\"ngDisabled\">",
					"<div class=\"switch-label\">{{ checked ? onLabel : offLabel}}</div>",
				"</label>"].join("");
	link = (scope: ISwitchScope, elem: angular.IAugmentedJQuery, attrs: ISwitchAttrs, modelCtrl: angular.INgModelController) => {
		scope.uniqueId = `checkbox-${SwitchDirective.uniqueId++}`;

		var trueValue = true;
		var falseValue = false;

		// If defined set true value
		if (attrs.ngTrueValue !== undefined) {
			trueValue = attrs.ngTrueValue !== 'false' && (attrs.ngTrueValue === 'true' || attrs.ngTrueValue);
		}
		// If defined set false value
		if (attrs.ngFalseValue !== undefined) {
			falseValue = attrs.ngFalseValue !== 'false' && (attrs.ngFalseValue === 'true' || attrs.ngFalseValue);
		}

		// Check if name attribute is set and if so add it to the DOM element
		if (scope.name !== undefined) {
			elem.find(':checkbox').prop('name', scope.name);
		}

		scope.$watch('ngDisabled', (newVal: boolean) => {
			elem.toggleClass('disabled', newVal);
		});

		if (attrs.ngModel) {
			scope.modelCtrl = modelCtrl;
			// Update element when model changes
			scope.$watch('modelCtrl.$modelValue', (newVal, oldVal) => {
				scope.checked = modelCtrl.$modelValue === trueValue;
			}, true);

			// On click swap value and trigger onChange function
			elem.click((e) => {
				if (scope.ngDisabled) {
					e.preventDefault();
					return;
				}

				if (modelCtrl.$modelValue === falseValue) {
					modelCtrl.$setViewValue(trueValue);
				} else {
					modelCtrl.$setViewValue(falseValue);
				}
			});
		}
		else if (attrs.ngChecked) {
			var expressionHandler = this.$parse(attrs.ngToggle);

			scope.$watch('ngChecked', (newVal) => {
			scope.checked = newVal === trueValue;
			}, true);

			// On click swap value and trigger onChange function
			elem.click((e) => {
				if (scope.ngDisabled) {
					e.preventDefault();
					return;
				}

				var newVal = scope.checked ? falseValue : trueValue;

				expressionHandler(scope.$parent, { $value: newVal });
			});
		}
	}
}