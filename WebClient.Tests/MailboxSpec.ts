
//module UnitTests {
//	describe("Mailbox", () => {
//		it("controller exist", () => {
//			angular.mock.module("app");
//			angular.mock.module({ $log: Helper.getEnchanceLogMock() });	
//			// ReSharper disable InconsistentNaming
//			inject((_$controller_, _$rootScope_: ng.IRootScopeService) => {
//				// ReSharper enable InconsistentNaming
//				let controller = _$controller_("MailboxCtrl", { $scope: _$rootScope_.$new() });
//				expect(controller).toBeDefined();
//			});
//		});

//		describe("functionality", () => {
//			const userId = 5; //current user ID
//			const mailListFromServer: Array<MailBox.IMailMessage> = [ //Server response with user mails.
//				{ id: 9, when: "2016-03-13T18:55:46.53", lead: undefined, fromId: 4, toId: userId, status: 10, partnerDisplayName: "John Silver", subject: "Hello9", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 7, when: "2016-03-12T18:55:46.53", lead: undefined, fromId: userId, toId: 3, status: 2, partnerDisplayName: "Captain Flint", subject: "Hello7", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 8, when: "2016-03-11T18:55:46.53", lead: undefined, fromId: userId, toId: 3, status: 2, partnerDisplayName: "Captain Flint", subject: "Hello8", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 1, when: "2016-03-10T18:55:46.53", lead: undefined, fromId: userId, toId: 1, status: 2, partnerDisplayName: "John Smiths", subject: "Hello1", replyToMail: 2, firstName: undefined, lastName: undefined },
//				{ id: 2, when: "2016-03-09T18:55:48.53", lead: undefined, fromId: 1, toId: userId, status: 11, partnerDisplayName: "John Smiths", subject: "Hello2", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 4, when: "2016-03-09T18:55:46.53", lead: undefined, fromId: 2, toId: userId, status: 10, partnerDisplayName: "Padre Adriano", subject: "Hello4", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 3, when: "2016-03-09T08:55:46.53", lead: undefined, fromId: 1, toId: userId, status: 11, partnerDisplayName: "John Smiths", subject: "Hello3", replyToMail: null, firstName: undefined, lastName: undefined },
//				{ id: 5, when: "2016-03-08T18:55:46.53", lead: undefined, fromId: userId, toId: 2, status: 2, partnerDisplayName: "Padre Adriano", subject: "Hello5", replyToMail: 6, firstName: undefined, lastName: undefined },
//				{ id: 6, when: "2016-03-07T18:55:46.53", lead: undefined, fromId: 2, toId: userId, status: 11, partnerDisplayName: "Padre Adriano", subject: "Hello6", replyToMail: null, firstName: undefined, lastName: undefined },
//			];
//			let $controller: ng.IControllerService;
//			let $rootScope: ng.IRootScopeService;
//			let statesHelper: Services.StatesService;
//			beforeEach(() => {
//				angular.mock.module("app");
//				angular.mock.module({ $log: Helper.getEnchanceLogMock() });	
//				// ReSharper disable once InconsistentNaming
//				inject((_$controller_, _$rootScope_, _statesHelper_) => {
//					$controller = _$controller_;
//					$rootScope = _$rootScope_;
//					statesHelper = _statesHelper_;
//				});
//			});

//			it("memberToContact test", () => {
//				let $httpBackend;
//				let testMessage = "test message";
//				inject((_$httpBackend_:ng.IHttpBackendService) => {
//					$httpBackend = _$httpBackend_;
//				});
//				let userService: any = {
//					create: (user: Authentication.IAuthUser) => { return <Authentication.IAuthUser>{}; },
//					isInitUserExistAsync: () => { return true },
//					isUserExist: () => { return true; },
//					getUserName: () => { return "" },
//					getUser: () => { return { userId: 5 }; },
//					getUserBasicDetails: () => { return <Authentication.IUserBasicDetails>{}; }
//				};
//				Helper.mockHttpService($httpBackend);
//				let $scope: ng.IScope = $rootScope.$new();
//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $scope, statesHelper: statesHelper, userService:userService });
//				let stateParams: MailBox.IMailBoxUserStateParams = {
//					id: 1,
//					isNew: "new"
//					//reload:false
//				};
//				$httpBackend.whenPOST(Config.EndPoints.getMemberProfile).respond(200, { id: 1, firstName: "Andriy", lastName: "L" });
//				$httpBackend.whenPOST(Config.EndPoints.getMailContent).respond(200, { id: 1, message: "HEllo" });
//				$httpBackend.whenGET(Config.EndPoints.getListOfMails).respond(200, mailListFromServer);
//				mailboxCtrl.newMessage.text = testMessage;
//				$scope.$broadcast("$stateChangeSuccess", { name: States.mailboxUser.name }, stateParams);
//				$httpBackend.flush();
//				expect(mailboxCtrl.currentMember.firstName).toBe("Andriy");
//				expect(mailboxCtrl.currentMember.lastName).toBe("L");
//				expect(mailboxCtrl.newMessage.text).toBeUndefined();
//				expect(mailboxCtrl.isNewMessageOpen).toBeTruthy();

//				mailboxCtrl.newMessage.text = testMessage;
//				$scope.$broadcast("$stateChangeSuccess", { name: States.mailboxInbox.name });

//				expect(mailboxCtrl.currentMember.firstName).toBe("Andriy");
//				expect(mailboxCtrl.currentMember.lastName).toBe("L");

//				stateParams.isNew = undefined;
//				$httpBackend.whenPOST(Config.EndPoints.getMemberProfile).respond(200, { id: 1, firstName: "Andriy", lastName: "L" });
//				$scope.$broadcast("$stateChangeSuccess", { name: States.mailboxUser.name }, stateParams);
//				$httpBackend.flush();
//				expect(mailboxCtrl.currentMember.firstName).toBe("Andriy");
//				expect(mailboxCtrl.currentMember.lastName).toBe("L");
//				expect(mailboxCtrl.newMessage.text).toBeUndefined();
//				expect(mailboxCtrl.isNewMessageOpen).toBeFalsy();

//			});

//			it("get Member ID", () => {
//			    let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new() });
//				let userId = 1;
//				let fromId = 1;
//				let toId = 2;
//				let memberId = mailboxCtrl.getMemberId(userId, fromId, toId);
//				expect(memberId).toBe(toId, "member ID must equals ToID");

//				fromId = 3;
//				toId = 1;
//				memberId = mailboxCtrl.getMemberId(userId, fromId, toId);
//				expect(memberId).toBe(fromId, "member ID must equals FromID");
//			});

//			it("generate mails dictionary", () => {
//				let $httpBackend;
//				inject((_$httpBackend_: ng.IHttpBackendService) => {
//					$httpBackend = _$httpBackend_;
//				});
//				let userService: any = {
//					create: (user: Authentication.IAuthUser) => { return <Authentication.IAuthUser>{}; },
//					isInitUserExistAsync: () => { return true },
//					isUserExist: () => { return true; },
//					getUserName: () => { return "" },
//					getUser: () => { return { userId: 5 }; },
//					getUserBasicDetails: () => { return <Authentication.IUserBasicDetails>{}; }
//				};
//				Helper.mockHttpService($httpBackend);

//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new(), userService: userService });
				
				
//				$httpBackend.whenGET(Config.EndPoints.getListOfMails).respond(mailListFromServer);

//				let usersInListBefore = 0;
//				angular.forEach(mailboxCtrl.messages, (messages, userId) => {
//					usersInListBefore++;
//				});
//				expect(usersInListBefore).toBe(0);
				
//				mailboxCtrl.initMailBoxState(undefined);
//				$httpBackend.flush();

//				let usersInList = 0;
//				angular.forEach(mailboxCtrl.messages, (messages, userId) => {
//					usersInList++;
//				});
//				let partner1Msgs1 = mailboxCtrl.messages[1];
//				let partner1Msgs2 = mailboxCtrl.messages[2];
//				let partner1Msgs3 = mailboxCtrl.messages[3];
//				let partner1Msgs4 = mailboxCtrl.messages[4];

//				expect(usersInList).toBe(4);

//				expect(partner1Msgs1.length).toBe(3);
//				expect(partner1Msgs2.length).toBe(3);
//				expect(partner1Msgs3.length).toBe(2);
//				expect(partner1Msgs4.length).toBe(1);

//				expect(partner1Msgs1[0].date > partner1Msgs1[1].date).toBeTruthy();
//				expect(partner1Msgs1[1].date > partner1Msgs1[2].date).toBeTruthy();

//				expect(partner1Msgs2[0].date > partner1Msgs2[1].date).toBeTruthy();
//				expect(partner1Msgs2[1].date > partner1Msgs2[2].date).toBeTruthy();

//				expect(partner1Msgs3[0].date > partner1Msgs3[1].date).toBeTruthy();

//				let mailBoxList: Array<{ userId: number, firstName: string, lastName: string, subject: string, date: Date, status: number, replyTo?: number }> = mailboxCtrl.mailBoxList;

//				expect(mailBoxList[0].userId).toBe(4);
//				expect(mailBoxList[0].firstName).toBe("John");
//				expect(mailBoxList[0].lastName).toBe("Silver");
//				expect(mailBoxList[0].subject).toBe("Hello9");
//				expect(mailBoxList[0].status).toBe(10);
//				expect(mailBoxList[0].replyTo).toBe(null);

//				expect(mailBoxList[1].userId).toBe(3);
//				expect(mailBoxList[1].firstName).toBe("Captain");
//				expect(mailBoxList[1].lastName).toBe("Flint");
//				expect(mailBoxList[1].subject).toBe("Hello7");
//				expect(mailBoxList[1].status).toBe(2);
//				expect(mailBoxList[1].replyTo).toBe(null);

//				expect(mailBoxList[2].userId).toBe(1);
//				expect(mailBoxList[2].firstName).toBe("John");
//				expect(mailBoxList[2].lastName).toBe("Smiths");
//				expect(mailBoxList[2].subject).toBe("Hello1");
//				expect(mailBoxList[2].status).toBe(2);
//				expect(mailBoxList[2].replyTo).toBe(2);

//				expect(mailBoxList[3].userId).toBe(2);
//				expect(mailBoxList[3].firstName).toBe("Padre");
//				expect(mailBoxList[3].lastName).toBe("Adriano");
//				expect(mailBoxList[3].subject).toBe("Hello4");
//				expect(mailBoxList[3].status).toBe(10);
//				expect(mailBoxList[3].replyTo).toBe(null);
//			});

//			it("click on user on mailbox", () => {
//				let $httpBackend;
//				let $scope = $rootScope.$new();
//				let userService: any = {
//					create: (user: Authentication.IAuthUser) => { return <Authentication.IAuthUser>{}; },
//					isInitUserExistAsync: () => { return true },
//					isUserExist: () => { return true; },
//					getUserName: () => { return "" },
//					getUser: () => { return { userId: 5 }; },
//					getUserBasicDetails: () => { return <Authentication.IUserBasicDetails>{}; }
//				};
//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $scope, userService: userService });
//				inject((_$httpBackend_: ng.IHttpBackendService) => {
//					$httpBackend = _$httpBackend_;
//				});
//				Helper.mockHttpService($httpBackend);

//				//go to mailbox state
//				let mailboxStateTo = { name: States.mailboxInbox.name };
//				let mailBoxParams = {};

//				$httpBackend.whenGET(Config.EndPoints.getListOfMails).respond(mailListFromServer);

//				$scope.$broadcast(StatesHelper.UiStateEventNames.$stateChangeSuccess, mailboxStateTo, mailBoxParams);
//				$httpBackend.flush();

//				expect(Object.getOwnPropertyNames(mailboxCtrl.messages).length).toBe(4);
//				expect(mailboxCtrl.mailBoxList.length).toBe(4);
				
//				//click on "Padre Adriano"  mailbox
//				let stateTo = { name: States.mailboxUser.name };
//				let stateToParams = {
//					id: 2,
//					isNew: undefined
//				}
//				let memberData: Find.IMember = <Find.IMember>{
//					id:2 //member id
//				};
//				$httpBackend.whenPOST(Config.EndPoints.getMemberProfile).respond(memberData);
//				let mailContent: MailBox.IMesssageContent = <MailBox.IMesssageContent>{
//					message: "mail content.",
//					id: 4//message Id
//				};
//				$httpBackend.whenPOST(Config.EndPoints.getMailContent).respond(mailContent);

//				$scope.$broadcast(StatesHelper.UiStateEventNames.$stateChangeSuccess, stateTo, stateToParams);
//				$httpBackend.flush();

//				expect(mailboxCtrl.messages[2].length).toBe(3);
//				expect(mailboxCtrl.currentMember).toBeDefined();
//				expect(mailboxCtrl.currentMember.id).toBeDefined(4);
//				expect(mailboxCtrl.messages[2][0].content).toBeDefined();
//				expect(mailboxCtrl.messages[2][0].content).toBe(mailContent.message);
				

//				//go to mailbox state
//				$scope.$broadcast(StatesHelper.UiStateEventNames.$stateChangeSuccess, mailboxStateTo, mailBoxParams);
//				$httpBackend.flush();

//				//go back to user mailbox (userId=2)
//				$scope.$broadcast(StatesHelper.UiStateEventNames.$stateChangeSuccess, stateTo, stateToParams);
//				$httpBackend.flush();
//				expect(mailboxCtrl.messages[2].length).toBe(3);
//				expect(mailboxCtrl.currentMember).toBeDefined();
//				expect(mailboxCtrl.currentMember.id).toBeDefined(4);
//				expect(mailboxCtrl.messages[2][0].content).toBeDefined();
//				expect(mailboxCtrl.messages[2][0].content).toBe(mailContent.message);
//			});

//			it("initiate mailbox state", () => {
//				let $httpBackend: ng.IHttpBackendService;
//				let userService: any = {
//					create: (user: Authentication.IAuthUser) => { return <Authentication.IAuthUser>{}; },
//					isInitUserExistAsync: () => { return true },
//					isUserExist: () => { return true; },
//					getUserName: () => { return "" },
//					getUser: () => { return { userId: 5 }; },
//					getUserBasicDetails: () => { return <Authentication.IUserBasicDetails>{}; }
//				};
//				inject((_$http_, _$httpBackend_) => {
//					$httpBackend = _$httpBackend_;
//				});
//				Helper.mockHttpService($httpBackend);
//				$httpBackend.expectGET(Config.EndPoints.getListOfMails).respond(200, mailListFromServer);
//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new(), userService:userService });
//				mailboxCtrl.initMailBoxState({ notReload: false });
//				$httpBackend.flush();

//				$httpBackend.expectGET(Config.EndPoints.getListOfMails).respond(200, mailListFromServer);
//				mailboxCtrl.initMailBoxState(undefined);
//				$httpBackend.flush();

//				$httpBackend.expectGET(Config.EndPoints.getListOfMails).respond(200, mailListFromServer);
//				mailboxCtrl.initMailBoxState({notReload:true});
//				expect(() => {
//					$httpBackend.verifyNoOutstandingExpectation();
//				}).toThrowError(new RegExp(Config.EndPoints.getListOfMails));
//			});

//			it("send message to server with replyTo", () => {
//				let $httpBackend: ng.IHttpBackendService;
//				let $http: ng.IHttpService;
//				let statesHelper = { go() {} };
//				inject((_$http_, _$httpBackend_) => {
//					$httpBackend = _$httpBackend_;
//					$http = _$http_;
//				});
//				Helper.mockHttpService($httpBackend);

//				let memberToContact = <Find.IMember>{ id: 1 };
//				let messageText = "new Message";
//				let message = { text: messageText };
//				let messageFormController = <MailBox.IMessageFormController>{ messageText: { $valid: true } };
//				let lastUserMessage = <MailBox.IMailMessage>{ id: 5, fromId: 1 };
				
//				$httpBackend.whenPOST(Config.EndPoints.postMail).respond(200);
//				$httpBackend.expectPOST(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText, replyTo: lastUserMessage.id });
//				spyOn($http, "post").and.callThrough();
//				spyOn(statesHelper, "go").and.callFake(() => { });

//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new(), statesHelper: statesHelper });
//				mailboxCtrl.newMessageForm = messageFormController;
//				mailboxCtrl.currentMember = memberToContact;
//				mailboxCtrl.newMessage = message;
//				mailboxCtrl.messages = <MailBox.UserMessagesStorage>{ 1: [lastUserMessage] };
//				mailboxCtrl.sendMessageToServer();

//				$httpBackend.flush();

//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect($http.post).toHaveBeenCalledWith(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText, replyTo: lastUserMessage.id });
//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect(statesHelper.go).toHaveBeenCalledWith(States.mailboxInbox.name, { notReload: false });
//				expect(mailboxCtrl.newMessage.text).toBeUndefined();
//			});
//			it("send message to server without replyTo", () => {
//				let $httpBackend: ng.IHttpBackendService;
//				let $http: ng.IHttpService;
//				let statesHelper = { go() { } };
//				inject((_$http_, _$httpBackend_) => {
//					$httpBackend = _$httpBackend_;
//					$http = _$http_;
//				});
//				Helper.mockHttpService($httpBackend);

//				let memberToContact = <Find.IMember>{ id: 1 };
//				let messageText = "new Message";
//				let message = { text: messageText };
//				let messageFormController = <MailBox.IMessageFormController>{ messageText: { $valid: true } };
//				let lastUserMessage = <MailBox.IMailMessage>{ id: 5, fromId: 3 };

//				$httpBackend.whenPOST(Config.EndPoints.postMail).respond(200);
//				$httpBackend.expectPOST(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText});
//				spyOn($http, "post").and.callThrough();
//				spyOn(statesHelper, "go").and.callFake(() => { });

//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new(), statesHelper: statesHelper });
//				mailboxCtrl.newMessageForm = messageFormController;
//				mailboxCtrl.currentMember = memberToContact;
//				mailboxCtrl.newMessage = message;
//				mailboxCtrl.messages = <MailBox.UserMessagesStorage>{ 1: [lastUserMessage] };
//				mailboxCtrl.sendMessageToServer();

//				$httpBackend.flush();

//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect($http.post).toHaveBeenCalledWith(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText});
//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect(statesHelper.go).toHaveBeenCalledWith(States.mailboxInbox.name, { notReload: false });
//				expect(mailboxCtrl.newMessage.text).toBeUndefined();
//			});
//			it("send message to server without previous message", () => {
//				let $httpBackend: ng.IHttpBackendService;
//				let $http: ng.IHttpService;
//				let statesHelper = { go() { } };
//				inject((_$http_, _$httpBackend_) => {
//					$httpBackend = _$httpBackend_;
//					$http = _$http_;
//				});
//				Helper.mockHttpService($httpBackend);

//				let memberToContact = <Find.IMember>{ id: 1 };
//				let messageText = "new Message";
//				let message = { text: messageText };
//				let messageFormController = <MailBox.IMessageFormController>{ messageText: { $valid: true } };

//				$httpBackend.whenPOST(Config.EndPoints.postMail).respond(200);
//				$httpBackend.expectPOST(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText });
//				spyOn($http, "post").and.callThrough();
//				spyOn(statesHelper, "go").and.callFake(() => { });

//				let mailboxCtrl = <MailBox.MailBoxCtrl>$controller("MailboxCtrl", { $scope: $rootScope.$new(), statesHelper: statesHelper });
//				mailboxCtrl.newMessageForm = messageFormController;
//				mailboxCtrl.currentMember = memberToContact;
//				mailboxCtrl.newMessage = message;
//				mailboxCtrl.sendMessageToServer();

//				$httpBackend.flush();

//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect($http.post).toHaveBeenCalledWith(Config.EndPoints.postMail, { memberIdTo: memberToContact.id, text: messageText });
//				expect($http.post).toHaveBeenCalledTimes(1);
//				expect(statesHelper.go).toHaveBeenCalledWith(States.mailboxInbox.name, { notReload: false });
//				expect(mailboxCtrl.newMessage.text).toBeUndefined();
//			});
//		});

//		it("isValidMessage", () => {
//			let messageFormController = <MailBox.IMessageFormController>{ $valid: true, messageText: { $valid: true} };
//			let validator = new MailBox.MessageValidator(messageFormController);
//			validator.isEnabled = true;
//			expect(validator.isValid).toBeTruthy("Validatior must return true, if controller's $valid === true and validatior enabled");

//			messageFormController = <MailBox.IMessageFormController>{ $valid: false, messageText: { $valid: false, $error: {required:true} } };
//			validator = new MailBox.MessageValidator(messageFormController);
//			validator.isEnabled = true;
//			expect(validator.isValid).toBeFalsy("Validatior must return false, if controller's $valid === false and validatior enabled");
//			expect(validator.messageTextErrorMessage).toBe(validator.messageTextRequired);

//			// No longer present in the Validator

//			//messageFormController = <MailBox.IMessageFormController>{ $valid: false, messageText: { $valid: false, $error: { minlength: true } } };
//			//validator = new MailBox.MessageValidator(messageFormController);
//			//validator.isEnabled = true;
//			//expect(validator.isValid).toBeFalsy("Validatior must return false, if controller's $valid === false and validatior enabled");
//			//expect(validator.messageTextErrorMessage).toBe(validator.messageTextIsTooShort);

//			//messageFormController = <MailBox.IMessageFormController>{ $valid: false, messageText: { $valid: false, $error: { maxlength: true } } };
//			//validator = new MailBox.MessageValidator(messageFormController);
//			//validator.isEnabled = true;
//			//expect(validator.isValid).toBeFalsy("Validatior must return false, if controller's $valid === false and validatior enabled");
//			//expect(validator.messageTextErrorMessage).toBe(validator.messageIsTooLong);

//			messageFormController = <MailBox.IMessageFormController>{ $valid: false, messageText: { $valid: false } };
//			validator = new MailBox.MessageValidator(messageFormController);
//			expect(validator.isValid).toBeTruthy("Validator must return true when disabled.");
//		});
//	});
//}
