/// <reference path="References.d.ts" />

//---------- Catch javascript errors -------------------------------------
// There are other mechanisms for catching angular/Ajax/SignalR errors, but they don't catch early problems (before Angular runs fully, for e.g.)

window.onerror = (msg, url, line) => {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/api/log", true);
	xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
	xmlhttp.send(JSON.stringify({
		logger: "javascript",
		level: "Error",
		path: window.location.pathname,
		message: `JavascriptError = ${JSON.stringify({ error: msg, url: url, line: line })}`
	}));
	debugger; // Do not remove! This helps catching errors during development
}


//---------- Configuration Settings -------------------------------------

module Config {

	// This version number is validated by the Checkpoint Api Endpoint (see CheckpointController.cs)
	// If you need to force all users to use a new version (usually for compatibility with a new server),
	// configure the endpoint the reject earlier versions

	export const clientVersion = "166"; 
	 
	export module Loggers {
		export const client  = "WebClient";
		export const angular = "Angular";
		export const ajax    = "Ajax";
		export const signalR = "SignalRClient";
	}

	export module Ajax {
		export const timewarningInMs = 3000;
		export const timeoutInMs = 10000;
	}

	export module EndPoints {
		export const postDeleteAccount          = "/api/account/delete";
		export const getResendEmailVerification = "/api/account/resend-email-verification";
		export const postTilesFilter            = "/api/account/filter";
		export const profileUrl                 = "/api/account/profile";
		export const postContactUsMessage       = "/api/care/message";
		export const getContactsList            = "/api/contact-list";
		export const postContactsAdd            = "/api/contact-list/add";
		export const postContactsRemove         = "/api/contact-list/remove";
		export const remoteLog                  = "/api/log";
		export const postMail                   = "/api/mailbox/post-mail";
		export const getListOfMails             = "/api/mailbox/get-list-of-mails";
		export const getMailContent             = "/api/mailbox/get-mail-content";
		export const postArchiveThread          = "/api/mailbox/archive";
		export const getMemberProfile           = "/api/members/get-profile";
		export const postMembersList            = "/api/members/list";
	}

	export module CookieNames {
		// Must match server-side cookie names
		export const deviceTag             = "DeviceTag";
		export const oldUiCulture          = "OldUiCulture";
		export const sessionTag            = "SessionTag";
		export const uiCulture             = "UiCulture";
		// Client cookie only
		export const loggedIn				  = "LoggedIn";
		export const playMessageAddedSound    = "PlayMessageAddedSound";
		export const sharedSkypeId            = "SharedSkypeId";
		export const sharedSecretRoom         = "SharedSecretRoom";
		export const sharedEmailAddress       = "SharedEmailAddress";
		export const playUserNewInvitation    = "PlayUserNewInvitation";
		export const mutedUsers               = "MutedUsers";
		export const roomsFromPreviousSession = "RoomsFromPreviousSession";
		export const lastStates               = "LastStates";
	};

	export const lobbySpecialRoom = { name: "text-chat-lobby", text: null };

	export module TopicChatRooms {
		export const hellolingo = { name: "hellolingo", text: "Hellolingo" };
	}

	export const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

	export module Regex {
		export const secretRoom = /^[a-zA-Z0-9]{6,20}$/;
	}
}


//---------- App Booststrap --------------------------------------------------------------------------------------

var app: IApp = angular.module("app", ["app.filters", "ngCookies", "ct.ui.router.extras", "ui.bootstrap", "ngAnimate", "ngSanitize","pascalprecht.translate"]);

app.config(["$locationProvider", "$httpProvider", "$stateProvider", "$stickyStateProvider", "$urlRouterProvider",
			"$translateProvider", "serverResourcesProvider", "$cookiesProvider",
	($locationProvider, $httpProvider, $stateProvider: ng.ui.IStateProvider, $stickyStateProvider, $urlRouterProvider,
	 $translateProvider: ng.translate.ITranslateProvider, serverResourcesProvider: Services.ServerResourcesProvider, $cookiesProvider) => {

		// Create all the needed states for the app
		StatesHelper.createUiRouterStates($stateProvider);

		// 404s: Intercept unrecognized urls, report them and redirect to home page or text chat lobby.
		$urlRouterProvider.otherwise(($injector, $location) => {
			($injector.get("$log") as Services.EnhancedLog).appWarn("Angular404", { url: $location.path() });
			($injector.get("$state") as ng.ui.IStateService).go(States.home.name);
		});

		// Enable Html5 mode (for hashtagless urls) + change the hashTag prefix to reclaim # for other usages
		$locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix("!");

		// Restore the header that tells the server if request are Ajaxy or not (because removed in new versions of angular)
		$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

		// Hook the ajax manager (track and report slow/failed AJAX calls, handle unauthorized calls, cache/version template management)
		$httpProvider.interceptors.push(["$q", "$log", "$injector", Services.AjaxManager.factory]);

		$cookiesProvider.defaults.expires = new Date(2099, 1, 31, 0, 0, 0);

		// Debug stuff - DO NOT REMOVE
		// $stickyStateProvider.enableDebug(true);

		//Andriy: Get translation resources from HTML and configure $translate service.
		serverResourcesProvider.setupTranslationService($translateProvider);
	}
]);

//---------- Runtime Settings --------------------------------------------------------------------------------------

module Runtime {

	export var ngCookies: angular.cookies.ICookiesService; // This module expect this to have point an instance of $cookie to work properly

	// TODOLATER: Get these settings to follow the same approach as other properties in the Runtime module
	export var uiCultureCode: String;
	export var sessionTag: Number;

	export class SharedLingoData {
		static first:string;
		static last:string;
		static birthYear:number;
		static email: string;
		static gender: string;
		static natives: string;
		static learns: string;
		static countryCode: string;
		static city: string;
	}

	export class TextChatSettings {
		static get playMessageAddedSound(): Boolean { return Runtime.getBooleanCookie(Config.CookieNames.playMessageAddedSound, true); }
		static set playMessageAddedSound(val: Boolean) { Runtime.saveBooleanCookie(Config.CookieNames.playMessageAddedSound, val); }
		static get playUserNewInvitation(): Boolean { return Runtime.getBooleanCookie(Config.CookieNames.playUserNewInvitation, true); }
		static set playUserNewInvitation(val: Boolean) { Runtime.saveBooleanCookie(Config.CookieNames.playUserNewInvitation, true); }
	}

	export function getBooleanCookie(cookieName: string, defaultValue: Boolean): Boolean {
		const val = ngCookies.get(cookieName);
		return val == undefined ? defaultValue : val === "true";
	}
	export function saveBooleanCookie(cookieName: string, val: Boolean): void { Runtime.ngCookies.put(cookieName, val ? "true" : "false"); }

}


//---------- App Runtime --------------------------------------------------------------------------------------

app.run(["$rootScope", "$cookies", "$state", "$log", "$window", "$http", "authService", "userService", "spinnerService", "$stickyState", "serverResources", "modalService", "$location",
	($rootScope, $cookies, $state: ng.ui.IStateService, $log: Services.EnhancedLog, $window: ng.IWindowService, $http: ng.IHttpService, authService: Authentication.IAuthenticationService,
		userService: Authentication.IUserService, spinnerService: Services.SpinnerService, $stickyState: ng.ui.IStickyStateService, serverResources: Services.IServerResourcesService,
		modalService: Services.IModalWindowService, $location: ng.ILocationService) => {

	// This configures the EnhancedLog. Injecting $http directly didnt work because of injection circular dependencies :-(
	Services.EnhancedLog.http = $http;

	// Collect SharedLingo data, if any
	Runtime.SharedLingoData.first = $location.search().first;
	Runtime.SharedLingoData.last = $location.search().last;
	Runtime.SharedLingoData.birthYear = $location.search().bornYear;
	Runtime.SharedLingoData.email = $location.search().email;
	Runtime.SharedLingoData.gender = $location.search().gender;
	Runtime.SharedLingoData.natives = $location.search().natives;
	Runtime.SharedLingoData.learns = $location.search().learns;
	Runtime.SharedLingoData.countryCode = $location.search().countryCode;
	Runtime.SharedLingoData.city = $location.search().city;
	$rootScope.goToState = (stateName: string) => $state.go(stateName); // Shortcut function for the SharedLingo page to go to signup state

	// Needed for proper state behavior
	$rootScope.$state = $state;

	// Load cookies
	Runtime.ngCookies = $cookies;
	Runtime.uiCultureCode = $cookies.get(Config.CookieNames.uiCulture);
	Runtime.sessionTag = $cookies.get(Config.CookieNames.sessionTag);

	// Eject if we don't have the cookies we need
	if (!Runtime.uiCultureCode || Runtime.uiCultureCode == undefined) {
		setTimeout(() => { $log.appWarn("MissingProperCookies", Runtime.ngCookies.getAll());
						   $rootScope.taskBarAlert("Cookies are disabled! :-(");
						   $rootScope.fatalFailure = true; }, 1);
		return;
	} else
		$log.appInfo("CookieReport", Runtime.ngCookies.getAll());

	// Track page refresh events and window size
	$log.appInfo("InitialWindowSize", { width: $(window).innerWidth(), height: $(window).innerHeight()} );
	$(window).resize(() => {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(() => {
			$log.appInfo("WindowResized", { width: $(window).innerWidth(), height: $(window).innerHeight() });
		}, 500);
	});

	// Handle some angular state change events
	$rootScope.$on("$stateChangeStart", (event: ng.IAngularEvent, toState: State, toParam, fromState: State /*, fromParam*/) => {
        StatesHelper.onStateChangeStart(event, toState, toParam, fromState, $log, spinnerService, authService, userService, $state, $stickyState, modalService, $cookies);
	});

	$rootScope.$on("$stateChangeSuccess", (event: ng.IAngularEvent, toState: State, toParam, fromState: State /*, fromParam*/) => {
		$log.appInfo("StateChangeSuccess", { from: fromState.name, to: toState.name, toParam });
		spinnerService.showSpinner.show = false;
		
		// Force window to scoll back up. This is necessary, unless we have a fix taskbar. because the current scroll situation will remain in the target state (like when the dashboard is scrolled down and we click the find tile)
		$window.scrollTo(0, 0);

		if (toState.name === States.emailNotConfirmed.name)
			!userService.getUser().isEmailConfirmed
				? modalService.openEmailIsNotConfirmModal()
				: $state.go(States.home.name);

	    StatesHelper.saveOpenedStateInCookies($state, $cookies);
	});
		
	$rootScope.$on("$stateChangeError", (event, toState, toParams, fromState, fromParams, error) => {
		$log.appError("StateChangeError", { from: fromState.name, to: toState.name } );
		spinnerService.showSpinner.show = false;
		throw error; /* It's not clear if I have to rethrow errors, but some docs suggest I wouldn't otherwise catch ALL errors */
	});

	// Check with the server every 5 minutes (to report client version) and get server notifications and requests
	var checkCount = 0;
	var newClientRequestReceived = false;
	var check = () => $http.post("/api/check", { version: Config.clientVersion, count: checkCount++ })
		.success((response: Backend.WebApi.WebApiResponse) => {
			if (response.message && response.message.code === Backend.WebApi.WebApiResponseCode.NewClientRequired) {
				if (newClientRequestReceived) {
					$log.appInfo("ForcingPageRefreshToGetNewClient");
					window.onbeforeunload = null; // This prevent "Confirm Navigation" Alert that verifies the user actually want to refresh the page
					window.location.href = window.location.href;
				} 
				newClientRequestReceived = true;
				serverResources.getServerResponseText(response.message.code).then((serverMessage) => {
					$rootScope.taskBarAlert(serverMessage);
				});
				
			}
		});
	check();
	setInterval(check, 300000); // 5 minutes

	// Set message on reload/leave to prevent loss of data from user
	$window.onbeforeunload = () => {

		if (!Config.isFirefox) { // Don't try to prevent refreshes on Firefox because, regardless of the answer to the prompt, it will silently close the signalR connection and prevent the client from knowing about it. That's quite fucked up. Who knows what other terrible things firefox can do?
		if ($state.includes(States.signup.name) || ($state.includes(States.mailboxUser.name) && $state.params["isNew"])) {
			$log.appInfo("PageRefreshOrClosePrevented", { state: $state.current.name });
			return ""; //Not displaying any message at this time. It has little value (Chrome doesn't show it anyway;
			}
		}
		$log.appInfo("PageRefreshOrCloseAccepted", {state: $state.current.name});
		return undefined;

	};
}]);


//---------- Services --------------------------------------------------------------------------------------

app.service("$log", Services.EnhancedLog); // $Log Substitute
app.service("statesService", Services.StatesService); 
app.service("userService", Authentication.UserService);
app.service("authService", Authentication.AuthenticationService);
app.service("spinnerService", Services.SpinnerService);
app.service("membersService", Services.MembersService);
app.service("mailboxServerService", MailBox.MailboxServerService);
app.service("chatUsersService", Services.ChatUsersService);
app.service("textChatRoomsService", Services.TextChatRoomsService);
app.service("serverConnectionService", Services.ServerSocketService);
app.service("simpleWebRtcService", Services.RtcService);
app.service("textHubService", Services.TextChatHubService);
app.service("voiceHubService", Services.VoiceChatHubService);
app.service("modalService", Services.ModalWindowService);
app.service("countersService", Services.TaskbarCounterService);
app.service("modalLanguagesService", Services.ModalSelectLanguageService);
app.service("contactsService", Services.ContactsService);
app.service("textChatSettings", Services.TextChatSettingsService);
app.service("translationErrorsHandler", ["$log", Services.translationErrorsHandlerService]);

//---------- Providers --------------------------------------------------------------------------------------

app.provider("serverResources", Services.ServerResourcesProvider);

//---------- Controllers --------------------------------------------------------------------------------------

app.controller("TextChatCtrl", TextChatCtrl);
app.controller("TaskbarCtrl", TaskbarCtrl);
app.controller("TextChatLobbyCtrl", TextChat.TextChatLobbyCtrl);
app.controller("FindCtrl", Find.FindMembersCtrl);
app.controller("MailboxCtrl", MailBox.MailBoxCtrl);
app.controller("UserProfileCtrl", Profile.ProfileController);
app.controller("UserProfileModalCtrl", Profile.ProfileModalController);
app.controller("ContactUsCtrl", ContactUsCtrl);
app.controller("HomeFindBlockCtrl", HomeFindBlockCtrl);

//---------- Directives --------------------------------------------------------------------------------------

app.directive("textChatRoom", ["$sce", "$cookies", "$timeout", "userService", "chatUsersService", "$state", ($sce, $cookies, $timeout, userService, chatUsersService, $state) => new TextChatRoom($sce, $cookies, $timeout, userService, chatUsersService, $state)]);
app.directive("allowPattern", () => new AllowPattern());
app.directive("trimPassword", () => new TrimPasswordDirective());
app.directive("strictEmailValidator", () => new Validation.ValidationEmailDirective());
app.directive("onEnter", () => new OnEnter());
app.directive("title", ["$rootScope", "serverResources", ($rootScope, serverResources) => new Title($rootScope, serverResources)]);
app.directive("focusOnShow", ["$timeout", ($timeout) => new FocusOnShow($timeout)]);
app.directive("signUp", Authentication.SignUpDirective.factory());
app.directive("logInOrOut", Authentication.LogInOrOutDirective.factory());
app.directive("logIn", Authentication.LogInDirective.factory());
app.directive("showDuringChangeState", ShowDuringChangeState.factory());
app.directive("tooltipLink", () => new TooltipLink());
app.directive("textChatLobby", () => new TextChat.TextChatLobbyDirective);
app.directive("messageStatus",   () => new MailBox.MessageStatusDirective());
app.directive("messagesHistory", () => new MailBox.MessagesHistoryDirective());
app.directive("userProfile", () => new Profile.ProfileDirective());
app.directive("profileLangsPicker", () => new Profile.ProfileLangsPicker());
app.directive("profileView", () => new ProfileViewDirective());
app.directive("dashboard", () => new Dashboard.DashboardDirective());
app.directive("dashboardTile", () => new Dashboard.DashboardTileDirective());
app.directive("switch", ["$parse", ($parse) => new SwitchDirective($parse)]);
app.directive("tileWidget", ["$parse", "$compile", "$injector", ($parse, $compile, $injector) => new Dashboard.WidgetTileDirective($parse, $compile, $injector)]);
app.directive("contactsTileWidget", () => new Contacts.DashboardWidget());
app.directive("languageSelect", ["modalLanguagesService", (modalLanguagesService) => new LanguageSelectDirective(modalLanguagesService)]);
app.directive("selectLanguagesWidget", ["$compile", "serverResources", ($compile: ng.ICompileService, serverResources: Services.IServerResourcesService) => new LanguageSelectWidgetDIrective($compile, serverResources)]);
app.directive("taskbarButton", ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log", "statesService", (countersService, $timeout, authService, $state, $stickyState, $log, statesService) => new TaskButtonDirective(countersService, $timeout, authService, $state, $stickyState, $log, statesService)]);
app.directive("uiCultureDropDown", ["$templateCache", "authService", "$stickyState", "$state", "modalService", ($templateCache, authService, $stickyState, $state, modalService) => new UiCultureDropDown($templateCache, authService, $stickyState, $state, modalService)]);

//---------- Custom provider --------------------------------------------------------------------------------------

app.config(["$httpProvider", $httpProvider => {
  if (!$httpProvider.defaults.headers.get)
	$httpProvider.defaults.headers.get = {}; // Initialize get if not there

  // Disable IE ajax request caching, Otherwise partial views get cached
  $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
  $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
  //This does't seem to be needed, and it's said to cause other issues
  //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
}]);

//---------- Helpers --------------------------------------------------------------------------------------

module Helper {
	export function safeApply(scope): void {
		if (!scope.$$phase) scope.$apply(); // <== This is know to be bad practices!!!
	}
}
