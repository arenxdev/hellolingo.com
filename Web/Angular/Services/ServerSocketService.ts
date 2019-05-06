
module Services {

	export enum ServerSocketState { Connecting = 0, Connected = 1, Reconnecting = 2, Disconnected = 4 } // matches $.signalR.connectionState for convenience

	export class ServerSocketService {

		private hubErrorWebSocketClosedCount = 0;
		private connectHubFailureCount = 0;
		private hub: SignalR.Hub.Connection;

		public eventConnectionSlow = new LiteEvent<void>();
		public eventDisconnected = new LiteEvent<void>();
		public eventReconnected = new LiteEvent<void>();
		public eventStarting = new LiteEvent<void>();
		public eventStarted = new LiteEvent<void>();
		public eventFatalError = new LiteEvent<void>();

		get state() { return this.hub.state; }
		get sessionId() { return this.hub.id; }

		static $inject = ["$q", "$log", "$timeout"];
		constructor(private $q: ng.IQService, private $log: EnhancedLog, private $timeout: ng.ITimeoutService) {

			this.hub = $.hubConnection();

			// Register hub event handlers
			this.hub.starting      (()      => { this.$log.signalRInfo("HubStarting");       this.eventStarting.trigger(); });
			this.hub.connectionSlow(()      => { this.$log.signalRWarn("HubConnectionSlow"); this.eventConnectionSlow.trigger(); });
			this.hub.reconnecting  (()      => { this.$log.signalRWarn("HubReconnecting") });
			this.hub.reconnected   (()      => { this.$log.signalRInfo("HubReconnected");    this.eventReconnected.trigger(); });
			this.hub.disconnected  (()      => { this.onHubDisconnected();                   this.eventDisconnected.trigger(); });
			this.hub.stateChanged  ((data)  => this.onHubStateChanged(data));
			this.hub.received      ((data)  => this.onHubReceived(data));
			this.hub.error         ((error) => this.onHubError(error));

			// Reset the hubErrorWebSocketClosedCount every 5 minutes. This means that the client can have occasional issues, but if that happens to often, we'll kick them out
			setInterval(() => {
				if (this.hubErrorWebSocketClosedCount !== 0) {
					$log.signalRInfo("ResettinghubErrorWebSocketClosedCountToZero", { hubErrorWebSocketClosedCount: this.hubErrorWebSocketClosedCount });
					this.hubErrorWebSocketClosedCount = 0;
				}
			}, 300000 /* 5 min */);
		}

		getHubProxy = (hubName: string) => $.connection[hubName] ? <SignalR.Hub.Proxy>$.connection[hubName] : this.hub.createHubProxy(hubName); 

		start() {
			this.$log.signalRInfo("StartSignalRConnectionRequested");

			var startDeferred = this.$q.defer();

			if (this.connectHubFailureCount >= 10) {
				this.$log.signalRInfo("ConnectHubFailedTooMuch");
				startDeferred.reject("ConnectHubFailedTooMuch");
			} else if (this.hub.state === $.signalR.connectionState.disconnected) {
				this.$log.signalRInfo("ConnectingHub");
				this.hub.start().done((event) => startDeferred.resolve())
				.fail((error) => {
					this.connectHubFailureCount++;
					this.$log.signalRError("HubStartFailed", error);
					startDeferred.reject(error);
				});
			} else {
				// SimpleWebRtcService may call this when it's already started. Optimally, this shouldn't happen like that
				this.$log.signalRInfo("StartWasCalledOnNonDisconnectedState", { state: this.hub.state });
				startDeferred.resolve();
			}

			return startDeferred.promise;
		}

		restart() {
			this.hub.stop();
			this.$timeout(() => this.hub.start(), 500, false); // Immediate start after stop tends to fail
		}

		stop = () => this.hub.stop();

		private onHubStateChanged(data: SignalR.StateChanged) {
			this.$log.signalRInfo("HubStateChanged", data);
			if (data.oldState === $.signalR.connectionState.connecting && data.newState === $.signalR.connectionState.connected) {
				this.$log.signalRInfo("ClientConnected");
				this.eventStarted.trigger();
			}
		}

		private onHubReceived(data) {
			const dataCopy = angular.copy(data);

			//filter out a few things to prevent excessive logging
			if (dataCopy["I"] != undefined) return; // Filter out server telling client how many times it has been called (e.g.: {"I":"70"})
			if (dataCopy["M"] === "Pong") return; 

			// Prevent AddInitialMessages from clogging the log files (or the console) by removing all the messages from the object
			if (dataCopy["M"] === "Do") angular.forEach(dataCopy["A"][0], (call) => {
				if (call["message"]["method"] === "AddInitialMessages" || call["message"]["method"] === "AddPrivateChatStatus")
					call["message"]["args"] = "...";
			});

			// Log the received data
			if (dataCopy["E"] !== undefined) this.$log.signalRError("HubReceived", dataCopy);
			else this.$log.consoleInfo("HubReceived", dataCopy);
		}

		private onHubError(error) {
			if (error.message === "WebSocket closed.") this.onWebSocketClosed();
			else this.$log.signalRError("HubError", { errorMessage: error["message"], stack: error["stack"] });
		}

		private onHubDisconnected() {
			if (this.hub.lastError) {
				this.$log.signalRWarn("HubDisconnectedOnError", this.hub.lastError.message);
				this.$timeout(() => { this.start() }, 5000);
			} else {
				// The previously saved sessionTag is included here for information because, on a page refresh, chrome run this after loading the next page,
				// which has consequently already updated the cookies with a new SessionTag, making it look like it's the new session that gets disconnected
				this.$log.signalRInfo("HubDisconnectedOnDemand", { sessionTag: Runtime.sessionTag });
			}
		}

		private onWebSocketClosed() {
			this.hubErrorWebSocketClosedCount++;
			this.$log.signalRWarn("HubErrorWebSocketClosed", { occurences: this.hubErrorWebSocketClosedCount });

			// Clean the error. Otherwise it lingers there and "onHubDisconnected" gets a false positive HubDisconnectedOnError. This affects Chrome only
			this.hub.lastError = null;

			// Somehow SignalR sometimes fall into a never ending loop of "WebSocket closed." => "Reconnecting" ==> "Reconnected" => "WebSocket closed."
			// We try to break that by manually disconnecting the hub
			if (this.hubErrorWebSocketClosedCount === 5) {
				this.$log.signalRWarn("HubResetDueToExcessiveWebSocketClosedErrors");
				this.restart();
			}

			// We give up and close it all
			if (this.hubErrorWebSocketClosedCount === 10) {
				this.$log.signalRError("HubStopAndQuitChatDueToExcessiveWebSocketClosedErrors");
				this.eventFatalError.trigger();
				this.stop();
			}
		}

	}

}