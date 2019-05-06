
module Authentication {

	export class LogInOrOutDirective implements ng.IDirective {

		constructor(private authService: IAuthenticationService, private userService: IUserService, private statesService: Services.StatesService, private $log: Services.EnhancedLog) {}

		link = ($scope: ILogInOrOutScope, element: ng.IAugmentedJQuery) => {
			$scope.isAuthenticated = this.authService.isAuthenticated();
			$scope.hide = true;
			$scope.logOut = (confirmMsg: string) => {
				if (confirm(confirmMsg) === false) return;
				this.authService.logout().then(() => $scope.isAuthenticated = this.authService.isAuthenticated() );
			};
			$scope.$watch(() => {
				return this.authService.isAuthenticated();
			}, (isAuthenticated) => {
				$scope.isAuthenticated = isAuthenticated;
				$scope.hide = isAuthenticated && ($scope.showLogOff != null && !$scope.showLogOff);
			});
		};
		restrict = "E";
		scope = { showLogOff: "=" };
		templateUrl = "log-in-or-out-directive.tpl";

		public static factory() {
			const directive = (authService: IAuthenticationService, userService: IUserService, statesService: Services.StatesService, $log: Services.EnhancedLog) =>
				new LogInOrOutDirective(authService, userService, statesService, $log);
			directive["$inject"] = ["authService", "userService", "statesService", "$log"];
			return directive;
		}
	}

	export interface ILogInOrOutScope extends ng.IScope {
        isAuthenticated: boolean;
        hide: boolean;
        logOut: (confirmMsg: string) => void;
		showLogOff: boolean;
    }

}