module Services {

	export enum LogLevel { Info, Warn, Error };

	// Naming conventions for Log Tags: PascalCase, Only Letters (a - z, A - Z), underscore, and digits (but don't start with a digit)
	export type LogTag =
		// Voice Chat
		"AudioCallRequested" | "AudioCallFinishing" | "AudioCallFinished" | "AudioCallConnected" | "StoppingAudioCall" | "CallFinishedReceived"
		| "StartingRoomAudioCall" | "StartRoomAudioCallPromiseFailed" | "ReadyToCallReceived" | "JoinRoomReturnedError" | "JoinRoomCompleted"
		| "RtcLocalMediaError" | "RequestAudioCallStarted" | "FailedToMapReasonToMessage" | "AudioCallDeclined" | "AudioCallCancelled"
		| "CheckCapabilitiesFailed" | "StartingLocalVideo" | "StartingRoomAudioCallCompleted" | "IceConnectionStateChange" 
		| "RequestAudioCallAborted" | "connectivityError" | "iceFailed" | "AbortingRequestAudioCall" | "SendingRequestAudioCall"
		| "HangUpAudioCall" | "AudioCallHungUp" | "StartSignalRConnectionRequested" | "StartWasCalledOnNonDisconnectedState"
		| "RequestAudioCallSent" | "AudioCallAcceptRequest" | "AudioCallAccepted" | "DeclineAudioCall" | "CancelAudioCall"
		| "PeerCreatedHandler" | "RoomAudioCallStateMissing" | "UnexpectedRoomAudioCallState" | "MissingAudioPeerHanlder"
		| "MissingAudioCallStateOnIceClose" | "IceConnectionFailed" | "UnhandledIceConnectionState"

		| "InitialWindowSize" | "WindowResized" | "StateChangeStart" | "StateChangeSuccess" | "ForcingPageRefreshToGetNewClient"
		| "PageRefreshOrClosePrevented" | "PageRefreshOrCloseAccepted" | "ValidLogInFormSubmitted" | "InvalidLogInFormSubmitted"
		| "ValidProfileFormSubmitted" | "InvalidProfileFormSubmitted" | "InvalidSignUpFormSubmitted" | "ValidSignUpFormSubmitted"
		| "HubConnectionSlow" | "AttemptToSendTooShortMail" | "StateChangeError" | "LogInPostFailed" | "CrossSessionLogOutApplied"
		| "SignUpPostFailed" | "LogOutPostFailed" | "PostProfile_PostFailed" | "OnTextChatDetroy" | "ManagedMessagesKeptForLater"
		| "ManagedMessagesCannotBeNullOrEmpty" | "ManagedMessagesCannotBeNullOrEmpty" | "MissingProperCookies" | "CookieReport"
		| "HubStarting" | "HubStateChanged" | "AddChatRequestToHistoryFailedOnMissingPartner"
		| "HubReconnecting" | "HubReconnected" | "HubErrorWebSocketClosed" | "HubResetDueToExcessiveWebSocketClosedErrors"
		| "HubStopAndQuitChatDueToExcessiveWebSocketClosedErrors" | "HubError" | "HubReceived" | "ConnectingHub"
		| "UserIdNotFoundInAddUserTo" | "UserIdNotFoundInAddInitialUsersTo" | "UnexpectedExistingStatusInChatRequest"
		| "HubStartFailed" | "HubDisconnectedOnError" | "HubDisconnectedOnDemand"
		| "SlowServerResponse" | "AjaxUnauthorized" | "AjaxException" | "AjaxTimeout" | "Angular404"  | "ClosingState"
		| "TaskBar_CloseStateRequested" | "TaskBar_ChangeStateRequested" | "TaskBar_WidthOverflow" | "ClosingStateImmediately"
		| "ClosingStateInitiated" | "ClosingStateCompleted" | "ClosingStateFailedOnDestStateMismatch" | "ClosingStateFailedOnStateChangeError"
		| "ConnectHubFailedTooMuch" | "RemoveUserFromMissingRoomError" | "CancelAccountRequested" | "MissingAwaitedPong"
		| "LoadUsersByLanguagesFailed" | "LoadUsersByNameFailed" | "LoadMoreUsersFailed" | "DeleteProfile_PostFailed"
		| "CancelAccountCancelled" | "ResendEmailVerification_Failed" | "ClientConnected" | "UpdateTileFilters_PostFailed"
		| "ResettinghubErrorWebSocketClosedCountToZero" | "ResolveLangIdFromModal_Failed"
		| "UpdateTileFilters_PostFailed" | "GetMemberPost_Failed" | "PreviousEmailPastedIn"
		| "MissedTranslationResource" | "StateChangeRestricted" | "MutedChatMessage" | "AudioCallMutedFor" | "ChatUserUnmuted"
		| "ChatUserMuted" | "UnexpectedTextChatSettingType" | "UserNotFoundInAddMessage" | "InactiveUserBootedOutOfRoom"
		| "MalformedRoomRequested" | "dumpFailingRoomFromCookie" | "UndefinedListItemsInRemoveUserFromLists" | "FailedToLoadListOfMails"
		| "FailedToLoadContentOfMail" | "FailedToSendMail" | "FailedUserMailboxChangeStateConfirmation" | "FailedToGetCurrentMember"
		| "QueueingOutgoingAction" | "MissingHubActionHandler" | "XirsysServerRequestResponse" | "XirsysServerRequestFailed"
		| "OutgoingQueueGrewTooManyTimesInARow" | "OutgoingQueueGrew" | "FailImportSharedLingoDataIntoForm" | "UrlClicked"
		;

	export class EnhancedLog {

		public static http: ng.IHttpService; // This is initialized early with the angular app. It's used because I failedto find a way to inject $http that doesn't create circular dependencies errors

		public maxErrorRemotelyLogged = 250; // Occasionally, angular crashes in a loop and may report a gazillion errors to the server if no one stops it. So we need to put a limit to that.
		public currentErrorRemotelyLogged = 0; 

		// ========== Helper methods ==========

		private getErrorMessage = (msg, location?) => {
			return (msg.stack || msg.message || ((typeof msg === "string" || msg instanceof String) ? msg : JSON.stringify(msg)))
				+ (location != undefined ? `\n    at ${location}` : "");
		};

		private getMessage = (tag:LogTag, data:Object) => tag + (data ? ` = ${JSON.stringify(data)}` : ""); 

		private logTo = (tag, data:Object, logger, level) => {
			var msg = this.getMessage(tag, data);
			if (level !== LogLevel.Error || this.currentErrorRemotelyLogged < this.maxErrorRemotelyLogged)
				EnhancedLog.http.post(Config.EndPoints.remoteLog, { logger: logger, level: level, path: window.location.pathname, message: msg });

			if (level === LogLevel.Error) {
				this.currentErrorRemotelyLogged++;
				if (this.currentErrorRemotelyLogged === this.maxErrorRemotelyLogged)
					EnhancedLog.http.post(Config.EndPoints.remoteLog, { logger: logger, level: LogLevel.Error, path: window.location.pathname, message: "MaxErrorRemotelyLoggedReached" });
			}
			switch (level) {
				case LogLevel.Error: this.consoleError(tag, data); debugger; break; // Do not remove 'debugger'! This helps catching errors during development
				case LogLevel.Warn: this.consoleWarn(tag, data); break;
				default: this.consoleInfo(tag, data); break;
			}

		};

		// ========== Override $log methods ==========

		private trace = msg => { this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); }; 
		private debug = msg => { this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); }; 
		private log = msg => { this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); }; 
		private info = msg => { this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); }; 
		private warn = msg => { this.logTo(msg, null, Config.Loggers.angular, LogLevel.Warn); };
		private error = (msg?, location?) => {
			if (msg) {
				const errorMsg = this.getErrorMessage(msg, location);
				this.logTo(errorMsg, null, Config.Loggers.angular, LogLevel.Error);
			}
		};

		// ========== Log to console ==========
		public consoleInfo = (tag: LogTag, data?: Object) => console.info(this.getMessage(tag, data));
		public consoleWarn = (tag: LogTag, data?: Object) => console.warn(this.getMessage(tag, data));
		public consoleError = (tag: LogTag, data?: Object) => console.error(this.getMessage(tag, data));

		// ========== Enhanced logging methods ==========
		// Guidelines: Avoid using the "WithString" versions of these methods. If you have to use them (because your logTag is dynamic),
		//			   make sure the string is in one word, only Letters (a-z, A-Z), underscore, and digits (but don't start with a digit)

		public appInfo = (tag:LogTag, data?:Object) => this.logTo(tag, data, Config.Loggers.client, LogLevel.Info);
		public appWarn = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.client, LogLevel.Warn); };
		public appError = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.client, LogLevel.Error); };

		public ajaxInfo = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Info); };
		public ajaxWarn = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Warn); };
		public ajaxError = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Error); };

		public signalRInfo = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Info); };
		public signalRWarn = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Warn); };
		public signalRError = (tag: LogTag, data?: Object) => { this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Error); };

		// Use this only if you really can't use signalRWarn/signalRError(...).
		// This happens if you're composing the tag dynamically, which is frowned upon because it makes tracking errors difficult
		public signalRWarnWithString = (tagString: String, data?: Object) => { this.logTo(tagString, data, Config.Loggers.signalR, LogLevel.Warn); };
		public signalRErrorWithString = (tagString: String, data?: Object) => { this.logTo(tagString, data, Config.Loggers.signalR, LogLevel.Error); };
	}

}
