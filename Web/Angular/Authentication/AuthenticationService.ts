let sysend: any; // library to communicate events between sessions

module Authentication {

	export interface IAuthenticationService {
		isAuthenticated: () => boolean;
		login: (credentials: ILoginCredentials) => angular.IPromise<ILoginServerResponse>;
		logout: () => angular.IPromise<boolean>;
		signUp: (user: ISignUpUser) => angular.IPromise<ISignUpServerResponse>;
		setStateToRedirect: (state: string, params?: any) => void;
		getStateToRedirect: () => { stateName: string, params?: any };
	}

	export class AuthenticationService implements IAuthenticationService {
		private loginUrl = "/api/account/log-in";
		private signUpUrl = "/api/account/sign-up";
		private logoutUrl = "/api/account/log-out";
		private stateToRedirect: { stateName: string, params?: any } = { stateName: undefined, params: undefined};

		static $inject = ["$http", "userService", "$templateCache", "$log", "$cookies", "statesService"];
		constructor(private $http: angular.IHttpService, private userService: IUserService, private $templateCache: angular.ITemplateCacheService, private $log: Services.EnhancedLog, private $cookies: ng.cookies.ICookiesService, private statesService: Services.StatesService) {
			// Listen to cross sessions events
			sysend.on("logOut", () => {
				this.applyLogOut();
				$log.appInfo("CrossSessionLogOutApplied");
			});
		}

		isAuthenticated = () => this.userService.isUserExist();
		getStateToRedirect = () => this.stateToRedirect;

		login = (credentials: ILoginCredentials) => {
			return this.$http.post(this.loginUrl, credentials)
				.then(
					/* Success */ (response: ng.IHttpPromiseCallbackArg<ILoginServerResponse>) => {
						if (response.data.isAuthenticated) this.userService.create(response.data.userData);
						return response.data;
					},
					/* Failure */ () => {
						this.$log.ajaxError("LogInPostFailed");
						return false;
					});
		};

		signUp = (user: ISignUpUser) => {
			return this.$http.post(this.signUpUrl, user).then(
				/* Success */ (response: ng.IHttpPromiseCallbackArg<ISignUpServerResponse>) => {
					if (response.data.isAuthenticated) this.userService.create(response.data.userData);
					return response.data;
				},
				/* Failure */  () => {
					this.$log.ajaxError("SignUpPostFailed");
					return { isAuthenticated: false, message: { text: "Well! Could you try that again?" } };
				});
		};

		logout = () => {
			return this.$http.post(this.logoutUrl, {})
				.then(
					/* Success */ (response: ng.IHttpPromiseCallbackArg<ILoginServerResponse>) => {
						if (response.data.isAuthenticated === false) {
							sysend.broadcast("logOut"); // broadcast the logOut to all other sessions
							this.applyLogOut();
						}
						return response.data.isAuthenticated;
					},
					/* Failure */ () => {
						this.$log.ajaxError("LogOutPostFailed");
						return false;
					});
		};

		setStateToRedirect = (stateName: string, params?:any) => {
			this.stateToRedirect.stateName  = stateName;
			this.stateToRedirect.params = params;
		};

		applyLogOut() {
			this.$cookies.remove(Config.CookieNames.loggedIn);
			this.userService.create(undefined);
			this.statesService.resetAllStates();
			this.statesService.goAndReload(States.home.name);

		}
	}

}