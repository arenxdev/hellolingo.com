namespace MailBox {
	export type NewMessage          = { text: string; replyToMailId?: number; };
	export type MailBoxItem         = { userId: number; firstName: string; lastName: string; subject: string; date: Date; status: MailStatus; replyTo?: number };
	export type UserMessagesStorage = { [userId: number]: Array<IMailMessage> };

	export enum MailStatus { Draft = 1, Sent = 2, Unread = 10, Read = 11, Archived = 20 };

	export class MailBoxCtrl {

		i18N: (resource: "i18nMessageTextRequired" | "i18nYouCannotWriteMoreThanOneEmailMsg" | "i18nYes" | "i18nNo" | "i18nOk" | "i18nMessageHasBeenSent" | "i18nArchiveThreadConfirm") => string;

		defaultHistoryLoadStep = 3;
		defaultMessagesOnPage = 3;

		logger = new Services.EnhancedLog(); // Trying a new approach to logging. It doesn't use injection. I'm not sure that's a good idea
		mailCount = 0;
		newMessageForm: IMessageFormController;
		lastSentMessage: string;
		initInboxPromise: ng.IPromise<void>;
		isInboxLoading = false;
		previousState: State;
		previousStateParams: any;

		// Used in the view
		messages: UserMessagesStorage = {};
		mailBoxList: Array<MailBoxItem>;
		mailBoxArchivesList: Array<MailBoxItem>;
		currentMember: ILightUser;
		validator: MessageValidator;
		canBeRepliedTo: boolean; 
		newMessage: NewMessage = { text: undefined, replyToMailId: undefined };
		isThreadArchived: boolean;
		isNewMessageOpen = false;
		showInsertPopup = false;
		sendingMessage = false;
		isInboxVisible = () => this.statesService.is(States.mailboxInbox.name);
		isArchivesVisible = () => this.statesService.is(States.mailboxArchives.name);
		isEmailVisible = () => this.statesService.is(States.mailboxUser.name);

		static $inject = ["$scope", "$http", "$filter", "$q", "$timeout", "statesService", "userService", "mailboxServerService", "modalService", "serverResources", "spinnerService", "$attrs"];
		constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private $filter: ng.IFilterService, private $q: ng.IQService, private $timeout: ng.ITimeoutService, 
			private statesService: Services.StatesService, private userService: Authentication.IUserService, private mailboxServerService: IMailboxServerService,
			private modalService: Services.IModalWindowService, private serverResources: Services.IServerResourcesService, private spinnerService: Services.SpinnerService,
			private $attrs: ng.IAttributes) {

			this.i18N = (resource: string) => Helpers.decodeAttr(this.$attrs[resource.toLowerCase()]); // Get localized strings from view attributes

			$scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, (event: ng.IAngularEvent, toState: State, toStateParam: any, fromState: State, fromStateParam: any) => {
				this.previousState = fromState;
				this.previousStateParams = fromStateParam;
				switch (toState.name) {
					case States.mailboxUser.name: this.initMemberMailBoxState(toStateParam); break;
					case States.mailboxInbox.name:
					case States.mailboxArchives.name: this.initMailBoxState(toStateParam); break;
				}
			});
			this.validator = new MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18N("i18nMessageTextRequired"));
		}

		startNewMessage() {
			//this is switch state to mailboxUser with "new" just to open textarea.
			const currentMemberId = this.currentMember.id;
			const stateParam: IMailBoxUserStateParams = { id: currentMemberId, isNew: "new"};
			this.statesService.go(States.mailboxUser.name, stateParam);
		}

		sendMessageToServer() {
			if (!this.validator.isEnabled) {
				this.validator = new MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18N("i18nMessageTextRequired"));
				this.validator.isEnabled = true;
			}
			if (this.validator.isValid) {
				const postMessageParams = this.getPostNewMessageParams();
				if (!postMessageParams.replyTo) this.lastSentMessage = this.newMessage.text;
				this.sendingMessage = true;
				this.$http.post(Config.EndPoints.postMail, postMessageParams)
					.then(() => {
						this.newMessage.text = undefined;
						this.newMessageForm.messageText.$setViewValue(undefined);
						this.newMessageForm.messageText.$render();
						this.newMessageForm.messageText.$setPristine();
						this.newMessageForm.$setPristine();
						this.isNewMessageOpen = false;
						this.sendingMessage = false;
						this.validator.isEnabled = false;

						this.messageSentModal().then(() => {
							// Go back to the previous state or the inbox (if the reply button has been pressed)
							if (this.previousState.name !== States.mailboxUser.name) {
								this.statesService.resetState(States.mailbox.name); // This is to make sure the user won't get a "new message view" if he comes back to the mailbox.
								this.statesService.go(this.previousState.name, this.previousStateParams);
							}
							 else this.statesService.go(States.mailboxInbox.name, { notReload: false } as IMailBoxStateParams);
						});
					}, errorData => this.logger.appWarn("FailedToSendMail") );
			} else
				this.logger.appInfo("AttemptToSendTooShortMail");

		}

		initMemberMailBoxState(toStateParam: IMailBoxUserStateParams) {
			this.confirmToReloadUserMailState(toStateParam).then((confirmed: boolean) => {
				if (confirmed) this.loadUserMailBoxState(toStateParam);
				else this.statesService.go(States.mailboxUser.name, { id: this.currentMember.id, isNew: "new" });
			}, errorData => this.logger.appError("FailedUserMailboxChangeStateConfirmation", errorData) );
		}

		loadUserMailBoxState(toStateParam: IMailBoxUserStateParams) {
			if (!this.messages || Object.keys(this.messages).length === 0) {
				this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" })
					.then((messages: ng.IHttpPromiseCallbackArg<IMailMessage[]>) => {
						this.updateMailBox(messages.data);
						this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
					}, errorData => this.logger.appWarn("FailedToLoadListOfMails") );
			} else
				this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
		}

		initMailBoxState(toStateParam: IMailBoxStateParams) {
			if (!toStateParam||!toStateParam.notReload) { //Upload messages only if toStateParam.notReload !== TRUE.
				this.spinnerService.showSpinner.show = true;
				this.initInboxPromise = this.$http({url: Config.EndPoints.getListOfMails,method: "GET"})
				.then((messages: ng.IHttpPromiseCallbackArg<IMailMessage[]>) => {
					this.updateMailBox(messages.data);
					this.initInboxPromise = undefined;
					this.spinnerService.showSpinner.show = false;
					this.isInboxLoading = false;
				}, (errorData) => {
					this.spinnerService.showSpinner.show = false;
					this.isInboxLoading = false;
					this.logger.appWarn("FailedToLoadListOfMails");
				});
			}
			this.validator.isEnabled = false;
		}

		openMemberMessages(memberId: number) {
			const stateParams: IMailBoxUserStateParams = { id: memberId, isNew: ""};
			this.statesService.go(States.mailboxUser.name, stateParams);
		}

		getCurrentMember(memberId: number) {
			const p = this.$q.defer();
			this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
				.success((member: ILightUser) => {
					if (!this.messages[member.id]) 
						this.messages[member.id] = new Array<IMailMessage>(); // TODOLater: WHY THE FUCK DO WE CREATE AN EMPTY MESSAGE WITHIN THE LOAD OF A PROFILE!!!! CODE SMELL SMELL SMELL!! THIS CREATES AN ERROR WHEN WE RETURN TO A MESSAGE OF A MEMBER WE NEVER WROTE BEFORE : Alice email Zoe (never emailed before) from the find feature. Once in mailbox, Alice switch to the inbox, opens up another email and says no to overwriting message => Error in logs
					this.currentMember = member;
					this.newMessage.text = undefined;
					this.newMessageForm.messageText.$setViewValue(undefined);
					this.newMessageForm.messageText.$render();
					this.newMessageForm.messageText.$setPristine();
					p.resolve();
				}).error( errorData => p.reject(errorData) );
			return p.promise;
		}

		getMemberMessage(messageId: number,memberId:number) {
			let needToLoadContent = false, messageIndex = -1;
			for (let i = 0; i < this.messages[memberId].length; i++) {
				if (this.messages[memberId][i].id === messageId && !this.messages[memberId][i].content) {
					messageIndex = i;
					needToLoadContent = true;
					break;
				}
			}
			if (needToLoadContent) {
				this.$http.post(Config.EndPoints.getMailContent, { "id": messageId })
					.success((messageContent: IMesssageContent) => {
						if (messageContent)
							this.messages[memberId][messageIndex].content = messageContent.message;
					}).error((errorData) => this.logger.appWarn("FailedToLoadContentOfMail") );
			}
		}

		createUserMailsDictionary(messages: IMailMessage[]) {
			let mailsDict: { [index: number]: Array<IMailMessage> } = {};
			if (!messages || messages.length === 0) return mailsDict;

			let currentUser = this.userService.getUser();
			
			for (let i = 0; i < messages.length; i++) {
				let msg = messages[i];
				let name: string[] = msg.partnerDisplayName.split(" ");
				// TODOLATER: Get the server to provide the right name instead.
				if (name.length !== 2) {
					msg.firstName = msg.partnerDisplayName;
				} else {
					msg.firstName = name[0];
					msg.lastName = name[1];
				}
				msg.date = new Date(msg.when);
				let partnerId = currentUser.id === msg.fromId ? msg.toId : msg.fromId;
				if (mailsDict[partnerId]) {
					mailsDict[partnerId].push(msg);
				} else {
					mailsDict[partnerId] = [msg];
				}
			}
			return mailsDict;
		}

		createMailThreadList(messages: UserMessagesStorage) {
			let list = new Array<MailBoxItem>();
			if (!messages) return list;
			angular.forEach(messages, (messages: IMailMessage[], userId: string) => {
				list.push({
					userId: Number(userId),
					firstName: messages[0].firstName,
					lastName: messages[0].lastName,
					subject: messages[0].subject,
					date: messages[0].date,
					status: messages[0].status,
					replyTo: messages[0].replyToMail
				});
			});
			list = this.$filter("orderBy")(list, "date", true);
			return list;
		}

		loadNewMessages() {
			let userMessages = this.messages[this.currentMember.id];
			if (!userMessages || userMessages.length === 0) return;
			let loadStep = this.defaultHistoryLoadStep;

			for (var i = 0; i < userMessages.length; i++) {
				let message = userMessages[i];
				if (message.content) continue;
				if (loadStep === 0) break;
				this.getMemberMessage(message.id, this.currentMember.id);
				loadStep--;
			}
		}

		goToMailBox() {
			let mailboxStateParams: IMailBoxStateParams = { notReload: false };
			this.statesService.go(States.mailboxInbox.name, mailboxStateParams);
		}

		updateMailBox(messages?: IMailMessage[]) {
			if (messages) this.messages = this.createUserMailsDictionary(messages);
			let threads = this.createMailThreadList(this.messages);
			this.mailBoxList = threads.filter(t => t.status !== MailStatus.Archived);
			this.mailBoxArchivesList = threads.filter(t => t.status === MailStatus.Archived);
		}

		initMemberMailBoxStateAfterMessagesReady(toStateParam: IMailBoxUserStateParams) {
			if (toStateParam.isNew && toStateParam.isNew === "new") {
				this.isNewMessageOpen = true;
				if (this.lastSentMessage) this.showInsertPopup = true;
			} else {
				this.isNewMessageOpen = false;
			}

			// TODOLater: Seriously? Not even checking if the toState matches? Pray that we don't get unexpected states that unexpectedly also have a stateParams has common 'id'
			if (toStateParam.id) {
				const memberId = Number(toStateParam.id);

				if (isNaN(memberId)) { // TODOLater: SERIOUSLY?! SILENCING ISSUES JUST LIKE THAT?!
					const toMailBoxParams: IMailBoxStateParams = { notReload: false };
					this.statesService.go(States.mailboxInbox.name, toMailBoxParams);
					return;
				}

				if (!this.currentMember || this.currentMember.id !== memberId) {
					this.currentMember = undefined;
					this.getCurrentMember(memberId).then(() => {
						this.prepareViewDataForMemberThread(memberId);
						this.newMessageForm.$setPristine();
					}, errorData => this.logger.appWarn("FailedToGetCurrentMember") );
				} else {
					this.prepareViewDataForMemberThread(memberId);
				}
			}
		}

		prepareViewDataForMemberThread(memberId: number) {
			const prepareViewData = () => {
				this.getMemberTopMessagesTexts(memberId, this.defaultMessagesOnPage);
				let lastUserMessage = this.messages[this.currentMember.id][0]; // This is known to blow up because the messages look for don't exist, due to the hack of adding an empty empty to messages when the user writes a new message
				this.canBeRepliedTo = lastUserMessage && lastUserMessage.toId === this.userService.getUser().id;
				this.isThreadArchived = this.messages[memberId].length > 0 &&
										this.messages[memberId][0].status === MailStatus.Archived;
			}
			if (this.initInboxPromise)
				this.initInboxPromise.finally(prepareViewData);
			else
				prepareViewData();
		}

		getPostNewMessageParams() {
			let postMessageParams = { memberIdTo: this.currentMember.id, text: this.newMessage.text, replyTo:undefined };
			if (this.messages[this.currentMember.id] && this.messages[this.currentMember.id].length > 0 && this.messages[this.currentMember.id][0].fromId === this.currentMember.id) {
				postMessageParams["replyTo"] = this.messages[this.currentMember.id][0].id;
			}
			return postMessageParams;
		}

		private isNoMessagesInThread = () =>
			!this.currentMember || !this.messages[this.currentMember.id] || this.messages[this.currentMember.id].length === 0;

		getMemberTopMessagesTexts(memberId: number, defaultMessagesOnPage: number) {
			for (let i = 0; i < defaultMessagesOnPage; i++) {
				if (this.messages[memberId] && this.messages[memberId].length > i) {
					this.getMemberMessage(this.messages[memberId][i].id, memberId);
				}
			}
		}

		confirmToReloadUserMailState(toStateParam: IMailBoxUserStateParams) {
			const confirmationPromise = this.$q.defer();
			const memberId = Number(toStateParam.id);
			if (!memberId || !this.currentMember || !this.newMessageForm.messageText.$viewValue || this.currentMember.id === memberId)
				confirmationPromise.resolve(true);
			else
				this.confirmInModal().then((confirmed) => { confirmationPromise.resolve(confirmed); });
			return confirmationPromise.promise;
		}
		
		confirmInModal = () => this.modalService.open(
			`<h4 class="text-center">${this.i18N("i18nYouCannotWriteMoreThanOneEmailMsg")}<h4>`,
			[{ label: `${this.i18N("i18nYes")}`, cssClass: "btn btn-warning", result: true },
				{ label: `${this.i18N("i18nNo")}`, cssClass: "btn btn-success", result: false }]
		);

		messageSentModal = () => this.modalService.open(
			`<h4 class="text-center">${this.i18N("i18nMessageHasBeenSent")}<h4>`,
			[{ label: `${this.i18N("i18nOk")}`, cssClass: "btn btn-success", result: true }]
		);

		insertPrevEmail() {
			this.newMessage.text = this.lastSentMessage;
			this.showInsertPopup = false;
			this.logger.appInfo("PreviousEmailPastedIn", { content: this.lastSentMessage });
		}

		notInsertPrevEmail = () => this.showInsertPopup = false;

		archiveThread() {
			this.modalService.open(`<h3 class="text-center">${this.i18N("i18nArchiveThreadConfirm")}</h3>`,
				[{ label: `${this.i18N("i18nYes")}`, cssClass: "btn btn-warning", result: true },
				 { label: `${this.i18N("i18nNo")}`,  cssClass: "btn btn-success", result: false }])
				.then(confirmed => {
					if (!confirmed) return;
					this.$http.post(Config.EndPoints.postArchiveThread, { id: this.messages[this.currentMember.id][0].id });
					this.$timeout(() => {
						this.messages[this.currentMember.id].forEach(m => m.status = MailStatus.Archived);
						this.updateMailBox();
						this.goToMailBox();
					});

				});
		}
	}

}