namespace Dashboard {

	export interface IDashboardTileInheritedScope { tileDef: IDashboardTile, isPinned: boolean };

	export class DashboardTileCtrl {

		static $inject = ["$scope", "$cookies", "$log", "$document", "statesService", "userService"];
		constructor($scope: IDashboardTileInheritedScope, private $cookies, private $log: Services.EnhancedLog, private $document: ng.IDocumentService, private statesService: Services.StatesService, private userService: Authentication.IUserService) { this.scope = angular.extend($scope, this.scope); }

		scope = Helpers.extend(<IDashboardTileInheritedScope>{}, { // .apply() syntax preserves lexical context
			onTileClick: (...args) => this.onTileClick.apply(this, args),
			onPinClick: (...args) => this.onPinClick.apply(this, args)
		});

		onTileClick() {
			if (this.scope.tileDef.isPlanned) return;
			if (this.scope.tileDef.type === TileType.Feature)
				this.statesService.go(this.scope.tileDef.stateName, this.scope.tileDef.stateParams);
			if (this.scope.tileDef.type === TileType.Url)
				this.$log.appInfo("UrlClicked", { url: this.scope.tileDef.url });
		}

		onPinClick($event: ng.IAngularEvent, tileId: number) {
			$event.stopPropagation();
			this.scope.isPinned = !this.scope.isPinned;
			if (this.scope.isPinned) this.userService.promoteTile(tileId);
			else this.userService.demoteTile(tileId);
		}
	}
}