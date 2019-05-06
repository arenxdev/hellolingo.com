module Services {

	export class StatesService {

		private stateNamesHistory: Array<string> = [];

		static $inject = ["$rootScope", "$state", "$stateParams", "$stickyState", "$templateCache", "$log", "$deepStateRedirect", "userService", "$cookies"];
		constructor(
			private $rootScope: ng.IRootScopeService, private $state: ng.ui.IStateService,
			private $stateParams: ng.ui.IStateParamsService, private $stickyState: any,
			private $templateCache: angular.ITemplateCacheService, private $log: EnhancedLog,
			private $deepStateRedirect: any, private userService: Authentication.IUserService,
		    private $cookies:ng.cookies.ICookiesService) {

			// Record all states the users navigate to successfuylly
			this.$rootScope.$on("$stateChangeSuccess", (event: ng.IAngularEvent, toState: State) => {
				this.stateNamesHistory.push(toState.name);
				if (this.stateNamesHistory.length > 100) this.stateNamesHistory.shift(); // Keep the history small
			});

		}

		resetAllStates(): void {
			this.userService.clearUserData();
			// Forces all sticky states to reset.We don't want unauthenticated views to linger around
			this.$stickyState.reset("*");

			// Clean the $templateCache
			angular.forEach(States, (state: State) => {
				if (state.isRemoteTemplate) this.$templateCache.remove(state.templateUrl);
			});
		}
		
		getStateParams() {
			return this.$stateParams; 
		}

		getStateCopyByName(name: string) {
			for (let key in States) {
				if (States.hasOwnProperty(key)) {
					const state = States[key];
					if (state.name === name) {
						return angular.copy(state);
					}
				}
			}
			return undefined;
		}

		resetState(stateName: string) {
			const stateToReset = this.getStateCopyByName(stateName);
			this.$stickyState.reset(stateName);
			this.$deepStateRedirect.reset(stateName);
			if (stateToReset.isRemoteTemplate) this.$templateCache.remove(stateToReset.templateUrl);
		}

		closeState(stateNameToClose: string) {
			// Determine the destination state
			var currentStateName = this.$state.current.name;
			var destinationStateName = States.home.name;
			var destinitionStateParams = {};
			var inactiveStates = this.$stickyState.getInactiveStates();
			for (var i = this.stateNamesHistory.length; i-- > 0;) {
				var candidateStateName = this.stateNamesHistory[i], found = false;
				angular.forEach(inactiveStates, (inactiveState) => {
					// ReSharper disable ClosureOnModifiedVariable
					if (candidateStateName.indexOf(stateNameToClose) == -1 && (candidateStateName === inactiveState.name || candidateStateName === currentStateName)) {
						found = true;
						destinitionStateParams = inactiveState.locals.globals.$stateParams;
					}
					// ReSharper restore ClosureOnModifiedVariable
				});
				if (found) { destinationStateName = candidateStateName; break; }
			}
			this.removeStateFromCookies(stateNameToClose);

			// If the current state is already the destination state, it's as easy as reset the state to be closed
			if (this.$state.includes(destinationStateName)) {
				this.$log.appInfo("ClosingStateImmediately", { stateNameToClose, destinationStateName });
				this.resetState(stateNameToClose);
			}

			// If not, we have to go to the destination state, wait for that state change to succeed, and then only reset the state to be closed
			else {
				this.$log.appInfo("ClosingStateInitiated", { stateNameToClose, destinationStateName });
				var successListener = this.$rootScope.$on("$stateChangeSuccess", (/*event: ng.IAngularEvent, toState: State, toParams, fromState: State*/) => {
					successListener(); // remove curent listener
					if (this.$state.includes(destinationStateName)) {
						this.resetState(stateNameToClose);
						this.$log.appInfo("ClosingStateCompleted", { stateNameToClose, destinationStateName });
					} else {
						this.$log.appError("ClosingStateFailedOnDestStateMismatch", { currentState: this.$state.current.name, expectedState: destinationStateName });
					}
				});
				var failureListener = this.$rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
					failureListener(); // remove curent listener
					this.$log.appError("ClosingStateFailedOnStateChangeError", { from: fromState.name, to: toState.name, error });
				});
				this.$state.go(destinationStateName, destinitionStateParams);
			}
		}


		//========== Implements $states features ======================================================================================

		go(to: string, params?: {}, options?: angular.ui.IStateOptions): angular.IPromise<any> { return this.$state.go(to, params, options); }
		goAndReload(to: string, params?: {}): angular.IPromise<any> { return this.$state.go(to, params, <any>{ reload: true }); }
		reload(): ng.IPromise<any> { return this.$state.reload(); }

		get current(): angular.ui.IState { return this.$state.current };
	    get params(): angular.ui.IStateParamsService { return this.$stateParams };

		includes(state: string, params?: {}): boolean { return this.$state.includes(state, params); }

		is(state: string, params?: {}): boolean;
		is(state: angular.ui.IState, params?: {}): boolean;
		is(state: angular.ui.IState | string, params: {}): boolean { return this.$state.is(state as angular.ui.IState, params) }

		get(state: string, context?: string): angular.ui.IState { return this.$state.get(state, context); }

		href(state: string, params?: {}, options?: angular.ui.IHrefOptions): string;
		href(state: angular.ui.IState, params?: {}, options?: angular.ui.IHrefOptions): string;
		href(state: angular.ui.IState | string, params: {}, options: angular.ui.IHrefOptions): string { return this.$state.href(state as string, params, params) }

		private removeStateFromCookies(stateNameToClose: string) {
			const cookiesString = this.$cookies.get(Config.CookieNames.lastStates);
			if (!cookiesString) return;
			const stateNameParts = stateNameToClose.split(".");
			const statesInCookies = angular.fromJson(cookiesString) as string[];
			const stateNameIndx = statesInCookies.indexOf(stateNameParts[1]);
			if (stateNameIndx !== -1) {
				statesInCookies.splice(stateNameIndx, 1);
				this.$cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
			}
		}
	}
}