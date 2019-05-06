/// <reference path="../Interfaces.ts"/>
/// <reference path="ServerSocketService.ts"/>
module Services {

	export class InvokeHandlers {
		callback: (...args: any[]) => void;
		managedHandler: (...args: any[]) => void;
	}

	export class HubService<TRemoteEventName, TLocalMethodName> {

		private hubProxy: SignalR.Hub.Proxy;
		private queuedOutgoingActions: IHubAction<TLocalMethodName>[] = [];
		private invokeHandlers: { [event: string]: Array<InvokeHandlers> } = {};

		protected queuedIncomingActions: IHubManagedAction<TLocalMethodName>[] = [];
		protected expectedCallOrderId: number;

		constructor(protected $q: ng.IQService, protected $log: EnhancedLog, protected $timeout: ng.ITimeoutService, protected connection: ServerSocketService, public hubName: string) {
			// set handlers for managed queue
			this.hubProxy = connection.getHubProxy(hubName);
			this.hubProxy.on("Do", (managedMessages: IHubManagedAction<TLocalMethodName>[]) => this.onManagedMessages(managedMessages) );
			this.hubProxy.on("ResetClient", () => this.connection.restart());
			this.connection.eventStarting.on(() => this.expectedCallOrderId = 1 );
			this.connection.eventStarted.on(() => this.processOutgoingQueue());
			this.connection.eventReconnected.on(() => this.processOutgoingQueue());
			this.connection.eventDisconnected.on(() => this.queuedOutgoingActions = []); // Make sure the queue doesn't get re-emitted when a full reconnect happens
		}

		/// Subscribe to server-initiated invokes
		protected on(hubAction: TRemoteEventName, callback: (...args: any[]) => void) {
			// Listen to server invoking client side methods
			const fn = (...args: any[]) => this.processReceivedInvoke(String(hubAction), args);
			this.hubProxy.on(String(hubAction), fn );

			// Store the callback function for the listener above to use
			if (!this.invokeHandlers[String(hubAction)]) this.invokeHandlers[String(hubAction)] = [];
			this.invokeHandlers[String(hubAction)].push( { callback: callback, managedHandler: fn});
		}

		protected processReceivedInvoke(hubAction: string, hubArgs: any[]) {
			const handlers = this.invokeHandlers[hubAction];
			if (!handlers || !handlers.length) { this.$log.signalRError("MissingHubActionHandler", { hubAction }); return; }
			for (let idx = 0; idx < handlers.length; idx++) {
				this.$timeout((handler) => { // Note: I tried to remove the timer but it messes up the display of new message to the partner: The text doesn't scroll down on a new messages
					try { handler.apply(this, hubArgs); }
				    catch (e) {
						var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
						this.$log.signalRErrorWithString(`${hubAction}_Failed`, errorData); // TODOLater: Composed error messages are really difficult to track down
					}
				}, 0, true, handlers[idx].callback);
			}
		}

		protected onManagedMessages(managedMessages: IHubManagedAction<TLocalMethodName>[]) {
			try {
				// All the validation is to make sure we catch issues, because SignalR swallow errors inside of this method.
				if (managedMessages == null || managedMessages.length === 0) {
					this.$log.signalRError("ManagedMessagesCannotBeNullOrEmpty");
					return;
				}

				var processedMessagesCount = 0;
				var keepProcessing: boolean;

				// Append unprocessed messages from previous call(s)
				managedMessages = managedMessages.concat(this.queuedIncomingActions || []);

				do {
					keepProcessing = false;
					managedMessages.forEach((managedMessage) => {
						if (managedMessage.orderId === this.expectedCallOrderId) {
							const action = managedMessage.message;
							this.processReceivedInvoke(String(action.method), action.args || []);
							this.expectedCallOrderId++;
							processedMessagesCount++;
							keepProcessing = true;
						}
					});
				} while (keepProcessing);

				// Collect unprocessed messages
				this.queuedIncomingActions = [];
				managedMessages.forEach((managedMessage) => {
					if (managedMessage.orderId > this.expectedCallOrderId)
						this.queuedIncomingActions.push(managedMessage);
				});

				if (this.queuedIncomingActions.length !== 0)
					this.$log.signalRInfo("ManagedMessagesKeptForLater", { count: this.queuedIncomingActions.length });
			} catch (e) {
				var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
				this.$log.signalRErrorWithString("Do_Failed", errorData);
			}
		}

		/// Invoke method on the server. In case last argument is a function (simpleWebRtc does that), it would be used as a callback (err, res) => void. But it's better to use promise.
		protected emit(action: TLocalMethodName, ...argsAndCallback: any[]) {
			//var deferred = this.$q.defer();// Todolater: Re-instate the promise and use it?

			// if we have the callback fn passed to emit call, splice it from args and fire it on done
			let callback = () => { };
			let args = angular.copy(argsAndCallback);
			if (args.length) {
				const hasCallback = typeof args[args.length - 1] == "function";
				if (hasCallback) callback = args.splice(args.length - 1)[0];
			}

			if (this.connection.state === ServerSocketState.Connected)
				this.hubProxy.invoke(String(action), ...args)
					.done((result: any) => {
						//deferred.resolve(result);
						callback.apply(this, [null, result]); // callback is in standard js-notation function(err: Error, result?: any)
					}).fail((err) => {
						var errorData = { args: args, error: { errorMessage: err["message"], stack: err["stack"] } };
						if (err["message"] === "Connection started reconnecting before invocation result was received.") {
							this.$log.signalRWarnWithString(`${this.hubName}${action}_Retrying`, errorData); // TodoLater: Composed Error messages are hard to track down :-(
							this.queuedOutgoingActions.push({ method: action, args: argsAndCallback });
						} else {
							this.$log.signalRErrorWithString(`${this.hubName}${action}_Failed`, errorData); // TodoLater: Composed Error messages are hard to track down :-(
							//deferred.reject(err);
							callback.apply(this, [err]); // callback is in standard js-notation function(err: Error, result?: any)
						}
					});
			else {
				this.$log.signalRInfo("QueueingOutgoingAction", { action });
				this.queuedOutgoingActions.push({ method: action, args: argsAndCallback });
			}

			//return deferred.promise; 
		}

		private previousOutgoingQueueLength = 0;
		private outgoingQueueLengthGrowthCount = 0;
		private processOutgoingQueue(): void {
			// This copy of actions prevents from new actions being (re)queued while we are still trying to re-emit previously queued ones, which would make a mess
			const actions = angular.copy(this.queuedOutgoingActions);
			this.queuedOutgoingActions = [];  // Empty the queue

			// There is a unknown condition in which the queue keeps growing and the connection keeps reconnecting. 
			// Eventually, it keep resending so many messages that it puts pressure on the server.
			// This prevents it from happening by resetting the connection when an outoing queue grew 5 times in a row
			if (actions.length !== 0 && actions.length >= this.previousOutgoingQueueLength) {
				if (++this.outgoingQueueLengthGrowthCount >= 5) {
					this.$log.signalRWarn("OutgoingQueueGrewTooManyTimesInARow");
					this.queuedOutgoingActions = []; // Make sure the queue doesn't get re-emitted when a full reconnect happens. I thought connection.eventDisconnected would be triggered and clean the queue, but that doesn't appear to happen
					this.previousOutgoingQueueLength = 0;
					this.connection.restart(); // Reset the client
					return;
				} else this.$log.signalRInfo("OutgoingQueueGrew");
			} else this.outgoingQueueLengthGrowthCount = 0;
			this.previousOutgoingQueueLength = actions.length;

			// Re-emit the queue
			for (let action of actions) this.emit(action.method, ...action.args);
		}

		public detachAllHandlers() {
			for (let eventName in this.invokeHandlers) 
				for (let handlers in this.invokeHandlers[eventName])
					this.hubProxy.off(eventName, this.invokeHandlers[eventName][handlers].managedHandler);
			this.invokeHandlers = {};
		}
	}

	export type TextChatRemoteEvent =
		"AddInitialMessages" | "AddInitialUsers" | "AddInitialUsersTo" | "AddMessage" | "AddPrivateChatStatus" | "AddUser" |
		"AddUserTo" | "AudioCallConnected" | "CancelAudioCall" | "DeclineAudioCall" | "HangoutAudioCall" | "MarkUserAsTyping" |
		"Pong" | "PrivateChatRequestResponse" | "RemoveUser" | "RemoveUserFrom" | "RequestAudioCall" | "SetInitialCountOfUsers" |
		"SetUserIdle" | "UnmarkUserAsTyping" | "UpdateCountOfUsers" | "RequestAudioCall" | "LeaveRoom";

	export type TextChatLocalMethod =
		"Ping" | "RequestResend" | "AudioCallConnected" | "BlockPrivateChat" | "CancelAudioCall" | "DeclineAudioCall" |
		"HangoutAudioCall" | "IgnoreChatInvite" | "JoinRoom" | "LeaveRoom" | "MarkAllCaughtUp" | "PostChatEventTo" |
		"PostTo" | "RequestAudioCall" | "RequestPrivateChat" | "SetTypingActivityIn" | "SetUserActive";

	export class TextChatHubService extends HubService<TextChatRemoteEvent, TextChatLocalMethod> {

		private pingInterval = null;
		private pingIntervalDuration = 15 * 1000 /* 15 seconds */;
		private awaitingPong = false;

		static $inject = ["$q", "$log", "$timeout", "serverConnectionService"];
		constructor($q: ng.IQService, $log: EnhancedLog, $timeout: ng.ITimeoutService, connection: ServerSocketService) {
			super($q, $log, $timeout, connection, "TextChatHub");

			// reset values when the connection is starting
			this.connection.eventStarted.on(() => this.awaitingPong = false);

			// Frequent pinging of SignalR server helps mitigate unexplained bouts of disconnections of websockets (issue encountered in production, that hasn't been answered at this time - 11/7/2016)
			this.pingInterval = setInterval(() => {
				// Report any missing awaited pong
				if (this.awaitingPong) {
					this.$log.signalRWarn("MissingAwaitedPong");
					this.awaitingPong = false;
				}

				// Ping server and ack last processed message
				if (this.connection.state === ServerSocketState.Connected) {
					this.ping(this.expectedCallOrderId - 1);
					this.awaitingPong = true;
				}
			}, this.pingIntervalDuration);
			super.on("Pong", this.onPong);
		}

		// Events (Signature is defined by the server)
		onAddInitialMessages         = (callback: (messages: ITextChatMessage[])    => void) => super.on("AddInitialMessages", callback);
		onAddInitialUsers            = (callback: (users: ITextChatUser[])          => void) => super.on("AddInitialUsers", callback);
		onAddInitialUsersTo          = (callback: (roomId: RoomId, users: UserId[]) => void) => super.on("AddInitialUsersTo", callback);
		onAddMessage                 = (callback: (message: ITextChatMessage)       => void) => super.on("AddMessage", callback);
		onAddPrivateChatStatus       = (callback: (status: ITextChatTracker[])      => void) => super.on("AddPrivateChatStatus", callback);
		onAddUser                    = (callback: (users: ITextChatUser)            => void) => super.on("AddUser", callback);
		onAddUserTo                  = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("AddUserTo", callback);
		onAudioCallConnected         = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("AudioCallConnected", callback);
		onCancelAudioCall            = (callback: (roomId: RoomId)                  => void) => super.on("CancelAudioCall", callback);
		onDeclineAudioCall           = (callback: (roomId: RoomId, reason: string)  => void) => super.on("DeclineAudioCall", callback);
		onHangoutAudioCall           = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("HangoutAudioCall", callback);
		onMarkUserAsTyping           = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("MarkUserAsTyping", callback);
		onPrivateChatRequestResponse = (callback: (users: ITextChatUser)            => void) => super.on("PrivateChatRequestResponse", callback);
		onRemoveUser                 = (callback: (userId: UserId)                  => void) => super.on("RemoveUser", callback);
		onRemoveUserFrom             = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("RemoveUserFrom", callback);
		onRequestAudioCall           = (callback: (roomId: RoomId, userId: UserId)  => void) => super.on("RequestAudioCall", callback);
		onSetInitialCountOfUsers     = (callback: (countOfUsers: ICountOfUsers)     => void) => super.on("SetInitialCountOfUsers", callback);
		onSetUserIdle                = (callback: (userId: UserId)                  => void) => super.on("SetUserIdle", callback);
		onUnmarkUserAsTyping         = (callback: (userId: UserId)                  => void) => super.on("UnmarkUserAsTyping", callback);
		onUpdateCountOfUsers         = (callback: (roomId: RoomId, count: number)   => void) => super.on("UpdateCountOfUsers", callback);
		onLeaveRoom                  = (callback: (roomId: RoomId)                  => void) => super.on("LeaveRoom", callback);

		// Methods to call the server-side corresponding methods
		private ping          = (orderId: Number)                               => super.emit("Ping", orderId);
		private requestResend = (orderIds: Number[])                            => super.emit("RequestResend", orderIds);
		audioCallConnected    = (roomId: RoomId)                                => super.emit("AudioCallConnected", roomId);
		blockPrivateChat      = (bool: boolean)                                 => super.emit("BlockPrivateChat", bool);
		cancelAudioCall       = (roomId: RoomId)                                => super.emit("CancelAudioCall", roomId);
		declineAudioCall      = (roomId: RoomId, reason: String)                => super.emit("DeclineAudioCall", roomId, reason);
		hangoutAudioCall      = (roomId: RoomId)                                => super.emit("HangoutAudioCall", roomId);
		ignoreChatInvite      = (userId: UserId)                                => super.emit("IgnoreChatInvite", userId);
		subscribeToRoom       = (roomId: RoomId)                                => super.emit("JoinRoom", roomId);
		leaveRoom             = (roomId: RoomId)                                => super.emit("LeaveRoom", roomId);
		markAllCaughtUp       = (userId: UserId)                                => super.emit("MarkAllCaughtUp", userId);
		postChatEventTo       = (roomId: RoomId, event: string, userId: UserId) => super.emit("PostChatEventTo", roomId, event, userId);
		postTo                = (roomId: RoomId, message: string)               => super.emit("PostTo", roomId, message);
		requestAudioCall      = (roomId: RoomId)                                => super.emit("RequestAudioCall", roomId);
		requestPrivateChat    = (userId: UserId)                                => super.emit("RequestPrivateChat", userId);
		setTypingActivityIn   = (roomId: RoomId)                                => super.emit("SetTypingActivityIn", roomId);
		setUserActive         = ()                                              => super.emit("SetUserActive");

		public detachAllHandlers() {
			super.detachAllHandlers();
			clearInterval(this.pingInterval);
		}

		public onPong(lastQueuedOrderId: Number) {
			this.awaitingPong = false;

			// Check if we have all the messages we should have received from the server. If not, request the server to resend what's missing
			var isAvail = (orderId: number) => this.queuedIncomingActions.some((action) => action.orderId === orderId);
			const orderIds = ((n, p) => {
				const a: number[] = []; for (; n <= p; n++)
					if (!isAvail(n)) a.push(n); return a;
			})(this.expectedCallOrderId, lastQueuedOrderId);
			if (orderIds.length !== 0) this.requestResend(orderIds);
		}
	}

	export class VoiceChatHubService extends HubService<string, string> implements ISignallingConnection {
		static $inject = ["$q", "$log", "$timeout", "serverConnectionService"];
		constructor($q: ng.IQService, $log: EnhancedLog, $timeout: ng.ITimeoutService, connection: ServerSocketService) {
			super($q, $log, $timeout, connection, "VoiceChatHub");
		}

		// Implementation of ISignallingConnection, called by SimpleWebRtc
		// Some hubActions that will go through it are: "connect", "message", "remove", "stunservers", "turnservers", "init", "join", "leave", "message", "callFinished"
		on(hubAction: string, callback: (...args: any[]) => void) { super.on(hubAction, callback); return this; }
		emit(hubAction: string, ...args: any[]) { return super.emit(hubAction, ...args); }
		getSessionid = () => this.connection.sessionId;
		disconnect = null; // Called when SimpleWebRtc doesn't need the signalling anymore
	}

}