class TaskButtonDirective {
	static $inject = ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log","statesService"];
	constructor(private countersService: Services.ITaskbarCounterService, private $timeout: ng.ITimeoutService, private authService: Authentication.IAuthenticationService, private $state: ng.ui.IStateService, private $stickyState:ng.ui.IStickyStateService, private $log: Services.EnhancedLog, private statesService:Services.StatesService) {}

	restrict = "AE";
	replace = true;
	scope = {
		buttonId:"=",
		iconUrl: "@",
		hideClose: "=",
		showCounter: "="
	};

	templateUrl = "task-button.tpl";

	link = ($scope: ITaskButtonScope) => {
		$scope.showButton = false;
		$scope.actionClick = () => {
			var stateToGo = $scope.buttonId;
			switch ($scope.buttonId) {
				case States.mailbox.name:
					this.countersService.resetCounter(Services.Counters.MailBox);
					break;
				case States.textChat.name:
					this.countersService.resetCounter(Services.Counters.TextChat);
					break;
				default:
					break;
			}
			this.$log.appInfo("TaskBar_ChangeStateRequested", { stateName: stateToGo });
			if (!this.$state.includes(stateToGo))
				this.$state.go(stateToGo);
		};
		$scope.isCurrentState = () => this.$state.includes($scope.buttonId); 
		$scope.closeState = () => {
			this.$log.appInfo("TaskBar_CloseStateRequested", { stateName: $scope.buttonId });
			this.statesService.closeState($scope.buttonId);
		};
		$scope.isIconShown = (stateName: string) => this.isIconShownOnTaskBar(stateName, this.authService, this.$state, this.$stickyState);

		if ($scope.showCounter) {
			$scope.$watch(($scope: ITaskButtonScope) => {
				return this.isCounterValueChanged($scope.buttonId);
			}, (newVal) => {
				$scope.showCounterBadge = false;
				this.$timeout(() => {
					$scope.counterVal = newVal;
					$scope.showButton = false;
					$scope.hideClose = false;
					$scope.showCounterBadge = !$scope.isCurrentState() && newVal > 0;	
					if ($scope.showCounterBadge) {
						$scope.showButton = true;
						$scope.hideClose = true;
					}
				}, 200); // TODOLATER: 200ms? why not 0ms? 
				
			});
		}
	}

	isIconShownOnTaskBar(state: string, authService: Authentication.IAuthenticationService, $state: ng.ui.IStateService, $stickyState: ng.ui.IStickyStateService) {
		var inactiveStates = $stickyState.getInactiveStates();
		if (state === States.home.name)
			return authService.isAuthenticated() && inactiveStates.length >= 1;
		var found = false;
		angular.forEach(inactiveStates, (inactiveState) => {
			if (inactiveState.name === state) found = true;
		});
		return found || $state.includes(state);
	}

	isCounterValueChanged(forState: string) {
		switch (forState) {
			case States.mailbox.name:
				return this.countersService.getCounterValue(Services.Counters.MailBox);
			case States.textChat.name:
				return this.countersService.getCounterValue(Services.Counters.TextChat);
			default:
				return 0;
		}
	}
};
