/// <reference path="DashboardTileCtrl.ts" />
namespace Dashboard{
	export class DashboardTileDirective {
		restrict = "E";
		link() { };
		scope = {
			i18n: "=",
			tileDef: "=",
			showInfo: "=",
			pinMode: "=",
			isPinned: "="

		};
		controller = DashboardTileCtrl;
		templateUrl = "dashboard-tile.tpl";
	}
}