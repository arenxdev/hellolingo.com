/// <reference path="../Interfaces.ts"/>
/// <reference path="ServerSocketService.ts"/>
/// <reference path="../../Scripts/typings/simplewebrtc/simplewebrtc.d.ts"/>

module Services {
	export type FinishCallReason = "hangout" | "peer_hangout" | "leftRoom" | "peer_leftRoom" | "cancelled" | "peer_cancelled" | "declined" | "peer_declined" |
		"unsupported_device" | "peer_unsupported_device" | "unsupported_browser" | "peer_unsupported_browser" | "timeout" | "peer_disconnected" | "declined"
		| "busy";

	export class RtcService {

		rtc: SimpleWebRTC;
		roomId: RoomId;

		private localAudioTrack;
		private callDeferred: ng.IDeferred<any>; // for starting an audio call
		private initRtcDeferred: ng.IDeferred<any>; // for initialization of SimpleWebRtc
		private isMicAbsent: boolean;
		private onPeerCreatedCallback: (peer) => void;

		static $inject = ["$q", "$document", "$log", "serverConnectionService", "voiceHubService"];
		constructor(private $q: ng.IQService, private $document: ng.IDocumentService, private $log: EnhancedLog, private serverConnection: ServerSocketService, private voiceChatHub: VoiceChatHubService) { }

		hasBrowserCapabilities = () => navigator && navigator.mediaDevices && window.RTCPeerConnection && !this.isMicAbsent;

		checkCapabilities() {
			var deferred = this.$q.defer();
			if (this.isMicAbsent) deferred.reject("device");
			else if (!this.hasBrowserCapabilities()) deferred.reject("browser");
			else if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
				navigator.mediaDevices.enumerateDevices().then((devices) => {
					var mics = devices.filter(device => device.kind === "audioinput");
					this.isMicAbsent = !mics.length;
					if (this.isMicAbsent) deferred.reject("device");
					deferred.resolve();
				});
			} else deferred.resolve();

			return deferred.promise;
		}

		init(caller:boolean) {
			this.initRtcDeferred = this.$q.defer();
			this.initSimpleWebRtc();
			this.serverConnection.start().then(
				() => this.voiceChatHub.emit("init", this.roomId, caller), 
				(err) => this.initRtcDeferred.reject(err));
			return this.initRtcDeferred.promise;
		}


		startRoomAudioCall(roomId: RoomId, onPeerCreatedCallback: (peer) => void, caller: boolean) {
            this.$log.appInfo("StartingRoomAudioCall", { roomId });
			this.onPeerCreatedCallback = onPeerCreatedCallback;

			this.callDeferred = this.$q.defer();
			this.callDeferred.promise.catch((err: string) => {
				// if call haven't been started. report about finishing anyway
				this.$log.appWarn("StartRoomAudioCallPromiseFailed");
				this.stopAudioCall(<FinishCallReason>`unsupported_${err}`);
				return this.$q.reject(err);
			});

			this.roomId = roomId;

			this.checkCapabilities()
				.then(() => this.init(caller), (reason) => {
					this.$log.appError("CheckCapabilitiesFailed", { reason });
					this.callDeferred.reject(reason); // reject if capabilities checking failed
					return this.$q.reject(reason);
				})
				.then(() => {
					this.$log.appInfo("StartingLocalVideo");
					this.rtc.startLocalVideo();
				} ); // This also starts the Audio. startDeferred could be then rejected by rtc 'localMediaError' handler and resolved by 'readyToCall'

			return this.callDeferred.promise;
		}

		private initSimpleWebRtc() {
			if (!this.rtc) this.rtc = new SimpleWebRTC({
				debug: true,
				connection: this.voiceChatHub,
				localVideoEl: "", remoteVideosEl: "",
				media: { audio: true, video: false },
				receiveMedia: { offerToReceiveAudio: 1, offerToReceiveVideo: 0 }
				// autoRequestMedia: false, // Use true to request user media automatically, or false to request media later with startLocalVideo
				// enableDataChannels: false, // enable/disable data channels (used for volume levels or direct messaging)
				// url: 'https://sandbox.simplewebrtc.com:443/', // Url of signaling server that can be used for development. Use your own signaling in production
				// autoRemoveVideos: true, // automatically remove video elements when streams are stopped.
				// adjustPeerVolume: false, peerVolumeWhenSpeaking: 0.25,
			})
			.on("iceFailed", (peer) => this.$log.appError("iceFailed" /*, {peer} Can't dot that b/c CIRCULAR JSON ERROR */))
			.on("connectivityError", (peer) => this.$log.appError("connectivityError" /*, {peer} Can't dot that b/c CIRCULAR JSON ERROR */) )
			.on("connectionReady", () => this.initRtcDeferred.resolve() )
			.on("readyToCall", () => {
				this.$log.appInfo("ReadyToCallReceived");
				this.rtc.joinRoom(this.roomId, (err, res) => {
					if (err && this.callDeferred) {
						this.$log.appWarn("JoinRoomReturnedError", { err });
						this.callDeferred.reject("join");
					} else if (this.callDeferred) {
						this.$log.appInfo("JoinRoomCompleted", { err });
						this.callDeferred.resolve(res);
					}
				});
			})
			.on("localMediaError", (err) => {
				if (this.callDeferred) this.callDeferred.reject("device");
				this.$log.appWarn("RtcLocalMediaError", { error: err.name || err });
			})
			.on("localStream", (stream) => this.localAudioTrack = stream.getAudioTracks()[0])
			.on("createdPeer", (peer) => { // set handlers for peer connection and disconnection events
				if (!peer || !peer.pc) return;
				if (this.onPeerCreatedCallback) this.onPeerCreatedCallback(peer);
			});
		}

		stopAudioCall(reason: FinishCallReason = "hangout") {
			this.$log.appInfo("StoppingAudioCall", {reason: reason});
			var deferred = this.$q.defer();
			if (!this.rtc) deferred.resolve();
			else this.voiceChatHub.emit("callFinished", this.roomId, reason, () => {
				this.$log.appInfo("CallFinishedReceived");
				//if (this.rtc) {
				this.rtc.leaveRoom();
				this.rtc.stopLocalVideo();
				//}
				this.localAudioTrack = null;
				this.roomId = null;
				deferred.resolve();
			});
			return deferred.promise;
		}

		// Not used, but could be useful
		//switchSelfMute(isMuted: boolean) {
		//	if (!this.localAudioTrack) return;
		//	this.localAudioTrack.enabled = isMuted;
		//}
	}
}

interface Navigator {
	mediaDevices: IMediaDevicesCollection;
}

interface IMediaDevicesCollection {
	enumerateDevices(): ng.IPromise<any[]>;
	getUserMedia();
}

interface Window {
	RTCPeerConnection: any;
}
