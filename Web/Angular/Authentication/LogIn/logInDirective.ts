module Authentication {
	export class LogInDirective implements ng.IDirective {

		constructor(private $timeout: ng.ITimeoutService, private authService: IAuthenticationService,
			private statesService: Services.StatesService, private $log: Services.EnhancedLog,
			private serverResources:Services.IServerResourcesService) { }

		link = ($scope: ILogInScope, element: ng.IAugmentedJQuery) => {

			// Collect email used in an attempt to sign up with an already signed up email
			$scope.email = (<ILoginStateParams>this.statesService.params).emailOfExistingAccount;
			$scope.showExistingAccountAlert = $scope.email != undefined;

			$scope.validResult = new LoginValidationResult();

			$scope.logIn = () => {
				$scope.validResult.isEmailValid = true;
				$scope.validResult.isPasswordValid = true;
				$scope.isLogInFailed = false;
				this.$timeout(() => { // TODOLATER: What is this timeout for?
					const credentials: ILoginCredentials = { userName: $scope.email, password: $scope.password };
					if (this.validateForm($scope.logInForm, $scope.validResult)) {
						this.$log.appInfo("ValidLogInFormSubmitted", credentials);
						this.authService.login(credentials).then((loginServerResponse: ILoginServerResponse) => {
							if (loginServerResponse.isAuthenticated) {
								this.statesService.resetAllStates();
								// TodoLater: This should simply be sent as stateParams (like emailOfExistingAccount) rather than storing it in authService!!!
								let stateToRedirect = this.authService.getStateToRedirect();
								if (angular.isUndefined(stateToRedirect)||angular.isUndefined(stateToRedirect.stateName)) {
									stateToRedirect.stateName = States.home.name;
									stateToRedirect.params    = undefined;
								}
								this.statesService.goAndReload(stateToRedirect.stateName, stateToRedirect.params);
								this.authService.setStateToRedirect(undefined, undefined);
							} else {
								$scope.isLogInFailed = true;
								// TodoLater: The server could simply send a string message rather than a code and the whole world would be better
								this.serverResources.getServerResponseText(loginServerResponse.message.code)
									.then((serverMessage) => { $scope.logInServerFailedMessage = serverMessage; });
							}
						});
					} else 
						this.$log.appInfo("InvalidLogInFormSubmitted", credentials);
				}, 250);
			};

			$scope.goToSignUp = () => this.statesService.go(States.signup.name);
		};
	    
		validateForm = (formController: ILogInController, validation: LoginValidationResult) => {
			validation.isEmailValid = formController.email.$valid;
			validation.isPasswordValid = formController.password.$valid;
			return validation.isEmailValid && validation.isPasswordValid;
		};

		restrict = "E";
	    scope = {};
		templateUrl = "Partials/Log-In-Directive";

		public static factory() {
			const directive = ($timeout: ng.ITimeoutService, authService: IAuthenticationService, statesService: Services.StatesService, $log: Services.EnhancedLog, serverResources:Services.IServerResourcesService) =>
				new LogInDirective($timeout, authService, statesService, $log, serverResources);
			directive["$inject"] = ["$timeout", "authService", "statesService", "$log", "serverResources"];
			return directive;
		}

	}
}