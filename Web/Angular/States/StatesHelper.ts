module StatesHelper {

	const statesNotRequiringEmailConfirmations: string[]=[];

	export function createUiRouterStates($stateProvider: ng.ui.IStateProvider) {
		$stateProvider.state("root", {
			abstract: true,
			resolve: {
				userService: "userService",
				//serverResources:"serverResources",
				//Andriy: Minification-safe syntax
				//userExists: ["userService", (userService: Authentication.IUserService) => {
				//	return userService.isInitUserExistAsync();
				//}],
				resolveResources: ["serverResources", (serverResources:Services.ServerResourcesService) => {
						return serverResources.resolveTranslationsAsync();
					}]
			}
		});
		// Adding other states
		const stateTitles = angular.element.parseJSON(document.getElementById("titles-json").innerText);
		for (let key in States) {
			const state: State = States[key];
			const views: Object = {};
			views[state.name] = { /* controller: "YourCustomCtrlIfYouWant" */ };

			// Set the template url for this state
			if (!state.templateLess) {
				if (!state.templateUrl) state.templateUrl = `/partials${state.url.slice(1)}`;
				views[state.name]["templateUrl"] = state.templateUrl;
			}
			state.isRemoteTemplate = !state.templateLess && state.templateUrl.indexOf("/") === 0;

			// Create the UI State
			///let uiState: ng.ui.IState & { title: string, sticky: boolean, dsr: Object } = { // intersection state doesn't work, using any
			let uiState: any = {
				title: stateTitles[key], url: state.url, views: views,
				sticky: state.sticky || false, dsr: state.deepStateRedirect
			};

			// Add default parameters
			switch (state.name) {
				case States.login.name           : uiState.params = <Authentication.ILoginStateParams>{ emailOfExistingAccount: undefined }; break;
				case States.mailboxUser.name     : uiState.params = { id: undefined, isNew: { value: undefined, squash: true } }; break;
				case States.mailboxInbox.name    : uiState.params = <MailBox.IMailBoxStateParams>{ notReload: undefined }; break;
				case States.findByLanguages.name : uiState.params = { known: { value: undefined, squash: true }, learn: { value: undefined, squash: true } }; break;
			}

			// Add the UI State to the provider
			$stateProvider.state(state.name, <ng.ui.IState>uiState);
		};

		// Define states that don't require a validated email address
		statesNotRequiringEmailConfirmations.push(States.home.name, States.contactUs.name, States.profile.name,
			States.termsOfUse.name, States.privacyPolicy.name, States.sharedTalk.name, States.livemocha.name);
	}

	//Andriy: It's hack (not dirty).... 
	// Event "StateChangedStart" fired on transition to every nested state. 
	// For example if you need to go to text-chat.lobby it fires 2 times on text-chat state and text-chat.lobby state
	// If we use promises, we need to be sure that logic performs only one time during all transitions.
	// To prevent this i think it's better to move such logic to "StateChangedSuccess" handler which fired 1 time always
	let isDataLoading = false;

	export function onStateChangeStart(event: ng.IAngularEvent, toState: State, toParam, fromState: State,
		                               $log: Services.EnhancedLog, spinnerService: Services.SpinnerService,
		                               authService: Authentication.IAuthenticationService,
		                               userService: Authentication.IUserService, $state: ng.ui.IStateService,
									   $stickyState: ng.ui.IStickyStateService, modalService: Services.IModalWindowService,
									   $cookies: ng.cookies.ICookiesService) {

		//$log.appInfo("StateChangeStart", { from: fromState.name, to: toState.name, toParam }); // Too much to log at this time
		spinnerService.showSpinner.show = true;

		if (!userService.isUserDataLoaded) {
			event.preventDefault();
			if (!userService.isInitLoadingStarted)
				userService.getInitUserDataAsync().then((authenticated) => {
					if (authenticated) openStatesFromCookies($state, $cookies, authService, toState.name, angular.copy(toParam));
					else $state.go(toState.name, toParam, { reload: true });
				});
			return;
		}

		// Restrict access when account is pending email confirmation
		if (toState.name !== States.emailNotConfirmed.name && authService.isAuthenticated() && !userService.getUser().isEmailConfirmed && statesNotRequiringEmailConfirmations.indexOf(toState.name) === -1) {
			$log.appInfo("StateChangeRestricted", { toState: toState.name, cause: "EmailNotConfirmed" });
			$stickyState.reset("*");
			event.preventDefault();
			spinnerService.showSpinner.show = false;
			if (!isDataLoading) {
				isDataLoading = true;
				userService.getInitUserDataAsync().then(() => {
					isDataLoading = false;
					if (userService.getUser().isEmailConfirmed) $state.go(toState.name, toParam, { reload: true });
					else modalService.openEmailIsNotConfirmModal();
				});
			}
			return;
		}

		// Prevent authenticated user from visiting signup form
		if (toState.name === States.signup.name && authService.isAuthenticated()) {
			event.preventDefault();
			$state.go(States.home.name);
			return;
		}

		// Redirect unreachable text chat states to the text chat lobby
		if ((toState.name === States.textChatHistory.name) && fromState.name.length === 0) {
			event.preventDefault();
			$state.go(States.textChatLobby.name);
			return;
		};

		// With this, the user will always end on the intended page if he got asked to log in to see that authenticated,
		// or, once he logs in, he will return to the last page he was on before logging in
		if (toState.name !== States.login.name) authService.setStateToRedirect(toState.name, toParam);

		if (!authService.isAuthenticated() && toState.name === States.emailNotConfirmed.name) {
			event.preventDefault();
			$state.go(States.login.name);
			return;
		}

		if (fromState.name !== States.home.name && toState.name === States.emailNotConfirmed.name && authService.isAuthenticated()) {
			event.preventDefault();
			$state.go(States.home.name).then(() => { $state.go(States.emailNotConfirmed.name) });
			return;
		}
	}

	export class UiStateEventNames {
		static get $stateChangeSuccess() { return "$stateChangeSuccess"; }
		static get $stateChangeStart()   { return "$stateChangeStart";   }
		static get $stateNotFound()      { return "$stateNotFound";      }
	}

	const statesToSave = {
		// States.ts isn't available at this time. Must use strings until we find out why
		"text-chat": "root.text-chat.lobby",
		"find"     : "root.find.languages"
	};

	export function saveOpenedStateInCookies($state: angular.ui.IStateService, $cookies: angular.cookies.ICookiesService) {
		const stateNamePart = $state.current.name.split(".")[1];
		if (Object.keys(statesToSave).indexOf(stateNamePart) !== -1) {
			const cookies = $cookies.get(Config.CookieNames.lastStates);
			const statesInCookies = (cookies ? angular.fromJson(cookies) : []) as string[];
			if (statesInCookies.indexOf(stateNamePart) === -1) {
				statesInCookies.push(stateNamePart);
				$cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
			}
		}
	}

	export function openStatesFromCookies($state: angular.ui.IStateService, $cookies: angular.cookies.ICookiesService, authService: Authentication.IAuthenticationService, toStateName: string, toParam:any) {
		const cookies = $cookies.get(Config.CookieNames.lastStates);
		if (cookies) {
			$cookies.put(Config.CookieNames.lastStates, undefined); // clear the cookie (to prevent corrupted states from being perpertuated forever)
			const statesInCookies = angular.fromJson(cookies) as string[];
			if (statesInCookies.length > 0) {
				loadStatesFunc(statesInCookies, $state, toStateName, toParam);
				return;
			}
		}
		$state.go(toStateName, toParam);

		function loadStatesFunc(statesToOpen: string[], $state: ng.ui.IStateService, currentStateName: string, currentStateParam: any) {
			if (statesToOpen.length > 0) {
				$state.go(statesToSave[statesToOpen[0]])
					.then(() => {
						if (statesToOpen.length > 1) {
							const nextStates = statesToOpen.slice(1);
							loadStatesFunc(nextStates, $state, currentStateName, currentStateParam);
						} else 
							$state.go(currentStateName, currentStateParam);
					});
			}

		}
	}
}