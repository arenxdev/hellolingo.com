/// <reference path="DashboardCtrl.ts" />
namespace Dashboard {
	export class DashboardDirective {
		restrict = "E";
		link = (scope: any, element: JQuery, attrs: ng.IAttributes/*, ngModel: ng.INgModelController*/) => {
			scope.i18n = (resource: string) => Helpers.decodeAttr(attrs[resource.toLowerCase()]);
		};
		scope = {};
		templateUrl = "Partials/Dashboard";
		controller = DashboardCtrl;
		replace = true;
	}
}