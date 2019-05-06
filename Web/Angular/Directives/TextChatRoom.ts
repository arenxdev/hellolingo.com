/// <reference path="../helpers.ts" />

class TextChatRoom implements IAccessorDirective {

	public static keywords: Array<LinkedKeywordTooltip>;
	public static i18N: (resource: string) => string;

	public static getTextWithTooltips(text: string, keywords: Array<LinkedKeywordTooltip>) {
		const result = new TextWithTooltips(text);

		// Collect Keywords tooltips
		result.tooltips = TextChatRoom.keywordsTooltips(text, keywords);

		//Collect URL tooltips
		var urlsResult = TextChatRoom.textWithUrlTooltips(text);
		result.text = urlsResult.text;
		result.tooltips = result.tooltips.concat(urlsResult.tooltips);

		//Collect Email tooltips
		var emailTooltips = TextChatRoom.emailsTooltips(text);
		result.tooltips = result.tooltips.concat(emailTooltips);
		
		return result;
	}

	public static keywordsTooltips(text: string, keywordsTooltips: Array<Tooltip>) {
		var tooltips: Array<Tooltip> = [];
		angular.forEach(keywordsTooltips, (tooltip) => {
			var regex = new RegExp(`\\b(${Helpers.regExpEscape(tooltip.label)}\\b)`, "gi");
			if (regex.test(text)) tooltips.push(tooltip);
		});
		return tooltips;
	}

	public static textWithUrlTooltips(text: string) {
		var result = new TextWithTooltips(text);
		var expression = /(https?:\/\/((?:www\.|(?!www))[^\s\.]+\.[^\s]{2,})|(www\.[^\s]+\.[^\s]{2,})|https?:\/\/([^\s]+))/gi; // Supports http://localhost
		let urls = text.match(new RegExp(expression.source, "gi"));
		angular.forEach(urls, (url) => {
			var properLink = url.toLowerCase().indexOf("http") === 0 ? url: `http://${url}`;
			result.tooltips.push(new UrlTooltip(properLink, TextChatRoom.i18N("i18nTooltipVisit")));
			var reasonableUrl = url.length < 50 ? url : url.substr(0, 46) + "...";
			result.text = text.replace(url, reasonableUrl);
		});
		return result;
	}

	public static emailsTooltips(text: string) {
		var tooltips: Array<Tooltip> = [];
		const regex = /([a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]{2,4})/gi;
		const emails = text.match(regex);
		angular.forEach(emails, (email) => { tooltips.push(new EmailTooltip(email, TextChatRoom.i18N("i18nTooltipSendEmail"))); });
		return tooltips;
	}

	static $inject = ["$sce", "$cookies", "$timeout", "userService", "chatUsersService", "textChatRoomsService", "$state"];
	constructor(private $sce: ng.ISCEService, private $cookies, private $timeout: ng.ITimeoutService, private userService: Authentication.IUserService,
		private chatUsersService: Services.ChatUsersService, private $state: ng.ui.IStateService) { }

	templateUrl = "text-chat-room.tpl";
	replace = true;
	scope = {
		accessor: "=",
		roomId: "@",
		roomTitle: "@",
		localFirstName: "@",
		localLastName: "@",
		nameHighlightClass: "@",
		textPosted: "&",
		showTooltip: "&",
		openModal: "&",
		isPrivate: "=",
		callState: "=",
		requestCall: "&",
		cancelCall: "&",
		acceptCall: "&",
		declineCall: "&",
		hangoutCall: "&",
		undockingEnabled: "=",
		isUndocked: "=",
		isInactive: "=",
		onInputKeyPress: "=",
		privateChatWith:"="				
	};

	link = (scope: ITextChatRoomScope, element: JQuery, attrs: ng.IAttributes/*, ngModel: ng.INgModelController*/) => {
		scope.accessor = new TextChatRoomAccessor(scope, this.$sce, this.$timeout, this.$state);
		TextChatRoom.i18N = (resource: string) => Helpers.decodeAttr(attrs[resource.toLowerCase()]);
		scope.element = element;
		scope.messages = [];
		scope.users = [];
		scope.languages = Languages.langsById;
		scope.loading = true;
		scope.inputType = InputTypes.textInputType;
		scope.inputNavType = null;
		scope.global = {};
		scope.setFocusOnInput = setFocusOnInput;

		var inputField = $("#inputField", element); //Andriy:It's better to use class instead of id, because evry directive has this Id.

		// We use this rather then ng-keydown, because the later triggers a whole lot of indigest digests for each character typed by the user
		inputField.on("keydown", (event: JQueryKeyEventObject) => scope.onInputKeyPress(event.keyCode, scope.roomId) );

		function setFocusOnInput() { inputField[0].focus(); }

		scope.postMessage = () => {
			var text = inputField.val();
			if (!text) return;

			// Process Sharing of SkypeId
			if (scope.inputType === InputTypes.emailInputType) {
				if (Helpers.isValidEmail(text) === false) {
					scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipEmailInvalid"), "error")]); // "error" is a css class :-(
					return;
				}
				this.$cookies.put(Config.CookieNames.sharedEmailAddress, text);
				text = JSON.stringify({ email: text });
			}

			// Process Sharing of Email
			if (scope.inputType === InputTypes.skypeInputType) {
				if (Helpers.isValidSkype(text) === false) {
					scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipSkypeInvalid"), "error")]);
					return;
				}
				this.$cookies.put(Config.CookieNames.sharedSkypeId, text);
				text = JSON.stringify({ skype: text });
			}

			// Process a secret room
			if (scope.inputType === InputTypes.secretRoomInputType) {
				if (Config.Regex.secretRoom.test(text) === false) {
					scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipSecretRoomInvalid"), "error")]);
					return;
				}
				this.$cookies.put(Config.CookieNames.sharedSecretRoom, text);
				text = JSON.stringify({ secretRoom: text });
			}

			// Add message to the local interface
			scope.accessor.addMessage(MessageOrigin.self, undefined, scope.localFirstName, scope.localLastName, text);
			scope.scrollToBottom();
			scope.accessor.resetLastSeenMark();

			// Reset input field and return to text mode.
			scope.inputType = InputTypes.textInputType;
			inputField.val("");
			setFocusOnInput();

			// Raise event for posted message
			scope.textPosted({ text: text });
		};

		scope.addUserNameOrShowModal = (message: ITextChatMessage) => {
			let filteredUsers = scope.users.filter(u => u.id === message.userId);
			let haveToInsertName = filteredUsers.length === 1 || !message.userId;

			if (haveToInsertName) {
				let firstName = message.firstName;
				if (firstName.toLowerCase() !== scope.localFirstName.toLowerCase())
					inputField.val((inputField.val() + " " + firstName).trim());
				setFocusOnInput();
			} else scope.openModal({ userId: message.userId });
		};

		scope.showTooltip = (tooltips) => {
			// TODOLATER: Log attempts to display sentences with no tooltips
			scope.tooltips = tooltips;
			var tooltipEl = $(`#tooltipMsg`, scope.element);
			if (tooltipEl.css("display") !== "none")
				tooltipEl.finish().hide();
			tooltipEl.show().delay(5000).fadeOut(500);
		};

		scope.setInputType = (type, $event?: ng.IAngularEvent) => {
			var comeFromNonSharing = scope.inputType !== InputTypes.emailInputType &&
									 scope.inputType !== InputTypes.skypeInputType &&
									 scope.inputType !== InputTypes.secretRoomInputType &&
									 type === InputTypes.skypeInputType;
			// Set Input Type
			scope.inputType = type;

			// Set relevant placeholder
			var placeholder = "", text = "";
			switch (type) {
				case InputTypes.textInputType: placeholder = TextChatRoom.i18N("i18nPlaceholderSayHi"); break;
				case InputTypes.emailInputType: placeholder = TextChatRoom.i18N("i18nPlaceholderYourEmail"); text = this.$cookies.get(Config.CookieNames.sharedEmailAddress) || ""; break;
				case InputTypes.skypeInputType: placeholder = TextChatRoom.i18N("i18nPlaceholderYourSkypeId"); text = this.$cookies.get(Config.CookieNames.sharedSkypeId) || ""; break;
				case InputTypes.secretRoomInputType: placeholder = TextChatRoom.i18N("i18nPlaceholderEnterSecretRoom"); text = this.$cookies.get(Config.CookieNames.sharedSecretRoom) || ""; break;
			}
			inputField.attr("placeholder", placeholder).val(text);

			// Set focus/shareNav
			if (comeFromNonSharing) scope.toggleInputNav("share", $event);
			else setFocusOnInput();
		};

		scope.toggleInputNav = (type, $event?: ng.IAngularEvent) => {
			if ($event) $event.stopPropagation();

			if (type === scope.inputNavType) type = null;
			$("body").off("click.inputnav");

			scope.inputNavType = type;
			// TODOLATER: to angular animation
			//$(`div[id^=shareNav]`, element).delay(500).fadeIn();
			//$(`div[id^=inputNav]`, element).delay(500).fadeIn();
			$(`div[id^=shareNav]`, element).stop().fadeOut().fadeIn();
			$(`div[id^=inputNav]`, element).stop().fadeOut().fadeIn();

			// if we set inputNavType, attach one-time handler to the body to hide it on next click on anything
			if (scope.inputNavType)
				$("body").one("click.inputnav", e => {
					scope.toggleInputNav(null);
					scope.$apply("inputNavType");
				});
		};

		scope.showUserModal = (userId: UserId) => {
			if (!userId) return;
			scope.openModal({ userId: userId, hideChatButton: scope.isPrivate});
		};

		scope.unMarkRecentUser = (user: TextChatUser, roomId: RoomId) => {
			const index = user.recentlyJoinedRooms.indexOf(roomId);
			if (index !== -1)
				user.recentlyJoinedRooms.splice(index,1);
		}

		// Little piece for chat messages scrolling
		scope.hasNewMessagesOutOfView = false;
		scope.messagesHtml = $("#roomMessages", element)[0];
		scope.processScrollInterval = setInterval(() => {
			if (!scope.needsScrollToBottom && !scope.needsScrollToNewMessage && !scope.needsMandatoryScrollToBottom) return; // Nothing to do
			else {
				const elt = scope.messagesHtml;
				if (elt.clientHeight === 0) return; // The client isn't visible
				else if (scope.needsMandatoryScrollToBottom) scope.scrollToBottom(); // Force scroll to bottom
				else if (elt.scrollHeight - (elt.scrollTop + elt.clientHeight) < 150) scope.scrollToBottom(); // Scroll to bottom the user didn't significantly scroll back up manually
				else if (scope.needsScrollToNewMessage) scope.hasNewMessagesOutOfView = true; // Warn the user there are new messages if we haven't been able to scroll down
			}
		}, 500); // Happens twice per second

		scope.scrollToBottom = () => this.$timeout(() => {
			const elt = scope.messagesHtml;
			$(elt).animate({ scrollTop: elt.scrollHeight }, 500);
			scope.needsScrollToBottom = false;
			scope.needsScrollToNewMessage = false;
			scope.needsMandatoryScrollToBottom = false;
			scope.hasNewMessagesOutOfView = false;
		});

		scope.$parent.$watch(attrs["ngShow"], (val: boolean) => {
			if (val) this.$timeout(() => {
				scope.scrollToBottom();
				scope.setFocusOnInput();
			});
		});

		// Watch changes in people typing in to activate the typing indicator when needed
		var whosTypingNow: UserId[] = [];
		scope.$watch(() => scope.users, (users) => {
			angular.forEach(users, (user) => {
				const typingIndex = whosTypingNow.indexOf(user.id);
				if (user.roomTypingIn && typingIndex === -1) { scope.needsScrollToBottom = true; whosTypingNow.push(user.id); }
				if (!user.roomTypingIn && typingIndex !== -1) { scope.needsScrollToBottom = true; whosTypingNow.splice(typingIndex,1); }
			});
		}, true);

		// Watch if a private partner is online
		if (scope.isPrivate)
			scope.$watch(() => this.chatUsersService.onlineUsers, (list: TextChatUser[]) => {
				var found = false;
				angular.forEach(list, (user) => { if (user.id === scope.privateChatWith) found = true; });
				scope.isPartnerOnline = found;
			}, true); 

		// Watch window resizes to keep scroll at bottom
		scope.requestScrollOnResize = () => scope.needsMandatoryScrollToBottom = true;
		window.addEventListener("resize", scope.requestScrollOnResize, false);

		// Set userId for the local user
		scope.userId = this.userService.getUser().id;

	}
};

// =============== SUPPORTING CLASSES ===============

interface JsonMessage {
	email?: string;
	skype?: string;
	secretRoom?: string;
	audioStarted?: string;
	audioMessage?: string;
	chatRequest?: Number;
	chatRequestAccepted?: Number;
	timeAgo?: string;
	noPrivateChat?: RoomId[];
}

class TextChatRoomAccessor implements ITextChatRoomAccessor {
    constructor(private scope: ITextChatRoomScope, private $sce: ng.ISCEService, private $timeout: ng.ITimeoutService, private $state: ng.ui.IStateService) { }

	addMessage(origin, userId: UserId, firstName: FirstName, lastName: LastName, text, firstLoad = false) {
		let message = new TextChatMessage(origin, userId, firstName, lastName, text);

		// Save last posted message
		this.lastMessage = text;

		// Get JSON from text, if any
		let json: JsonMessage;
		try { json = JSON.parse(text); } catch (e) { }

		// Process Json, if any
		if (json) {
			if (json.skype) {
				message.tooltips.push(new SkypeTooltip(json.skype, TextChatRoom.i18N("i18nTooltipOpenWithSkype")));
				message.text = json.skype;
				message.htmlText = Helpers.wrapInDiv(json.skype, "icon-skype");
			} else if (json.email) {
				message.tooltips.push(new EmailTooltip(json.email, TextChatRoom.i18N("i18nTooltipSendEmail")));
				message.text = json.email;
				message.htmlText = Helpers.wrapInDiv(json.email, "icon-email");
			} else if (json.secretRoom) {
				message.tooltips.push(new UrlTooltip(this.$state.href(this.$state.get(States.textChatRoomCustom.name), { roomId: json.secretRoom }), TextChatRoom.i18N("i18nTooltipVisitSecretRoom") /*TextChatRoom.translations["visitSecretRoom"]*/));
				message.text = json.secretRoom;
				message.htmlText = Helpers.wrapInDiv(json.secretRoom, "icon-key");
			} else if (json.audioStarted) {
				message.text = json.audioStarted;
				message.htmlText = Helpers.wrapInDiv(json.audioStarted, "audio-message audio-started");
			} else if (json.audioMessage) {
				message.text = json.email; // TodoLater: That line just doesn't make any sense
				message.htmlText = Helpers.wrapInDiv(json.audioMessage, "audio-message");
			} else if (json.chatRequest) {
				if (this.scope.userId !== json.chatRequest) return;
				message.htmlText = Helpers.wrapInDiv(TextChatRoom.i18N("i18nCallHasBeenSent"), "chat-request-inline-status");
			} else if (json.chatRequestAccepted) {
				message.htmlText = Helpers.wrapInDiv(TextChatRoom.i18N("i18nInvitationAccepted"), "chat-request-inline-status accepted");
			} else if (json.timeAgo) {
				message.htmlText = Helpers.wrapInDiv(json.timeAgo, "time-ago");
			} else if (json.noPrivateChat) { // TODOLater: This may no longer be relevant if we don't display "Sorry. no private chat with this member" inline in the chatroom
				this.scope.isDisabled = true;
				if (json.noPrivateChat.length !== 0) this.scope.isDisabledButIsReachable = true;

				// This is mildly redundant with TextChatLobbyCtrl's selectedUserListOfRooms. Also, it doesn't support presence in dual langs room. But that's not such a big deal
				this.scope.joinedPublicRooms = <[{ title: string, url: string }]>[];
				json.noPrivateChat.forEach(roomId => {
					var title:string = null;
					if (angular.isDefined(Config.TopicChatRooms[roomId])) title = Config.TopicChatRooms[roomId].text;
					else if (angular.isDefined(Languages[roomId])) title = Languages[roomId].text;
					if (title) this.scope.joinedPublicRooms.push({ title: title, url: this.$state.href(this.$state.get(States.textChatRoomPublic.name), { roomId }) });
				});
				return;
			} else
				json = undefined; // TODOLATER: Warn about the fact that it wasn't a recognized JSON (though all these can be unrecognized too: 'true', '"foo"', '[1, 5, "false"]', 'null')
		}

		if (!json) {
			// Add tooltips to message, if found
			// Looking for tooltips must happen before the htmlEncoding, or urls can get corrupted
			var result = TextChatRoom.getTextWithTooltips(text, TextChatRoom.keywords);
			message.tooltips = message.tooltips.concat(result.tooltips);
			message.text = result.text;

			// Encode for html
			message.htmlText = Helpers.htmlEncode(message.text);
			// Wrap username in highlighting div, if any
			message.htmlText = Helpers.searchAndWrapInElement(message.htmlText, this.scope.localFirstName, this.scope.nameHighlightClass);
		}
		message.htmlText = this.formatMessage(message.htmlText);
		message.htmlText = this.$sce.trustAsHtml(message.htmlText);

		// Add message
		var lastMessage = this.scope.messages[this.scope.messages.length - 1];
		if (!(message.origin === MessageOrigin.self && lastMessage && lastMessage.origin === MessageOrigin.self))
			this.markLastMessageAsLastSeen();
		this.scope.messages.push(message);

		// Reduce message list to 250 of it's getting longer than 300 messages
		if (this.scope.messages.length >= 300) this.scope.messages = this.scope.messages.slice(50);

		// Scroll to bottom
		if (firstLoad) this.scope.needsMandatoryScrollToBottom = true;
		else this.scope.needsScrollToNewMessage = true;

	}

	addUser = (user) => this.scope.users.unshift(user);
	removeUser = (userId: UserId) => this.scope.users = this.scope.users.filter(user => user.id !== userId);

	resetLastSeenMark() {
		for (let i = 0; i < this.scope.messages.length - 1; i++)
			if (this.scope.messages[i].lastSeen) {
				this.scope.messages[i].lastSeen = false;
				return true;
			}
		return false;
	}
	hasLastSeenMark() {
		for (let i = 0; i < this.scope.messages.length - 1; i++)
			if (this.scope.messages[i].lastSeen)
				return true;
		return false;
	}
	markLastMessageAsLastSeen() {
		if (this.scope.messages.length !== 0 && !this.hasLastSeenMark())
			this.scope.messages[this.scope.messages.length - 1].lastSeen = true;
	}

	get userCount(): Number { return this.scope.users.length; }
	get loading() { return this.scope.loading; }
	set loading(b: boolean) { this.scope.loading = b; }

	initForFirstVisit() {
		// This is a hack... but it caters to an immediate need in a quick and easy way
		if (this.scope.roomId === "hellolingo")
			this.$timeout(() => {
				this.scope.accessor.addMessage(MessageOrigin.news, undefined, "", "", TextChatRoom.i18N("i18nFirstMessage"));
				this.scope.scrollToBottom();
			}, 5000);
	}

	reset() {
		this.scope.messages = [];
		this.scope.users = [];
	}

	dispose() {
		window.removeEventListener("resize", this.scope.requestScrollOnResize);
		clearInterval(this.scope.processScrollInterval);
	}

	get roomUsers() { return this.scope.users; }

	setFocusOnInput() { this.scope.setFocusOnInput(); }

	lastMessage: string = null;

	formatMessage(htmlText: string): string {
		if (htmlText) {
			htmlText = this.formatBold(htmlText);
			htmlText = this.formatUnderline(htmlText);
			htmlText = this.formatStrikethrough(htmlText);
			htmlText = this.formatEmoticons(htmlText);
		}
		return htmlText;
	}
	formatBold          = (htmlText: string) => this.formatText(htmlText, "*", "message-bold");
	formatUnderline     = (htmlText: string) => this.formatText(htmlText, "_", "message-underline");
	formatStrikethrough = (htmlText: string) => this.formatText(htmlText, "~", "message-strikethrough");
	formatEmoticons = (htmlText: string) => {
		return htmlText.replace(":)", "😃").replace(":-)", "😃").replace("\^\^", "😃").replace("\^_\^", "😃") // Smile-😃
			.replace(":d", "😀").replace(":D", "😀").replace(":-d", "😀").replace(":-D", "😀") // BigSmile-😀
			.replace(":p", "😛").replace(":P", "😛").replace(":-p", "😛").replace(":-P", "😛") // TongueOut-😛
			.replace(";)", "😉").replace(";-)", "😉") // Wink-😉
			.replace(";p", "😜").replace(";P", "😜") // WinkTongueOut-😜
			.replace(":o", "😲").replace(":O", "😲").replace(":-o", "😲").replace(":-O", "😲") // Surprised-😲
			//.replace(":0", "😲").replace(":-0", "😲") // Surprised-😲 <== Disabled because it breaks times (e.g. 7:00 => 7😲0)
			.replace("&lt;3", "💗"); // Heart-💗 or ❤
	};

	formatText(htmlText: string, formatSymbol: string, cssClass: string) {
		const escapedSymbol = formatSymbol === "*" ? `\\*` : formatSymbol;
		const regexp = new RegExp(`${escapedSymbol}(?:[^${formatSymbol}\\s]{1}|[^${formatSymbol}\\s][^${formatSymbol}]*[^${formatSymbol}\\s])${escapedSymbol}`, "g");
		//Andriy: I need here this strange cycle because otherwise RegExp doesn't work corectly.
		//http://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
		let match: RegExpExecArray;
		do {
			match = regexp.exec(htmlText);
			if (match) match.forEach(m => {
				const boldFormat = m.substr(1, m.length - 2);
				htmlText = htmlText.replace(m, `<span class='${cssClass}'>${boldFormat}</span>`);
			});
		} while (match)
		return htmlText;
	}
}

class TextChatRoomModel implements IAccessorModel {
	public accessor: ITextChatRoomAccessor;
	public newMessagesCount = 0;
	public isUndocked = false;
	public isInactive = false;
	get isPrivate() { return this.userId != null };

	public audioCallState: AudioCallState;
	constructor(public roomId: RoomId, public text: string, public url: string, public state: string, public userId: UserId = null) { }
}

class AudioCallState { // Those strings are used in views. Do not change!
	static initializing = "init";
	static requested = "requested";
	static connected = "connected";
	static finishing = "finishing";
}

// =============== SUPPORTING INTERFACES ===============

interface ITextChatRoomScope extends IAccessorScope {
	accessor: ITextChatRoomAccessor;
	element: JQuery;
	roomId: string;
	isPrivate: boolean;
	localFirstName: string;
	localLastName: string;
	nameHighlightClass: string;
	tooltips: Array<Tooltip>;
	messages: Array<ITextChatMessage>;
	users: Array<ITextChatUser>;
	languages: Languages.ILanguage[];
	loading: boolean;
	postMessage(text: string);
	textPosted({ text: string });
	addUserNameOrShowModal(message: ITextChatMessage);
	showTooltip(tooltips: Array<Tooltip>);
	setInputType(type: string, $event?: angular.IAngularEvent);
	toggleInputNav(type: string, $event?: angular.IAngularEvent);
	inputType: string;
	inputNavType: string;
	global: any; // This allows to use uninitialized booleans in the view
	openModal: any;
	showUserModal: (userId: UserId) => void;
	unMarkRecentUser: (user: TextChatUser, roomId: RoomId) => void;
	callState: string;
	requestCall();
	cancelCall();
	acceptCall();
	declineCall();
	hangoutCall();
	needsScrollToBottom: boolean;
	needsScrollToNewMessage: boolean;
	needsMandatoryScrollToBottom: boolean;
	hasNewMessagesOutOfView: boolean;
	requestScrollOnResize: () => void;
	messagesHtml: HTMLElement;
	scrollToBottom: () => void;
	processScrollInterval: number;
	undockingEnabled: boolean;
	isInactive: boolean;
	isUndocked: boolean;
	onInputKeyPress: (keyCode: Number, roomId: string) => void;
	setFocusOnInput: () => void;
	userId: number;
	isDisabled: boolean;
	isDisabledButIsReachable: boolean;
	joinedPublicRooms: [{ title: string, url:string }];
	privateChatWith: number;
	isPartnerOnline: boolean;
}

interface ITextChatRoomAccessor {
	userCount: Number;
	addMessage(origin: MessageOrigin, userId:UserId, firstName: FirstName, lasName: LastName, text: string, firstLoad?: boolean);
	resetLastSeenMark(): boolean;
	markLastMessageAsLastSeen();
	addUser(user: ITextChatUser);
	removeUser(userId: UserId);
	loading: boolean;
	initForFirstVisit();
	reset();
	dispose();
	roomUsers: ITextChatUser[];
	setFocusOnInput();
	lastMessage: string;
}

// =============== Message Class ===============

class TextChatMessage implements ITextChatMessage {
	public htmlText: string;
	public lastSeen: boolean;
	public tooltips: Array<Tooltip> = [];

	get hasTooltip(): boolean { return this.tooltips.length !== 0; }

	constructor(public origin: string, public userId: UserId, public firstName: FirstName, public lastName: LastName, public text: string) {}
}

// =============== Tooltip Classes ===============

class Tooltip {
	label: string;
	text: string;
	link: string;
	type: string; // this is a css class :-(
}

class KeywordTooltip implements Tooltip {
	public link = "";
	public type = "abbr";
	constructor(public label: string, public text: string) { }
}

class LinkedKeywordTooltip implements Tooltip {
	public type = "keyword";
	constructor(public label: string, public text: string, public link: string) { }
}

class UrlTooltip extends Tooltip {
	public type = "url";
	constructor(public text: string, public label: string) { super(); this.link = text; }
}

class EmailTooltip extends Tooltip {
	public type = "email";
	constructor(emailAddress: string, public label: string) { super(); this.text = emailAddress; this.link = `mailto:${emailAddress}`; }
}

class SkypeTooltip extends Tooltip {
	public type = "skype";
	constructor(skypeId: string, public label: string) { super(); this.text = skypeId; this.link = `skype:${skypeId}?add`; }
}

class MessageTooltip implements Tooltip {
	constructor(public label: string, public text: string, public type, public link: string = "") { }
}

class TextWithTooltips {
	public tooltips = new Array<Tooltip>();
	constructor(public text: string) { }
};

