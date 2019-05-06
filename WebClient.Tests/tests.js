var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//module UnitTests {
//    describe("Allow Pattern", () => {
//        let $compileService: ng.ICompileService;
//        let $scope: any;
//        let element: ng.IAugmentedJQuery;
//        let inputElement: ng.IAugmentedJQuery;
//        beforeEach(() => {
//            angular.mock.module("app");
//            angular.mock.module({ "$log": Helper.getEnchanceLogMock() });
//        });
//        beforeEach(inject(($rootScope: ng.IRootScopeService, $compile: ng.ICompileService, $httpBackend: ng.IHttpBackendService) => {
//            $compileService = $compile;
//            $scope = $rootScope.$new();
//            Helper.mockHttpService($httpBackend);
//        }));
//        it("first name pattern", () => {
//            const regExp = "[\\u0020\\u002D\\u005C\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u1FFF\\u3020-\\uFFDF]";
//            const htmlTmpl = `<input id='input-field' type='text' allow-pattern='${regExp}' ng-model='firstName'/>`;
//            inputElement = angular.element(htmlTmpl);
//            element = $compileService(inputElement)($scope);
//            $scope.firstName = "(%).andri y";
//            $scope.$digest();
//            let event = jQuery.Event("keypress");
//            event.altKey = true;
//            event.ctrlKey = true;
//            inputElement.triggerHandler(event);
//            expect($scope.firstName).toBe("andri y");
//        });
//        it("last name pattern", () => {
//            const regExp = "[\\u002E\\u0020\\u002D\\u005C\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u1FFF\\u3020-\\uFFDF]";
//            inputElement = angular.element(`<input id='input-field' type='text' allow-pattern='${regExp}' ng-model='firstName'/>`);
//            element = $compileService(inputElement)($scope);
//            $scope.firstName = "(%.)andri y.";
//            $scope.$digest();
//            let event = jQuery.Event("keypress");
//            event.altKey = true;
//            event.ctrlKey = true;
//            inputElement.triggerHandler(event);
//            expect($scope.firstName).toBe(".andri y.");
//        });
//        it("location pattern", () => {
//            const regExp = "[\\u002C\\u002E\\u0020\\u002D\\u005C\\u0026-\\u0029\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u1FFF\\u3020-\\uFFDF]";
//            inputElement = angular.element(`<input id='input-field' type='text' allow-pattern="${regExp}" ng-model='location'/>`);
//            element = $compileService(inputElement)($scope);
//            $scope.location = "(&', %.)andri y.";
//            $scope.$digest();
//            let event = jQuery.Event("keypress");
//            event.altKey = true;
//            event.ctrlKey = true;
//            inputElement.triggerHandler(event);
//            expect($scope.location).toBe("(&', .)andri y.");
//        });
//    });
//}
///// <reference path="../../scripts/typings/jasmine/jasmine.d.ts" />
//describe("Before unload handler", () => {
//    let $windowService: ng.IWindowService;
//    let $stateService: ng.ui.IStateService;
//    let $locationService: ng.ILocationService;
//    let $rootScopeService: ng.IRootScopeService;
//    beforeEach(angular.mock.module("app"));
//    beforeEach(inject(($window:ng.IWindowService, $state:ng.ui.IStateService, $location:ng.ILocationService, $rootScope:ng.IRootScopeService, $httpBackend:ng.IHttpBackendService) => {
//        UnitTests.Helper.mockHttpService($httpBackend);
//        $windowService = $window;
//        $stateService = $state;
//        $locationService = $location;
//        $rootScopeService = $rootScope;
//    }));
//    it("message not fired", () => {
//        //Check home state
//        $stateService.go("root.home").then(() => {
//			$rootScopeService.$digest();
//			expect($stateService.includes("root.text-chat")).toBeTruthy();
//			const result = $windowService.onbeforeunload(<BeforeUnloadEvent>event);
//			expect(result).toBeUndefined("alert with message must not be fired.");
//        });
//    });
//    it("message fired on chat ", () => {
//        //Check main text chat state
//        $stateService.go("root.text-chat").then(() => {
//			$rootScopeService.$digest();
//			expect($stateService.includes("root.text-chat")).toBeTruthy();
//			const result = $windowService.onbeforeunload(<BeforeUnloadEvent>event);
//			expect(result).toBe(Config.leavePageMessage, "alert with message must be fired.");
//        });
//		//Check one children text chat state
//        $stateService.go("root.text-chat.room-multi").then(() => {
//			$rootScopeService.$digest();
//			expect($stateService.includes("root.text-chat")).toBeTruthy();        
//			const result = $windowService.onbeforeunload(<BeforeUnloadEvent>event);
//			expect(result).toBe(Config.leavePageMessage, "alert with message must be fired.");
//        });
//		//Check signup state
//		$stateService.go("root.signup").then(() => {
//			$rootScopeService.$digest();
//			expect($stateService.includes("root.text-chat")).toBeTruthy();
//			const result = $windowService.onbeforeunload(<BeforeUnloadEvent>event);
//			expect(result).toBe(Config.leavePageMessage, "alert with message must be fired.");
//        });
//    });
//}); 
//module UnitTests {
//	describe("User Profile", () => {
//		let $compile: ng.ICompileService;
//		let $rootScope: ng.IRootScopeService;
//		let $templateCache: ng.ITemplateCacheService;
//		let $controller: ng.IControllerService;
//		//Andriy: Get preloaded templates from ng-html2js
//		beforeEach(angular.mock.module("my.tmpls"));
//		beforeEach(angular.mock.module("app"));
//		beforeEach(angular.mock.module({ $log: Helper.getEnchanceLogMock() }));
//		beforeEach(angular.mock.inject((_$rootScope_: ng.IRootScopeService, _$compile_: ng.ICompileService, _$controller_: ng.IControllerService, _$httpBackend_: ng.IHttpBackendService, _$templateCache_: ng.ITemplateCacheService) => {
//			$compile = _$compile_;
//			$rootScope = _$rootScope_;
//			$templateCache = _$templateCache_;
//			$controller = _$controller_;
//			Helper.mockHttpService(_$httpBackend_);
//		}));
//		it("loaded", () => {
//			let userProfile = <Authentication.IAuthUser>{
//				id: 1,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				gender: "M",
//				age: 36,
//				knows: 3,
//				learns: 1,
//				learns2: 4,
//				knows2:5,
//				lookToLearnWithTextChat: true,
//				lookToLearnWithVoiceChat: true,
//				lookToLearnWithGames: true,
//				lookToLearnWithMore: true,
//				birthMonth: 2,
//				birthYear: 1980,
//				country: 102,
//				location: "Toronto",
//				introduction: "I learn english",
//				wantsToHelpHellolingo: true,
//				email: "test@test.com",
//				isSharedTalkMember: false,
//				isLivemochaMember: false,
//				isEmailConfirmed: true
//			};
//			let userServiceMock = Helper.getUserServiceMock();
//			userServiceMock.getUser = () => userProfile;
//			$controller("UserProfileCtrl", { $scope: $rootScope.$new(), userService: userServiceMock, $uibModal: undefined, statesHelper: undefined });
//			let profileTemplate = $templateCache.get("Angular/Profile/ProfileTemplate.html");
//			expect(profileTemplate).toBeDefined();
//			let profileStateTemplate = "<user-profile></user-profile>";
//			let wrappedTemplate = angular.element(profileStateTemplate);
//			let $scope = $rootScope.$new();
//			let compiledDirective = $compile(wrappedTemplate)($scope);
//			$scope.$digest();
//			let buttonLearn = angular.element(wrappedTemplate[0].querySelector("#profile-learn-lang"));
//			let langToLearn = buttonLearn.text().trim();
//			debugger;
//			expect(langToLearn).toBe(Languages.languagesById[userProfile.learns].text, "lern language is wrong");
//		});
//		it("fields updated", () => {
//			expect({}).toBeDefined();
//		});
//});
//} 
///// <reference path="../../scripts/typings/jasmine/jasmine.d.ts" />
//describe("Find", () => {
//	const viewTemplateName = "partials/find";
//	describe("controller ", () => {
//		beforeEach(angular.mock.module("app"));
//		it("exist", () => {
//			let findController;
//// ReSharper disable once InconsistentNaming
//			inject((_$controller_, _userService_) => {
//				_userService_ = UnitTests.Helper.getUserServiceMock();
//				findController = _$controller_("FindCtrl", {$scope: {},userService:_userService_ });
//			});
//			expect(findController).toBeDefined("FindCtrl doesn't exist.");
//		});
//	});
//	describe("functionality", () => {
//		let $controller: ng.IControllerService;
//		let $templateCache: ng.ITemplateCacheService;
//		let $compile: ng.ICompileService;
//		let $rootScope: ng.IRootScopeService;
//		let userServiceMock: Authentication.IUserService;
//		let $httpBackend: ng.IHttpBackendService;
//		let authService: Authentication.IAuthenticationService;
//		let statesHelper: Services.StatesHelper;
//		beforeEach(() => {
//	    angular.mock.module("app");
//		angular.mock.module({ "userService": UnitTests.Helper.getUserServiceMock() });
//		//angular.mock.module({ "authService": { isAuthenticated: () => false } });
//		});
//// ReSharper disable InconsistentNaming
//		beforeEach(inject((_$compile_: ng.ICompileService,
//			               _$templateCache_: ng.ITemplateCacheService,
//			               _$httpBackend_: ng.IHttpBackendService,
//			               _$rootScope_: ng.IRootScopeService,
//			               _$controller_: ng.IControllerService,
//						   _userService_: Authentication.IUserService,
//						   _authService_: Authentication.IAuthenticationService,
//		                   _statesHelper_:Services.StatesHelper) => {
//			UnitTests.Helper.mockHttpService(_$httpBackend_);
//			$httpBackend = _$httpBackend_;
//			UnitTests.Helper.mockGeneratedTemplates(_$templateCache_, viewTemplateName);
//			$rootScope = _$rootScope_;
//			$controller = _$controller_;
//			$templateCache = _$templateCache_;
//			$compile = _$compile_;
//			userServiceMock = _userService_;
//			authService = _authService_;
//			statesHelper = _statesHelper_;
//		}));
//		it("view rendered", () => {
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($rootScope.$new());
//			expect(viewHtml).toBeDefined("Find view must be rendered");
//		});
//		it("get languagaes in view", () => {
//			$httpBackend.whenGET(new RegExp(".+member$")).respond(200, []);
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($rootScope.$new());
//			$rootScope.$digest();
//			let buttons = viewHtml.find("button");
//			expect(buttons.length > 10).toBeTruthy();
//		});
//		it("select learn 1st tier html", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$httpBackend.whenGET(new RegExp("learnId=1")).respond(200, []);
//			$httpBackend.whenGET(new RegExp("learnId=3")).respond(200, []);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate)[4])($scope);
//			$scope.$digest();
//			let findHtmlDiv = viewHtml[0];
//			let languagesPickers = findHtmlDiv.getElementsByClassName("lang-picker");
//			let firstTierLearnButtons = angular.element(languagesPickers[0]).children("button");
//			let frenchLearn = firstTierLearnButtons[2];
//			frenchLearn.click();
//			$scope.$digest();
//			let frenchScope: any = angular.element(frenchLearn).scope();
//			expect(frenchScope.find.languageSelect.learnId).toEqual(3);
//			expect(angular.element(frenchLearn).hasClass("active")).toBeTruthy();
//		});
//		it("select known 1st tier  html", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$httpBackend.whenGET(new RegExp("\\?learnId=1")).respond(200, []);
//			$httpBackend.whenGET(new RegExp("\\?knownId=3&learnId=1")).respond(200, []);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", { $scope: $scope, userService: userServiceMock });
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			let findHtmlDiv = viewHtml[4];
//			let languagesPickers = findHtmlDiv.getElementsByClassName("lang-picker");
//			let firstTierKnownButtons = angular.element(languagesPickers[1]).children("button");
//			let frenchKnown = firstTierKnownButtons[2];
//			frenchKnown.click();
//			$scope.$digest();
//			let frenchScope: any = angular.element(frenchKnown).scope();
//			expect(frenchScope.find.languageSelect.knownId).toEqual(3);
//			expect(angular.element(frenchKnown).hasClass("active")).toBeTruthy();
//		});
//		it("select known 2nd tier  html", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$httpBackend.whenGET(new RegExp("\\?learnId=1")).respond(200, []);
//			$httpBackend.whenGET(new RegExp(("\\?knownId=55&learnId=1"))).respond(200, []);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			let findController = <Find.FindMembersCtrl>$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			let findHtmlDiv = viewHtml[4];
//			let languagesPickers = findHtmlDiv.getElementsByClassName("lang-picker");
//			let secondTierKnownItems = angular.element(languagesPickers[1]).children("div").children("ul").children("li");
//			let ukrKnown = $(secondTierKnownItems[26]).first().children("a")[0];
//			ukrKnown.click();
//			$scope.$digest();
//			let ukrScope: any = angular.element(ukrKnown).scope();
//			expect(ukrScope.find.languageSelect.knownId).toEqual(55);
//			expect(angular.element(languagesPickers[1]).children("div").children("button").text().length > 5).toBeTruthy();
//			let secondtTierLearnButtons = angular.element(languagesPickers[0]).children("div").children("ul").children("li");
//			let hiddenListItem = secondtTierLearnButtons[26];
//			let isHide = $(hiddenListItem).children("a").first().hasClass("ng-hide");
//			expect(isHide).toEqual(true);
//		});
//		it("select learn 2nd tier html", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$httpBackend.whenGET(new RegExp("\\?learnId=1")).respond(200, []);
//			$httpBackend.whenGET(new RegExp("\\?learnId=55")).respond(200, []);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			let findHtmlDiv = viewHtml[4];
//			let languagesPickers = findHtmlDiv.getElementsByClassName("lang-picker");
//			let secondTierLearnItems = $(languagesPickers[0]).children("div").children("ul").children("li");
//			let ukrLearn = $(secondTierLearnItems[25]).first().children("a")[0];
//			ukrLearn.click();
//			$scope.$digest();
//			let ukrScope: any = angular.element(ukrLearn).scope();
//			expect(ukrScope.find.languageSelect.learnId).toEqual(55);
//			let selectLangText = $(languagesPickers[0]).children("div").children("button").text().trim();
//			expect(selectLangText).toEqual("Українська");
//			let secondtTierKnownButtons = angular.element(languagesPickers[1]).children("div").children("ul").children("li");
//			let hiddenListItem = secondtTierKnownButtons[26];
//			let hiddenLink = $(hiddenListItem).children("a").first();
//			let hiddenLang = $(hiddenListItem).children("a").first().text().trim();
//			let isHide = hiddenLink.hasClass("ng-hide");
//			expect(isHide).toEqual(true);
//			expect(hiddenLang).toEqual("Українська");
//		});
//		it("select default languages for sign in user", () => {
//			$httpBackend.whenGET(new RegExp("learnId=7$")).respond([{
//				id: 1,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				country: "Ukraine",
//				gender: "M",
//				age: 36,
//				learns: 55,
//				knowns: 7
//			},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 7
//				},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 7
//				},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 7
//				}]);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			userServiceMock.getUserBasicDetails = () => <Authentication.IUserBasicDetails>{
//				firstName: "andriy@lakhno.com",
//				learns: undefined,
//				knows: 7
//			};
//			$controller("FindCtrl as find", { $scope: $scope, userService: userServiceMock });
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			expect($scope.find.languageSelect.learnId).toEqual(7);
//			expect($scope.find.languageSelect.knownId).toEqual(undefined);
//		});
//		it("select default languages for guest user", () => {
//			$httpBackend.whenGET(new RegExp(".+member.+learnId=1")).respond([{
//				id: 1,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				country: "Ukraine",
//				gender: "M",
//				age: 36,
//				learns: "English",
//				knowns: "Ukrainian"
//			},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: "English",
//					knowns: "Franch"
//				}]);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$controller("FindCtrl as find", { $scope: $scope, userService: userServiceMock });
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			expect($scope.find.languageSelect.learnId).toEqual(1);
//			expect($scope.find.languageSelect.knownId).toEqual(undefined);
//		});
//		it("get initial members", () => {
//			$httpBackend.whenGET(new RegExp(".+member.+learnId=1")).respond([{
//				id: 1,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				country: "Ukraine",
//				gender: "M",
//				age: 36,
//				learns: "English",
//				knowns: "Ukrainian"
//			},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: "English",
//					knowns: "Franch"
//				}]);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$controller("FindCtrl as find", { $scope: $scope, userService: userServiceMock });
//			$httpBackend.flush();
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			expect($scope.find.foundMembers.length).toEqual(2);
//		});
//		it("get select languages by clicks", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			$httpBackend.whenGET(new RegExp("\\?learnId=1")).respond([{
//				id: 1,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				country: "Ukraine",
//				gender: "M",
//				age: 36,
//				learns: "English",
//				knowns: "Ukrainian"
//			},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: "Brazil",
//					gender: "F",
//					age: 26,
//					learns: "English",
//					knowns: "Franch"
//				}]);
//			$httpBackend.whenGET(new RegExp("\\?learnId=55")).respond([{
//				id: 2,
//				firstName: "Andriy",
//				lastName: "Lakhno",
//				country: 5,
//				gender: "M",
//				age: 36,
//				learns: 55,
//				knowns: 2
//			}]);
//			$httpBackend.whenGET(new RegExp("\\?knownId=6&learnId=55")).respond([
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 5,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 5,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				},
//				{
//					id: 2,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 5,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				}]);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", { $scope: $scope, userService: userServiceMock });
//			$httpBackend.flush();
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$scope.$digest();
//			let findHtmlDiv = viewHtml[4];
//			let languagesPickers = findHtmlDiv.getElementsByClassName("lang-picker");
//			let secondTierLearnItems = $(languagesPickers[0]).children("div").children("ul").children("li");
//			let ukrLearn = $(secondTierLearnItems[25]).first().children("a")[0];
//			ukrLearn.click();
//			$httpBackend.flush();
//			$scope.$digest();
//			let ukrScope: any = angular.element(ukrLearn).scope();
//			expect(ukrScope.find.languageSelect.learnId).toEqual(55);
//			expect(ukrScope.find.foundMembers.length).toEqual(1);
//			let member = <Find.IPublicUser>ukrScope.find.foundMembers[0];
//			expect(member.id).toEqual(2);
//			expect(member.firstName).toEqual("Andriy");
//			expect(member.lastName).toEqual("Lakhno");
//			expect(member.country).toEqual(5);
//			expect(member.gender).toEqual("M");
//			expect(member.age).toEqual(36);
//			expect(member.learns).toEqual(55);
//			expect(member.knowns).toEqual(2);
//			let firstTierKnownButtons = angular.element(languagesPickers[1]).children("button");
//			let italianKnown = $(firstTierKnownButtons[5]);
//			italianKnown.click();
//			$httpBackend.flush();
//			$scope.$digest();
//			let italianScope: any = angular.element(italianKnown).scope();
//			expect(italianScope.find.languageSelect.knownId).toEqual(6);
//			expect(italianScope.find.foundMembers.length).toEqual(3);
//		});
//		it("choose member", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			const members = [
//				{
//					id: 2,
//					firstName: "Andriy",
//					lastName: "Lakhno",
//					country: 5,
//					gender: "M",
//					age: 36,
//					learns: 55,
//					knowns: 2
//				},
//				{
//					id: 3,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 7,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				}
//			];
//			$httpBackend.whenGET(new RegExp("learnId=1")).respond(200, members);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$httpBackend.flush();
//			$scope.$digest();
//			let userRows = $(viewHtml[4]).find("table").find("tbody").children();
//			expect(userRows.length).toBe(2);
//			let firstUserRow = userRows[0];
//			firstUserRow.click();
//			$scope.$digest();
//			let user1Scope = <Find.IFindScope>angular.element(firstUserRow).scope();
//			expect(user1Scope.find.selectedMember.id).toBe(members[0].id);
//			let secondUserRow = userRows[1];
//			secondUserRow.click();
//			$scope.$digest();
//			let user2Scope = <Find.IFindScope>angular.element(secondUserRow).scope();
//			expect(user2Scope.find.selectedMember.id).toBe(members[1].id);
//		});
//		it("contact member as guest", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			statesHelper.go = (to: string, params?: {}, options?: angular.ui.IStateOptions) => { return <ng.IPromise<any>>{} };
//			spyOn(statesHelper, "go");
//			authService.isAuthenticated = () => false;
//			spyOn(authService, "isAuthenticated").and.returnValue(false);
//			const members = [
//				{
//					id: 2,
//					firstName: "Andriy",
//					lastName: "Lakhno",
//					country: 5,
//					gender: "M",
//					age: 36,
//					learns: 55,
//					knowns: 2
//				},
//				{
//					id: 3,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 7,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				}
//			];
//			$httpBackend.whenGET(new RegExp("learnId=1")).respond(200, members);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock,
//				authService: authService,
//				statesHelper: statesHelper
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$httpBackend.flush();
//			$scope.$digest();
//			let userRows = $(viewHtml[4]).find("table").find("tbody").children();
//			expect(userRows.length).toBe(2);
//			let firstUserRow = userRows[0];
//			firstUserRow.click();
//			$scope.$digest();
//			let user1Scope = <Find.IFindScope>angular.element(firstUserRow).scope();
//			expect(user1Scope.find.selectedMember.id).toBe(members[0].id);
//			let contactElement = $(firstUserRow).children().first().children().first();
//			contactElement.click();
//			$scope.$digest();
//			expect(authService.isAuthenticated).toHaveBeenCalledTimes(1);
//			expect(statesHelper.go).toHaveBeenCalledTimes(1);
//			expect(statesHelper.go).toHaveBeenCalledWith(States.login.name, { needLogin: true });
//			expect(statesHelper.go).toHaveBeenCalledWith(States.login.name, { needLogin: true });
//		});
//		it("contact member as registered user", () => {
//			userServiceMock.getUserBasicDetails = () => undefined;
//			statesHelper.go = (to: string, params?: {}, options?: angular.ui.IStateOptions) => { return <ng.IPromise<any>>{} };
//			spyOn(statesHelper, "go");
//			authService.isAuthenticated = () => true;
//			spyOn(authService, "isAuthenticated").and.returnValue(true);
//			const members = [
//				{
//					id: 2,
//					firstName: "Andriy",
//					lastName: "Lakhno",
//					country: 5,
//					gender: "M",
//					age: 36,
//					learns: 55,
//					knowns: 2
//				},
//				{
//					id: 3,
//					firstName: "Martha",
//					lastName: "Proto",
//					country: 7,
//					gender: "F",
//					age: 26,
//					learns: 55,
//					knowns: 2
//				}
//			];
//			$httpBackend.whenGET(new RegExp("learnId=1")).respond(200, members);
//			let $scope = <Find.IFindScope>$rootScope.$new();
//			$controller("FindCtrl as find", {
//				$scope: $rootScope.$new(),
//				userService: userServiceMock,
//				authService: authService,
//				statesHelper: statesHelper
//			});
//			let viewTemplate = $templateCache.get(viewTemplateName);
//			let viewHtml = $compile(angular.element(viewTemplate))($scope);
//			$httpBackend.flush();
//			$scope.$digest();
//			let userRows = $(viewHtml[4]).find("table").find("tbody").children();
//			expect(userRows.length).toBe(2);
//			let firstUserRow = userRows[0];
//			firstUserRow.click();
//			$scope.$digest();
//			let user1Scope = <Find.IFindScope>angular.element(firstUserRow).scope();
//			expect(user1Scope.find.selectedMember.id).toBe(members[0].id);
//			let contactElement = $(firstUserRow).children().first().children().first();
//			contactElement.click();
//			$scope.$digest();
//			expect(authService.isAuthenticated).toHaveBeenCalledTimes(1);
//			expect(statesHelper.go).toHaveBeenCalledTimes(1);
//			expect(statesHelper.go).toHaveBeenCalledWith(States.contact.name, { id: 2});
//		});
//	});
//describe("findMembersCtrl", () => {
//	it("not show load more", inject(($http: ng.IHttpService, $httpBackend: ng.IHttpBackendService) => {
//		const resources = { getCountries: () => { return []; } } as Services.IServerResourcesService;
//		const userService = { getUser: () => { return {} as Authentication.IAuthUser; } } as Authentication.IUserService;
//		const scope = { $on: ($event: string, fn: Function) => { } } as Find.IFindScope;
//		const findMembersCtrl: Find.FindMembersCtrl = new Find.FindMembersCtrl(scope, null, userService, null, null, null, null, null, resources, null);
//		$httpBackend.whenGET(Config.EndPoints.postMembersList).respond(200, []);
//		expect(findMembersCtrl.loadingMoreMemebers).toBeFalsy();
//		findMembersCtrl.loadMoreUsers();
//		expect(findMembersCtrl.loadingMoreMemebers).toBeTruthy();
//		$httpBackend.flush();
//		expect(findMembersCtrl.loadingMoreMemebers).toBeFalsy();
//	}));
//});
//}) 
var UnitTests;
(function (UnitTests) {
    describe("memberFilter", function () {
        var $filter;
        var resources;
        beforeEach(function () {
            angular.mock.module("app.filters");
            angular.mock.module({
                "serverResources": {
                    getCountries: function () {
                        var countriesList = [
                            { id: 0, text: "United States", displayOrder: 1 },
                            { id: 1, text: "Argentina", displayOrder: 1 } //index=1
                        ];
                        return countriesList;
                    }
                }
            });
        });
        beforeEach(inject(function (_$filter_, serverResources) {
            $filter = _$filter_;
            resources = serverResources;
        }));
        it("filters by name", function () {
            var initMembers = [
                { firstName: "John" },
                { firstName: "Andriy" },
            ];
            var filter = Filters.findMembersFilter($filter, resources);
            var filteredMembers = filter(initMembers, Filters.SortMembersBy.name);
            expect(initMembers.length).toEqual(2);
            expect(filteredMembers.length).toEqual(2);
            expect(filteredMembers[0].firstName).toEqual(initMembers[1].firstName);
            expect(filteredMembers[1].firstName).toEqual(initMembers[0].firstName);
        });
        it("filters by id", function () {
            var initMembers = [
                { firstName: "John", id: 10 },
                { firstName: "Andriy", id: 2 },
            ];
            var filter = Filters.findMembersFilter($filter, resources);
            var filteredMembers = filter(initMembers, Filters.SortMembersBy.id);
            expect(initMembers.length).toEqual(2);
            expect(filteredMembers.length).toEqual(2);
            expect(filteredMembers[0].id).toEqual(initMembers[0].id);
            expect(filteredMembers[1].id).toEqual(initMembers[1].id);
        });
        it("filters by country", function () {
            var initMembers = [
                { firstName: "John", id: 10, country: 0 /*United States*/ },
                { firstName: "Andriy", id: 2, country: 1 /*Argentina*/ },
            ];
            var filter = Filters.findMembersFilter($filter, resources);
            var filteredMembers = filter(initMembers, Filters.SortMembersBy.country);
            var countries = resources.getCountries();
            expect(initMembers.length).toEqual(2);
            expect(filteredMembers.length).toEqual(2);
            expect(countries[filteredMembers[0].country].text).toEqual(countries[initMembers[1].country].text);
            expect(countries[filteredMembers[1].country].text).toEqual(countries[initMembers[0].country].text);
        });
        it("filters by lern", function () {
            var initMembers = [
                { firstName: "John", id: 10, learns: 9 },
                { firstName: "Andriy", id: 2, learns: 1 },
            ];
            var filter = Filters.findMembersFilter($filter, resources);
            var filteredMembers = filter(initMembers, Filters.SortMembersBy.learns);
            var lang = Languages.languagesById;
            expect(initMembers.length).toEqual(2);
            expect(filteredMembers.length).toEqual(2);
            expect(lang[filteredMembers[0].learns].text).toEqual(lang[initMembers[1].learns].text);
            expect(lang[filteredMembers[1].learns].text).toEqual(lang[initMembers[0].learns].text);
        });
        it("filters by known", function () {
            var initMembers = [
                { firstName: "John", id: 10, knows: 8 },
                { firstName: "Andriy", id: 2, knows: 3 },
            ];
            var filter = Filters.findMembersFilter($filter, resources);
            var filteredMembers = filter(initMembers, Filters.SortMembersBy.knows);
            var lang = Languages.languagesById;
            expect(initMembers.length).toEqual(2);
            expect(filteredMembers.length).toEqual(2);
            expect(lang[filteredMembers[0].knows].text).toEqual(lang[initMembers[1].knows].text);
            expect(lang[filteredMembers[1].knows].text).toEqual(lang[initMembers[0].knows].text);
        });
    });
})(UnitTests || (UnitTests = {}));
var UnitTests;
(function (UnitTests) {
    describe("FormInputsRegulator", function () {
        it("clenup last name", function () {
            var input = " .Smi.th... ";
            var inputResult = "Smi.th...";
            var cleanedInpupt = FormInputsRegulator.cleanLastName(input);
            expect(cleanedInpupt).toBe(inputResult, "Last name cleanup failed");
        });
        it("clenup last name one dot", function () {
            var input = " . ";
            var inputResult = "";
            var cleanedInpupt = FormInputsRegulator.cleanLastName(input);
            expect(cleanedInpupt).toBe(inputResult, "Last name one dot cleanup failed");
        });
        it("cleanup last name is undefined", function () {
            var input = undefined;
            var inputResult = undefined;
            var cleanedInpupt = FormInputsRegulator.cleanLastName(input);
            expect(cleanedInpupt).toBe(inputResult, "Last must be undefined");
        });
        it("clenup location", function () {
            var input = "  ,'  - \\&().Ky.&(,')i()v.,'&(\\--) ";
            var inputResult = "Ky.&(,')i()v.";
            var cleanedInpupt = FormInputsRegulator.cleanLocation(input);
            expect(cleanedInpupt).toBe(inputResult, "Location cleanup failed");
        });
        it("clenup location to empty", function () {
            var input = " &().,'.&()().&( )";
            var inputResult = undefined;
            var cleanedInpupt = FormInputsRegulator.cleanLocation(input);
            expect(cleanedInpupt).toBe(inputResult, "Empty location cleanup failed");
        });
        it("location is undefined", function () {
            var input = undefined;
            var inputResult = undefined;
            var cleanedInpupt = FormInputsRegulator.cleanLocation(input);
            expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
        });
        it("location is undefined after dots", function () {
            var input = "...";
            var inputResult = undefined;
            var cleanedInpupt = FormInputsRegulator.cleanLocation(input);
            expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
        });
        it("clenup first name", function () {
            var input = " -\\Ky\\-\\iv-- \\";
            var inputResult = "Ky\\-\\iv";
            var cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
            expect(cleanedInpupt).toBe(inputResult, "Location cleanup failed");
        });
        it("clenup first name to empty", function () {
            var input = "\\-\-\ -\-\-";
            var inputResult = "";
            var cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
            expect(cleanedInpupt).toBe(inputResult, "Empty location cleanup failed");
        });
        it("first name is undefined", function () {
            var input = undefined;
            var inputResult = undefined;
            var cleanedInpupt = FormInputsRegulator.cleanFirstName(input);
            expect(cleanedInpupt).toBe(inputResult, "Location must be undefined");
        });
    });
})(UnitTests || (UnitTests = {}));
//module UnitTests {
//	export class Helper {
//        static mockHttpService($httpBackend: ng.IHttpBackendService) {
//            $httpBackend.whenGET("/api/ping").respond(200, "Pong");
//            $httpBackend.whenGET("api/account/profile").respond(200, false);
//            $httpBackend.whenGET("/partials/").respond(200, true);
//			$httpBackend.whenGET(/\.html\?v=/).respond(200, true);
//			$httpBackend.whenPOST("/api/check").respond(200, "OK");
//        }
//		//To get server generated templates from backend local server must be started on http://localhost:52800
//        static mockGeneratedTemplates($templateCache: ng.ITemplateCacheService, templateUrl: string) {
//            let req: XMLHttpRequest = new XMLHttpRequest();
//            req.onload = () => {
//				const template = req.responseText;
//				$templateCache.put(templateUrl, template);
//            };
//            req.onerror = (event: Event) => {
//                console.log(event);
//            }
//			const url = `http://localhost:52800/${templateUrl}`;
//			req.open("get", url, false);
//            req.send();
//        }
//		static getUserServiceMock() {
//			return new UserServiceMock();
//		}
//		static getEnchanceLogMock() {
//			return new EnhanceLogMock();
//		}
//    }
//	export class UserServiceMock implements Authentication.IUserService {
//		create = (user) => <Authentication.IAuthUser>{};
//		update = (profile: Profile.IUserProfile) => <ng.IPromise<Authentication.IUserUpdateServerResponseMessage>>{};
//		isInitUserExistAsync = () => <ng.IPromise<boolean>>{};
//		isUserExist = () => false;
//		getUserName = () => "userName";
//		getUser = () => <Authentication.IAuthUser>{};
//		getUserBasicDetails = () => <Authentication.IUserBasicDetails>{};
//	}
//	export class EnhanceLogMock {//UpdAate with interface
//		//Review this
//		trace = msg => { };
//		debug = msg => { };
//		log = msg => { };
//		info = msg => {};
//		warn = msg => {};
//		error = (msg?, location?) => {};
//		logTo = (msg, logger, level) => { };
//		// ========== Enhanced logging methods ==========
//		public app = (msg, obj?) => { };
//		public appWarn = msg => { };
//		public appError = msg => { };
//		public ajax = msg => { };
//		public ajaxWarn = msg => { };
//		public ajaxError = msg => {};
//		public signalR = msg => { };
//		public signalRWarn = msg => { };
//		public signalRError = msg => {};
//	}
//} 
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
var UnitTests;
(function (UnitTests) {
    describe("message formating", function () {
        describe("bold", function () {
            it("text1", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatBold("hello *Andriy*");
                expect(bold).toEqual("hello <span class='message-bold'>Andriy</span>");
            });
            it("text2", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatBold("hello *Andriy* hello");
                expect(bold).toEqual("hello <span class='message-bold'>Andriy</span> hello");
            });
            it("text3", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatBold("hello *Andriy* hello *Julia*");
                expect(bold).toEqual("hello <span class='message-bold'>Andriy</span> hello <span class='message-bold'>Julia</span>");
            });
            it("text4", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatBold("*hello *Andriy* hello *Julia*");
                expect(bold).toEqual("*hello <span class='message-bold'>Andriy</span> hello <span class='message-bold'>Julia</span>");
            });
            it("text5", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatBold("Elle est aidé*e*");
                expect(bold).toEqual("Elle est aidé<span class='message-bold'>e</span>");
            });
        });
        describe("underline", function () {
            it("text1", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatUnderline("hello _Andriy_");
                expect(bold).toEqual("hello <span class='message-underline'>Andriy</span>");
            });
            it("text2", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatUnderline("hello _Andriy_ hello");
                expect(bold).toEqual("hello <span class='message-underline'>Andriy</span> hello");
            });
            it("text3", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatUnderline("hello _Andriy_ hello _Julia_");
                expect(bold)
                    .toEqual("hello <span class='message-underline'>Andriy</span> hello <span class='message-underline'>Julia</span>");
            });
            it("text4", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatUnderline("_hello _Andriy_ hello _Julia_");
                expect(bold)
                    .toEqual("_hello <span class='message-underline'>Andriy</span> hello <span class='message-underline'>Julia</span>");
            });
        });
        describe("strike-through", function () {
            it("text1", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatStrikethrough("hello ~Andriy~");
                expect(bold).toEqual("hello <span class='message-strikethrough'>Andriy</span>");
            });
            it("text2", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatStrikethrough("hello ~Andriy~ hello");
                expect(bold).toEqual("hello <span class='message-strikethrough'>Andriy</span> hello");
            });
            it("text3", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatStrikethrough("hello ~Andriy~ hello ~Julia~");
                expect(bold)
                    .toEqual("hello <span class='message-strikethrough'>Andriy</span> hello <span class='message-strikethrough'>Julia</span>");
            });
            it("text4", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatStrikethrough("~hello ~Andriy~ hello ~Julia~");
                expect(bold)
                    .toEqual("~hello <span class='message-strikethrough'>Andriy</span> hello <span class='message-strikethrough'>Julia</span>");
            });
        });
        describe("with html", function () {
            it("text2", function () {
                var accessor = new TextChatRoomAccessor(undefined, undefined, undefined, undefined);
                var bold = accessor.formatStrikethrough("~hello ~<span class='hello'>Andriy</span>~ hello ~Julia~");
                expect(bold)
                    .toEqual("~hello <span class='message-strikethrough'><span class='hello'>Andriy</span></span> hello <span class='message-strikethrough'>Julia</span>");
            });
        });
    });
})(UnitTests || (UnitTests = {}));
//describe("States helper", () => {
//	describe("found state", () => {
//	let statesHelper: Services.StatesHelper;
//	let $templateCache: ng.ITemplateCacheService;
//	let $state: ng.ui.IStateService;
//	beforeEach(angular.mock.module("app"));
//		// ReSharper disable InconsistentNaming
//		beforeEach(inject((_$httpBackend_: ng.IHttpBackendService,
//			_$state_: ng.ui.IStateService,
//			_$templateCache_: ng.ITemplateCacheService,
//			_statesHelper_: Services.StatesHelper) => {
//			// ReSharper restore InconsistentNaming
//		UnitTests.Helper.mockHttpService(_$httpBackend_);
//			statesHelper = _statesHelper_;
//		$templateCache = _$templateCache_;
//		$state = _$state_;
//		UnitTests.Helper.mockGeneratedTemplates($templateCache, "partials/SignUpDirective");
//		UnitTests.Helper.mockGeneratedTemplates($templateCache, "Partials/LogInDirective");
//	}));
//	it("getSateByName found", () => {
//		const foundState: State = statesHelper.getStateCopyByName(States.home.name);
//		expect(foundState.name).toEqual(States.home.name);
//	});
//	it("getSateByName not found", () => {
//		const foundState: State = statesHelper.getStateCopyByName("unknown");
//		expect(foundState).toBeUndefined();
//	});
//	});
//	describe("reset state", () => {
//		beforeEach(angular.mock.module("app"));	
//		it("one state with remote template", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetState(States.home.name);
//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith(States.home.name);
//			expect($templateCache.remove).toHaveBeenCalledTimes(1);
//			expect($templateCache.remove).toHaveBeenCalledWith(States.home.templateUrl);
//		});
//		it("one state without remote template", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetState(States.textChatRoomChinese.name);
//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith(States.textChatRoomChinese.name);
//			expect($templateCache.remove).not.toHaveBeenCalled();
//	});
//		it("reset all states", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetAllStates();
//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith("*");
//			let numberOfTempates =0;
//			angular.forEach(States, (state: State) => {
//				if (state.isRemoteTemplate) numberOfTempates++;
//			});
//			expect($templateCache.remove).toHaveBeenCalledTimes(numberOfTempates);
//		});
//});
//}); 
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.htmlEncode = function (text) {
        return $("<div />").text(text).html();
    };
    Helpers.isValidEmail = function (email) {
        var regex = /(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)/gi;
        return regex.test(email);
    };
    Helpers.isValidSkype = function (skype) {
        var regex = /^[a-zA-Z][a-zA-Z0-9\.,\-_]{5,31}$/gi;
        return regex.test(skype);
    };
    Helpers.wrapInDiv = function (text, className) {
        if (className === void 0) { className = ""; }
        var div = $("<div class=\"" + className + "\"/>").text(text);
        return $('<div/>').append(div).html();
    };
    Helpers.searchAndWrapInElement = function (text, searchFor, className, element) {
        if (element === void 0) { element = "span"; }
        var regex = new RegExp("\\b(" + Helpers.regExpEscape(searchFor) + "\\b)", "gi");
        // WARNING: $1 might not be properly encoded to be placed in a div
        return text.replace(regex, "<" + element + " class=\"" + className + "\">$1</" + element + ">");
    };
    Helpers.regExpEscape = function (str) {
        var specials = /[.*+?|()\[\]{}\\$^]/g;
        return str.replace(specials, "\\$&");
        // Another proposed approach (not evaluted or validated) : return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    };
    return Helpers;
}());
var ActiveTracker = (function () {
    function ActiveTracker(idleTimeoutInMs, deadTimeoutInMs, onBecomingActive, onBecomingIdle, onBecomingDead) {
        this.idleTimeoutInMs = idleTimeoutInMs;
        this.deadTimeoutInMs = deadTimeoutInMs;
        this.onBecomingActive = onBecomingActive;
        this.onBecomingIdle = onBecomingIdle;
        this.onBecomingDead = onBecomingDead;
        this.idleStatus = false;
        this.deadStatus = false;
        this.idleTimer = null;
        this.deadTimer = null;
    }
    Object.defineProperty(ActiveTracker.prototype, "isIdle", {
        get: function () { return this.idleStatus; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActiveTracker.prototype, "isDead", {
        get: function () { return this.deadStatus; },
        enumerable: true,
        configurable: true
    });
    ActiveTracker.prototype.markActive = function () {
        var _this = this;
        if (this.idleStatus)
            this.onBecomingActive();
        this.clear();
        this.idleStatus = false;
        this.deadStatus = false;
        this.idleTimer = setTimeout(function () { _this.idleStatus = true; _this.onBecomingIdle(); }, this.idleTimeoutInMs);
        this.deadTimer = setTimeout(function () { _this.deadStatus = true; _this.onBecomingDead(); }, this.deadTimeoutInMs);
    };
    ActiveTracker.prototype.clear = function () {
        clearTimeout(this.idleTimer);
        clearTimeout(this.deadTimer);
    };
    return ActiveTracker;
}());
var Set = (function () {
    function Set(failOnDuplicate) {
        var _this = this;
        if (failOnDuplicate === void 0) { failOnDuplicate = true; }
        this.failOnDuplicate = failOnDuplicate;
        this.array = [];
        this.add = function (value) {
            if (!_this.contains(value))
                _this.array.push(value);
            else if (_this.failOnDuplicate)
                throw ("Failed to add value to Set. Value already exists");
        };
        this.remove = function (value) { var index = _this.array.indexOf(value, 0); if (index > -1)
            _this.array.splice(index, 1); };
        this.contains = function (value) { return _this.array.indexOf(value) > -1; };
        this.any = function () { return _this.array.length !== 0; };
    }
    return Set;
}());
var Dashboard;
(function (Dashboard) {
    (function (TileFilterValue) {
        TileFilterValue[TileFilterValue["Promote"] = 1] = "Promote";
        TileFilterValue[TileFilterValue["Demote"] = 2] = "Demote";
    })(Dashboard.TileFilterValue || (Dashboard.TileFilterValue = {}));
    var TileFilterValue = Dashboard.TileFilterValue;
})(Dashboard || (Dashboard = {}));
/// <reference path="../dashboard/itilefilter.ts" />
/// <reference path="IUser.ts" />
/// <reference path="ILoginCredentials.ts" />
/// <reference path="IUser.ts" />
/// <reference path="loginServerResponse.ts" />
var Authentication;
(function (Authentication) {
    var AuthenticationService = (function () {
        // TODOLATER: This $inject could be used, and the Factory could be dropped (as in userService). Any reason to keep Factory()?
        //static $inject = ["$q", "$http", "$templateCache"]; 
        function AuthenticationService($http, userService, $templateCache, $log) {
            var _this = this;
            this.$http = $http;
            this.userService = userService;
            this.$templateCache = $templateCache;
            this.$log = $log;
            this.loginUrl = "/api/account/log-in";
            this.signUpUrl = "/api/account/sign-up";
            this.logoutUrl = "/api/account/log-out";
            this.stateToRedirect = { stateName: undefined, params: undefined };
            this.isAuthenticated = function () {
                return _this.userService.isUserExist();
            };
            this.login = function (credentials) {
                return _this.$http
                    .post(_this.loginUrl, credentials)
                    .then(
                // If success
                function (response) {
                    if (response.data.isAuthenticated)
                        _this.userService.create(response.data.userData);
                    return response.data;
                }, 
                // If failure
                function () {
                    _this.$log.ajaxError("LogInPostFailed");
                    return false;
                });
            };
            this.signUp = function (user) {
                return _this.$http.post(_this.signUpUrl, user).then(
                // If success
                function (response) {
                    if (response.data.isAuthenticated)
                        _this.userService.create(response.data.userData);
                    return response.data;
                }, 
                // If failure
                function () {
                    _this.$log.ajaxError("SignUpPostFailed");
                    return { isAuthenticated: false, message: { text: "Well! Could you try that again?" } };
                });
            };
            this.logout = function () {
                var userService = _this.userService;
                return _this.$http
                    .post(_this.logoutUrl, {})
                    .then(
                // If success
                function (response) {
                    if (response.data.isAuthenticated === false)
                        userService.create(undefined);
                    return response.data.isAuthenticated;
                }, 
                // If failure
                function () {
                    _this.$log.ajaxError("LogOutPostFailed");
                    return false;
                });
            };
            this.setStateToRedirect = function (stateName, params) {
                _this.stateToRedirect.stateName = stateName;
                _this.stateToRedirect.params = params;
            };
            this.getStateToRedirect = function () {
                return _this.stateToRedirect;
            };
        }
        AuthenticationService.factory = function () {
            var service = function ($http, userService, $templateCache, $log) {
                return new AuthenticationService($http, userService, $templateCache, $log);
            };
            service["$inject"] = ["$http", "userService", "$templateCache", "$log"];
            return service;
        };
        return AuthenticationService;
    }());
    Authentication.AuthenticationService = AuthenticationService;
})(Authentication || (Authentication = {}));
var FormInputsRegulator = (function () {
    function FormInputsRegulator() {
    }
    FormInputsRegulator.cleanFirstName = function (nameString) {
        if (nameString) {
            nameString = nameString.replace(FormInputsRegulator.firstNameStartRegExp, "")
                .replace(FormInputsRegulator.firstNameEndRegExp, "");
        }
        return nameString;
    };
    FormInputsRegulator.cleanLastName = function (nameString) {
        if (nameString) {
            nameString = nameString.trim()
                .replace(FormInputsRegulator.lastNameRegExp, "")
                .replace(FormInputsRegulator.lastNameStartTrimRegExp, "")
                .replace(FormInputsRegulator.lastNameEndTrimRegExp, "")
                .trim();
        }
        return nameString;
    };
    FormInputsRegulator.cleanLocation = function (locationString) {
        if (locationString) {
            locationString = locationString.trim()
                .replace(FormInputsRegulator.locationStartRegExp, "")
                .replace(FormInputsRegulator.locationEndRegExp, "")
                .replace(FormInputsRegulator.locationEndDotsRegExp, ".")
                .trim();
        }
        return locationString === "" ? undefined : locationString;
    };
    FormInputsRegulator.firstNameStartRegExp = /^[\u0020\\-]+/;
    FormInputsRegulator.firstNameEndRegExp = /[\u0020\\-]+$/;
    FormInputsRegulator.lastNameStartTrimRegExp = /^-+/;
    FormInputsRegulator.lastNameEndTrimRegExp = /-+$/;
    FormInputsRegulator.lastNameRegExp = /^\.+/;
    FormInputsRegulator.locationStartRegExp = /^[\u0020\.\(\),'&\\-]+/;
    FormInputsRegulator.locationEndRegExp = /[\u0020\(\),'&\\-]+$/;
    FormInputsRegulator.locationEndDotsRegExp = /\.{2,}$/;
    return FormInputsRegulator;
}());
/// <reference path="IUser.ts" />
var Authentication;
(function (Authentication) {
    var SignUpUser = (function () {
        function SignUpUser() {
            this.lookToLearnWithTextChat = true;
            this.lookToLearnWithVoiceChat = true;
            this.lookToLearnWithGames = true;
            this.lookToLearnWithMore = false;
        }
        return SignUpUser;
    }());
    Authentication.SignUpUser = SignUpUser;
})(Authentication || (Authentication = {}));
/// <reference path="../dashboard/itilefilter.ts" />
var Authentication;
(function (Authentication) {
    var UserService = (function () {
        function UserService($q, $http, $log, countersService) {
            var _this = this;
            this.$q = $q;
            this.$http = $http;
            this.$log = $log;
            this.countersService = countersService;
            this.isUserDataLoaded = false;
            this.isInitLoadingStarted = false;
            this.create = function (user) {
                _this.currentUser = user;
                if (!_this.currentUser) {
                    _this.countersService.resetCounter(Services.Counters.MailBox);
                    _this.countersService.resetCounter(Services.Counters.VoiceOut);
                }
                return _this.currentUser;
            };
            this.getInitUserDataAsync = function () {
                //Andiry: It prevents repted calls to server during changing states, before application get respond from server.
                if (_this.isInitLoadingStarted)
                    return;
                _this.isInitLoadingStarted = true;
                var deffered = _this.$q.defer();
                var httpPromise = _this.$http.get(Config.EndPoints.profileUrl);
                httpPromise.then(
                //Success user data loaded
                function (response) {
                    _this.isUserDataLoaded = true;
                    _this.isInitLoadingStarted = false;
                    if (response.data.isAuthenticated)
                        _this.handleAuthUserData(response.data);
                    deffered.resolve(response.data.isAuthenticated);
                }, 
                //Error during loading data
                function (arg) {
                    _this.currentUser = undefined;
                    _this.isInitLoadingStarted = false;
                    deffered.reject("Error during server request.");
                });
                return deffered.promise;
            };
            this.isUserExist = function () { return angular.isDefined(_this.currentUser); };
            this.getUserName = function () {
                var userName;
                if (_this.currentUser !== undefined) {
                    userName = _this.currentUser.firstName;
                }
                return userName;
            };
            this.getUser = function () { return angular.copy(_this.currentUser); };
            this.getUserBasicDetails = function () {
                if (angular.isUndefined(_this.currentUser))
                    return undefined;
                return {
                    firstName: _this.currentUser.firstName,
                    learns: _this.currentUser.learns,
                    knows: _this.currentUser.knows
                };
            };
            this.getTileFilters = function () { return _this.filters; };
        }
        UserService.prototype.update = function (profile) {
            var _this = this;
            return this.$http
                .post(Config.EndPoints.profileUrl, profile)
                .then(
            // If success
            function (response) {
                if (response.data.isUpdated)
                    _this.create(profile); // Update the local user with the change
                return response.data;
            }, 
            // If failure
            function () {
                _this.$log.ajaxError("PostProfile_PostFailed");
                return false;
            });
        };
        UserService.prototype.deleteUser = function (userData) {
            var _this = this;
            return this.$http
                .post(Config.EndPoints.postDeleteAccount, userData)
                .then(
            // If success
            function (response) {
                if (response.data.isSuccess) {
                    _this.currentUser = undefined;
                }
                return response.data;
            }, 
            // If failure
            function () {
                _this.$log.ajaxError("DeleteProfile_PostFailed");
                return false;
            });
        };
        UserService.prototype.resendEmailVerification = function () {
            return this.$http.get(Config.EndPoints.getResendEmailVerification).then(function () { return true; }, function () { return false; });
        };
        ;
        UserService.prototype.handleAuthUserData = function (serverResponse) {
            this.currentUser = angular.copy(serverResponse.userData);
            if (serverResponse.unreadMessagesCount) {
                this.countersService.setCounterValue(Services.Counters.MailBox, serverResponse.unreadMessagesCount);
            }
            if (serverResponse.unseenVoiceOutRequestsCount) {
                this.countersService.setCounterValue(Services.Counters.VoiceOut, serverResponse.unseenVoiceOutRequestsCount);
            }
            this.filters = {};
            if (serverResponse.tileFilters) {
                for (var i = 0; i < serverResponse.tileFilters.length; i++) {
                    this.filters[serverResponse.tileFilters[i].tileId] = serverResponse.tileFilters[i];
                }
            }
        };
        UserService.prototype.updateTileFilters = function () {
            var _this = this;
            var filtersToUpdate = Array();
            for (var f in this.filters) {
                filtersToUpdate.push(this.filters[f]);
            }
            return this.$http
                .post(Config.EndPoints.postTilesFilter, { filters: filtersToUpdate, userId: this.currentUser.userId })
                .then(function () { }, function () { _this.$log.ajaxWarn("UpdateTileFilters_PostFailed"); });
        };
        ;
        UserService.prototype.clearUserData = function () {
            this.currentUser = undefined;
            this.isUserDataLoaded = false;
        };
        UserService.prototype.setNoPrivateChat = function (bool) {
            this.currentUser.isNoPrivateChat = bool;
        };
        UserService.$inject = ["$q", "$http", "$log", "countersService"];
        return UserService;
    }());
    Authentication.UserService = UserService;
})(Authentication || (Authentication = {}));
/// <reference path="ILogInOrOutScope.ts" />
var Authentication;
(function (Authentication) {
    var LogInOrOutDirective = (function () {
        function LogInOrOutDirective(authService, userService, statesService, $log) {
            var _this = this;
            this.authService = authService;
            this.userService = userService;
            this.statesService = statesService;
            this.$log = $log;
            this.link = function ($scope, element) {
                $scope.isAuthenticated = _this.authService.isAuthenticated();
                $scope.hide = true;
                $scope.userName = _this.userService.getUserName();
                $scope.logOut = function (confirmMsg) {
                    if (confirm(confirmMsg) === false)
                        return;
                    _this.authService.logout().then(function () {
                        $scope.isAuthenticated = _this.authService.isAuthenticated();
                        $scope.userName = undefined;
                        _this.statesService.resetAllStates();
                        _this.statesService.goAndReload(States.home.name);
                    });
                };
                $scope.$watch(function () {
                    return _this.authService.isAuthenticated();
                }, function (isAuthenticated) {
                    $scope.isAuthenticated = isAuthenticated;
                    $scope.hide = isAuthenticated && ($scope.showLogOff != null && !$scope.showLogOff);
                    if ($scope.isAuthenticated) {
                        $scope.userName = _this.userService.getUserName();
                    }
                });
            };
            this.restrict = "E";
            this.scope = { showLogOff: "=" };
            this.templateUrl = "log-in-or-out-directive.tpl";
        }
        LogInOrOutDirective.factory = function () {
            var directive = function (authService, userService, statesService, $log) {
                return new LogInOrOutDirective(authService, userService, statesService, $log);
            };
            directive["$inject"] = ["authService", "userService", "statesService", "$log"];
            return directive;
        };
        return LogInOrOutDirective;
    }());
    Authentication.LogInOrOutDirective = LogInOrOutDirective;
})(Authentication || (Authentication = {}));
/// <reference path="ILogInScope.ts" />
var Authentication;
(function (Authentication) {
    var LogInDirective = (function () {
        function LogInDirective($timeout, authService, statesService, $log, serverResources) {
            var _this = this;
            this.$timeout = $timeout;
            this.authService = authService;
            this.statesService = statesService;
            this.$log = $log;
            this.serverResources = serverResources;
            this.link = function ($scope, element) {
                // Collect email used in an attempt to sign up with an already signed up email
                $scope.email = _this.statesService.params.emailOfExistingAccount;
                $scope.showExistingAccountAlert = $scope.email != undefined;
                $scope.validResult = new Authentication.LoginValidationResult();
                $scope.logIn = function () {
                    $scope.validResult.isEmailValid = true;
                    $scope.validResult.isPasswordValid = true;
                    $scope.isLogInFailed = false;
                    _this.$timeout(function () {
                        var credentials = { userName: $scope.email, password: $scope.password };
                        if (_this.validateForm($scope.logInForm, $scope.validResult)) {
                            _this.$log.appInfo("ValidLogInFormSubmitted", credentials);
                            _this.authService.login(credentials).then(function (loginServerResponse) {
                                if (loginServerResponse.isAuthenticated) {
                                    _this.statesService.resetAllStates();
                                    // TodoLater: This should simply be sent as stateParams (like emailOfExistingAccount) rather than storing it in authService!!!
                                    var stateToRedirect = _this.authService.getStateToRedirect();
                                    if (angular.isUndefined(stateToRedirect) || angular.isUndefined(stateToRedirect.stateName)) {
                                        stateToRedirect.stateName = States.home.name;
                                        stateToRedirect.params = undefined;
                                    }
                                    _this.statesService.goAndReload(stateToRedirect.stateName, stateToRedirect.params);
                                    _this.authService.setStateToRedirect(undefined, undefined);
                                }
                                else {
                                    $scope.isLogInFailed = true;
                                    // TodoLater: The server could simply send a string message rather than a code and the whole world would be better
                                    _this.serverResources.getServerResponseText(loginServerResponse.message.code)
                                        .then(function (serverMessage) { $scope.logInServerFailedMessage = serverMessage; });
                                }
                            });
                        }
                        else
                            _this.$log.appInfo("InvalidLogInFormSubmitted", credentials);
                    }, 250);
                };
                $scope.goToSignUp = function () { return _this.statesService.go(States.signup.name); };
            };
            this.validateForm = function (formController, validation) {
                validation.isEmailValid = formController.email.$valid;
                validation.isPasswordValid = formController.password.$valid;
                return validation.isEmailValid && validation.isPasswordValid;
            };
            this.restrict = "E";
            this.scope = {};
            this.templateUrl = "Partials/LogInDirective";
        }
        LogInDirective.factory = function () {
            var directive = function ($timeout, authService, statesService, $log, serverResources) {
                return new LogInDirective($timeout, authService, statesService, $log, serverResources);
            };
            directive["$inject"] = ["$timeout", "authService", "statesService", "$log", "serverResources"];
            return directive;
        };
        return LogInDirective;
    }());
    Authentication.LogInDirective = LogInDirective;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var LoginValidationResult = (function () {
        function LoginValidationResult() {
            this.isEmailValid = true;
            this.isPasswordValid = true;
        }
        return LoginValidationResult;
    }());
    Authentication.LoginValidationResult = LoginValidationResult;
})(Authentication || (Authentication = {}));
/// <reference path="../../validations/validation.ts" />
var Authentication;
(function (Authentication) {
    var SignUpFormValidation = (function () {
        function SignUpFormValidation(formCtrl, serverResources) {
            var _this = this;
            this.formCtrl = formCtrl;
            this.serverResources = serverResources;
            this.enabled = false;
            this.errors = {};
            serverResources.getAccountValidationErrors()
                .then(function (errorTransaltions) { _this.validationErrors = errorTransaltions; });
        }
        Object.defineProperty(SignUpFormValidation.prototype, "isEmailValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.email.$valid : true;
                if (!isValid)
                    this.errors["email"] = this.formCtrl.email.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isEmailCheckedValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.isEmailChecked.$valid : true;
                if (!isValid)
                    this.errors["isEmailChecked"] = this.formCtrl.isEmailChecked.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isPasswordValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.password.$valid : true;
                if (!isValid)
                    this.errors["password"] = this.formCtrl.password.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isReTypedPasswordValid", {
            get: function () {
                var isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.formCtrl.password.$modelValue === this.formCtrl.reTypedPassword.$modelValue);
                if (!isValid) {
                    this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isFormValid", {
            get: function () {
                this.errors = {};
                return !this.enabled ? true : this.isEmailCheckedValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "signUpClientError", {
            get: function () {
                //Andriy: Currently it's only for password errors, but it could be extended for others, just not clear how to show more then one errror message on sign up form.
                if (Object.keys(this.errors).length === 0)
                    return undefined;
                var passwordErrors = this.errors["password"];
                var errorText;
                if (passwordErrors) {
                    if (passwordErrors["minlength"])
                        errorText = this.validationErrors.passwordMinError;
                    else if (passwordErrors["maxlength"])
                        errorText = this.validationErrors.passwordMaxError;
                    else
                        errorText = this.validationErrors.defaultError;
                }
                else {
                    errorText = this.validationErrors.defaultError;
                }
                return errorText;
            },
            enumerable: true,
            configurable: true
        });
        return SignUpFormValidation;
    }());
    Authentication.SignUpFormValidation = SignUpFormValidation;
    var ProfileFormValidation = (function () {
        function ProfileFormValidation(formCtrl, user) {
            this.formCtrl = formCtrl;
            this.user = user;
            this.enabled = false;
        }
        Object.defineProperty(ProfileFormValidation.prototype, "isLearnsValid", {
            get: function () { return this.enabled ? this.user.learns : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isKnowsValid", {
            get: function () { return this.enabled ? this.user.knows : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isNameValid", {
            get: function () { return this.enabled ? this.isFirstNameValid && this.isLastNameValid : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFirstNameValid", {
            get: function () { return this.formCtrl.firstName.$valid && this.formCtrl.firstName.$modelValue.length >= 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isLastNameValid", {
            get: function () { return this.formCtrl.lastName.$valid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isGenderValid", {
            get: function () { return this.enabled ? this.user.gender : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isBirthDateValid", {
            get: function () { return this.enabled ? this.user.birthMonth && this.user.birthYear : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isCountryValid", {
            get: function () { return this.enabled ? this.user.country !== undefined : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFormValid", {
            get: function () {
                return !this.enabled ? true :
                    this.isLearnsValid && this.isKnowsValid && this.isNameValid
                        && this.isBirthDateValid && this.isCountryValid && this.isGenderValid;
            },
            enumerable: true,
            configurable: true
        });
        return ProfileFormValidation;
    }());
    Authentication.ProfileFormValidation = ProfileFormValidation;
})(Authentication || (Authentication = {}));
/// <reference path="../../References.d.ts" />
// TODOLATER: This is definitely not I18N-ready. Languages Text should be loaded from DB
var Languages;
(function (Languages) {
    // First Tier
    Languages.english = { id: 1, tier: 1, culture: "en", name: "english", text: "English" };
    Languages.spanish = { id: 2, tier: 1, culture: "es", name: "spanish", text: "Español" };
    Languages.french = { id: 3, tier: 1, culture: "fr", name: "french", text: "Français" };
    Languages.japanese = { id: 4, tier: 1, culture: "ja", name: "japanese", text: "日本語" };
    Languages.german = { id: 5, tier: 1, culture: "de", name: "german", text: "Deutsch" };
    Languages.italian = { id: 6, tier: 1, culture: "it", name: "italian", text: "Italiano" };
    Languages.chinese = { id: 7, tier: 1, culture: "zh-CN", name: "chinese", text: "中文" };
    Languages.russian = { id: 8, tier: 1, culture: "ru", name: "russian", text: "Русский" };
    Languages.portuguese = { id: 9, tier: 1, culture: "pt-BR", name: "portuguese", text: "Português" };
    Languages.korean = { id: 11, tier: 1, culture: "ko", name: "korean", text: "한국어" };
    // Second Tier
    Languages.arabic = { id: 10, tier: 2, culture: "##", name: "arabic", text: "العربية" };
    Languages.bengali = { id: 44, tier: 2, culture: "##", name: "bengali", text: "বাংলা" };
    Languages.bosnian = { id: 46, tier: 2, culture: "##", name: "bosnian", text: "Bosanski" };
    Languages.bulgarian = { id: 45, tier: 2, culture: "##", name: "bulgarian", text: "български" };
    Languages.cantonese = { id: 13, tier: 2, culture: "##", name: "cantonese", text: "广东话" };
    Languages.catalan = { id: 50, tier: 2, culture: "##", name: "catalan", text: "Català" };
    Languages.croatian = { id: 41, tier: 2, culture: "##", name: "croatian", text: "hrvatski" };
    Languages.czech = { id: 38, tier: 2, culture: "##", name: "czech", text: "Čeština" };
    Languages.danish = { id: 35, tier: 2, culture: "##", name: "danish", text: "Dansk" };
    Languages.dutch = { id: 15, tier: 2, culture: "##", name: "dutch", text: "Nederlands" };
    Languages.esperanto = { id: 63, tier: 2, culture: "##", name: "esperanto", text: "Esperanto" };
    Languages.finnish = { id: 30, tier: 2, culture: "##", name: "finnish", text: "Suomi" };
    Languages.greek = { id: 19, tier: 2, culture: "##", name: "greek", text: "ελληνικά" };
    Languages.hebrew = { id: 29, tier: 2, culture: "##", name: "hebrew", text: "עברית" };
    Languages.hindi = { id: 12, tier: 2, culture: "##", name: "hindi", text: "हिन्दी" };
    Languages.hungarian = { id: 36, tier: 2, culture: "##", name: "hungarian", text: "Magyar" };
    Languages.icelandic = { id: 47, tier: 2, culture: "##", name: "icelandic", text: "Íslenska" };
    Languages.indonesian = { id: 34, tier: 2, culture: "##", name: "indonesian", text: "Bahasa Indonesia" };
    Languages.irish = { id: 33, tier: 2, culture: "##", name: "irish", text: "Gaeilge" };
    Languages.lithuanian = { id: 57, tier: 2, culture: "##", name: "lithuanian", text: "Lietuvių" };
    Languages.norwegian = { id: 26, tier: 2, culture: "##", name: "norwegian", text: "Norsk" };
    Languages.persian = { id: 21, tier: 2, culture: "##", name: "persian", text: "فارسی" };
    Languages.polish = { id: 23, tier: 2, culture: "##", name: "polish", text: "Polski" };
    Languages.romanian = { id: 25, tier: 2, culture: "##", name: "romanian", text: "Română" };
    Languages.serbian = { id: 31, tier: 2, culture: "##", name: "serbian", text: "Српски/srpski" };
    Languages.slovak = { id: 56, tier: 2, culture: "##", name: "slovak", text: "Slovenčina" };
    Languages.slovenian = { id: 62, tier: 2, culture: "##", name: "slovenian", text: "Slovenščina" };
    Languages.swahili = { id: 43, tier: 2, culture: "##", name: "swahili", text: "Kiswahili" };
    Languages.swedish = { id: 18, tier: 2, culture: "##", name: "swedish", text: "Svenska" };
    Languages.tagalog = { id: 14, tier: 2, culture: "##", name: "tagalog", text: "Tagalog" };
    Languages.thai = { id: 22, tier: 2, culture: "##", name: "thai", text: "ไทย" };
    Languages.turkish = { id: 17, tier: 2, culture: "##", name: "turkish", text: "Türkçe" };
    Languages.ukrainian = { id: 55, tier: 2, culture: "##", name: "ukrainian", text: "Українська" };
    Languages.urdu = { id: 16, tier: 2, culture: "##", name: "urdu", text: "اُردُو" };
    Languages.vietnamese = { id: 27, tier: 2, culture: "##", name: "vietnamese", text: "Tiếng Việt" };
    Languages.languagesById = [];
    // First Tier
    Languages.languagesById[Languages.english.id] = Languages.english;
    Languages.languagesById[2] = Languages.spanish;
    Languages.languagesById[3] = Languages.french;
    Languages.languagesById[4] = Languages.japanese;
    Languages.languagesById[5] = Languages.german;
    Languages.languagesById[6] = Languages.italian;
    Languages.languagesById[7] = Languages.chinese;
    Languages.languagesById[8] = Languages.russian;
    Languages.languagesById[9] = Languages.portuguese;
    Languages.languagesById[11] = Languages.korean;
    // Second Tier
    Languages.languagesById[10] = Languages.arabic;
    Languages.languagesById[44] = Languages.bengali;
    Languages.languagesById[46] = Languages.bosnian;
    Languages.languagesById[45] = Languages.bulgarian;
    Languages.languagesById[13] = Languages.cantonese;
    Languages.languagesById[50] = Languages.catalan;
    Languages.languagesById[41] = Languages.croatian;
    Languages.languagesById[38] = Languages.czech;
    Languages.languagesById[35] = Languages.danish;
    Languages.languagesById[15] = Languages.dutch;
    Languages.languagesById[63] = Languages.esperanto;
    Languages.languagesById[30] = Languages.finnish;
    Languages.languagesById[19] = Languages.greek;
    Languages.languagesById[29] = Languages.hebrew;
    Languages.languagesById[12] = Languages.hindi;
    Languages.languagesById[36] = Languages.hungarian;
    Languages.languagesById[47] = Languages.icelandic;
    Languages.languagesById[34] = Languages.indonesian;
    Languages.languagesById[33] = Languages.irish;
    Languages.languagesById[57] = Languages.lithuanian;
    Languages.languagesById[26] = Languages.norwegian;
    Languages.languagesById[21] = Languages.persian;
    Languages.languagesById[23] = Languages.polish;
    Languages.languagesById[25] = Languages.romanian;
    Languages.languagesById[31] = Languages.serbian;
    Languages.languagesById[56] = Languages.slovak;
    Languages.languagesById[62] = Languages.slovenian;
    Languages.languagesById[43] = Languages.swahili;
    Languages.languagesById[18] = Languages.swedish;
    Languages.languagesById[14] = Languages.tagalog;
    Languages.languagesById[22] = Languages.thai;
    Languages.languagesById[17] = Languages.turkish;
    Languages.languagesById[55] = Languages.ukrainian;
    Languages.languagesById[16] = Languages.urdu;
    Languages.languagesById[27] = Languages.vietnamese;
    Languages.languagesStorage = {
        "english": Languages.english,
        "spanish": Languages.spanish,
        "french": Languages.french,
        "japanese": Languages.japanese,
        "german": Languages.german,
        "italian": Languages.italian,
        "chinese": Languages.chinese,
        "russian": Languages.russian,
        "portuguese": Languages.portuguese,
        "korean": Languages.korean,
        "arabic": Languages.arabic,
        "bengali": Languages.bengali,
        "bosnian": Languages.bosnian,
        "bulgarian": Languages.bulgarian,
        "cantonese": Languages.cantonese,
        "catalan": Languages.catalan,
        "croatian": Languages.croatian,
        "czech": Languages.czech,
        "danish": Languages.danish,
        "dutch": Languages.dutch,
        "esperanto": Languages.esperanto,
        "finnish": Languages.finnish,
        "greek": Languages.greek,
        "hebrew": Languages.hebrew,
        "hindi": Languages.hindi,
        "hungarian": Languages.hungarian,
        "icelandic": Languages.icelandic,
        "indonesian": Languages.indonesian,
        "irish": Languages.irish,
        "lithuanian": Languages.lithuanian,
        "norwegian": Languages.norwegian,
        "persian": Languages.persian,
        "polish": Languages.polish,
        "romanian": Languages.romanian,
        "serbian": Languages.serbian,
        "slovak": Languages.slovak,
        "slovenian": Languages.slovenian,
        "swahili": Languages.swahili,
        "swedish": Languages.swedish,
        "tagalog": Languages.tagalog,
        "thai": Languages.thai,
        "turkish": Languages.turkish,
        "ukrainian": Languages.ukrainian,
        "urdu": Languages.urdu,
        "vietnamese": Languages.vietnamese
    };
})(Languages || (Languages = {}));
var Enums;
(function (Enums) {
    var Gender = (function () {
        function Gender() {
        }
        Gender.female = "F";
        Gender.male = "M";
        return Gender;
    }());
    Enums.Gender = Gender;
})(Enums || (Enums = {}));
/// <reference path="../forminputsregulator.ts" />
/// <reference path="../../Enums/Languages.ts" />
/// <reference path="../../Enums/Genders.ts" />
/// <reference path="../IUser.ts" />
/// <reference path="../SignUpUser.ts" />
/// <reference path="FormValidations.ts" />
/// <reference path="ISignUpScope.ts" />
var Authentication;
(function (Authentication) {
    var SignUpDirective = (function () {
        function SignUpDirective($timeout, authService, statesService, $rootScope, $log, serverResources) {
            var _this = this;
            this.$timeout = $timeout;
            this.authService = authService;
            this.statesService = statesService;
            this.$rootScope = $rootScope;
            this.$log = $log;
            this.serverResources = serverResources;
            this.years = new Array();
            this.restrict = "E";
            this.scope = {};
            this.templateUrl = "/partials/SignUpDirective";
            this.link = function ($scope, element) {
                // Sign Up Resources
                $scope.months = _this.serverResources.getMonths();
                $scope.years = _this.years;
                $scope.languages = Languages.languagesById;
                $scope.countries = _this.serverResources.getCountries();
                //Sign Up data
                $scope.loading = false;
                $scope.user = new Authentication.SignUpUser(); // this.getInitUser();
                $scope.profileFormValidation = new Authentication.ProfileFormValidation($scope.profileForm, $scope.user);
                $scope.signUpFormValidation = new Authentication.SignUpFormValidation($scope.signUpForm, _this.serverResources);
                $scope.signUpFailedOnServer = false;
                $scope.setLearns = function (id) {
                    $scope.user.learns = id;
                    $scope.selectedLearns = $scope.languages[id];
                };
                $scope.setKnows = function (id) {
                    $scope.user.knows = id;
                    $scope.selectedKnows = $scope.languages[id];
                };
                $scope.setGenderAsMale = function () { return $scope.user.gender = Enums.Gender.male; };
                $scope.setGenderAsFemale = function () { return $scope.user.gender = Enums.Gender.female; };
                $scope.setMonth = function (index) {
                    $scope.user.birthMonth = $scope.months[index].id;
                    $scope.selectedMonth = $scope.months[index].text;
                };
                $scope.setCountry = function (c) {
                    $scope.user.country = c;
                    $scope.selectedCountry = $scope.countries[c];
                };
                $scope.submitProfile = function () {
                    $scope.profileFormValidation.enabled = true;
                    if ($scope.profileFormValidation.isFormValid) {
                        _this.$log.appInfo("ValidProfileFormSubmitted", { form: $scope.user });
                        _this.showModal();
                    }
                    else
                        _this.$log.appInfo("InvalidProfileFormSubmitted", { form: $scope.user });
                };
                $scope.signUp = function () {
                    $scope.signUpFailedOnServer = false;
                    $scope.signUpFormValidation.enabled = true;
                    if ($scope.signUpFormValidation.isFormValid === false) {
                        _this.$log.appInfo("InvalidSignUpFormSubmitted", { form: $scope.user });
                        return;
                    }
                    _this.$log.appInfo("ValidSignUpFormSubmitted", { form: $scope.user });
                    $scope.loading = true;
                    _this.authService.signUp($scope.user)
                        .then(function (data) {
                        $scope.loading = false;
                        if (data.isAuthenticated) {
                            _this.closeModal();
                            _this.statesService.resetAllStates();
                            _this.statesService.goAndReload(States.home.name /*, { validation: EmailConfirmStatuses.pending }*/);
                        }
                        else {
                            _this.handleSignUpFailure($scope, data);
                        }
                    });
                };
                $scope.cleanFirstName = function () {
                    $scope.user.firstName = FormInputsRegulator.cleanFirstName($scope.user.firstName);
                };
                $scope.cleanLastName = function () {
                    $scope.user.lastName = FormInputsRegulator.cleanLastName($scope.user.lastName);
                };
                $scope.cleanLocation = function () {
                    $scope.user.location = FormInputsRegulator.cleanLocation($scope.user.location);
                };
                // TODOLATER: A directive shouldn't know that the app has a $stateChangeStart event.
                // Andriy: I agree in general, directive can expose service which can maintain modal state
                //         Or add this functionality yo StatesHelper
                _this.$rootScope.$on("$stateChangeStart", function () {
                    if ((_this.modalElement.data("bs.modal") || {}).isShown) {
                        _this.closeModal();
                    }
                });
                _this.modalElement = element.find("#signUpModal");
            };
            this.showModal = function () {
                _this.modalElement.modal("show");
            };
            this.closeModal = function () {
                _this.modalElement.modal("hide");
                //Andriy: it's necessary to clenaup modal window, after temlates are deleted. 
                //Later for modal windows better to use angular-ui bootstrap for modal windows.
                $("body").removeClass("modal-open");
                $(".modal-backdrop").remove();
            };
            // TODOLATER: upper year should be dynamic (current year - 16)
            // TODOLATER: Make a module of this to be used in other places as well
            for (var i = 2000; i > 1920; i--) {
                this.years.push(i);
            }
        }
        SignUpDirective.prototype.handleSignUpFailure = function ($scope, serverResponse) {
            if (serverResponse.message.code === 2 /* EmailAlreadyInUse */) {
                this.handleExistingEamilFailure($scope.user.email);
            }
            else {
                $scope.signUpFailedOnServer = true;
                this.serverResources.getServerResponseText(serverResponse.message.code).then(function (serverMessage) {
                    $scope.signUpServerFailedMessage = serverMessage;
                });
            }
        };
        ;
        SignUpDirective.prototype.handleExistingEamilFailure = function (email) {
            this.statesService.resetState(States.signup.name); // This line doesn't do anything?! The state of the sign up is preserved when using the browser back up button
            var stateParams = { emailOfExistingAccount: email };
            this.statesService.go(States.login.name, stateParams);
        };
        SignUpDirective.factory = function () {
            var directive = function ($timeout, authService, statesService, $rootScope, $log, serverResources) {
                return new SignUpDirective($timeout, authService, statesService, $rootScope, $log, serverResources);
            };
            directive["$inject"] = ["$timeout", "authService", "statesService", "$rootScope", "$log", "serverResources"];
            return directive;
        };
        return SignUpDirective;
    }());
    Authentication.SignUpDirective = SignUpDirective;
})(Authentication || (Authentication = {}));
var Contacts;
(function (Contacts) {
    var ProfileModalController = (function () {
        function ProfileModalController($uibModalInstance, $state, user) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.$state = $state;
            this.goToPrivateRoom = function () {
                _this.$uibModalInstance.close();
                _this.$state.go(States.textChatRoomPrivate.name, { userId: _this.user.id });
            };
            this.user = user;
        }
        ProfileModalController.$inject = ["$uibModalInstance", "$state", "user"];
        return ProfileModalController;
    }());
    Contacts.ProfileModalController = ProfileModalController;
})(Contacts || (Contacts = {}));
/// <reference path="../Find/IMember.ts" />
/// <reference path="profilemodalcontroller.ts" />
var Contacts;
(function (Contacts) {
    var DashboardWidget = (function () {
        function DashboardWidget() {
            this.restrict = "E";
            this.scope = {};
            this.controller = DashboardWidgetController;
            this.controllerAs = "widget";
            this.templateUrl = "dashboard-widget-template.tpl"; //Andriy: placed in Partials/Dashboard.cshtml
        }
        DashboardWidget.prototype.link = function () { };
        ;
        return DashboardWidget;
    }());
    Contacts.DashboardWidget = DashboardWidget;
    var DashboardWidgetController = (function () {
        function DashboardWidgetController($scope, $uibModal, contactsService, userService, serverResources, $state) {
            this.$scope = $scope;
            this.$uibModal = $uibModal;
            this.contactsService = contactsService;
            this.serverResources = serverResources;
            this.$state = $state;
            this.sortUsersGetter = function (user) { return user.firstName; };
            this.$scope.languages = Languages.languagesById;
            this.$scope.countries = this.serverResources.getCountries();
            this.$scope.contacts = this.contactsService.contacts;
        }
        DashboardWidgetController.prototype.chooseMember = function (user) {
            this.$uibModal.open({
                templateUrl: "dashboard-modal-template.tpl",
                controller: Contacts.ProfileModalController,
                resolve: { user: function () { return user; } },
                controllerAs: "ctrl"
            });
        };
        DashboardWidgetController.prototype.sortUsersByKnows = function () { this.sortUsersGetter = function (user) { return Languages.languagesById[Number(user.knows)].text; }; };
        DashboardWidgetController.prototype.sortUsersByLearns = function () { this.sortUsersGetter = function (user) { return Languages.languagesById[Number(user.learns)].text; }; };
        DashboardWidgetController.$inject = ["$scope", "$uibModal", "contactsService", "userService", "serverResources", "$state"];
        return DashboardWidgetController;
    }());
    Contacts.DashboardWidgetController = DashboardWidgetController;
})(Contacts || (Contacts = {}));
var ContactUsCtrl = (function () {
    function ContactUsCtrl($scope, $http, $location, authService, statesService) {
        this.$scope = $scope;
        this.$http = $http;
        this.$location = $location;
        this.authService = authService;
        this.statesService = statesService;
        this.$scope.isAuthenticated = authService.isAuthenticated();
        this.disableValidation();
    }
    ContactUsCtrl.prototype.send = function () {
        var _this = this;
        if (!this.validateForm())
            return;
        this.$http.post(Config.EndPoints.postContactUsMessage, this.$scope.contactMessage)
            .then(function () { _this.statesService.closeState(States.contactUs.name); }, function (errorData) { throw new Error(errorData); });
    };
    ContactUsCtrl.prototype.validateForm = function () {
        this.$scope.isEmailInvalid = this.$scope.contactForm.email && !this.$scope.contactForm.email.$valid;
        this.$scope.isMessageInvalid = !this.$scope.contactForm.message.$valid;
        return !this.$scope.isEmailInvalid && !this.$scope.isMessageInvalid;
    };
    ContactUsCtrl.prototype.disableValidation = function () {
        this.$scope.isEmailInvalid = false;
        this.$scope.isMessageInvalid = false;
    };
    ContactUsCtrl.$inject = ["$scope", "$http", "$location", "authService", "statesService"];
    return ContactUsCtrl;
}());
var HomeFindBlockCtrl = (function () {
    function HomeFindBlockCtrl($scope, statesService) {
        var _this = this;
        this.$scope = $scope;
        this.statesService = statesService;
        this.$scope.findLanguages = {};
        this.$scope.languageChanged = function () {
            var knownId = _this.$scope.findLanguages.knownId;
            var learnId = _this.$scope.findLanguages.learnId;
            _this.statesService.go(States.findByLanguages.name, {
                known: (Languages.languagesById[knownId] && Languages.languagesById[knownId].name) || "any",
                learn: Languages.languagesById[learnId] && Languages.languagesById[learnId].name
            });
        };
    }
    HomeFindBlockCtrl.$inject = ["$scope", "statesService"];
    return HomeFindBlockCtrl;
}());
var TasbarButton = (function () {
    function TasbarButton(stateName, iconUrl, htmlText, hasCounter, disableClose) {
        this.stateName = stateName;
        this.iconUrl = iconUrl;
        this.htmlText = htmlText;
        this.hasCounter = hasCounter;
        this.disableClose = disableClose;
    }
    return TasbarButton;
}());
var TaskbarCtrl = (function () {
    function TaskbarCtrl($rootScope, $scope, $element, $timeout, $window, $sce, authService, $state) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.$window = $window;
        this.$sce = $sce;
        this.authService = authService;
        this.$state = $state;
        var resizeTimeout = null;
        // Set taskbar color
        $scope.darkColor = function () { return _this.authService.isAuthenticated(); };
        $scope.hasShadow = function () {
            var isUnderbarState = $state.includes(States.find.name) || $state.includes(States.voiceOut.name) || $state.includes(States.mailbox.name);
            return isUnderbarState && _this.authService.isAuthenticated();
        };
        $scope.logoCollapsed = false;
        $scope.isHomeCurrent = function () { return $state.current.name === States.home.name; };
        $scope.hideTaskBar = function () { return $state.current.name === States.signup.name; };
        $scope.buttonsOnTaskbar = [];
        $scope.showAlert = false;
        $rootScope.taskBarAlert = function (message) {
            $scope.alertMessage = message;
            $scope.showAlert = true;
        };
        $scope.addAppButton = function (btn) {
            $scope.buttonsOnTaskbar.push({
                stateName: btn.stateName,
                text: $sce.trustAsHtml(btn.htmlText),
                iconUrl: btn.iconUrl,
                disableClose: btn.disableClose,
                hasCounter: btn.hasCounter
            });
        };
        $scope.addAppButton(new TasbarButton(States.home.name, "/Images/Icons/taskbar-icon-dashboard-48.png", "Dashboard", false, true));
        $scope.addAppButton(new TasbarButton(States.textChat.name, "/Images/Icons/taskbar-icon-text-chat-48.png", "Text <br>Chat", true));
        $scope.addAppButton(new TasbarButton(States.mailbox.name, "/Images/Icons/taskbar-icon-mailbox-48.png", "Mail<br>Box", true));
        $scope.addAppButton(new TasbarButton(States.find.name, "/Images/Icons/taskbar-icon-find-48.png", "Members<br>Search"));
        $scope.addAppButton(new TasbarButton(States.profile.name, "/Images/Icons/taskbar-icon-profile-48.png", "Profile"));
        $scope.addAppButton(new TasbarButton(States.contactUs.name, "/Images/Icons/taskbar-icon-contact-us-48.png", "Contact<br>Us"));
        $scope.addAppButton(new TasbarButton(States.voiceOut.name, "/Images/Icons/taskbar-icon-voice-out.png", "Voice<br>Chat++", true));
        //$scope.addAppButton(new TasbarButton(States.network.name, "/Images/Icons/question_mark_40x60.png", "Network"));
        // ========= Automatic adjustment of icons in the taskbar =========
        // Not used for now, but could really be used later
        angular.element($window).bind("resize", function () {
            $timeout.cancel(resizeTimeout);
            resizeTimeout = $timeout($scope.spaceButtonsProperly, 500);
        });
        //$scope.$on("ngRepeatFinished", () => {
        //	$timeout($scope.spaceButtonsProperly, 0); // timeout used because even the $scope.$apply in the target function doesn't guarantee everything is renderer
        //});
        //$scope.onMouseEnterButton = indexOfEnteredButton => {
        //	$scope.spaceButtonsProperly(indexOfEnteredButton);
        //};
        //var collapsedLogoWidth = null;
        //var uncollapsedLogoWidth = null;
        $scope.spaceButtonsProperly = function (indexOfButtonToKeepUncollapsed) {
            // Collapse Hellolingo logo when space is scarce
            var maxWidth = $element.width();
            $scope.logoCollapsed = maxWidth < 480;
            //	// Get the maxWidth we can afford
            //	var maxWidth = $element.width() - $("#taskbar-right").outerWidth();
            //	// Collect Widths of logo and buttons
            //	if ($scope.logoCollapsed === false) {
            //		uncollapsedLogoWidth = $element.find("#site-logo").outerWidth();
            //		collapsedLogoWidth = uncollapsedLogoWidth - $element.find("#site-logo>img:nth-child(2)").outerWidth();
            //	}
            //	$scope.buttonsOnTaskbar.forEach((buttonDef, index) => {
            //		var button = $element.find(`#taskbarButton-${index}`);
            //		var buttonText = $element.find(`#taskbarButton-${index}>a>span`);
            //		if (buttonDef.collapsedWidth == undefined) {
            //			buttonDef.uncollapsedWidth = button.outerWidth();
            //			buttonDef.collapsedWidth = buttonDef.uncollapsedWidth - buttonText.outerWidth();
            //		}
            //	});
            //	// Reset List of Buttons to be collapsed
            //	var logoToBeCollapsed = false;
            //	$scope.buttonsOnTaskbar.forEach((buttonDef /*, index*/) => { buttonDef.toBeCollapsed = false; });
            //	// Find out which buttons should be collapsed to fit the maxWidth;
            //	var shortEnough = false, previousElementsWidth = undefined;
            //	do {
            //		var indexOfWidestButton, widthOfWidestButton = 0;
            //		var elementsWidth = logoToBeCollapsed ? collapsedLogoWidth : uncollapsedLogoWidth;
            //		$scope.buttonsOnTaskbar.forEach((buttonDef, index) => {
            //			var buttonWidth = buttonDef.toBeCollapsed ? buttonDef.collapsedWidth : buttonDef.uncollapsedWidth;
            //			elementsWidth += buttonWidth;
            //			if (index !== indexOfButtonToKeepUncollapsed && buttonWidth > widthOfWidestButton) {
            //				widthOfWidestButton = buttonWidth;
            //				indexOfWidestButton = index;
            //			}
            //		});
            //		// If buttons don't fit maxwidth, collapse a button, starting with home and then the widest button found
            //		if (elementsWidth >= maxWidth) {
            //			if (logoToBeCollapsed || indexOfButtonToKeepUncollapsed === "logo") {
            //				//TODOLATER: try replacing below with this JQuery.extend($scope.buttonsOnTaskbar[indexOfWidestButton], { collapsed: true, toBeCollapsed: true });
            //				const buttonDef = $scope.buttonsOnTaskbar[indexOfWidestButton];
            //				buttonDef.collapsed = buttonDef.toBeCollapsed = true;
            //			}
            //			if (indexOfButtonToKeepUncollapsed !== "logo") $scope.logoCollapsed = logoToBeCollapsed = true;
            //			Helper.safeApply($scope);
            //		} else shortEnough = true;
            //		// Check if we aren't in an infinite loop with no more possible button to collapse
            //		if (previousElementsWidth === elementsWidth) this.$log.appError("TaskBar_WidthOverflow");
            //		else previousElementsWidth = elementsWidth;
            //	} while (!shortEnough);
            //	// Uncollapse buttons that don't need to be collapsed anymore
            //	$scope.logoCollapsed = logoToBeCollapsed;
            //	$scope.buttonsOnTaskbar.forEach(buttonDef => { buttonDef.collapsed = buttonDef.toBeCollapsed; });
            //	Helper.safeApply($scope);
            //	// Animate the buttons to their final spot
            //	//$timeout(() => {
            //	//	var x = $element.find("#site-logo").outerWidth();
            //	//	$element.find(".taskbar-button").each(function() {
            //	//		if ($(this).css("visibility") === "hidden") { // new button freshly added
            //	//			$(this).css("visibility", "visible");
            //	//			$(this).hide(); // hide button
            //	//			$(this).animate({ left: x }, 0, "swing"); // place new button to its new spot
            //	//			$(this).show(300); // reveal button
            //	//		} else {
            //	//			$(this).animate({ left: /* "+="+ */ x }, 100, "swing"); // move existing element to its new spot
            //	//		}
            //	//		x += $(this).outerWidth();
            //	//	});
            //	//});
        };
        //// Testing Only
        //$scope.removeFirstButton = () => {
        //	$scope.buttonsOnTaskbar.splice(0, 1);
        //	$timeout($scope.spaceButtonsProperly, 0);
        //};
    }
    TaskbarCtrl.$inject = ["$rootScope", "$scope", "$element", "$timeout", "$window", "$sce", "authService", "$state"];
    return TaskbarCtrl;
}());
var Dashboard;
(function (Dashboard) {
    (function (TileType) {
        TileType[TileType["Header"] = 1] = "Header";
        TileType[TileType["Feature"] = 2] = "Feature";
        TileType[TileType["Widget"] = 4] = "Widget";
    })(Dashboard.TileType || (Dashboard.TileType = {}));
    var TileType = Dashboard.TileType;
})(Dashboard || (Dashboard = {}));
/// <reference path="tiletype.ts" />
/// <reference path="idashboardcategory.ts" />
/// <reference path="idashboardtile.ts" />
/// <reference path="idashboardviewmodel.ts" />
var Dashboard;
(function (Dashboard) {
    var DashboardController = (function () {
        function DashboardController($filter, userService) {
            this.$filter = $filter;
            this.userService = userService;
            var orderBy = $filter("orderBy");
            this.viewDashBoardCategories = orderBy(this.getDashboardItems().categories, "orderId");
            this.viewDashboardTiles = this.arrangeTiles(this.getDashboardItems());
        }
        //Andriy: I did this like method to be sure that i can get from here untouched items.
        DashboardController.prototype.getDashboardItems = function () {
            return {
                categories: [
                    { id: 1, orderId: 1, name: "PinAndDefault", title: "pinAndDefaultTitle" },
                    { id: 2, orderId: 3, name: "MoreFeatures", title: "moreFeaturesTitle" },
                    { id: 3, orderId: 2, name: "ContactList", title: "yourContactListTitle" }
                ],
                tiles: {
                    101: { categoryId: 1, id: 101, orderId: 1, name: "headerTile", type: Dashboard.TileType.Header, title: "title", description: "description" },
                    102: { categoryId: 1, id: 102, orderId: 5, name: "textChat", type: Dashboard.TileType.Feature, stateName: States.textChat.name, cssClass: "icon-text-chat", title: "title", description: "description" },
                    104: { categoryId: 1, id: 104, orderId: 20, name: "find", type: Dashboard.TileType.Feature, cssClass: "icon-find", title: "title", description: "description", stateName: States.findByLanguages.name },
                    105: { categoryId: 1, id: 105, orderId: 25, name: "mailbox", type: Dashboard.TileType.Feature, cssClass: "icon-mailbox", title: "title", description: "description", stateName: States.mailbox.name },
                    106: { categoryId: 1, id: 106, orderId: 30, name: "findBySharedTalk", type: Dashboard.TileType.Feature, stateName: States.findBySharedTalk.name, cssClass: "icon-find-by-sharedtalk", title: "title", description: "description", visibleTo: Dashboard.TileVisibility.SharedTalkMembers },
                    107: { categoryId: 1, id: 107, orderId: 35, name: "findByLivemocha", type: Dashboard.TileType.Feature, stateName: States.findByLivemocha.name, cssClass: "icon-find-by-livemocha", title: "title", description: "description", visibleTo: Dashboard.TileVisibility.LivemochaMembers },
                    108: { categoryId: 1, id: 108, orderId: 40, name: "aboutHellolingo", type: Dashboard.TileType.Feature, stateName: States.textChatRoomPublic.name, stateParams: { roomId: Config.TopicChatRooms.hellolingo.name }, cssClass: "icon-about-hellolingo", title: "title", description: "description" },
                    109: { categoryId: 1, id: 109, orderId: 45, name: "profile", type: Dashboard.TileType.Feature, stateName: States.profile.name, cssClass: "icon-profile", title: "title", description: "description" },
                    120: { categoryId: 1, id: 120, orderId: 10, name: "voiceOut", isNew: true, type: Dashboard.TileType.Feature, stateName: States.voiceOut.name, cssClass: "icon-voice-out", title: "title", description: "description" },
                    //Obsoleted
                    //103: { categoryId: 1, id: 103, orderId: 15, name: "VoiceChat", type: TileType.Feature, stateName: States.voiceOut.name, cssClass: "icon-voice-chat", title: "Voice Chat", description: "Practice speaking in your new language and reach greater fluency" },
                    110: { categoryId: 2, id: 110, orderId: 121, name: "yourResources", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-resources", title: "title", description: "description" },
                    114: { categoryId: 2, id: 114, orderId: 122, name: "advancedFind", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-advanced-find", title: "title", description: "description" },
                    111: { categoryId: 2, id: 111, orderId: 123, name: "yourFeatures", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-features", title: "title", description: "description" },
                    //124: { categoryId: 2, id: 124, orderId: 124, name: "Contacts", type: TileType.Feature, isPlanned: true, cssClass: "icon-contacts", title: "Your Partners", description: "A list for your awesome friends, best partners, and valuable contacts" },
                    123: { categoryId: 2, id: 123, orderId: 125, name: "i18N", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-i18n", title: "title", description: "description" },
                    112: { categoryId: 2, id: 112, orderId: 126, name: "yourMockups", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-mockups", title: "title", description: "description" },
                    122: { categoryId: 2, id: 122, orderId: 127, name: "reviewAndEdit", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-review-and-edit", title: "title", description: "description" },
                    119: { categoryId: 2, id: 119, orderId: 128, name: "modularChat", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-modular-chat", title: "title", description: "description" },
                    118: { categoryId: 2, id: 118, orderId: 129, name: "chatHistory", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-chat-history", title: "title", description: "description" },
                    117: { categoryId: 2, id: 117, orderId: 130, name: "learningContent", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-learning-content", title: "title", description: "description" },
                    121: { categoryId: 2, id: 121, orderId: 131, name: "games", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-games", title: "title", description: "description" },
                    113: { categoryId: 2, id: 113, orderId: 132, name: "iosApp", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-ios-app", title: "title", description: "description" },
                    125: { categoryId: 2, id: 125, orderId: 133, name: "windowsPhoneApp", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-windows-phone-app", title: "title", description: "description" },
                    126: { categoryId: 2, id: 126, orderId: 134, name: "androidApp", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-android-app", title: "title", description: "description" },
                    115: { categoryId: 2, id: 115, orderId: 135, name: "secretTool1", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "title", description: "description" },
                    116: { categoryId: 2, id: 116, orderId: 136, name: "secretTool2", type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "title", description: "description" },
                    601: { categoryId: 3, id: 601, orderId: 37, name: "contactList", type: Dashboard.TileType.Widget, cssClass: "contact-list", widgetDirective: "contacts-tile-widget", title: "Your contacts", description: "Connect with your friends in one click" }
                }
            };
        };
        DashboardController.prototype.viewSwitchInfoView = function () {
            this.viewShowTileInfo = !this.viewShowTileInfo;
        };
        DashboardController.prototype.viewSwitchPinMode = function () {
            this.viewIsPinMode = !this.viewIsPinMode;
            if (!this.viewIsPinMode) {
                this.viewDashboardTiles = this.arrangeTiles(this.getDashboardItems());
                this.userService.updateTileFilters();
            }
        };
        DashboardController.prototype.getTiles = function (dashboardObject) {
            var tiles = {};
            for (var _i = 0, _a = dashboardObject.categories; _i < _a.length; _i++) {
                var cat = _a[_i];
                tiles[cat.id] = new Array();
            }
            for (var tileId in dashboardObject.tiles) {
                var tile = dashboardObject.tiles[tileId];
                if (tiles[tile.categoryId])
                    tiles[tile.categoryId].push(tile);
            }
            return tiles;
        };
        DashboardController.prototype.applyCustomUserFilters = function (tiles) {
            var filters = this.userService.getTileFilters();
            if (filters) {
                for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
                    var tileId = _a[_i];
                    switch (filters[tileId].filterId) {
                        case Dashboard.TileFilterValue.Promote:
                            var tileToPromote = tiles[filters[tileId].tileId];
                            if (tileToPromote) {
                                tileToPromote.categoryId = 1;
                            }
                            break;
                        case Dashboard.TileFilterValue.Demote:
                            var tileToDemote = tiles[filters[tileId].tileId];
                            if (tileToDemote && tileToDemote.categoryId === 1) {
                                tileToDemote.categoryId = 2;
                            }
                            break;
                        default:
                    }
                }
            }
            return tiles;
        };
        DashboardController.prototype.sortTiles = function (tiles) {
            var orderBy = this.$filter("orderBy");
            for (var catId in tiles) {
                var tempHeaders = Array();
                var tempOther = Array();
                for (var i = 0; i < tiles[catId].length; i++) {
                    if (tiles[catId][i].type === Dashboard.TileType.Header)
                        tempHeaders.push(tiles[catId][i]);
                    else
                        tempOther.push(tiles[catId][i]);
                }
                tempHeaders = orderBy(tempHeaders, "orderId");
                tempOther = orderBy(tempOther, "orderId");
                tiles[catId] = tempHeaders.concat(tempOther);
            }
            return tiles;
        };
        DashboardController.prototype.arrangeTiles = function (items) {
            items.tiles = this.applyCustomUserFilters(items.tiles);
            var tiles = this.getTiles(items);
            var sortedTiles = this.sortTiles(tiles);
            return sortedTiles;
        };
        DashboardController.$inject = ["$filter", "userService"];
        return DashboardController;
    }());
    Dashboard.DashboardController = DashboardController;
})(Dashboard || (Dashboard = {}));
/// <reference path="dashboardcontroller.ts" />
var Dashboard;
(function (Dashboard) {
    var DashboardDirective = (function () {
        function DashboardDirective() {
            this.restrict = "E";
            this.scope = {};
            this.bindToController = {};
            this.templateUrl = "Partials/Dashboard";
            this.controller = Dashboard.DashboardController;
            this.controllerAs = "db";
            this.replace = true;
        }
        DashboardDirective.prototype.link = function () { };
        ;
        return DashboardDirective;
    }());
    Dashboard.DashboardDirective = DashboardDirective;
})(Dashboard || (Dashboard = {}));
/// <reference path="idashboardtile.ts" />
/// <reference path="idashboardtileviewmodel.ts" />
var Dashboard;
(function (Dashboard) {
    var DashboardTileController = (function () {
        function DashboardTileController($cookies, $log, $document, statesService, userService) {
            this.$cookies = $cookies;
            this.$log = $log;
            this.$document = $document;
            this.statesService = statesService;
            this.user = userService.getUser();
            this.viewIsTileShown = this.isTileShown();
        }
        DashboardTileController.prototype.viewOnTileClick = function () {
            if (this.viewTileObject.isPlanned)
                return;
            if (this.viewTileObject.type === Dashboard.TileType.Feature)
                this.statesService.go(this.viewTileObject.stateName, this.viewTileObject.stateParams);
        };
        DashboardTileController.prototype.isTileShown = function () {
            switch (this.viewTileObject.visibleTo) {
                case Dashboard.TileVisibility.SharedTalkMembers: return this.user.isSharedTalkMember;
                case Dashboard.TileVisibility.LivemochaMembers: return this.user.isLivemochaMember;
                default: return true;
            }
        };
        DashboardTileController.$inject = ["$cookies", "$log", "$document", "statesService", "userService"];
        return DashboardTileController;
    }());
    Dashboard.DashboardTileController = DashboardTileController;
})(Dashboard || (Dashboard = {}));
/// <reference path="dashboardtilecontroller.ts" />
var Dashboard;
(function (Dashboard) {
    var DashboardTileDirective = (function () {
        function DashboardTileDirective() {
            this.restrict = "E";
            this.scope = {};
            this.bindToController = {
                viewTileObject: "=tileObject",
                viewShowInfo: "=showInfo",
                viewIsPinMode: "=pinMode"
            };
            this.controller = Dashboard.DashboardTileController;
            this.controllerAs = "tile";
            this.templateUrl = "dashboard-tile-template.tpl";
        }
        DashboardTileDirective.prototype.link = function () { };
        ;
        return DashboardTileDirective;
    }());
    Dashboard.DashboardTileDirective = DashboardTileDirective;
})(Dashboard || (Dashboard = {}));
/// <reference path="dashboardtilecontroller.ts" />
var Dashboard;
(function (Dashboard) {
    var WidgetTileDirective = (function () {
        function WidgetTileDirective($parse, $compile, $injector) {
            var _this = this;
            this.$parse = $parse;
            this.$compile = $compile;
            this.$injector = $injector;
            this.restrict = "E";
            this.link = function (scope, element, attrs) {
                var directiveNameGetter = _this.$parse(attrs.directive);
                var directiveName = directiveNameGetter(scope);
                /*
                var directives = <ng.IDirective[]>$injector.get(directiveName);
                if (directives.length === 0) {
                    element.remove();
                    return;
                }
                
                var directive = directives[0];
                */
                var widget = _this.$compile("<" + directiveName + "></" + directiveName + ">")(scope);
                element.replaceWith(widget);
            };
        }
        WidgetTileDirective.$inject = ["$parse", "$compile", "$injector"];
        return WidgetTileDirective;
    }());
    Dashboard.WidgetTileDirective = WidgetTileDirective;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    (function (TileVisibility) {
        TileVisibility[TileVisibility["Everyone"] = 1] = "Everyone";
        TileVisibility[TileVisibility["SharedTalkMembers"] = 2] = "SharedTalkMembers";
        TileVisibility[TileVisibility["LivemochaMembers"] = 3] = "LivemochaMembers";
    })(Dashboard.TileVisibility || (Dashboard.TileVisibility = {}));
    var TileVisibility = Dashboard.TileVisibility;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var TilePinController = (function () {
        function TilePinController(userService) {
            this.userService = userService;
            this.viewIsPinned = this.category === 1;
        }
        TilePinController.prototype.viewOnPinClick = function ($event) {
            //Andriy: I believe it could be done better and more cleaner but can't find solution for now.
            var filter = this.userService.getTileFilters();
            $event.stopPropagation();
            this.viewIsPinned = !this.viewIsPinned;
            if (this.viewIsPinned) {
                if (this.category === 1) {
                    if (filter[this.id])
                        delete filter[this.id];
                }
                else {
                    if (filter[this.id])
                        delete filter[this.id];
                    else
                        filter[this.id] = { tileId: this.id, filterId: Dashboard.TileFilterValue.Promote };
                }
            }
            else {
                if (filter[this.id])
                    delete filter[this.id];
                else
                    filter[this.id] = { tileId: this.id, filterId: Dashboard.TileFilterValue.Demote };
            }
        };
        TilePinController.$inject = ["userService"];
        return TilePinController;
    }());
    Dashboard.TilePinController = TilePinController;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var TilePinDirective = (function () {
        function TilePinDirective() {
            this.restrict = "E";
            this.scope = {};
            this.bindToController = {
                viewIsPinMode: "=pinMode",
                category: "=tileCat",
                id: "=tileId"
            };
            this.controller = Dashboard.TilePinController;
            this.controllerAs = "pin";
            this.templateUrl = "dashboard-tile-pin-template.tpl";
            this.replace = true;
        }
        TilePinDirective.prototype.link = function () { };
        ;
        return TilePinDirective;
    }());
    Dashboard.TilePinDirective = TilePinDirective;
})(Dashboard || (Dashboard = {}));
var AllowPattern = (function () {
    function AllowPattern() {
        //Andriy: Key codes needed for this to work correctly in Firefox
        this.excludedKeyCodes = [
            37, 38, 39, 40,
            8,
            9,
            36, 35,
            46,
            13 //Enter
        ];
        this.restrict = "A";
        this.require = "?ngModel";
    }
    AllowPattern.prototype.compile = function () {
        var _this = this;
        return function (scope, element, attrs, ngModel) {
            element.bind("keypress propertychange keyup paste", function (event) {
                // Don't allow the char is it doesn't match the pattern
                var regex = new RegExp(attrs.allowPattern);
                if (event.type === "keypress" && event.ctrlKey === false && event.altKey === false) {
                    if (_this.excludedKeyCodes.indexOf(event.keyCode) === -1) {
                        var keyCodeChar = String.fromCharCode(event.which || event.keyCode);
                        if (!keyCodeChar.match(regex)) {
                            event.preventDefault();
                            return false;
                        }
                    }
                }
                // THIS IS DISABLED BECAUSE ngModel.$render(); INTERFERES WITH IME (JAPANESE)
                // AND PREVENT FROM TYPING ANYTHING. WHILE DISABLED, PEOPLE CAN PASTE ANY CHARACTER
                // THEY WANT AND IT WILL BE ACCEPTED.
                // Clean anything invalid in the string
                //var s = ngModel.$modelValue;
                //if (s) {
                //	s = s.replace(new RegExp(`.{1}`, "g"), (c) => {
                //		 return c.match(regex) ? c : "";
                //	});
                //}
                //ngModel.$setViewValue(s);
                //ngModel.$render();
                return true;
            });
        };
    };
    return AllowPattern;
}());
var FocusOnShow = (function () {
    function FocusOnShow($timeout) {
        var _this = this;
        this.$timeout = $timeout;
        this.restrict = "A";
        this.link = function ($scope, $element, $attr) {
            if ($attr.ngShow) {
                $scope.$watch($attr.ngShow, function (newValue) {
                    if (newValue === true)
                        _this.$timeout(function () {
                            var elt = $element.children().find("#" + $attr.focusOnShow);
                            //elt.attr("autofocus", ""); according JQuery documentation autofocus is not necessary here.
                            if (elt) {
                                //Andriy:if element disabled it's not possible to set focus. It happens often because during loading rooms input element is disabled.
                                elt.prop("disabled", false);
                                elt.focus();
                            }
                        }, 0);
                });
            }
        };
    }
    FocusOnShow.$inject = ["$timeout"];
    return FocusOnShow;
}());
var InputPreparer = (function () {
    function InputPreparer($cookies, serverResources) {
        var _this = this;
        this.$cookies = $cookies;
        this.serverResources = serverResources;
        this.restrict = "A";
        this.require = "?ngModel";
        this.link = function (scope, $element, $attr, ngModel) {
            _this.serverResources.getTextChatInputPrepareResources().then(function (translations) {
                scope.$watch($attr.inputType, function (newValue) {
                    var placeholder = "", text = "";
                    switch (newValue) {
                        case InputTypes.textInputType:
                            placeholder = translations.sayHi;
                            break;
                        case InputTypes.emailInputType:
                            placeholder = translations.yourEmail;
                            text = _this.$cookies.get(Config.CookieNames.sharedEmailAddress) || "";
                            break;
                        case InputTypes.skypeInputType:
                            placeholder = translations.yourSkypeId;
                            text = _this.$cookies.get(Config.CookieNames.sharedSkypeId) || "";
                            break;
                        case InputTypes.secretRoomInputType:
                            placeholder = translations.enterSecretRoom;
                            text = _this.$cookies.get(Config.CookieNames.sharedSecretRoom) || "";
                            break;
                    }
                    $element.attr("placeholder", placeholder).val(text);
                    ngModel.$setViewValue(text);
                });
            });
        };
    }
    InputPreparer.$inject = ["$cookies", "serverResources"];
    return InputPreparer;
}());
;
var LanguageSelectDirective = (function () {
    function LanguageSelectDirective(modalLanguagesService) {
        var _this = this;
        this.modalLanguagesService = modalLanguagesService;
        this.restrict = "AE";
        this.require = "ngModel";
        this.replace = true;
        this.scope = {
            languageChanged: "&"
        };
        this.template = ["<span class=\"language-select btn btn-default btn-stripped\" ng-click=\"setLangFilter()\">",
            "{{languageLabel()}}",
            "<span class=\"caret\"></span>",
            "</span>"].join("");
        this.link = function (scope, elem, attrs, modelCtrl) {
            scope.languages = Languages.languagesById;
            scope.languageLabel = function () {
                var langId = modelCtrl.$modelValue;
                return langId && scope.languages[langId].text ? scope.languages[langId].text : "               "; // !!! These are special non-breakable white spaces! Do not replace with normal spaces
            };
            scope.setLangFilter = function () {
                var currentLangId = modelCtrl.$modelValue;
                _this.modalLanguagesService.getLanguage(currentLangId, elem)
                    .then(function (langId) {
                    var haveChanged = langId !== modelCtrl.$modelValue;
                    modelCtrl.$setViewValue(langId);
                    if (scope.languageChanged && haveChanged)
                        scope.languageChanged();
                });
            };
        };
    }
    LanguageSelectDirective.$inject = ["modalLanguagesService"];
    return LanguageSelectDirective;
}());
/// <reference path="../References.d.ts" />
var LanguageSelectWidgetDIrective = (function () {
    function LanguageSelectWidgetDIrective($compile, serverResources) {
        var _this = this;
        this.$compile = $compile;
        this.serverResources = serverResources;
        this.restrict = "AE";
        this.scope = {
            setLanguage: "&",
            selectedLanguages: "="
        };
        this.template = function () {
            var template = "<h4 class='text-center'>{content}</h4>";
            var learLangFilterTempl = "<language-select ng-model=\"selectedLanguages.learnId\" language-changed=\"languageChanged('learn' );\"></language-select>";
            var knowLangFilterTempl = "<language-select ng-model=\"selectedLanguages.knownId\" language-changed=\"languageChanged('know' );\"></language-select>";
            var translatedResource = _this.serverResources.getVoiceOutLangugesFilter();
            translatedResource = translatedResource.replace("#learn#", learLangFilterTempl).replace("#know#", knowLangFilterTempl);
            template = template.replace("{content}", translatedResource);
            return template;
        };
        this.link = function (scope, elem, attrs) {
            scope.languageChanged = function (langFilter) {
                scope.setLanguage({
                    langFilter: langFilter
                });
            };
        };
    }
    LanguageSelectWidgetDIrective.$inject = ["$compile", "serverResources"];
    return LanguageSelectWidgetDIrective;
}());
var OnEnter = (function () {
    function OnEnter() {
        this.restrict = "A";
    }
    OnEnter.prototype.compile = function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () { scope.$eval(attrs.onEnter); });
                    event.preventDefault();
                }
            });
        };
    };
    return OnEnter;
}());
var OptionPicker = (function () {
    function OptionPicker($state) {
        this.$state = $state;
        this.scope = {
            chatRequests: "=",
            newChatRequestsCount: "=",
            newUsersCount: "=",
            isLobbyState: "=",
            isChatRequestsState: "=",
            options: "=",
            goToChatRequests: "&",
            optionClass: "@",
            highlightProperty: "@", highlightClass: "@",
            selectedId: "=", selectedClass: "@",
            goToLobby: "&",
            showSettings: "&"
        };
        this.templateUrl = "option-picker.tpl";
    }
    OptionPicker.prototype.showSettings = function () {
        debugger;
    };
    OptionPicker.$inject = ["$state"];
    return OptionPicker;
}());
var ShowDuringChangeState = (function () {
    function ShowDuringChangeState(spinnerService) {
        var _this = this;
        this.spinnerService = spinnerService;
        this.directiveLink = function ($scope, element) {
            $scope.showObject = _this.spinnerService.showSpinner;
            //element.removeClass("ng-hide");
            //this.$rootScope.$on("$stateChangeStart", () => {
            //    element.removeClass("ng-hide");
            //});
            //this.$rootScope.$on("$stateChangeSuccess", () => {
            //    element.addClass("ng-hide");
            //});
            //this.$rootScope.$on("$stateChangeError", () => {
            //    //Note:Andriy: For now in case of error during change state we show current status as is, we can add here some custom behaveiour
            //    element.addClass("ng-hide");
            //});
        };
        this.link = this.directiveLink;
        this.restrict = "A";
    }
    ShowDuringChangeState.factory = function () {
        var directive = function (spinnerService) {
            return new ShowDuringChangeState(spinnerService);
        };
        directive["$inject"] = ["spinnerService"];
        return directive;
    };
    return ShowDuringChangeState;
}());
/* Use ng-model or ng-checked + ng-toggle, but not ng-model + ng-toggle */
var SwitchDirective = (function () {
    function SwitchDirective($parse) {
        var _this = this;
        this.$parse = $parse;
        this.restrict = "AE";
        this.require = "?ngModel";
        this.replace = true;
        this.scope = {
            ngDisabled: "=",
            ngChecked: "=",
            name: "@",
            onLabel: "@",
            offLabel: "@"
        };
        this.template = ["<label for=\"{{::uniqueId}}\" class=\"switch\">",
            "<input type=\"checkbox\" id=\"{{::uniqueId}}\" class=\"switch-input\"",
            "ng-click=\"$event.stopPropagation()\" ng-model=\"checked\" ng-disabled=\"ngDisabled\">",
            "<div class=\"switch-label\">{{ checked ? onLabel : offLabel}}</div>",
            "</label>"].join("");
        this.link = function (scope, elem, attrs, modelCtrl) {
            scope.uniqueId = "checkbox-" + SwitchDirective.uniqueId++;
            var trueValue = true;
            var falseValue = false;
            // If defined set true value
            if (attrs.ngTrueValue !== undefined) {
                trueValue = attrs.ngTrueValue !== 'false' && (attrs.ngTrueValue === 'true' || attrs.ngTrueValue);
            }
            // If defined set false value
            if (attrs.ngFalseValue !== undefined) {
                falseValue = attrs.ngFalseValue !== 'false' && (attrs.ngFalseValue === 'true' || attrs.ngFalseValue);
            }
            // Check if name attribute is set and if so add it to the DOM element
            if (scope.name !== undefined) {
                elem.find(':checkbox').prop('name', scope.name);
            }
            scope.$watch('ngDisabled', function (newVal) {
                elem.toggleClass('disabled', newVal);
            });
            if (attrs.ngModel) {
                scope.modelCtrl = modelCtrl;
                // Update element when model changes
                scope.$watch('modelCtrl.$modelValue', function (newVal, oldVal) {
                    scope.checked = modelCtrl.$modelValue === trueValue;
                }, true);
                // On click swap value and trigger onChange function
                elem.click(function (e) {
                    if (scope.ngDisabled) {
                        e.preventDefault();
                        return;
                    }
                    if (modelCtrl.$modelValue === falseValue) {
                        modelCtrl.$setViewValue(trueValue);
                    }
                    else {
                        modelCtrl.$setViewValue(falseValue);
                    }
                });
            }
            else if (attrs.ngChecked) {
                var expressionHandler = _this.$parse(attrs.ngToggle);
                scope.$watch('ngChecked', function (newVal) {
                    scope.checked = newVal === trueValue;
                }, true);
                // On click swap value and trigger onChange function
                elem.click(function (e) {
                    if (scope.ngDisabled) {
                        e.preventDefault();
                        return;
                    }
                    var newVal = scope.checked ? falseValue : trueValue;
                    expressionHandler(scope.$parent, { $value: newVal });
                });
            }
        };
    }
    SwitchDirective.uniqueId = 1;
    SwitchDirective.$inject = ["$parse"];
    return SwitchDirective;
}());
/// <reference path="../helpers.ts" />
// =============== Tooltip Classes ===============
var Tooltip = (function () {
    function Tooltip() {
    }
    return Tooltip;
}());
var KeywordTooltip = (function () {
    function KeywordTooltip(label, text) {
        this.label = label;
        this.text = text;
        this.link = "";
        this.type = "abbr";
    }
    return KeywordTooltip;
}());
var LinkedKeywordTooltip = (function () {
    function LinkedKeywordTooltip(label, text, link) {
        this.label = label;
        this.text = text;
        this.link = link;
        this.type = "keyword";
    }
    return LinkedKeywordTooltip;
}());
var UrlTooltip = (function (_super) {
    __extends(UrlTooltip, _super);
    function UrlTooltip(text, label) {
        _super.call(this);
        this.text = text;
        this.label = label;
        this.type = "url";
        this.link = text;
    }
    return UrlTooltip;
}(Tooltip));
var EmailTooltip = (function (_super) {
    __extends(EmailTooltip, _super);
    function EmailTooltip(emailAddress, label) {
        _super.call(this);
        this.label = label;
        this.type = "email";
        this.text = emailAddress;
        this.link = "mailto:" + emailAddress;
    }
    return EmailTooltip;
}(Tooltip));
var SkypeTooltip = (function (_super) {
    __extends(SkypeTooltip, _super);
    function SkypeTooltip(skypeId, label) {
        _super.call(this);
        this.label = label;
        this.type = "skype";
        this.text = skypeId;
        this.link = "skype:" + skypeId + "?add";
    }
    return SkypeTooltip;
}(Tooltip));
var MessageTooltip = (function () {
    function MessageTooltip(label, text, type, link) {
        if (link === void 0) { link = ""; }
        this.label = label;
        this.text = text;
        this.type = type;
        this.link = link;
    }
    return MessageTooltip;
}());
var TextWithTooltips = (function () {
    function TextWithTooltips(text) {
        this.text = text;
        this.tooltips = new Array();
    }
    return TextWithTooltips;
}());
;
var TextChatRoom = (function () {
    function TextChatRoom($sce, $cookies, $timeout, serverResources, userService, chatUsersService, $state) {
        var _this = this;
        this.$sce = $sce;
        this.$cookies = $cookies;
        this.$timeout = $timeout;
        this.serverResources = serverResources;
        this.userService = userService;
        this.chatUsersService = chatUsersService;
        this.$state = $state;
        this.templateUrl = "text-chat-room.tpl";
        this.scope = {
            accessor: "=",
            roomId: "@",
            roomTitle: "@",
            localFirstName: "@",
            localLastName: "@",
            nameHighlightClass: "@",
            tooltipHighlightClass: "@",
            textPosted: "&",
            userTyping: "&",
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
            onInputKeyPress: "&",
            privateChatWith: "="
        };
        this.link = function (scope, element, attrs /*, ngModel: ng.INgModelController*/) {
            scope.accessor = new TextChatRoomAccessor(scope, _this.$sce, _this.$timeout, _this.$state);
            scope.element = element;
            scope.messages = [];
            scope.users = [];
            scope.languages = Languages.languagesById;
            scope.textInput = "";
            scope.loading = true;
            scope.inputType = InputTypes.textInputType;
            scope.inputNavType = null;
            scope.notifyUserTyping = function () { scope.userTyping(); };
            scope.isSideMenuOpen = false;
            scope.setFocusOnInput = setFocusOnInput;
            var inputField = $("#inputField", element); //Andriy:It's better to use class instead of id, because evry directive has this Id.
            function setFocusOnInput() {
                inputField[0].focus();
            }
            // Watch room state and focus on input field when it's ready
            scope.$watch("isActive && !loading", function (val) {
                // Don't focus on input field when we have audio call in requested state
                // because otherwise the appearing keyboard hides "Mic Authorization" dialog box at least on Android devices
                if (val && scope.callState !== "requested")
                    _this.$timeout(function () { return setFocusOnInput(); });
            });
            scope.postMessage = function (text) {
                if (!text)
                    return;
                // Process Sharing of SkypeId
                if (scope.inputType === InputTypes.emailInputType) {
                    if (Helpers.isValidEmail(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.translations["errorTitle"], TextChatRoom.translations["emailIsInvalid"], "error")]); // "error" is a css class :-(
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedEmailAddress, text);
                    text = JSON.stringify({ email: text });
                }
                // Process Sharing of Email
                if (scope.inputType === InputTypes.skypeInputType) {
                    if (Helpers.isValidSkype(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.translations["errorTitle"], TextChatRoom.translations["skypeIsInvalid"], "error")]);
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedSkypeId, text);
                    text = JSON.stringify({ skype: text });
                }
                // Process a secret room
                if (scope.inputType === InputTypes.secretRoomInputType) {
                    if (Config.Regex.secretRoom.test(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.translations["errorTitle"], TextChatRoom.translations["secretRoomIsInvalid"], "error")]);
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedSecretRoom, text);
                    text = JSON.stringify({ secretRoom: text });
                }
                // Add message to the local interface
                scope.accessor.addMessage(MessageOrigin.self, undefined, scope.localFirstName, scope.localLastName, text);
                scope.accessor.resetLastSeenMark();
                // Scrolling the text to the bottom
                // TODOLATER: This is a hack. Using scrollToBottom should be more appropriate, but it doesn't work
                setTimeout(function () {
                    $("#roomMessages", element)[0].scrollTop = $("#roomMessages", element)[0].scrollHeight + 999;
                }, 0);
                // Reset input field and return to text mode.
                scope.inputType = InputTypes.textInputType;
                scope.textInput = "";
                setFocusOnInput();
                // Raise event for posted message
                scope.textPosted({ text: text });
            };
            scope.addUserNameOrShowModal = function (message) {
                var filteredUsers = scope.users.filter(function (u) { return u.userId === message.userId; });
                var haveToInsertName = filteredUsers.length === 1 || !message.userId;
                if (haveToInsertName) {
                    var firstName = message.firstName;
                    if (firstName.toLowerCase() !== scope.localFirstName.toLowerCase())
                        scope.textInput = (scope.textInput + " " + firstName).trim();
                    setFocusOnInput();
                }
                else
                    scope.openModal({ userId: message.userId });
            };
            scope.showTooltip = function (tooltips) {
                // TODOLATER: Log attempts to display sentences with no tooltips
                scope.tooltips = tooltips;
                var tooltipEl = $("#tooltipMsg" + scope.roomId);
                if (tooltipEl.css("display") !== "none")
                    tooltipEl.finish().hide();
                tooltipEl.show().delay(5000).fadeOut(500);
            };
            scope.setInputType = function (type, $event) {
                var comeFromNonSharing = scope.inputType !== InputTypes.emailInputType &&
                    scope.inputType !== InputTypes.skypeInputType &&
                    scope.inputType !== InputTypes.secretRoomInputType &&
                    type === InputTypes.skypeInputType;
                scope.inputType = type;
                if (comeFromNonSharing) {
                    scope.toggleInputNav("share", $event);
                }
                else {
                    setFocusOnInput();
                }
            };
            scope.toggleInputNav = function (type, $event) {
                if ($event)
                    $event.stopPropagation();
                if (type === scope.inputNavType)
                    type = null;
                $("body").off("click.inputnav");
                scope.inputNavType = type;
                // TODOLATER: to angular animation
                //$(`div[id^=shareNav]`, element).delay(500).fadeIn();
                //$(`div[id^=inputNav]`, element).delay(500).fadeIn();
                $("div[id^=shareNav]", element).stop().fadeOut().fadeIn();
                $("div[id^=inputNav]", element).stop().fadeOut().fadeIn();
                // if we set inputNavType, attach one-time handler to the body to hide it on next click on anything
                if (scope.inputNavType)
                    $("body").one("click.inputnav", function (e) {
                        scope.toggleInputNav(null);
                        scope.$apply("inputNavType");
                    });
            };
            scope.showUserModal = function (userId) {
                if (!userId)
                    return;
                scope.openModal({ userId: userId, hideChatButton: scope.isPrivate });
            };
            // Little piece for chat messages scrolling
            scope.isMessagesOnBottom = true;
            scope.hasNewMessages = false;
            var scrollTimeoutPromise = null, messagesContainer = $("#roomMessages", element)[0];
            scope.scrollToBottom = function (mandatory) {
                if (mandatory === void 0) { mandatory = false; }
                if (mandatory)
                    scope.isMessagesOnBottom = true; // Forces it to true, otherwise the "new message" notification will flicker on reentering a room
                // Wrapped into timeout to prevent scrolling before final rendering of element view
                scrollTimeoutPromise = scrollTimeoutPromise || _this.$timeout(function () {
                    if (scope.isMessagesOnBottom || mandatory)
                        messagesContainer.scrollTop = messagesContainer.scrollHeight + 10;
                    scrollTimeoutPromise = null;
                }, 0, false);
            };
            // Watch for the visual state of the room
            if (attrs["ngShow"]) {
                scope.$parent.$watch(attrs["ngShow"], function (val) {
                    scope.isActive = val;
                    scope.scrollToBottom(true);
                });
            }
            else {
                scope.isActive = scope.isUndocked;
            }
            // Watch for scrolling and set isMessagesOnBottom to false if it was initiated by user and is ended not at the bottom
            element.find("#roomMessages").bind("scroll", function () {
                // allow some gap between current position and precise bottom
                var pxFromBottom = messagesContainer.scrollHeight - (messagesContainer.scrollTop + messagesContainer.clientHeight);
                _this.$timeout(function () {
                    scope.isMessagesOnBottom = pxFromBottom < 10;
                    if (scope.isMessagesOnBottom)
                        scope.hasNewMessages = false;
                });
            });
            scope.$watchCollection(function () { return scope.messages; }, function (newValue) {
                if (!newValue || !newValue.length)
                    return;
                scope.scrollToBottom(!scope.isActive);
                scope.hasNewMessages = scope.hasNewMessages || scope.messages[scope.messages.length - 1].origin === MessageOrigin.otherUser;
            });
            if (_this.scope.isPrivate) {
                // We scroll to bottom because the change in this collection can be the partner who starts or stops typing. Though it can also be when the users join/leaves the room.
                scope.$watch(function () { return scope.users; }, function () { return scope.scrollToBottom(); }, true);
                scope.$watch(function () { return _this.chatUsersService.onlineUsers; }, function (list) {
                    var found = false;
                    angular.forEach(list, function (user) { if (user.userId === scope.privateChatWith)
                        found = true; });
                    scope.isPartnerOnline = found;
                }, true);
            }
            // Watch window resizes to keep scroll at bottom
            window.addEventListener("resize", function () { return scope.scrollToBottom(true); }, false);
            scope.userId = _this.userService.getUser().userId;
        };
        this.injectTranslations();
    }
    TextChatRoom.getTextWithTooltips = function (text, keywords) {
        var result = new TextWithTooltips(text);
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
    };
    TextChatRoom.keywordsTooltips = function (text, keywordsTooltips) {
        var tooltips = [];
        angular.forEach(keywordsTooltips, function (tooltip) {
            var regex = new RegExp("\\b(" + Helpers.regExpEscape(tooltip.label) + "\\b)", "gi");
            if (regex.test(text))
                tooltips.push(tooltip);
        });
        return tooltips;
    };
    TextChatRoom.textWithUrlTooltips = function (text) {
        var result = new TextWithTooltips(text);
        var expression = /(https?:\/\/((?:www\.|(?!www))[^\s\.]+\.[^\s]{2,})|(www\.[^\s]+\.[^\s]{2,})|https?:\/\/([^\s]+))/gi; // Supports http://localhost
        var urls = text.match(new RegExp(expression.source, "gi"));
        angular.forEach(urls, function (url) {
            var properLink = url.toLowerCase().indexOf("http") === 0 ? url : "http://" + url;
            result.tooltips.push(new UrlTooltip(properLink, TextChatRoom.translations["visit"]));
            var reasonableUrl = url.length < 50 ? url : url.substr(0, 46) + "...";
            result.text = text.replace(url, reasonableUrl);
        });
        return result;
    };
    TextChatRoom.emailsTooltips = function (text) {
        var tooltips = [];
        var regex = /([a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]{2,4})/gi;
        var emails = text.match(regex);
        angular.forEach(emails, function (email) { tooltips.push(new EmailTooltip(email, TextChatRoom.translations["sendEmail"])); });
        return tooltips;
    };
    TextChatRoom.prototype.injectTranslations = function () {
        this.serverResources.getTextChatRoomResources()
            .then(function (translates) {
            TextChatRoom.keywords = [
                //new KeywordTooltip      ("brb"          , "Be right back"), // TODOLATER: Add link to Urban Dictionary
                //new KeywordTooltip      ("smh"          , "Shaking my head"),
                //new KeywordTooltip      ("afk"          , "Away from keyboard"),
                //new KeywordTooltip      ("asap"         , "As soon as possible"),
                new LinkedKeywordTooltip("SharedTalk", translates.sharedTalk, "https://www.quora.com/Why-is-Sharedtalk-closing-down"),
                new LinkedKeywordTooltip("Skype", translates.skype, "https://wikipedia.org/wiki/Skype")
            ];
            TextChatRoom.translations = {};
            TextChatRoom.translations["visit"] = translates.visit;
            TextChatRoom.translations["sendEmail"] = translates.sendEmail;
            TextChatRoom.translations["openWithSkype"] = translates.openWithSkype;
            TextChatRoom.translations["firstMessage"] = translates.firstMessage;
            TextChatRoom.translations["errorTitle"] = translates.errorTitle;
            TextChatRoom.translations["emailIsInvalid"] = translates.emailIsInvalid;
            TextChatRoom.translations["skypeIsInvalid"] = translates.skypeIsInvalid;
            TextChatRoom.translations["visitSecretRoom"] = translates.visitSecretRoom;
            TextChatRoom.translations["secretRoomIsInvalid"] = translates.secretRoomIsInvalid;
        });
    };
    TextChatRoom.$inject = ["$sce", "$cookies", "$timeout", "serverResources", "userService", "chatUsersService", "textChatRoomsService", "$state"];
    return TextChatRoom;
}());
;
var TextChatRoomAccessor = (function () {
    function TextChatRoomAccessor(scope, $sce, $timeout, $state) {
        var _this = this;
        this.scope = scope;
        this.$sce = $sce;
        this.$timeout = $timeout;
        this.$state = $state;
        this.lastMessage = null;
        this.formatBold = function (htmlText) { return _this.formatText(htmlText, "*", "message-bold"); };
        this.formatUnderline = function (htmlText) { return _this.formatText(htmlText, "_", "message-underline"); };
        this.formatStrikethrough = function (htmlText) { return _this.formatText(htmlText, "~", "message-strikethrough"); };
    }
    TextChatRoomAccessor.prototype.addMessage = function (origin, userId, firstName, lastName, text) {
        var _this = this;
        var message = new TextChatMessage(origin, userId, firstName, lastName, text);
        // Save last posted message
        this.lastMessage = text;
        // Get JSON from text, if any
        var json;
        try {
            json = JSON.parse(text);
        }
        catch (e) { }
        // Process Json, if any
        if (json) {
            if (json.skype) {
                message.tooltips.push(new SkypeTooltip(json.skype, TextChatRoom.translations["openWithSkype"]));
                message.text = json.skype;
                message.htmlText = Helpers.wrapInDiv(json.skype, "icon-skype");
            }
            else if (json.email) {
                message.tooltips.push(new EmailTooltip(json.email, TextChatRoom.translations["sendEmail"]));
                message.text = json.email;
                message.htmlText = Helpers.wrapInDiv(json.email, "icon-email");
            }
            else if (json.secretRoom) {
                message.tooltips.push(new UrlTooltip(this.$state.href(this.$state.get(States.textChatRoomCustom.name), { roomId: json.secretRoom } /*, {absolute: true}*/), TextChatRoom.translations["visitSecretRoom"]));
                message.text = json.secretRoom;
                message.htmlText = Helpers.wrapInDiv(json.secretRoom, "icon-key");
            }
            else if (json.audioStarted) {
                message.text = json.audioStarted;
                message.htmlText = Helpers.wrapInDiv(json.audioStarted, "audio-message audio-started");
            }
            else if (json.audioMessage) {
                message.text = json.email; // That line just doesn't make any sense
                message.htmlText = Helpers.wrapInDiv(json.audioMessage, "audio-message");
            }
            else if (json.noPrivateChat) {
                this.scope.isDisabled = true;
                if (json.noPrivateChat.length !== 0)
                    this.scope.isDisabledButIsReachable = true;
                this.scope.joinedPublicRooms = [];
                json.noPrivateChat.forEach(function (roomId) {
                    var title = null;
                    if (angular.isDefined(Config.TopicChatRooms.topicChatStorage[roomId]))
                        title = Config.TopicChatRooms.topicChatStorage[roomId].text;
                    else if (angular.isDefined(Languages.languagesStorage[roomId]))
                        title = Languages.languagesStorage[roomId].text;
                    if (title)
                        _this.scope.joinedPublicRooms.push({ title: title, url: _this.$state.href(_this.$state.get(States.textChatRoomPublic.name), { roomId: roomId }) });
                });
                return;
            }
            else
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
        // Add message (Either append it, or merge it to the previous one if the new and last message are from the local user)
        var lastMessage = this.scope.messages[this.scope.messages.length - 1];
        if (message.origin === MessageOrigin.self && lastMessage && lastMessage.origin === MessageOrigin.self)
            // Disabled for now, because the behavior gets inconsitent when posting emails or links and it interferes with recording the last message when leaving the room
            //this.scope.messages[this.scope.messages.length - 1].htmlText += "<br>" + message.htmlText;
            this.scope.messages.push(message);
        else {
            this.markLastMessageAsLastSeen();
            this.scope.messages.push(message);
        }
    };
    TextChatRoomAccessor.prototype.addUser = function (user) { this.scope.users.unshift(user); };
    TextChatRoomAccessor.prototype.removeUser = function (userId) { this.scope.users = this.scope.users.filter(function (user) { return user.userId !== userId; }); };
    TextChatRoomAccessor.prototype.resetLastSeenMark = function () {
        for (var i = 0; i < this.scope.messages.length - 1; i++) {
            if (this.scope.messages[i].lastSeen) {
                this.scope.messages[i].lastSeen = false;
                return true;
            }
        }
        return false;
    };
    TextChatRoomAccessor.prototype.hasLastSeenMark = function () {
        for (var i = 0; i < this.scope.messages.length - 1; i++)
            if (this.scope.messages[i].lastSeen)
                return true;
        return false;
    };
    TextChatRoomAccessor.prototype.markLastMessageAsLastSeen = function () {
        if (this.scope.messages.length !== 0 && !this.hasLastSeenMark())
            this.scope.messages[this.scope.messages.length - 1].lastSeen = true;
    };
    Object.defineProperty(TextChatRoomAccessor.prototype, "userCount", {
        get: function () { return this.scope.users.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextChatRoomAccessor.prototype, "loading", {
        set: function (b) { this.scope.loading = b; },
        enumerable: true,
        configurable: true
    });
    TextChatRoomAccessor.prototype.initForFirstVisit = function () {
        var _this = this;
        // This is a hack... but it caters to an immediate need in a quick and easy way
        if (this.scope.roomId === "hellolingo")
            this.$timeout(function () {
                _this.scope.accessor.addMessage(MessageOrigin.news, undefined, "", "", TextChatRoom.translations["firstMessage"]);
            }, 5000);
    };
    TextChatRoomAccessor.prototype.reset = function () {
        this.scope.messages = [];
        this.scope.users = [];
    };
    Object.defineProperty(TextChatRoomAccessor.prototype, "roomUsers", {
        get: function () { return this.scope.users; },
        enumerable: true,
        configurable: true
    });
    TextChatRoomAccessor.prototype.setFocusOnInput = function () {
        this.scope.setFocusOnInput();
    };
    TextChatRoomAccessor.prototype.formatMessage = function (htmlText) {
        if (htmlText) {
            htmlText = this.formatBold(htmlText);
            htmlText = this.formatUnderline(htmlText);
            htmlText = this.formatStrikethrough(htmlText);
        }
        return htmlText;
    };
    TextChatRoomAccessor.prototype.formatText = function (htmlText, formatSymbol, cssClass) {
        var escapedSymbol = formatSymbol === "*" ? "\\*" : formatSymbol;
        var regexp = new RegExp(escapedSymbol + "(?:[^" + formatSymbol + "\\s]{1}|[^" + formatSymbol + "\\s][^" + formatSymbol + "]*[^" + formatSymbol + "\\s])" + escapedSymbol, "g");
        //Andriy: I need here this strange cycle because otherwise RegExp doesn't work corectly.
        //http://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
        var match;
        do {
            match = regexp.exec(htmlText);
            if (match) {
                match.forEach(function (m) {
                    var boldFormat = m.substr(1, m.length - 2);
                    htmlText = htmlText.replace(m, "<span class='" + cssClass + "'>" + boldFormat + "</span>");
                });
            }
        } while (match);
        return htmlText;
    };
    return TextChatRoomAccessor;
}());
var TextChatRoomModel = (function () {
    function TextChatRoomModel(roomId, text, url, state, userId) {
        if (userId === void 0) { userId = null; }
        this.roomId = roomId;
        this.text = text;
        this.url = url;
        this.state = state;
        this.userId = userId;
        this.newMessagesCount = 0;
        this.isUndocked = false;
    }
    Object.defineProperty(TextChatRoomModel.prototype, "isPrivate", {
        get: function () { return this.userId != null; },
        enumerable: true,
        configurable: true
    });
    ;
    return TextChatRoomModel;
}());
// =============== Message Class ===============
var TextChatMessage = (function () {
    function TextChatMessage(origin, userId, firstName, lastName, text) {
        this.origin = origin;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.text = text;
        this.tooltips = [];
    }
    Object.defineProperty(TextChatMessage.prototype, "hasTooltip", {
        get: function () { return this.tooltips.length !== 0; },
        enumerable: true,
        configurable: true
    });
    return TextChatMessage;
}());
var Title = (function () {
    function Title($rootScope, serverResources) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.serverResources = serverResources;
        this.restrict = "E";
        this.link = function () {
            var listener = function (event, toState) {
                console.log(toState.title + " ===================");
                _this.$rootScope.title = toState.title;
            };
            _this.$rootScope.$on("$stateChangeSuccess", listener);
        };
    }
    Title.$inject = ["$rootScope", "serverResources"];
    return Title;
}());
var TooltipLink = (function () {
    function TooltipLink() {
        this.restrict = "A";
        this.scope = { tooltip: "=tooltipLink" };
        this.link = function (scope, $element, $attr) {
            var link = scope.tooltip.link;
            if (link) {
                if (link.toLowerCase().indexOf(window.location.origin) === 0)
                    $element.attr("href", link.substring(window.location.origin.length));
                else if (link.toLowerCase().indexOf("http") === 0)
                    $element.attr("target", "_blank").attr("href", link);
                else if (link.charAt(0) === "/")
                    $element.attr("href", link);
                else
                    $element.attr("href", link) //  Open others (email:, skype:)
                        .attr("onclick", "javascript:var tmp = window.onbeforeunload; window.onbeforeunload = null; window.location.href='" + link + "';  window.setTimeout(function () {window.onbeforeunload = tmp;}, 1000);");
            }
            else {
                $element.attr("target", "_self").attr("href", "javascript:void(0)");
            }
        };
    }
    return TooltipLink;
}());
;
var TrimPasswordDirective = (function () {
    function TrimPasswordDirective() {
        this.restrict = "A";
        this.require = "?ngModel";
        this.priority = 10;
    }
    TrimPasswordDirective.prototype.compile = function () {
        return function (scope, element, attrs, ngModel) {
            element.bind("input paste", function () {
                var s = ngModel.$viewValue;
                if (s === "") {
                    ngModel.$setViewValue(undefined);
                    ngModel.$render();
                }
            });
        };
    };
    return TrimPasswordDirective;
}());
/// <reference path="../../authentication/iuser.ts" />
/// <reference path="../../enums/countries.ts" />
/// <reference path="../../enums/languages.ts" />
var ProfileViewController = (function () {
    function ProfileViewController($scope, $attr, $http, $timeout, statesService, contactsService, serverResources) {
        var _this = this;
        this.$scope = $scope;
        this.$attr = $attr;
        this.$http = $http;
        this.$timeout = $timeout;
        this.statesService = statesService;
        this.contactsService = contactsService;
        this.serverResources = serverResources;
        this.languages = Languages.languagesById;
        this.countries = this.serverResources.getCountries();
        this.buttonLabels = {};
        if (this.loadProfile) {
            if (!this.user.id)
                this.user.id = this.getUserId();
            this.getMemberData(this.user.id);
        }
        this.serverResources.getProfileViewResources()
            .then(function (translate) {
            for (var resource in translate) {
                _this.buttonLabels[resource] = translate[resource];
            }
        });
    }
    // All of these are in the scope (provided from an external source) but aren't used here, so no need to declare them
    //showButtons          : boolean;
    //mailButton           : boolean;
    //chatButton           : boolean;
    //voiceChatButton      : boolean;
    //voiceOutInviteButton : boolean;
    //goToChat             : () => void;
    //goToVoiceChat        : () => void;
    //gotoVoiceoutInvite   : () => void;
    //muteButton: boolean;
    ProfileViewController.prototype.goToMailbox = function () {
        if (angular.isFunction(this.$scope.$parent.$close))
            this.$scope.$parent.$close();
        this.statesService.go(States.mailboxUser.name, { id: this.getUserId(), isNew: "new" });
    };
    ProfileViewController.prototype.getMemberData = function (memberId) {
        var _this = this;
        this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
            .success(function (member) {
            _this.user.firstName = member.firstName;
            _this.user.lastName = member.lastName;
            _this.user.gender = member.gender;
            _this.user.age = member.age;
            _this.user.learns = member.learns;
            _this.user.knows = member.knows;
            _this.user.isSharedTalkMember = member.isSharedTalkMember;
            _this.user.country = member.country;
            _this.user.learns2 = member.learns2;
            _this.user.knows2 = member.knows2;
            _this.user.introduction = member.introduction;
        })
            .error(function (errorData) {
            throw new Error(errorData);
        });
    };
    ProfileViewController.prototype.onPinClick = function (pinMsg, unpinMsg) {
        if (this.isUserPinned()) {
            this.contactsService.remove(this.getUserId());
            this.notify(unpinMsg);
        }
        else {
            if (!this.user.id)
                this.user.id = this.getUserId(); // wtf?!
            this.contactsService.add(this.user);
            this.notify(pinMsg);
        }
    };
    ProfileViewController.prototype.isUserPinned = function () {
        return !!this.user && this.contactsService.isUserInContacts(this.getUserId());
    };
    ProfileViewController.prototype.notify = function (message) {
        var _this = this;
        this.$timeout.cancel(this.notificationTimeout);
        this.notificationTimeout = this.$timeout(function () { return _this.showNotification = false; }, 3000);
        this.notification = message;
        this.showNotification = true;
    };
    ProfileViewController.prototype.getUserId = function () {
        if (!this.user)
            return undefined;
        return this.user.id || this.user.userId;
    };
    ProfileViewController.$inject = ["$scope", "$attrs", "$http", "$timeout", "statesService", "contactsService", "serverResources"];
    return ProfileViewController;
}());
var ProfileViewDirective = (function () {
    function ProfileViewDirective() {
        this.restrict = "E";
        this.scope = {};
        this.templateUrl = "profile-view-template.tpl";
        this.controller = ProfileViewController;
        this.controllerAs = "pv";
        this.bindToController = {
            user: "=",
            showButtons: "=" || false,
            chatButton: "=" || false,
            voiceChatButton: "=" || false,
            mailButton: "=" || false,
            isMailDimmed: "=" || false,
            isPinDimmed: "=" || false,
            voiceOutInviteButton: "=" || false,
            loadProfile: "=" || false,
            muteButton: "=" || false,
            goToChat: "&",
            goToVoiceChat: "&",
            gotoVoiceoutInvite: "&",
            isMuted: "&",
            switchUserMute: "&",
            chatButtonLabel: "@"
        };
        this.replace = true;
    }
    ProfileViewDirective.prototype.link = function () { };
    ;
    return ProfileViewDirective;
}());
var TaskButtonDirective = (function () {
    function TaskButtonDirective(countersService, $timeout, authService, $state, $stickyState, $log, statesService) {
        var _this = this;
        this.countersService = countersService;
        this.$timeout = $timeout;
        this.authService = authService;
        this.$state = $state;
        this.$stickyState = $stickyState;
        this.$log = $log;
        this.statesService = statesService;
        this.restrict = "AE";
        this.replace = true;
        this.scope = {
            buttonId: "=",
            iconUrl: "@",
            hideClose: "=",
            showCounter: "="
        };
        this.templateUrl = "task-button-template.tpl";
        this.link = function ($scope) {
            $scope.showButton = false;
            $scope.actionClick = function () {
                var stateToGo = $scope.buttonId;
                switch ($scope.buttonId) {
                    case States.mailbox.name:
                        _this.countersService.resetCounter(Services.Counters.MailBox);
                        break;
                    case States.textChat.name:
                        _this.countersService.resetCounter(Services.Counters.TextChat);
                        break;
                    case States.voiceOut.name:
                        if (_this.countersService.getCounterValue(Services.Counters.VoiceOut) > 0)
                            stateToGo = States.voiceOutRequests.name;
                        _this.countersService.resetCounter(Services.Counters.VoiceOut);
                        break;
                    default:
                        break;
                }
                _this.$log.appInfo("TaskBar_ChangeStateRequested", { stateName: stateToGo });
                if (!_this.$state.includes(stateToGo))
                    _this.$state.go(stateToGo);
            };
            $scope.isCurrentState = function () { return _this.$state.includes($scope.buttonId); };
            $scope.closeState = function () {
                _this.$log.appInfo("TaskBar_CloseStateRequested", { stateName: $scope.buttonId });
                _this.statesService.closeState($scope.buttonId);
            };
            $scope.isIconShown = function (stateName) { return _this.isIconShownOnTaskBar(stateName, _this.authService, _this.$state, _this.$stickyState); };
            if ($scope.showCounter) {
                $scope.$watch(function ($scope) {
                    return _this.isCounterValueChanged($scope.buttonId);
                }, function (newVal) {
                    $scope.showCounterBadge = false;
                    _this.$timeout(function () {
                        $scope.counterVal = newVal;
                        $scope.showButton = false;
                        $scope.hideClose = false;
                        $scope.showCounterBadge = !$scope.isCurrentState() && newVal > 0;
                        if ($scope.showCounterBadge) {
                            $scope.showButton = true;
                            $scope.hideClose = true;
                        }
                    }, 200); // TODOLATER: 200ms? why not 0ms? 
                });
            }
        };
    }
    TaskButtonDirective.prototype.isIconShownOnTaskBar = function (state, authService, $state, $stickyState) {
        var inactiveStates = $stickyState.getInactiveStates();
        if (state === States.home.name)
            return authService.isAuthenticated() && inactiveStates.length >= 1;
        var found = false;
        angular.forEach(inactiveStates, function (inactiveState) {
            if (inactiveState.name === state)
                found = true;
        });
        return found || $state.includes(state);
    };
    TaskButtonDirective.prototype.isCounterValueChanged = function (forState) {
        switch (forState) {
            case States.mailbox.name:
                return this.countersService.getCounterValue(Services.Counters.MailBox);
            case States.textChat.name:
                return this.countersService.getCounterValue(Services.Counters.TextChat);
            case States.voiceOut.name:
                return this.countersService.getCounterValue(Services.Counters.VoiceOut);
            default:
                return 0;
        }
    };
    TaskButtonDirective.$inject = ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log", "statesService"];
    return TaskButtonDirective;
}());
;
var UiCultureDropDown = (function () {
    function UiCultureDropDown($templateCache, authService, $stickyState, $state, modalService) {
        var _this = this;
        this.$templateCache = $templateCache;
        this.authService = authService;
        this.$stickyState = $stickyState;
        this.$state = $state;
        this.modalService = modalService;
        this.template = this.$templateCache.get("ui-culture-drop-down.tpl");
        this.i10NUnavailableStatusTemplate = "At this time, Hellolingo isn't available in #LANG#. Our members are actively translating Hellolingo in their preferred languages. Please <a href='/contact-us'>contact us</a> if you'd like to contribute to the #LANG# version of Hellolingo.";
        this.controller = ["$scope", "$cookies", function ($scope, $cookies) {
                $scope.uiCultures = {
                    // Text that doesn't appears only in languages other than English, because English is always fully localized:
                    //		"At this time, about 50% of Hellolingo is in Russian. We'll display text that hasn't been translated yet in English. Don't hesitate to contact us if you want to help complete the Russian version of Hellolingo."
                    "en": /* 100% */ { text: Languages.english.text, i10NStatus: "Hellolingo in English is made possible thanks to our members and friends:<br><br><strong>Olga 'Awesome' S.<br>Laura K.<br>Mark A.</strong>" },
                    "fr": /* 100% */ { text: Languages.french.text, i10NStatus: "Hellolingo est disponible en Français grâce à nos membres et amis:<br><br><strong>Claire Verday<br><a href='http://www.linkedin.com/in/bernardvanderydt' target='_blank'>Bernard Vanderydt</a></strong>" },
                    "pt-BR": /* 100% */ { text: Languages.portuguese.text, i10NStatus: "Hellolingo em Português é possível graças a nossos membros e amigos:<br><br><strong>Mark A.</strong>" /*+ "<br><br>Neste momento, por volta de <strong>56%</strong> do Hellolingo está em português. Os textos que ainda não foram traduzidos aparecerão em inglês.<br><br>Não deixe de <a href='/contact-us'>nos contactar</a> se quiser ajudar a completar a versão em português do Hellolingo."*/ },
                    "nl": /* 100% */ { text: Languages.dutch.text, i10NStatus: "Hellolingo in het Nederlands wordt mede mogelijk gemaakt door onze leden en vrienden:<br><br><strong>Poiet O.<br><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong>" /*+ "<br><br>Op dit moment is ongeveer <strong>98%</strong> van Hellolingo in het Nederlands. De tekst die nog niet is vertaald zal worden weergegeven in het Engels.<br><br>Aarzel niet <a href='/contact-us'>contact</a> met ons op te nemen indien u ons wilt helpen de nederlandse versie van Hellolingo te voltooien." */ },
                    "ko": /* 100% */ { text: Languages.korean.text, i10NStatus: "Hellolingo 한국어 버전 제작은 저희의 회원들과 친구들 덕분에 가능했습니다:<br><br><strong>Bona Sheen</strong>" /* "<br><br>현재, Hellolingo의 <strong>48%</strong> 정도가 한국어 버전으로 만들어져 있습니다. 아직 번역이 되지 않은 부분은 영문으로 표시될 것입니다. Hellolingo 한국어 버전 완성에 도움을 주고 싶으시다면, <a href='/contact-us'>망설이지 말고 저희에게 연락해주세요</a>." */ },
                    "es": /*  94% */ { text: Languages.spanish.text, i10NStatus: "Hellolingo en español es posible gracias a nuestros miembros y amigos:<br><br><strong>Quals & Co.</strong><br><br>En este momento, alrededor de un <strong>94%</strong> de Hellolingo está en español. Los textos que todavía no han sido traducidos aparecerán en inglés.<br><br>No dudes en <a href='/contact-us'>contactarnos</a> si quieres ayudar a completar la versión en español de Hellolingo." },
                    "ru": /*  70% */ { text: Languages.russian.text, i10NStatus: "Русская версия Hellolingo стала возможна благодаря нашим членам и друзьям:<br><br><strong>Olga 'Awesome' S.</strong><br><br>На данный момент, около <strong>70%</strong> сайта Hellolingo был переведен на русский язык. Текст, который ещё не был переведен, будет отображен на английском.<br><br>Если вы хотите помочь нам с переводом Русской версии Hellolingo, <a href='/contact-us'>свяжитесь с нами</a>!" },
                    "de": /*  56% */ { text: Languages.german.text, i10NStatus: "Hellolingo auf Deutsch wird mithilfe unserer Mitglieder und Freunde ermöglicht:<br><br><strong><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong><br><br>Zur Zeit sind rund <strong>56%</strong> von Hellolingo auf Deutsch. Die Teile des Textes, die noch nicht übersetzt sind, werden auf Englisch gezeigt.<br><br>Bitte <a href='/contact-us'>kontaktieren</a> Sie uns, wenn Sie helfen wollen, die deutsche Version von Hellolingo zu ergänzen." },
                    "zh-CN": /*  56% */ { text: Languages.chinese.text, i10NStatus: "谢谢我们的用户和朋友们的帮助，使Hellolingo能够被翻译成中文版本<br><br><strong>税诚 Alexander</strong><br><br>到现在为止，大约百分之56的Hellolingo已经被翻译成中文。我们将会把目前还未翻译部分的文本展示出来，如果您想帮助我们完成Hellolingo的中文部分，<a href='/contact-us'>请不要犹豫，赶快联系我们吧</a>" },
                    "it": /*  56% */ { text: Languages.italian.text, i10NStatus: "Hellolingo in italiano è reso possibile grazie ai nostri seguenti amici e membri:<br><br><strong>Alberto Fanciullacci</strong><br><br>Al momento circa il <strong>56%</strong> di Hellolingo è stato tradotto in italiano. Le parti che non sono ancora state tradotte verranno mostrate in inglese. Non esitare a <a href='/contact-us'>contattarci</a> se vuoi aiutarci a completare la versione italiana di Hellolingo." },
                    "et": /*  19% */ { text: Languages.esperanto.text, i10NStatus: "Hellolingo en Esperanto eblas danke al niaj membroj kaj amikoj:<br><br><strong>'sennoma nordulo'</strong><br><br>Momente, ĉirkaŭ <strong>19%</strong> de Hellolingo disponeblas en Esperanto. Teksto ne tradukita montriĝos angle.<br><br>Ne hezitu <a href='/contact-us'>kontakti</a> nin se vi volas kontribui al kompletigo de la tasko." },
                    "ja": { text: Languages.japanese.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Japanese") },
                    "cs": { text: Languages.czech.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Czech") },
                    "nb": { text: Languages.norwegian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Norwegian") },
                    // Credit Marcin for it and link to his mailbox
                    "pl": { text: Languages.polish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Polish") },
                    "ro": { text: Languages.romanian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Romanian") },
                    "fi": { text: Languages.finnish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Finnish") },
                    "sv": { text: Languages.swedish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Swedish") },
                    "vi": { text: Languages.vietnamese.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Vietnamese") },
                    "tr": { text: Languages.turkish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Turkish") },
                    "el": { text: Languages.greek.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Greek") },
                    "he": { text: Languages.hebrew.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Hebrew") },
                    "ar": { text: Languages.arabic.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Arabic") },
                    "fa": { text: Languages.persian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Persian") },
                    "hi": { text: Languages.hindi.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Hindi") },
                    "th": { text: Languages.thai.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Thai") }
                };
                $scope.uiCultureCode = Runtime.uiCultureCode;
                $scope.changeUiCultureTo = function (code, okButtonText) {
                    if (code !== Runtime.uiCultureCode) {
                        var targetCulture = $scope.uiCultures[code];
                        _this.modalService.open("<div class='i10nStatus'>" + targetCulture.i10NStatus + "<div>", [{ label: okButtonText, result: true, cssClass: "btn btn-success" }], false // Allows people to click the backdrop to close the window
                        ).then(function (confirmed) {
                            if (confirmed) {
                                $cookies.put(Config.CookieNames.oldUiCulture, Runtime.uiCultureCode); // TODOLATER: Extract cookie.put to Runtime
                                $cookies.put(Config.CookieNames.uiCulture, code);
                                Runtime.uiCultureCode = code;
                                location.reload();
                            }
                        });
                    }
                };
                $scope.isMember = function () { return _this.authService.isAuthenticated(); };
                $scope.isEnabled = function () {
                    return !_this.authService.isAuthenticated()
                        || ([States.home.name, States.livemocha.name, States.sharedTalk.name].some(function (s) { return s === _this.$state.current.name; })
                            && _this.$stickyState.getInactiveStates().length === 0);
                };
            }];
    }
    UiCultureDropDown.$inject = ["$templateCache", "authService", "$stickyState", "$state", "modalService"];
    return UiCultureDropDown;
}());
var InputTypes;
(function (InputTypes) {
    InputTypes.textInputType = "textInputType";
    InputTypes.emailInputType = "emailInputType";
    InputTypes.skypeInputType = "skypeInputType";
    InputTypes.secretRoomInputType = "secretRoomInputType";
})(InputTypes || (InputTypes = {}));
// TODOLATER: This is definitely not I18N-ready. Languages Text should be loaded from DB
var Years;
(function (Years) {
    Years.getYears = function (from, to) {
        if (from === void 0) { from = 1920; }
        if (to === void 0) { to = 2000; }
        if (from >= to) {
            throw Error("Year from must be less then year to.");
        }
        var years = new Array();
        for (var i = to; i > from; i--) {
            years.push(i);
        }
        return years;
    };
})(Years || (Years = {}));
var Filters;
(function (Filters) {
    (function (SortMembersBy) {
        SortMembersBy[SortMembersBy["id"] = 1] = "id";
        SortMembersBy[SortMembersBy["name"] = 2] = "name";
        SortMembersBy[SortMembersBy["country"] = 3] = "country";
        SortMembersBy[SortMembersBy["knows"] = 4] = "knows";
        SortMembersBy[SortMembersBy["learns"] = 5] = "learns";
    })(Filters.SortMembersBy || (Filters.SortMembersBy = {}));
    var SortMembersBy = Filters.SortMembersBy;
    function findMembersFilter($filter, serverResources) {
        var countries = serverResources.getCountries();
        return function (members, propertyToSort) {
            var orderByFilter = $filter("orderBy");
            switch (propertyToSort) {
                case SortMembersBy.name:
                    return orderByFilter(members, function (m) { return m.firstName; });
                case SortMembersBy.country:
                    return orderByFilter(members, function (m) { return countries[m.country].text; });
                case SortMembersBy.learns:
                    return orderByFilter(members, function (m) {
                        if (!Languages.languagesById[m.learns])
                            return undefined;
                        return Languages.languagesById[m.learns].text;
                    });
                case SortMembersBy.knows:
                    return orderByFilter(members, function (m) {
                        if (!Languages.languagesById[m.knows])
                            return undefined;
                        return Languages.languagesById[m.knows].text;
                    });
                default:
                    return orderByFilter(members, function (m) { return -m.id; });
            }
        };
    }
    Filters.findMembersFilter = findMembersFilter;
})(Filters || (Filters = {}));
/// <reference path="FindMembersFilter.ts" />
var Filters;
(function (Filters) {
    var app = angular.module("app.filters", []);
    // USAGE: ' ... | greaterThan:'myProp':value ' 
    // e.g.: ' ... | greaterThan:'age':16 ' ==>  item[age] > 16 
    //app.filter("greaterThan", () => (items, prop, val) => {
    //	var filtered = [];
    //	angular.forEach(items, item => { if (item[prop] > val) filtered.push(item); });
    //	return filtered;
    //});
    app.filter("findMembers", ["$filter", "serverResources", Filters.findMembersFilter]);
})(Filters || (Filters = {}));
/// <reference path="../References.d.ts" />
var Find;
(function (Find) {
    var FindMembersCtrl = (function () {
        function FindMembersCtrl($scope, $timeout, userService, statesService, membersService, $log, $uibModal, serverResources, findMembersFilter) {
            var _this = this;
            this.$timeout = $timeout;
            this.userService = userService;
            this.statesService = statesService;
            this.membersService = membersService;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.serverResources = serverResources;
            this.findMembersFilter = findMembersFilter;
            //  Used by view
            this.languages = Languages.languagesById;
            this.nameState = States.findByName;
            this.languagesState = States.findByLanguages;
            this.sharedTalkState = States.findBySharedTalk;
            this.livemochaState = States.findByLivemocha;
            this.languageSelect = { learnId: 1 };
            this.nameSelect = { isSharedTalkMember: false, isLivemochaMember: false };
            this.maybeHasMoreMembers = true;
            this.sortParam = Filters.SortMembersBy.id;
            this.loadingMoreMemebers = false;
            this.countries = serverResources.getCountries();
            this.user = this.userService.getUser();
            if (this.user) {
                $scope.isSharedTalkMember = this.user.isSharedTalkMember;
                $scope.isLivemochaMember = this.user.isLivemochaMember;
            }
            $scope.$on("$stateChangeSuccess", function (event, toState, toStateParams, fromState, fromStateParams) {
                // Exit if the current state isn't related to the this feature
                if (!_this.statesService.includes(States.find.name))
                    return;
                // Always make sure that the scrollable div has the focus, so that it can be scrolled directly with up/down pageUp/pageDown keys
                _this.$timeout(function () { $("#FindViewContent").focus(); }, 0);
                // Exit if there is nothing to change to prevents reloads/reset/scrollUp of the list
                var areParamsIdentical = (toStateParams.known === "" && toStateParams.learn === "") || (_this.lastStateParams && toStateParams.known === _this.lastStateParams.known && toStateParams.learn === _this.lastStateParams.learn);
                if (toState.name === _this.lastStateName && areParamsIdentical)
                    return;
                // Scroll the scrollable view to the top
                _this.$timeout(function () { $("#FindViewContent").scrollTop(0); }, 0);
                // Language search case
                if (toState.name === States.findByLanguages.name) {
                    if (!_this.lastStateName) {
                        var stateLangs = _this.getLanguagesFromState();
                        // If we don't have any languages specified in url and have authenticated user that came from some other place
                        // add his native language as a learn search criteria to embrace language exchange concept
                        if (!stateLangs.learnId && !stateLangs.knownId && _this.user) {
                            _this.languageSelect.learnId = _this.user.knows;
                            _this.goToLanguagesState();
                            return;
                        }
                        _this.loadUsersByLanguages();
                    }
                    else if (_this.lastStateName === States.findByLanguages.name)
                        _this.loadUsersByLanguages();
                    else
                        _this.goToLanguagesState(); // if we have already used search, go to state according to previous selection
                }
                if (toState.name === States.findByName.name && !_this.user)
                    _this.statesService.go(States.find.name);
                _this.lastStateName = toState.name;
                _this.lastStateParams = toStateParams;
                // Reset form
                _this.nameSelect.isLivemochaMember = false;
                _this.nameSelect.isSharedTalkMember = false;
                // Initialize find
                switch (statesService.current.name) {
                    case States.findByName.name:
                        _this.loadUsersByName();
                        break;
                    case States.findBySharedTalk.name:
                        _this.nameSelect.isSharedTalkMember = true;
                        _this.loadUsersByName();
                        break;
                    case States.findByLivemocha.name:
                        _this.nameSelect.isLivemochaMember = true;
                        _this.loadUsersByName();
                        break;
                }
            });
        }
        FindMembersCtrl.prototype.loadUsersByLanguages = function () {
            var _this = this;
            var stateLangs = this.getLanguagesFromState();
            this.languageSelect.learnId = stateLangs.learnId;
            this.languageSelect.knownId = stateLangs.learnId !== stateLangs.knownId ? stateLangs.knownId : undefined;
            this.membersService.getMembers({ learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId })
                .success(function (members) { _this.foundMembers = members; })
                .error(function (data) { _this.$log.appWarn("LoadUsersByLanguagesFailed", data); });
            this.maybeHasMoreMembers = true;
        };
        ;
        FindMembersCtrl.prototype.secondTierLangFilter = function (value) { return value.tier > 1; };
        ;
        FindMembersCtrl.prototype.setLearns = function (langId) {
            if (this.languageSelect.knownId === langId)
                this.languageSelect.knownId = undefined; // Prevent known language = to learned language
            // Set or clear the language selection
            this.languageSelect.learnId = this.languageSelect.learnId === langId ? undefined : langId;
            this.goToLanguagesState();
        };
        ;
        FindMembersCtrl.prototype.setKnows = function (langId) {
            if (this.languageSelect.learnId === langId)
                this.languageSelect.learnId = undefined; // Prevent learned language = to known language
            // Set or clear the language selection
            this.languageSelect.knownId = this.languageSelect.knownId === langId ? undefined : langId;
            this.goToLanguagesState();
        };
        ;
        FindMembersCtrl.prototype.updateSortParam = function (param) {
            this.sortParam = param;
        };
        FindMembersCtrl.prototype.showFoundMembers = function () {
            return this.findMembersFilter(this.foundMembers, this.sortParam);
        };
        FindMembersCtrl.prototype.goToLanguagesState = function () {
            this.statesService.go(States.findByLanguages.name, {
                known: (this.languageSelect.knownId && Languages.languagesById[this.languageSelect.knownId].name) || "any",
                learn: this.languageSelect.learnId && Languages.languagesById[this.languageSelect.learnId].name
            });
        };
        FindMembersCtrl.prototype.getLanguagesFromState = function () {
            var searchParams = this.statesService.getStateParams();
            var learnId = searchParams["learn"] && searchParams["learn"] !== "any" && Languages[searchParams["learn"]] ?
                Languages[searchParams["learn"]].id : undefined;
            var knownId = searchParams["known"] && searchParams["known"] !== "any" && Languages[searchParams["known"]] ?
                Languages[searchParams["known"]].id : undefined;
            return { learnId: learnId, knownId: knownId };
        };
        FindMembersCtrl.prototype.setMembership = function (target) {
            // Two memberships cannot be selected at once because the backend support lookup on only one at a time
            if (target === "SharedTalk")
                this.nameSelect.isLivemochaMember = false;
            else if (target === "Livemocha")
                this.nameSelect.isSharedTalkMember = false;
            this.loadUsersByName();
        };
        FindMembersCtrl.prototype.loadUsersByName = function () {
            var _this = this;
            this.membersService.getMembers(this.nameSelect) // Lose code: getMembers accept any kind of object... but namning matters for the server
                .success(function (members) { _this.foundMembers = members; })
                .error(function (data) { _this.$log.appWarn("LoadUsersByNameFailed", data); });
            this.maybeHasMoreMembers = true;
        };
        ;
        FindMembersCtrl.prototype.loadMoreUsers = function () {
            var _this = this;
            // Put the focus back on the list, because the load more button is gone and scrolling with the keyboard is gone with it
            $("#FindViewContent").focus();
            var isFindByLanguagesState = this.statesService.current.name === States.findByLanguages.name;
            var currentSearchParams = isFindByLanguagesState ? { learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId }
                : this.nameSelect;
            var belowId = this.getLowestMemberId();
            var searchParams = angular.extend({ belowId: belowId }, currentSearchParams);
            this.loadingMoreMemebers = true;
            this.membersService.getMembers(searchParams)
                .success(function (members) {
                if (members && members.length > 0) {
                    Array.prototype.push.apply(_this.foundMembers, members);
                    if (members.length < 100)
                        _this.maybeHasMoreMembers = false;
                }
                else {
                    _this.maybeHasMoreMembers = false;
                }
                _this.loadingMoreMemebers = false;
            })
                .error(function (data) { _this.$log.appWarn("LoadMoreUsersFailed", data); _this.loadingMoreMemebers = false; });
        };
        FindMembersCtrl.prototype.chooseMember = function (member) {
            if (!this.user || this.user.userId !== member.id) {
                this.selectedMember = member;
                this.showUserProfileModal();
            }
        };
        FindMembersCtrl.prototype.contactMember = function ($event) {
            $event.stopPropagation();
            this.statesService.go(States.mailboxUser.name, { id: this.selectedMember.id, isNew: "new" });
        };
        FindMembersCtrl.prototype.showUserProfileModal = function () {
            var _this = this;
            this.$uibModal.open({
                templateUrl: this.user ? "find-modal-user-template.tpl" : "find-modal-anonimus-template.tpl",
                controller: function () { return { user: _this.selectedMember }; },
                controllerAs: "ctrl"
            });
        };
        FindMembersCtrl.prototype.getLowestMemberId = function () {
            var memberWithLowestId = this.foundMembers.reduce(function (p, v) { return p.id < v.id ? p : v; });
            return memberWithLowestId.id;
        };
        FindMembersCtrl.$inject = ["$scope", "$timeout", "userService", "statesService", "membersService", "$log", "$uibModal", "serverResources", "findMembersFilter"];
        return FindMembersCtrl;
    }());
    Find.FindMembersCtrl = FindMembersCtrl;
})(Find || (Find = {}));
var InvitePopup;
(function (InvitePopup) {
    var InvitePopupCtrl = (function () {
        function InvitePopupCtrl($state, textHubService) {
            this.$state = $state;
            this.textHubService = textHubService;
            this.languages = Languages.languagesById;
        }
        InvitePopupCtrl.prototype.close = function () {
            this.textHubService.emit("servicePostTo", this.invite.user.userId, 5, undefined);
            this.invite.isNew = false;
            this.showPopup = false;
        };
        InvitePopupCtrl.prototype.goToInvitations = function () {
            this.showPopup = false;
            this.$state.go(States.textChatInvites.name);
        };
        InvitePopupCtrl.prototype.acceptInvitation = function () {
            this.showPopup = false;
            this.joinPrivateRoom({ user: this.invite.user });
        };
        InvitePopupCtrl.$inject = ["$state", "textHubService"];
        return InvitePopupCtrl;
    }());
    InvitePopup.InvitePopupCtrl = InvitePopupCtrl;
})(InvitePopup || (InvitePopup = {}));
var InvitePopup;
(function (InvitePopup) {
    var InvitePopupDirective = (function () {
        function InvitePopupDirective() {
            this.restrict = "E";
            this.templateUrl = "text-chat-invite-popup.tpl";
            this.link = function ($scope, element, attr) { };
            this.controller = InvitePopup.InvitePopupCtrl;
            this.controllerAs = "ctrl";
            this.bindToController = {
                showPopup: "=",
                invite: "=",
                joinPrivateRoom: "&"
            };
            this.replace = true;
        }
        return InvitePopupDirective;
    }());
    InvitePopup.InvitePopupDirective = InvitePopupDirective;
})(InvitePopup || (InvitePopup = {}));
var InvitePopup;
(function (InvitePopup) {
    var module = angular.module("app.invitePopup", []);
    module.directive("invitePopup", function () { return new InvitePopup.InvitePopupDirective(); });
})(InvitePopup || (InvitePopup = {}));
var MailBox;
(function (MailBox) {
    (function (MailStatus) {
        MailStatus[MailStatus["Draft"] = 1] = "Draft";
        MailStatus[MailStatus["Sent"] = 2] = "Sent";
        MailStatus[MailStatus["Unread"] = 10] = "Unread";
        MailStatus[MailStatus["Read"] = 11] = "Read";
        MailStatus[MailStatus["Archived"] = 20] = "Archived";
    })(MailBox.MailStatus || (MailBox.MailStatus = {}));
    var MailStatus = MailBox.MailStatus;
    ;
    var MailBoxCtrl = (function () {
        function MailBoxCtrl($scope, $http, $filter, $q, $timeout, statesService, userService, mailboxServerService, modalService, serverResources, spinnerService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$filter = $filter;
            this.$q = $q;
            this.$timeout = $timeout;
            this.statesService = statesService;
            this.userService = userService;
            this.mailboxServerService = mailboxServerService;
            this.modalService = modalService;
            this.serverResources = serverResources;
            this.spinnerService = spinnerService;
            this.defaultHistoryLoadStep = 3;
            this.defaultMessagesOnPage = 3;
            this.logger = new Services.EnhancedLog(); // Trying a new approach to logging. It doesn't use injection. I'm not sure that's a good idea
            this.mailCount = 0;
            this.i18NStrings = {};
            this.isInboxLoading = false;
            // Used in the view
            this.messages = {};
            this.newMessage = { text: undefined, replyToMailId: undefined };
            this.isNewMessageOpen = false;
            this.showInsertPopup = false;
            this.sendingMessage = false;
            this.isInboxVisible = function () { return _this.statesService.is(States.mailboxInbox.name); };
            this.isArchivesVisible = function () { return _this.statesService.is(States.mailboxArchives.name); };
            this.isEmailVisible = function () { return _this.statesService.is(States.mailboxUser.name); };
            this.isNoMessagesInThread = function () {
                return !_this.currentMember || !_this.messages[_this.currentMember.id] || _this.messages[_this.currentMember.id].length === 0;
            };
            // Get localized strings
            this.serverResources.getMailboxResources().then(function (strings) { return _this.i18NStrings = strings; });
            $scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, function (event, toState, toStateParam) {
                switch (toState.name) {
                    case States.mailboxUser.name:
                        _this.initMemberMailBoxState(toStateParam);
                        break;
                    case States.mailboxInbox.name:
                    case States.mailboxArchives.name:
                        _this.initMailBoxState(toStateParam);
                        break;
                }
            });
            this.validator = new MailBox.MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18NStrings["mailbox.messageTextRequired"]);
        }
        MailBoxCtrl.prototype.startNewMessage = function () {
            //this is switch state to mailboxUser with "new" just to open textarea.
            var currentMemberId = this.currentMember.id;
            var stateParam = { id: currentMemberId, isNew: "new" };
            this.statesService.go(States.mailboxUser.name, stateParam);
        };
        MailBoxCtrl.prototype.sendMessageToServer = function () {
            var _this = this;
            if (!this.validator.isEnabled) {
                this.validator = new MailBox.MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18NStrings["mailbox.messageTextRequired"]);
                this.validator.isEnabled = true;
            }
            if (this.validator.isValid) {
                var postMessageParams = this.getPostNewMessageParams();
                if (!postMessageParams.replyTo)
                    this.lastSentMessage = this.newMessage.text;
                this.sendingMessage = true;
                this.$http.post(Config.EndPoints.postMail, postMessageParams)
                    .then(function () {
                    _this.newMessage.text = undefined;
                    _this.newMessageForm.messageText.$setViewValue(undefined);
                    _this.newMessageForm.messageText.$render();
                    _this.newMessageForm.messageText.$setPristine();
                    _this.newMessageForm.$setPristine();
                    _this.isNewMessageOpen = false;
                    _this.sendingMessage = false;
                    var toMailBoxParams = { notReload: false };
                    _this.statesService.go(States.mailboxInbox.name, toMailBoxParams);
                }, function (errorData) {
                    throw new Error(errorData);
                });
            }
            else
                this.logger.appInfo("AttemptToSendTooShortMail");
        };
        MailBoxCtrl.prototype.initMemberMailBoxState = function (toStateParam) {
            var _this = this;
            this.confirmToReloadUserMailState(toStateParam).then(function (confirmed) {
                if (confirmed)
                    _this.loadUserMailBoxState(toStateParam);
                else
                    _this.statesService.go(States.mailboxUser.name, { id: _this.currentMember.id, isNew: "new" });
            }, function (errorData) { throw Error("FailedUserMailboxChangeStateConfirmation =" + errorData); });
        };
        MailBoxCtrl.prototype.loadUserMailBoxState = function (toStateParam) {
            var _this = this;
            if (!this.messages || Object.keys(this.messages).length === 0) {
                this.$http({
                    url: Config.EndPoints.getListOfMails,
                    method: "GET"
                })
                    .then(function (messages) {
                    _this.updateMailBox(messages.data);
                    _this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
                }, function (errorData) {
                    throw Error(errorData);
                });
            }
            else {
                this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
            }
        };
        MailBoxCtrl.prototype.initMailBoxState = function (toStateParam) {
            var _this = this;
            if (!toStateParam || !toStateParam.notReload) {
                this.spinnerService.showSpinner.show = true;
                this.initInboxPromise = this.$http({
                    url: Config.EndPoints.getListOfMails,
                    method: "GET"
                })
                    .then(function (messages) {
                    _this.updateMailBox(messages.data);
                    _this.initInboxPromise = undefined;
                    _this.spinnerService.showSpinner.show = false;
                    _this.isInboxLoading = false;
                }, function (errorData) {
                    _this.spinnerService.showSpinner.show = false;
                    _this.isInboxLoading = false;
                    throw Error(errorData);
                });
            }
            this.validator.isEnabled = false;
        };
        MailBoxCtrl.prototype.openMemberMessages = function (memberId) {
            var stateParams = { id: memberId, isNew: "" };
            this.statesService.go(States.mailboxUser.name, stateParams);
        };
        MailBoxCtrl.prototype.getCurrentMember = function (memberId) {
            var _this = this;
            var p = this.$q.defer();
            this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
                .success(function (member) {
                if (!_this.messages[member.id]) {
                    _this.messages[member.id] = new Array();
                }
                _this.currentMember = member;
                _this.newMessage.text = undefined;
                _this.newMessageForm.messageText.$setViewValue(undefined);
                _this.newMessageForm.messageText.$render();
                _this.newMessageForm.messageText.$setPristine();
                p.resolve();
            })
                .error(function (errorData) {
                p.reject(errorData);
            });
            return p.promise;
        };
        MailBoxCtrl.prototype.getMemberMessage = function (messageId, memberId) {
            var _this = this;
            var needToLoadContent = false, messageIndex = -1;
            for (var i = 0; i < this.messages[memberId].length; i++) {
                if (this.messages[memberId][i].id === messageId && !this.messages[memberId][i].content) {
                    messageIndex = i;
                    needToLoadContent = true;
                    break;
                }
            }
            if (needToLoadContent) {
                this.$http.post(Config.EndPoints.getMailContent, { "id": messageId })
                    .success(function (messageContent) {
                    if (messageContent) {
                        _this.messages[memberId][messageIndex].content = messageContent.message;
                    }
                }).error(function (errorData) {
                    throw new Error(errorData);
                });
            }
        };
        MailBoxCtrl.prototype.createUserMailsDictionary = function (messages) {
            var mailsDict = {};
            if (!messages || messages.length === 0)
                return mailsDict;
            var currentUser = this.userService.getUser();
            for (var i = 0; i < messages.length; i++) {
                var msg = messages[i];
                var name_1 = msg.partnerDisplayName.split(" ");
                // TODOLATER: Get the server to provide the right name instead.
                if (name_1.length !== 2) {
                    msg.firstName = msg.partnerDisplayName;
                }
                else {
                    msg.firstName = name_1[0];
                    msg.lastName = name_1[1];
                }
                msg.date = new Date(msg.when);
                var partnerId = currentUser.userId === msg.fromId ? msg.toId : msg.fromId;
                if (mailsDict[partnerId]) {
                    mailsDict[partnerId].push(msg);
                }
                else {
                    mailsDict[partnerId] = [msg];
                }
            }
            return mailsDict;
        };
        MailBoxCtrl.prototype.createMailThreadList = function (messages) {
            var list = new Array();
            if (!messages)
                return list;
            angular.forEach(messages, function (messages, userId) {
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
        };
        MailBoxCtrl.prototype.loadNewMessages = function () {
            var userMessages = this.messages[this.currentMember.id];
            if (!userMessages || userMessages.length === 0)
                return;
            var loadStep = this.defaultHistoryLoadStep;
            for (var i = 0; i < userMessages.length; i++) {
                var message = userMessages[i];
                if (message.content)
                    continue;
                if (loadStep === 0)
                    break;
                this.getMemberMessage(message.id, this.currentMember.id);
                loadStep--;
            }
        };
        MailBoxCtrl.prototype.goToMailBox = function () {
            var mailboxStateParams = { notReload: false };
            this.statesService.go(States.mailboxInbox.name, mailboxStateParams);
        };
        MailBoxCtrl.prototype.updateMailBox = function (messages) {
            if (messages)
                this.messages = this.createUserMailsDictionary(messages);
            var threads = this.createMailThreadList(this.messages);
            this.mailBoxList = threads.filter(function (t) { return t.status !== MailStatus.Archived; });
            this.mailBoxArchivesList = threads.filter(function (t) { return t.status === MailStatus.Archived; });
        };
        MailBoxCtrl.prototype.initMemberMailBoxStateAfterMessagesReady = function (toStateParam) {
            var _this = this;
            if (toStateParam.isNew && toStateParam.isNew === "new") {
                this.isNewMessageOpen = true;
                if (this.lastSentMessage)
                    this.showInsertPopup = true;
            }
            else {
                this.isNewMessageOpen = false;
            }
            if (toStateParam.id) {
                var memberId_1 = Number(toStateParam.id);
                if (isNaN(memberId_1)) {
                    var toMailBoxParams = { notReload: false };
                    this.statesService.go(States.mailboxInbox.name, toMailBoxParams);
                    return;
                }
                if (!this.currentMember || this.currentMember.id !== memberId_1) {
                    this.currentMember = undefined;
                    this.getCurrentMember(memberId_1).then(function () {
                        _this.prepareViewDataForMemberThread(memberId_1);
                        _this.newMessageForm.$setPristine();
                    }, function (errorData) { throw new Error(errorData); });
                }
                else {
                    this.prepareViewDataForMemberThread(memberId_1);
                }
            }
        };
        MailBoxCtrl.prototype.prepareViewDataForMemberThread = function (memberId) {
            var _this = this;
            var prepareViewData = function () {
                _this.getMemberTopMessagesTexts(memberId, _this.defaultMessagesOnPage);
                var lastUserMessage = _this.messages[_this.currentMember.id][0];
                _this.canBeRepliedTo = lastUserMessage && lastUserMessage.toId === _this.userService.getUser().userId;
                _this.isThreadArchived = _this.messages[memberId].length > 0 &&
                    _this.messages[memberId][0].status === MailStatus.Archived;
            };
            if (this.initInboxPromise)
                this.initInboxPromise.finally(prepareViewData);
            else
                prepareViewData();
        };
        MailBoxCtrl.prototype.getPostNewMessageParams = function () {
            var postMessageParams = { memberIdTo: this.currentMember.id, text: this.newMessage.text, replyTo: undefined };
            if (this.messages[this.currentMember.id] && this.messages[this.currentMember.id].length > 0 && this.messages[this.currentMember.id][0].fromId === this.currentMember.id) {
                postMessageParams["replyTo"] = this.messages[this.currentMember.id][0].id;
            }
            return postMessageParams;
        };
        MailBoxCtrl.prototype.getMemberTopMessagesTexts = function (memberId, defaultMessagesOnPage) {
            for (var i = 0; i < defaultMessagesOnPage; i++) {
                if (this.messages[memberId] && this.messages[memberId].length > i) {
                    this.getMemberMessage(this.messages[memberId][i].id, memberId);
                }
            }
        };
        MailBoxCtrl.prototype.confirmToReloadUserMailState = function (toStateParam) {
            var confirmationPromise = this.$q.defer();
            var memberId = Number(toStateParam.id);
            if (!memberId || !this.currentMember || !this.newMessageForm.messageText.$viewValue || this.currentMember.id === memberId)
                confirmationPromise.resolve(true);
            else
                this.confirmInModal().then(function (confirmed) { confirmationPromise.resolve(confirmed); });
            return confirmationPromise.promise;
        };
        MailBoxCtrl.prototype.confirmInModal = function () {
            var modalMessage = "<h4 class=\"text-center\">" + this.i18NStrings["mailbox.youCannotWriteMoreThanOneEmailMsg"] + "<h4>";
            var modalConfirmation = this.modalService.open(modalMessage, [{ label: "" + this.i18NStrings["buttons.yes"], cssClass: "btn btn-warning", result: true },
                { label: "" + this.i18NStrings["buttons.no"], cssClass: "btn btn-success", result: false }]);
            return modalConfirmation;
        };
        MailBoxCtrl.prototype.insertPrevEmail = function () {
            this.newMessage.text = this.lastSentMessage;
            this.showInsertPopup = false;
            this.logger.appInfo("PreviousEmailPastedIn", { content: this.lastSentMessage });
        };
        MailBoxCtrl.prototype.notInsertPrevEmail = function () {
            this.showInsertPopup = false;
        };
        MailBoxCtrl.prototype.archiveThread = function () {
            var _this = this;
            var modalMessage = "<h3 class=\"text-center\">" + this.i18NStrings["mailbox.archiveThreadConfirm"] + "</h3>";
            this.modalService.open(modalMessage, [{ label: "" + this.i18NStrings["buttons.yes"], cssClass: "btn btn-warning", result: true },
                { label: "" + this.i18NStrings["buttons.no"], cssClass: "btn btn-success", result: false }])
                .then(function (confirmed) {
                if (!confirmed)
                    return;
                _this.$http.post(Config.EndPoints.postArchiveThread, { id: _this.messages[_this.currentMember.id][0].id });
                _this.$timeout(function () {
                    _this.messages[_this.currentMember.id].forEach(function (m) { return m.status = MailStatus.Archived; });
                    _this.updateMailBox();
                    _this.goToMailBox();
                });
            });
        };
        MailBoxCtrl.$inject = ["$scope", "$http", "$filter", "$q", "$timeout", "statesService", "userService", "mailboxServerService", "modalService", "serverResources", "spinnerService", "$translate"];
        return MailBoxCtrl;
    }());
    MailBox.MailBoxCtrl = MailBoxCtrl;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MailboxServerService = (function () {
        function MailboxServerService($http) {
            this.$http = $http;
        }
        MailboxServerService.prototype.getUserMailList = function () {
            var promise = this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" });
            return promise;
        };
        MailboxServerService.$inject = ["$http"];
        return MailboxServerService;
    }());
    MailBox.MailboxServerService = MailboxServerService;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessagesHistoryDirective = (function () {
        function MessagesHistoryDirective() {
            this.link = function ($scope, element, attr, ctrl) { };
            this.$scope = {};
            this.controller = Ctrl;
            this.controllerAs = "ctrl";
            this.bindToController = {
                messages: "=",
                loadMessages: "&"
            };
            this.templateUrl = "mailbox-message-history-template.tpl";
            this.restrict = "E";
            this.replace = true;
        }
        return MessagesHistoryDirective;
    }());
    MailBox.MessagesHistoryDirective = MessagesHistoryDirective;
    var Ctrl = (function () {
        function Ctrl($scope, $http, $filter, userService, statesService) {
            this.$http = $http;
            this.$filter = $filter;
            this.userService = userService;
            this.statesService = statesService;
            this.user = this.userService.getUser(); // The user is referred to by the view
            if (!this.user) {
                statesService.go(States.login.name);
            }
        }
        Ctrl.prototype.loadNextMessages = function () { this.loadMessages(); };
        Object.defineProperty(Ctrl.prototype, "shownMessages", {
            get: function () { return this.$filter("filter")(this.messages, function (message) { return message.content ? true : false; }); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ctrl.prototype, "asMoreHistory", {
            get: function () { return this.shownMessages != null && this.shownMessages.length !== this.messages.length; },
            enumerable: true,
            configurable: true
        });
        Ctrl.$inject = ["$scope", "$http", "$filter", "userService", "statesService"];
        return Ctrl;
    }());
    MailBox.Ctrl = Ctrl;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessageStatusDirective = (function () {
        function MessageStatusDirective() {
            this.restrict = "A";
            this.link = function ($scope, $element, $attrs) {
                var status = $attrs["messageStatusVal"];
                var replyTo = $attrs["messageStatusReplyTo"];
                switch (status) {
                    case "10":
                        $element.addClass("message-unread");
                        break;
                    case "11":
                        $element.addClass("message-read");
                        break;
                    case "2":
                        if (replyTo === "") {
                            $element.addClass("message-sent");
                        }
                        else {
                            $element.addClass("message-replied");
                        }
                        break;
                    default:
                }
            };
        }
        return MessageStatusDirective;
    }());
    MailBox.MessageStatusDirective = MessageStatusDirective;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessageValidator = (function () {
        function MessageValidator(messageFormControler, isThisInitMessage, messageNotValidLabel) {
            this.messageFormControler = messageFormControler;
            this.isThisInitMessage = isThisInitMessage;
            this.messageNotValidLabel = messageNotValidLabel;
            // maxLength isn't used because we use the html maxlength attributes instead.
            // That requires less code to maintain and less localization
            this.minLength = 20;
            this.isMinLengthFailed = false;
            this.isEnabled = false;
            this.messageTextRequired = messageNotValidLabel;
        }
        Object.defineProperty(MessageValidator.prototype, "isMessageValid", {
            get: function () {
                var isValidText = this.isThisInitMessage
                    ? this.includeMinLengthValidation()
                    : this.messageFormControler.messageText.$valid;
                if (!isValidText) {
                    var error = Object.keys(this.messageFormControler.messageText.$error)[0];
                    if (error === "required")
                        this.messageTextErrorMessage = this.messageTextRequired;
                    if (this.isMinLengthFailed)
                        this.messageTextErrorMessage = this.messageTextRequired;
                }
                else
                    this.messageTextErrorMessage = undefined;
                return isValidText;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MessageValidator.prototype, "isValid", {
            get: function () {
                return this.isEnabled ? this.isMessageValid : true;
            },
            enumerable: true,
            configurable: true
        });
        ;
        MessageValidator.prototype.includeMinLengthValidation = function () {
            if (this.messageFormControler && this.messageFormControler.messageText) {
                var viewVal = this.messageFormControler.messageText.$viewValue;
                this.isMinLengthFailed = (!viewVal || viewVal.length < this.minLength);
                return this.messageFormControler.messageText.$valid && !this.isMinLengthFailed;
            }
            this.isMinLengthFailed = false;
            return true;
        };
        return MessageValidator;
    }());
    MailBox.MessageValidator = MessageValidator;
    ;
})(MailBox || (MailBox = {}));
/// <reference path="DeleteModal/IDeleteFormController.ts" />
var Profile;
(function (Profile) {
    var ProfileController = (function () {
        function ProfileController($scope, $http, $timeout, $uibModal, $log, userService, statesService, $window, modalService, serverResources) {
            var _this = this;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$uibModal = $uibModal;
            this.$log = $log;
            this.userService = userService;
            this.statesService = statesService;
            this.$window = $window;
            this.modalService = modalService;
            this.serverResources = serverResources;
            this.languages = Languages.languagesById;
            this.years = Years.getYears();
            this.translationLabels = {};
            this.serverValidation = { show: false, message: undefined, code: undefined, isModal: false };
            this.cleanLocation = function () {
                _this.editProfile.location = FormInputsRegulator.cleanLocation(_this.editProfile.location);
            };
            this.getLocalizedResources();
            this.user = this.userService.getUser();
            this.editProfile = this.user;
            this.months = this.serverResources.getMonths();
            this.countries = this.serverResources.getCountries();
        }
        ProfileController.prototype.updateLearns = function (lang1, lang2) {
            this.editProfile.learns = lang1;
            this.editProfile.learns2 = lang2;
        };
        ProfileController.prototype.updateKnows = function (lang1, lang2) {
            this.editProfile.knows = lang1;
            this.editProfile.knows2 = lang2;
        };
        ProfileController.prototype.setCountry = function (countryId) {
            this.editProfile.country = countryId;
        };
        ProfileController.prototype.setMonth = function (index) {
            this.editProfile.birthMonth = this.months[index].id;
        };
        ProfileController.prototype.setYear = function (year) {
            this.editProfile.birthYear = year;
        };
        ProfileController.prototype.saveProfile = function () {
            this.profileValidation.enabled = true;
            if (this.serverValidation.show) {
                this.setServerValidationToDefaults(this.serverValidation);
            }
            if (this.profileValidation.isFormValid) {
                this.$log.appInfo("ValidProfileFormSubmitted", { form: this.editProfile });
                this.showModal();
            }
            else {
                this.$log.appInfo("InvalidProfileFormSubmitted", { validationReport: this.profileValidation.validationReport, user: this.userService.getUser(), form: this.editProfile });
            }
        };
        ProfileController.prototype.showModal = function () {
            var _this = this;
            this.modalWindowInstance = this.$uibModal.open({
                templateUrl: "edit-ptofile-password-template.tpl",
                controller: "UserProfileModalCtrl",
                controllerAs: "profileModal",
                resolve: {
                    //Andriy: it used lambda to correct reference this keyword within modal controller
                    submitForm: function () { return function (userPassword, modalWindowInstance) {
                        _this.postDataToServer(_this.editProfile, _this.userService, userPassword, modalWindowInstance, _this.serverValidation);
                    }; },
                    serverValidation: function () { return _this.serverValidation; }
                }
            });
        };
        ProfileController.prototype.postDataToServer = function (editProfile, userService, userPassword, modalWindowInstance, serverValidation) {
            var _this = this;
            editProfile.currentPassword = userPassword;
            userService.update(editProfile).
                then(function (response) {
                if (response.isUpdated) {
                    _this.handleUpdateSuccessServerResponse(response, modalWindowInstance);
                }
                else {
                    _this.serverResources.getServerResponseText(response.message.code).then(function (serverMessage) {
                        serverValidation.message = serverMessage;
                    });
                    serverValidation.show = true;
                    serverValidation.code = response.message.code;
                    if (response.message.code === 6 /* WrongPassword */) {
                        serverValidation.isModal = true;
                    }
                    else {
                        modalWindowInstance.close();
                        serverValidation.isModal = false;
                    }
                    _this.$timeout(function () {
                        serverValidation.message = undefined;
                        serverValidation.show = false;
                    }, 5000);
                }
            }, function () {
                //Error logged in User Service
            });
        };
        ProfileController.prototype.handleUpdateSuccessServerResponse = function (response, modalWindowInstance) {
            var _this = this;
            modalWindowInstance.close();
            modalWindowInstance.result.then(function () {
                _this.modalService.open("<h4>" + _this.translationLabels["profileUpdated"] + "</h4>", [{ label: _this.translationLabels["ok"], cssClass: "btn btn-success", result: true }]).then(function () {
                    var statePromise = _this.statesService.reload();
                    statePromise.then(function () {
                        _this.statesService.closeState(States.profile.name);
                    });
                });
            });
        };
        ProfileController.prototype.setServerValidationToDefaults = function (serverValidation) {
            this.serverValidation.show = false;
            this.serverValidation.message = undefined;
            this.serverValidation.code = undefined;
            this.serverValidation.isModal = false;
        };
        ProfileController.prototype.cleanPassword = function () {
            if (this.editProfile.password === "") {
                this.editProfile.password = undefined;
            }
        };
        ProfileController.prototype.cleanRetypePassword = function () {
            if (this.editProfile.reTypePassword === "") {
                this.editProfile.reTypePassword = undefined;
            }
        };
        ProfileController.prototype.showDeleteAccountModal = function () {
            var _this = this;
            this.$log.appInfo("CancelAccountRequested", { userId: this.editProfile.userId });
            var deleteResult = this.modalWindowInstance = this.$uibModal.open({
                templateUrl: "edit-ptofile-delete-account-template.tpl",
                controller: Profile.DeleteProfileModalCtrl,
                controllerAs: "deleteModal",
                resolve: { id: function () { return _this.editProfile.userId; } }
            });
            deleteResult.result.then(function (result) {
                if (result) {
                    _this.statesService.resetAllStates();
                    _this.statesService.goAndReload(States.home.name);
                }
                else {
                    _this.$log.appInfo("CancelAccountCancelled", { userId: _this.editProfile.userId });
                }
            }, function () {
                _this.$log.appInfo("CancelAccountCancelled", { userId: _this.editProfile.userId });
            });
        };
        ProfileController.prototype.getLocalizedResources = function () {
            var _this = this;
            this.serverResources.getProfileResources().then(function (translates) {
                _this.translationLabels["profileUpdated"] = translates.profileUpdated;
                _this.translationLabels["ok"] = translates.ok;
            });
        };
        ProfileController.$inject = ["$scope", "$http", "$timeout", "$uibModal", "$log", "userService", "statesService", "$window", "modalService", "serverResources"];
        return ProfileController;
    }());
    Profile.ProfileController = ProfileController;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileDirective = (function () {
        function ProfileDirective() {
            this.link = function ($scope, element, attr, profile) {
                profile.profileValidation = new Profile.ProfileFormValidation(profile.profileForm, profile.editProfile, profile.serverResources);
            };
            this.scope = {};
            this.templateUrl = "edit-profile-template.tpl";
            this.controller = "UserProfileCtrl";
            this.controllerAs = "profile";
            this.bindToController = {};
            this.restrict = "E";
            this.replace = true;
        }
        return ProfileDirective;
    }());
    Profile.ProfileDirective = ProfileDirective;
})(Profile || (Profile = {}));
/// <reference path="../validations/validation.ts" />
var Profile;
(function (Profile) {
    var ProfileFormValidation = (function () {
        function ProfileFormValidation(formCtrl, profile, serverResources) {
            var _this = this;
            this.formCtrl = formCtrl;
            this.profile = profile;
            this.enabled = false;
            this.errors = {};
            serverResources.getAccountValidationErrors()
                .then(function (errorTransaltions) { _this.validationErrors = errorTransaltions; });
        }
        Object.defineProperty(ProfileFormValidation.prototype, "isLearnsValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.learns) : true;
                if (!isValid) {
                    this.errors["learns"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isKnowsValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.knows) : true;
                if (!isValid) {
                    this.errors["knows"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isBirthDateValid", {
            get: function () {
                var isValid = this.enabled ? this.profile.birthMonth && this.profile.birthYear : true;
                if (!isValid) {
                    this.errors["birthDate"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isLocationValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.country) && this.formCtrl.location.$valid : true;
                if (!isValid) {
                    this.errors["location"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isIntroductionValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.introduction.$valid : true;
                if (!isValid) {
                    this.errors["location"] = this.formCtrl.introduction.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isEmailValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.email.$valid : true;
                if (!isValid) {
                    this.errors["email"] = this.formCtrl.email.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isPasswordValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.password.$valid : true;
                if (!isValid)
                    this.errors["password"] = this.formCtrl.password.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isReTypedPasswordValid", {
            get: function () {
                var isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.profile.password === this.profile.reTypePassword);
                if (!isValid) {
                    this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "validationReport", {
            get: function () {
                return {
                    isLearnsValid: this.isLearnsValid,
                    isKnowsValid: this.isKnowsValid,
                    isBirthDateValid: this.isBirthDateValid,
                    isLocationValid: this.isLocationValid,
                    isIntroductionValid: this.isIntroductionValid,
                    isEmailValid: this.isEmailValid,
                    isPasswordValid: this.isPasswordValid,
                    isReTypedPasswordValid: this.isReTypedPasswordValid
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFormValid", {
            get: function () {
                this.errors = {};
                return !this.enabled ? true :
                    this.isLearnsValid && this.isKnowsValid && this.isBirthDateValid && this.isLocationValid
                        && this.isIntroductionValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "profileClientError", {
            get: function () {
                //Andriy: Currently it's only for password errors, but it could be extended for others, just not clear how to show more then one errror message on sign up form.
                if (Object.keys(this.errors).length === 0)
                    return undefined;
                var passwordErrors = this.errors["password"];
                var errorText;
                if (passwordErrors) {
                    if (passwordErrors["minlength"])
                        errorText = this.validationErrors.passwordMinError;
                    else if (passwordErrors["maxlength"])
                        errorText = this.validationErrors.passwordMaxError;
                    else
                        errorText = this.validationErrors.defaultError;
                }
                else {
                    errorText = this.validationErrors.defaultError;
                }
                return errorText;
            },
            enumerable: true,
            configurable: true
        });
        return ProfileFormValidation;
    }());
    Profile.ProfileFormValidation = ProfileFormValidation;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileHelper = (function () {
        function ProfileHelper() {
        }
        ProfileHelper.val = 42;
        return ProfileHelper;
    }());
    Profile.ProfileHelper = ProfileHelper;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileModalController = (function () {
        function ProfileModalController($scope, $uibModalInstance, submitForm, serverValidation) {
            this.$uibModalInstance = $uibModalInstance;
            this.submitForm = submitForm;
            this.serverValidation = serverValidation;
            this.validationDisabled = true;
        }
        Object.defineProperty(ProfileModalController.prototype, "isFormValid", {
            get: function () { return this.validationDisabled ? true : angular.isDefined(this.password) && this.password !== ""; },
            enumerable: true,
            configurable: true
        });
        ProfileModalController.prototype.save = function () {
            if (this.validationDisabled)
                this.validationDisabled = false;
            if (this.isFormValid) {
                this.submitForm(this.password, this.$uibModalInstance);
            }
        };
        ProfileModalController.$inject = ["$scope", "$uibModalInstance", "submitForm", "serverValidation"];
        return ProfileModalController;
    }());
    Profile.ProfileModalController = ProfileModalController;
})(Profile || (Profile = {}));
/// <reference path="ideleteformcontroller.ts" />
var Profile;
(function (Profile) {
    var DeleteProfileModalCtrl = (function () {
        function DeleteProfileModalCtrl($scope, $uibModalInstance, id, userService, statesService, serverResources) {
            this.$uibModalInstance = $uibModalInstance;
            this.id = id;
            this.userService = userService;
            this.statesService = statesService;
            this.serverResources = serverResources;
            this.isValidationEnabled = false;
            this.serverValidation = { show: false, message: undefined };
        }
        DeleteProfileModalCtrl.prototype.deleteAccount = function () {
            var _this = this;
            this.isValidationEnabled = true;
            this.serverValidation.show = false;
            this.serverValidation.message = undefined;
            this.userService.deleteUser({ userId: this.id, currentPassword: this.psw }).then(function (data) {
                if (data.isSuccess) {
                    _this.$uibModalInstance.close(true);
                }
                else {
                    _this.serverValidation.show = true;
                    _this.serverResources.getServerResponseText(data.message.code).then(function (translate) {
                        _this.serverValidation.message = translate;
                    });
                }
            }, function () { });
        };
        DeleteProfileModalCtrl.prototype.cancel = function () {
            this.$uibModalInstance.close(false);
        };
        DeleteProfileModalCtrl.prototype.isPasswordValid = function () {
            return this.isValidationEnabled ? this.deleteForm.password.$valid : true;
        };
        DeleteProfileModalCtrl.$inject = ["$scope", "$uibModalInstance", "id", "userService", "statesService", "serverResources"];
        return DeleteProfileModalCtrl;
    }());
    Profile.DeleteProfileModalCtrl = DeleteProfileModalCtrl;
})(Profile || (Profile = {}));
/// <reference path="../../References.d.ts" />
var Profile;
(function (Profile) {
    var LanguageSelectController = (function () {
        function LanguageSelectController($scope) {
            this.languages = Languages.languagesById;
            this.isSecondLangShown = false;
            if (this.currentLanguages[1]) {
                this.isSecondLangShown = true;
            }
        }
        LanguageSelectController.prototype.setLang = function (langIndex, langVal) {
            this.currentLanguages[langIndex] = langVal;
            this.updateLanguages({ lang1: this.currentLanguages[0], lang2: this.currentLanguages[1] });
        };
        LanguageSelectController.prototype.removeSecondLang = function () {
            this.isSecondLangShown = false;
            this.setLang(1, undefined);
        };
        LanguageSelectController.prototype.isBlockedLang = function (langId) {
            return langId === this.currentLanguages[0] || langId === this.currentLanguages[1]
                || langId === this.blockedLanguages[0] || langId === this.blockedLanguages[1];
        };
        LanguageSelectController.prototype.getLanguagesList = function (lang, index, array) {
            if (!lang)
                return false;
            return lang.tier === 1 || lang.tier === 2;
        };
        LanguageSelectController.$inject = ["$scope"];
        return LanguageSelectController;
    }());
    Profile.LanguageSelectController = LanguageSelectController;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileLanguageSelectDirective = (function () {
        function ProfileLanguageSelectDirective() {
            this.link = function ($scope, element, attr, lobby) { };
            this.scope = {};
            this.templateUrl = "edit-ptofile-lang-select-template.tpl";
            this.controller = "ProfileLanguageSelectCtrl";
            this.controllerAs = "langSelect";
            this.bindToController = {
                currentLanguages: "=",
                blockedLanguages: "=",
                updateLanguages: "&"
            };
            this.restrict = "E";
            this.replace = true;
        }
        return ProfileLanguageSelectDirective;
    }());
    Profile.ProfileLanguageSelectDirective = ProfileLanguageSelectDirective;
})(Profile || (Profile = {}));
/// <reference path="../References.d.ts" />
var Services;
(function (Services) {
    var AjaxManager = (function () {
        function AjaxManager($q, $log, $injector) {
            var _this = this;
            this.$q = $q;
            this.$log = $log;
            this.$injector = $injector;
            this.request = function (config) {
                if (!config.timeout)
                    config.timeout = Config.Ajax.timeoutInMs;
                config.msBeforeAjaxCall = new Date().getTime();
                // Prevent cross-version caching issue with angular templates
                // This invalidates the browser's cache each time a new client version appears
                if (config.url.indexOf("uib/template/") !== 0 // Reserved for inline templates by Angular-Bootstrap
                    && config.url.substr(-".html".length) === ".html" // Equivalent of Ecmascript 6:  config.url.endsWith(".html")
                ) {
                    config.url = config.url + "?v=" + Config.clientVersion;
                }
                return config;
            };
            this.response = function (response) {
                var timewarning = response.config.timewarning || Config.Ajax.timewarningInMs;
                if (timewarning) {
                    var timeTakenInMs = new Date().getTime() - response.config.msBeforeAjaxCall;
                    if (timeTakenInMs > timewarning && response.config.url !== Config.EndPoints.remoteLog)
                        _this.$log.ajaxWarn("SlowServerResponse", { timeTakenInMs: timeTakenInMs, url: response.config.url, data: response.config.data });
                }
                return response;
            };
            this.responseError = function (rejection) {
                var extraErrorData, errorType, downgradeToWarning = false;
                var errorData = { url: rejection.config.url, data: rejection.config.data };
                // Ignore 499 error: Http call has been cancelled due to user activity (refresh or close page)
                if (rejection && rejection.status === 499)
                    return rejection;
                // Is this a server error? a timeout? a 401?
                if (rejection && rejection.status === 401) {
                    _this.$log.ajaxWarn("AjaxUnauthorized", $.extend({}, errorData)); // I'm not sure why there is an extend here. Maybe to leave errorData untouched, somehow
                    _this.$injector.get("$state").go(States.login.name);
                    return rejection;
                }
                else if (rejection && rejection.status && rejection.data) {
                    errorType = "AjaxException";
                    extraErrorData = {
                        errorMessage: rejection.data.ExceptionMessage || rejection.data.Message,
                        status: rejection.status
                    };
                }
                else {
                    var timeTakenInMs = new Date().getTime() - rejection.config.msBeforeAjaxCall;
                    errorType = "AjaxTimeout";
                    downgradeToWarning = true;
                    extraErrorData = { timeTaken: timeTakenInMs };
                }
                // Log the error or warning
                if (rejection.config.url !== Config.EndPoints.remoteLog) {
                    if (downgradeToWarning)
                        _this.$log.ajaxWarn(errorType, $.extend(extraErrorData, errorData));
                    else
                        _this.$log.ajaxError(errorType, $.extend(extraErrorData, errorData));
                }
                //Note that rejecting this will log an additional error when loading a partial failed (but not when hitting the api failed...)
                // Reject via this.$q.reject(), otherwise the error will pass as success
                // Normally, you could use return $q.reject(rejection); but this rethrow an error that is logged with $log.
                // By not sending the rejection, we prevent logging things twice. Hopefully, that doesn't break other stuff
                // Update: actually, it breaks stuff by silencing errors and preventing some processes from dealing with them.
                // So, this.$q.reject(rejection) is needed
                return _this.$q.reject(rejection);
            };
        }
        AjaxManager.factory = function ($q, $log, $injector) { return new AjaxManager($q, $log, $injector); };
        AjaxManager.$inject = ["$q", "$log", "$injector"]; // Good for minification?
        return AjaxManager;
    }());
    Services.AjaxManager = AjaxManager;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var EventEmitter = (function () {
        function EventEmitter() {
            this.events = {};
        }
        EventEmitter.prototype.on = function (event, fn) {
            if (!this.events[event])
                this.events[event] = [];
            this.events[event].push(fn);
            return this;
        };
        EventEmitter.prototype.emit = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.events[event] || this.events[event].length === 0)
                return;
            for (var i = 0; i < this.events[event].length; i++) {
                var fn = this.events[event][i];
                fn.apply(this, args);
            }
        };
        EventEmitter.prototype.off = function (event, fn) {
            if (!this.events[event] || this.events[event].length === 0)
                return;
            if (!fn) {
                delete this.events[event];
                return;
            }
            var fnIdx = this.events[event].indexOf(fn);
            if (fnIdx === -1)
                return;
            this.events[event].splice(fnIdx, 1);
            if (this.events[event].length === 0)
                delete this.events[event];
        };
        return EventEmitter;
    }());
    Services.EventEmitter = EventEmitter;
})(Services || (Services = {}));
/// <reference path="EventEmitter.ts"/>
var Services;
(function (Services) {
    /// <summary>
    /// Usage of service provider allows us to initiate all hub proxys as early as possible
    /// and avoid the situation when one of the hubs is muted because of late client-side handlers assignment
    /// </summary>
    var SignalRConnectionServiceProvider = (function () {
        function SignalRConnectionServiceProvider() {
            var _this = this;
            // Provider's factory function
            this.$get = ["$q", "$log", "$timeout", function ($q, $log, $timeout) {
                    if (!_this.instance)
                        _this.instance = new SignalRConnectionService($q, $log, $timeout, _this.hubs);
                    return _this.instance;
                }];
        }
        return SignalRConnectionServiceProvider;
    }());
    Services.SignalRConnectionServiceProvider = SignalRConnectionServiceProvider;
    /// <summary>
    /// In simple cases (like one hub) service can be used directly. 
    /// If you have a multiple hubs with different usage areas concider using SignalRConnectionServiceProvider
    /// </summary>
    var SignalRConnectionService = (function (_super) {
        __extends(SignalRConnectionService, _super);
        function SignalRConnectionService($q, $log, $timeout, hubs) {
            var _this = this;
            _super.call(this);
            this.$q = $q;
            this.$log = $log;
            this.$timeout = $timeout;
            this.hubErrorWebSocketClosedCount = 0;
            this.connectionState = SignalRConnectionState.Disconnected;
            this.connectHubFailureCount = 0;
            // if we have autogenerated proxy, use $.connection.hub, otherwise create new connection via $.hubConnection()
            var hasAutogeneratedProxy = $.connection.hub && $.connection.hub.createHubProxy;
            this.hub = hasAutogeneratedProxy ? $.connection.hub : $.hubConnection();
            this.registerInternalEventHandlers();
            if (!hubs || hubs.length === 0)
                return;
            for (var i = 0; i < hubs.length; i++) {
                var hubProxy = this.hub.createHubProxy(hubs[i]);
                // We have to assign some handler to hubProxy for initiating connection to it.
                // Real handlers could be added later at any time (even after connection is started)
                // http://stackoverflow.com/a/33001395/186607
                hubProxy.on("dumb_handler_that_will_never_fire", function () { console.error("o_O"); });
                $.connection[hubs[i]] = hubProxy;
            }
            // Reset the hubErrorWebSocketClosedCount every 5 minutes. This means that the client can have occasional issues, but if that happens to often, we'll quick them out
            setInterval(function () {
                if (_this.hubErrorWebSocketClosedCount !== 0) {
                    $log.signalRInfo("ResettinghubErrorWebSocketClosedCountToZero", { hubErrorWebSocketClosedCount: _this.hubErrorWebSocketClosedCount });
                    _this.hubErrorWebSocketClosedCount = 0;
                }
            }, 300000 /* 5 min */);
        }
        Object.defineProperty(SignalRConnectionService.prototype, "state", {
            get: function () {
                return this.connectionState;
            },
            enumerable: true,
            configurable: true
        });
        // TODOLater: Finding usage doesn't work on this. It misses the usage in TextChatCtrl.ts
        SignalRConnectionService.prototype.start = function () {
            var _this = this;
            this.$log.signalRInfo("StartSignalRConnectionRequested");
            var startDeferred = this.$q.defer();
            if (this.connectHubFailureCount >= 10) {
                this.$log.signalRInfo("ConnectHubFailedTooMuch");
                startDeferred.reject("ConnectHubFailedTooMuch");
            }
            else if (this.connectionState === SignalRConnectionState.Disconnected) {
                this.$log.signalRInfo("ConnectingHub");
                this.connectionState = SignalRConnectionState.Connecting;
                this.hub.start()
                    .done(function (event) {
                    _this.connectionState = SignalRConnectionState.Connected;
                    startDeferred.resolve();
                })
                    .fail(function (error) {
                    _this.connectionState = SignalRConnectionState.Disconnected;
                    _this.connectHubFailureCount++;
                    _this.$log.signalRError("HubStartFailed", error);
                    startDeferred.reject(error);
                });
            }
            else {
                // SimpleWebRtcService may call this when it's already started
                // Optimally, this shouldn't happen like that
                this.$log.signalRInfo("StartWasCalledOnNonDisconnectedState", { state: this.connectionState });
                startDeferred.resolve();
            }
            return startDeferred.promise; //return promise;
        };
        SignalRConnectionService.prototype.restart = function () {
            var _this = this;
            this.connectionState = SignalRConnectionState.Reconnecting;
            this.hub.stop();
            this.$timeout(function () { _this.hub.start(); }, 500, false); // Immediate start after stop tends to fail
        };
        SignalRConnectionService.prototype.on = function (event, fn) {
            if (SignalRConnectionService.serviceEvents.indexOf(event) > -1) {
                _super.prototype.on.call(this, event, fn);
            }
            else {
                var pascalCaseEvent = event.charAt(0).toUpperCase() + event.substr(1, event.length - 1);
                $(this.hub).bind("on" + pascalCaseEvent, fn);
            }
            return this;
        };
        SignalRConnectionService.prototype.off = function (event, fn) {
            if (SignalRConnectionService.serviceEvents.indexOf(event) > -1) {
                _super.prototype.off.call(this, event, fn);
            }
            else {
                var pascalCaseEvent = event.charAt(0).toUpperCase() + event.substr(1, event.length - 1);
                $(this.hub).unbind("on" + pascalCaseEvent, fn);
            }
            return this;
        };
        SignalRConnectionService.prototype.stop = function () {
            this.connectionState = SignalRConnectionState.Disconnected;
            this.hub.stop();
        };
        SignalRConnectionService.prototype.registerInternalEventHandlers = function () {
            var _this = this;
            this.on("start", function () { _this.$log.signalRInfo("ClientConnected"); })
                .on("starting", function () { _this.$log.signalRInfo("HubStarting"); })
                .on("stateChanged", function (e, data) {
                _this.$log.signalRInfo("HubStateChanged", data);
                _this.connectionState = data.newState;
            })
                .on("connectionSlow", function () { _this.$log.signalRWarn("HubConnectionSlow"); })
                .on("reconnecting", function () { _this.$log.signalRWarn("HubReconnecting"); })
                .on("reconnect", function () { _this.$log.signalRInfo("HubReconnected"); })
                .on("disconnect", function () { _this.onHubDisconnected(); })
                .on("error", function (e, error) {
                if (error.message === "WebSocket closed.")
                    _this.onWebSocketClosed();
                else
                    _this.$log.signalRError("HubError", { errorMessage: error["message"], stack: error["stack"] });
            })
                .on("received", function (e, data) {
                // filter out a few things to prevent excessive logging
                if (data["I"] != undefined)
                    return; // Filter out server telling client how many times it has been called (e.g.: {"I":"70"})
                // Prevent AddInitialMessages from clogging the log files (or the console) by removing all the messages from the object
                if (data["M"] === "Do") {
                    angular.forEach(data["A"][0], function (call) {
                        if (call["message"]["method"] === "AddInitialMessages")
                            call["message"]["args"] = "...";
                    });
                }
                // Log the received data
                if (data["E"] !== undefined)
                    _this.$log.signalRError("HubReceived", data);
                else
                    _this.$log.consoleInfo("HubReceived", data); //else this.$log.signalRInfo("HubReceived", data); // disabled because it's too much to log in production, but we want to keep this around just in case
            });
        };
        SignalRConnectionService.prototype.onWebSocketClosed = function () {
            this.hubErrorWebSocketClosedCount++;
            this.$log.signalRWarn("HubErrorWebSocketClosed", { occurences: this.hubErrorWebSocketClosedCount });
            // Clean the error. Otherwise it lingers there and "onHubDisconnected" gets a false positive HubDisconnectedOnError.
            // This affects chrome only
            this.hub.lastError = null;
            // Somehow SignalR sometimes fall into a never ending loop of "WebSocket closed." => "Reconnecting" ==> "Reconnected" => "WebSocket closed."
            // We try to break that by manually disconnecting the hub
            if (this.hubErrorWebSocketClosedCount === 5) {
                this.$log.signalRWarn("HubResetDueToExcessiveWebSocketClosedErrors");
                this.restart();
            }
            // We give up and close the chat
            if (this.hubErrorWebSocketClosedCount === 10) {
                this.$log.signalRError("HubStopAndQuitChatDueToExcessiveWebSocketClosedErrors");
                this.emit("fatalError");
                this.stop();
            }
        };
        SignalRConnectionService.prototype.onHubDisconnected = function () {
            var _this = this;
            if (this.hub.lastError) {
                this.$log.signalRWarn("HubDisconnectedOnError", this.hub.lastError.message);
                this.$timeout(function () { _this.start(); }, 5000);
            }
            else {
                // The previously saved sessionTag is included here for information because, on a page refresh, chrome run this after loading the next page,
                // which has consequently already updated the cookies with a new SessionTag, making it look like it's the new session that gets disconnected
                this.$log.signalRInfo("HubDisconnectedOnDemand", { sessionTag: Runtime.sessionTag });
            }
        };
        SignalRConnectionService.$inject = ["$q", "$log", "$timeout"];
        SignalRConnectionService.serviceEvents = ["fatalError"];
        return SignalRConnectionService;
    }(Services.EventEmitter));
    Services.SignalRConnectionService = SignalRConnectionService;
    (function (SignalRConnectionState) {
        SignalRConnectionState[SignalRConnectionState["Connecting"] = 0] = "Connecting";
        SignalRConnectionState[SignalRConnectionState["Connected"] = 1] = "Connected";
        SignalRConnectionState[SignalRConnectionState["Reconnecting"] = 2] = "Reconnecting";
        SignalRConnectionState[SignalRConnectionState["Disconnected"] = 4] = "Disconnected";
    })(Services.SignalRConnectionState || (Services.SignalRConnectionState = {}));
    var SignalRConnectionState = Services.SignalRConnectionState;
})(Services || (Services = {}));
/// <reference path="../Interfaces.ts"/>
/// <reference path="EventEmitter.ts"/>
/// <reference path="SignalRConnectionService.ts"/>
var Services;
(function (Services) {
    /// <summary>
    /// We can use provider if it's desirable to have all hubs in one service wrapper
    /// In our case hubs are doing completely different stuff and we don't want textChat hub to be exposed to VoiceChatService and vice versa
    /// </summary>
    var HubServiceProvider = (function () {
        function HubServiceProvider() {
            var _this = this;
            // Provider's factory function
            this.$get = ["$q", "$log", "$timeout", "$connection", function ($q, $log, $timeout, $connection) {
                    if (!_this.instance) {
                        _this.instance = {};
                        for (var i = 0; i < _this.hubs.length; i++) {
                            _this.instance[_this.hubs[i]] = new HubService($q, $log, $timeout, $connection, _this.hubs[i]);
                        }
                    }
                    return _this.instance;
                }];
        }
        return HubServiceProvider;
    }());
    Services.HubServiceProvider = HubServiceProvider;
    /// <summary>
    /// Service can be used directly or with a HubServiceProvider proxy
    /// </summary>
    var HubService = (function (_super) {
        __extends(HubService, _super);
        function HubService($q, $log, $timeout, $connection, hub) {
            var _this = this;
            _super.call(this);
            this.$q = $q;
            this.$log = $log;
            this.$timeout = $timeout;
            this.$connection = $connection;
            this.hubName = hub;
            if (!$.connection[hub]) {
                // no autogenerated proxy, create our own
                this.hubProxy = $connection.hub.createHubProxy(hub);
            }
            else {
                this.hubProxy = $.connection[hub];
            }
            // set handler for a managed queue invoking
            this.hubProxy.on("do", function (managedMessages) { _this.processBundledInvoke(managedMessages); });
            this.$connection.on("starting", function () {
                _this.expectedCallOrderId = 1;
            });
        }
        /// <summary>
        /// Subscribe to server-initiated invokes
        /// </summary>
        HubService.prototype.on = function (hubAction, callback) {
            var _this = this;
            // normalize to PascalCase for logging and due to the fact that signalR itself is case insensitive
            hubAction = hubAction.charAt(0).toUpperCase() + hubAction.substr(1, hubAction.length - 1);
            // handlers are invoking in processServerInvoke function, so we need just one handler at hubProxy
            if (!this.events[hubAction]) {
                this.hubProxy.on(hubAction, function () {
                    var hubArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        hubArgs[_i - 0] = arguments[_i];
                    }
                    _this.processServerInvoke(hubAction, hubArgs);
                });
            }
            _super.prototype.on.call(this, hubAction, callback);
            return this;
        };
        HubService.prototype.processServerInvoke = function (hubAction, hubArgs) {
            var _this = this;
            // if we have ordered message tag, it's always the last argument
            var orderedMessageTag = (hubArgs.length > 0 && hubArgs[hubArgs.length - 1].isOrdered) ? hubArgs[hubArgs.length - 1] : null;
            // we continue processing of message if it doesn't have ordered message tag
            // or ordered message tag has correct orderId
            var continueProcessing = !orderedMessageTag || this.orderedMessageReceived(hubAction, orderedMessageTag);
            if (!continueProcessing)
                return;
            var handlers = this.events[hubAction];
            if (!handlers || !handlers.length)
                return;
            for (var idx = 0; idx < handlers.length; idx++) {
                this.$timeout(function (handler) {
                    try {
                        handler.apply(_this, hubArgs);
                    }
                    catch (e) {
                        var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
                        _this.$log.signalRErrorWithString(hubAction + "_Failed", errorData);
                    }
                }, 0, true, handlers[idx]);
            }
        };
        HubService.prototype.processBundledInvoke = function (managedMessages) {
            var _this = this;
            try {
                // All the validation is to make sure we catch issues, because SignalR swallow errors inside of this method.
                if (managedMessages == null || managedMessages.length === 0) {
                    this.$log.signalRError("ManagedMessagesCannotBeNullOrEmpty");
                    return;
                }
                var processedMessagesCount = 0;
                var keepProcessing;
                // Append unprocessed messages from previous call(s)
                managedMessages = managedMessages.concat(this.delayedManagedMessages || []);
                do {
                    keepProcessing = false;
                    managedMessages.forEach(function (managedMessage) {
                        if (managedMessage.orderId === _this.expectedCallOrderId) {
                            var action = managedMessage.message;
                            _this.processServerInvoke(action.method, action.args || []);
                            _this.expectedCallOrderId++;
                            processedMessagesCount++;
                            keepProcessing = true;
                        }
                    });
                } while (keepProcessing);
                // Collect unprocessed messages
                this.delayedManagedMessages = [];
                managedMessages.forEach(function (managedMessage) {
                    if (managedMessage.orderId > _this.expectedCallOrderId)
                        _this.delayedManagedMessages.push(managedMessage);
                });
                if (this.delayedManagedMessages.length !== 0)
                    this.$log.signalRInfo("ManagedMessagesKeptForLater", { count: this.delayedManagedMessages.length });
                this.emit("ack", this.expectedCallOrderId - 1);
            }
            catch (e) {
                var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
                this.$log.signalRErrorWithString("Do_Failed", errorData);
            }
        };
        /// <summary>
        /// Invoke method on the server.
        /// In case last argument is a function, it would be used as a callback (err, res) => void. But it's better to use promise.
        /// </summary>
        HubService.prototype.emit = function (message) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var deferred = this.$q.defer();
            // for logging
            var pascalCaseHubName = this.hubName.charAt(0).toUpperCase() + this.hubName.substr(1, this.hubName.length - 1);
            var pascalCaseMessage = message.charAt(0).toUpperCase() + message.substr(1, message.length - 1);
            var callback = function () { };
            if (args.length) {
                // if we have the callback fn passed to emit call, splice it from args and fire it on done
                var hasCallback = typeof args[args.length - 1] == "function";
                if (hasCallback) {
                    callback = args[args.length - 1];
                    args.splice(args.length - 1);
                }
            }
            // get message back to args
            args.unshift(message);
            this.hubProxy.invoke.apply(this.hubProxy, args)
                .done(function (result) {
                deferred.resolve(result);
                // callback is in standart js-notation function(err: Error, result?: any)
                callback.apply(_this, [null, result]);
            }).fail(function (err) {
                var errorData = { args: args, error: { errorMessage: err["message"], stack: err["stack"] } };
                _this.$log.signalRErrorWithString("" + pascalCaseHubName + pascalCaseMessage + "_Failed", errorData);
                deferred.reject(err);
                // callback is in standart js-notation function(err: Error, result?: any)
                callback.apply(_this, [err]);
            });
            return deferred.promise;
        };
        HubService.prototype.off = function (event, callback) {
            var _this = this;
            var unbind = function (ev, cb) {
                _super.prototype.off.call(_this, ev, cb);
                // if there's no event handlers left, unbind from hub proxy
                if (!_this.events[ev])
                    _this.hubProxy.off(ev, undefined); // wrong d.ts, see jquery.signalR-2.2.0.js:2645, we can call hubProxy.off without specifying callback
            };
            if (event) {
                unbind(event, callback);
                return;
            }
            angular.forEach(this.events, function (cb, ev) { unbind(ev); });
        };
        HubService.prototype.orderedMessageReceived = function (methodName, orderedMessageTag) {
            if (!orderedMessageTag.orderId === this.expectedCallOrderId)
                return false;
            this.expectedCallOrderId++;
            this.emit("ack", orderedMessageTag.orderId);
            return true;
        };
        HubService.$inject = ["$q", "$log", "$timeout", "$connection"];
        return HubService;
    }(Services.EventEmitter));
    Services.HubService = HubService;
})(Services || (Services = {}));
/// <reference path="../Interfaces.ts"/>
/// <reference path="SignalRConnectionService.ts"/>
/// <reference path="HubService.ts"/>
var Services;
(function (Services) {
    var TextChatHubService = (function (_super) {
        __extends(TextChatHubService, _super);
        function TextChatHubService($q, $log, $timeout, $connection) {
            _super.call(this, $q, $log, $timeout, $connection, "textChatHub");
        }
        return TextChatHubService;
    }(Services.HubService));
    Services.TextChatHubService = TextChatHubService;
    var VoiceChatHubService = (function (_super) {
        __extends(VoiceChatHubService, _super);
        function VoiceChatHubService($q, $log, $timeout, $connection) {
            _super.call(this, $q, $log, $timeout, $connection, "voiceChatHub");
        }
        VoiceChatHubService.prototype.getSessionid = function () {
            return this.$connection.hub.id;
        };
        VoiceChatHubService.prototype.disconnect = function () {
            this.emit("leave");
            // We don't really need this because signalr hubs has one common connection
        };
        return VoiceChatHubService;
    }(Services.HubService));
    Services.VoiceChatHubService = VoiceChatHubService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    (function (UsersSortingOptions) {
        UsersSortingOptions[UsersSortingOptions["Default"] = 0] = "Default";
        UsersSortingOptions[UsersSortingOptions["Name"] = 1] = "Name";
        UsersSortingOptions[UsersSortingOptions["Knows"] = 2] = "Knows";
        UsersSortingOptions[UsersSortingOptions["Learns"] = 3] = "Learns";
        UsersSortingOptions[UsersSortingOptions["Country"] = 4] = "Country";
    })(Services.UsersSortingOptions || (Services.UsersSortingOptions = {}));
    var UsersSortingOptions = Services.UsersSortingOptions;
    var ChatUsersService = (function () {
        function ChatUsersService($timeout, userService, $filter, serverResources) {
            this.$timeout = $timeout;
            this.userService = userService;
            this.$filter = $filter;
            this.serverResources = serverResources;
            this.onlineUsers = [];
            this.idleUsers = [];
            this.justLeftUsers = [];
            this.countOfUsers = { forPublicRooms: {}, inPrivateRooms: 0, inSecretRooms: 0 };
            this.derivedUserLists = [this.onlineUsers, this.idleUsers, this.justLeftUsers];
            this.countries = this.serverResources.getCountries();
        }
        ChatUsersService.prototype.clearAllUsers = function () {
            // This initialization approach protects from losing bindings somehwere else
            angular.copy([], this.onlineUsers);
            angular.copy([], this.idleUsers);
            angular.copy([], this.justLeftUsers);
            // Fake users for debugging purposes. Do not remove!
            //var someUsers: { [userId: number]: TextChatUser } = { };
            //someUsers[101] = new TextChatUser(<ITextChatUser>{ userId: 101, isSelf: false, firstName: "Alice", lastName: "Acupuncturist", country: 100, location: "", gender: "F", age: 20, isSharedTalkMember: false, knows: 1, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[102] = new TextChatUser(<ITextChatUser>{ userId: 102, isSelf: false, firstName: "Bob", lastName: "Babysitter", country: 101, location: "", gender: "M", age: 21, isSharedTalkMember: false, knows: 1, learns: 3, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[103] = new TextChatUser(<ITextChatUser>{ userId: 103, isSelf: false, firstName: "Carol", lastName: "Cartoonist", country: 102, location: "", gender: "F", age: 22, isSharedTalkMember: true, knows: 1, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[104] = new TextChatUser(<ITextChatUser>{ userId: 104, isSelf: false, firstName: "Dave", lastName: "Dentist", country: 103, location: "", gender: "M", age: 23, isSharedTalkMember: false, knows: 1, learns: 5, roomTypingIn: undefined, isIdle: true, isPinned: true });
            //someUsers[105] = new TextChatUser(<ITextChatUser>{ userId: 105, isSelf: false, firstName: "Eve", lastName: "Etymologist", country: 104, location: "", gender: "F", age: 24, isSharedTalkMember: false, knows: 1, learns: 6, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[106] = new TextChatUser(<ITextChatUser>{ userId: 106, isSelf: false, firstName: "Frank", lastName: "Fishermen", country: 105, location: "", gender: "M", age: 25, isSharedTalkMember: true, knows: 1, learns: 7, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[107] = new TextChatUser(<ITextChatUser>{ userId: 107, isSelf: false, firstName: "Grace", lastName: "Geographer", country: 106, location: "", gender: "F", age: 26, isSharedTalkMember: false, knows: 1, learns: 8, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[108] = new TextChatUser(<ITextChatUser>{ userId: 108, isSelf: false, firstName: "Henry", lastName: "Hammersmiths", country: 107, location: "", gender: "M", age: 27, isSharedTalkMember: false, knows: 1, learns: 9, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[109] = new TextChatUser(<ITextChatUser>{ userId: 109, isSelf: false, firstName: "Isabel", lastName: "Interpreter", country: 108, location: "", gender: "F", age: 28, isSharedTalkMember: true, knows: 1, learns: 10, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[110] = new TextChatUser(<ITextChatUser>{ userId: 110, isSelf: false, firstName: "Jack", lastName: "Jeweler", country: 109, location: "", gender: "M", age: 29, isSharedTalkMember: false, knows: 1, learns: 11, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[111] = new TextChatUser(<ITextChatUser>{ userId: 111, isSelf: false, firstName: "Kelly", lastName: "Knitter", country: 110, location: "", gender: "F", age: 30, isSharedTalkMember: false, knows: 2, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[112] = new TextChatUser(<ITextChatUser>{ userId: 112, isSelf: false, firstName: "Larry", lastName: "Landscaper", country: 111, location: "", gender: "M", age: 31, isSharedTalkMember: false, knows: 2, learns: 3, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[113] = new TextChatUser(<ITextChatUser>{ userId: 113, isSelf: false, firstName: "Megan", lastName: "Mayor", country: 112, location: "", gender: "F", age: 32, isSharedTalkMember: true, knows: 2, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[114] = new TextChatUser(<ITextChatUser>{ userId: 114, isSelf: false, firstName: "Nathan", lastName: "Neurosurgeon", country: 113, location: "", gender: "M", age: 33, isSharedTalkMember: false, knows: 2, learns: 5, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[115] = new TextChatUser(<ITextChatUser>{ userId: 115, isSelf: false, firstName: "Oscar", lastName: "Outfitter", country: 114, location: "", gender: "M", age: 34, isSharedTalkMember: false, knows: 3, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: true });
            //someUsers[116] = new TextChatUser(<ITextChatUser>{ userId: 116, isSelf: false, firstName: "Peggy", lastName: "Plumber", country: 115, location: "", gender: "F", age: 35, isSharedTalkMember: true, knows: 3, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[117] = new TextChatUser(<ITextChatUser>{ userId: 117, isSelf: false, firstName: "Quincy", lastName: "Quartermaster", country: 116, location: "", gender: "M", age: 36, isSharedTalkMember: true, knows: 3, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[118] = new TextChatUser(<ITextChatUser>{ userId: 118, isSelf: false, firstName: "Rebecca", lastName: "Reporter", country: 117, location: "", gender: "F", age: 37, isSharedTalkMember: false, knows: 3, learns: 5, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[119] = new TextChatUser(<ITextChatUser>{ userId: 119, isSelf: false, firstName: "Scott", lastName: "Reporter", country: 118, location: "", gender: "M", age: 38, isSharedTalkMember: false, knows: 4, learns: 1, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[120] = new TextChatUser(<ITextChatUser>{ userId: 120, isSelf: false, firstName: "Tyler", lastName: "Steward", country: 119, location: "", gender: "M", age: 39, isSharedTalkMember: true, knows: 4, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[121] = new TextChatUser(<ITextChatUser>{ userId: 121, isSelf: false, firstName: "Ursula", lastName: "Tattooist", country: 120, location: "", gender: "F", age: 40, isSharedTalkMember: false, knows: 4, learns: 3, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[122] = new TextChatUser(<ITextChatUser>{ userId: 122, isSelf: false, firstName: "Victoria", lastName: "Umpire", country: 121, location: "", gender: "F", age: 41, isSharedTalkMember: false, knows: 5, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[123] = new TextChatUser(<ITextChatUser>{ userId: 123, isSelf: false, firstName: "Walter", lastName: "Valet", country: 122, location: "", gender: "M", age: 42, isSharedTalkMember: false, knows: 5, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[124] = new TextChatUser(<ITextChatUser>{ userId: 124, isSelf: false, firstName: "Xandra", lastName: "Wrestler", country: 123, location: "", gender: "F", age: 43, isSharedTalkMember: true, knows: 5, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[125] = new TextChatUser(<ITextChatUser>{ userId: 125, isSelf: false, firstName: "Yanis", lastName: "Yardmaster", country: 124, location: "", gender: "M", age: 44, isSharedTalkMember: false, knows: 5, learns: 4, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[126] = new TextChatUser(<ITextChatUser>{ userId: 126, isSelf: false, firstName: "Zach", lastName: "Zoologist", country: 125, location: "", gender: "M", age: 45, isSharedTalkMember: false, knows: 6, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: true });
            //someUsers[201] = new TextChatUser(<ITextChatUser>{ userId: 201, isSelf: false, firstName: "Alice", lastName: "Acupuncturist", country: 100, location: "", gender: "F", age: 20, isSharedTalkMember: false, knows: 1, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[202] = new TextChatUser(<ITextChatUser>{ userId: 202, isSelf: false, firstName: "Bob", lastName: "Babysitter", country: 101, location: "", gender: "M", age: 21, isSharedTalkMember: false, knows: 1, learns: 3, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[203] = new TextChatUser(<ITextChatUser>{ userId: 203, isSelf: false, firstName: "Carol", lastName: "Cartoonist", country: 102, location: "", gender: "F", age: 22, isSharedTalkMember: true, knows: 1, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[204] = new TextChatUser(<ITextChatUser>{ userId: 204, isSelf: false, firstName: "Dave", lastName: "Dentist", country: 103, location: "", gender: "M", age: 23, isSharedTalkMember: false, knows: 1, learns: 5, roomTypingIn: undefined, isIdle: true, isPinned: true });
            //someUsers[205] = new TextChatUser(<ITextChatUser>{ userId: 205, isSelf: false, firstName: "Eve", lastName: "Etymologist", country: 104, location: "", gender: "F", age: 24, isSharedTalkMember: false, knows: 1, learns: 6, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[206] = new TextChatUser(<ITextChatUser>{ userId: 206, isSelf: false, firstName: "Frank", lastName: "Fishermen", country: 105, location: "", gender: "M", age: 25, isSharedTalkMember: true, knows: 1, learns: 7, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[207] = new TextChatUser(<ITextChatUser>{ userId: 207, isSelf: false, firstName: "Grace", lastName: "Geographer", country: 106, location: "", gender: "F", age: 26, isSharedTalkMember: false, knows: 1, learns: 8, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[208] = new TextChatUser(<ITextChatUser>{ userId: 208, isSelf: false, firstName: "Henry", lastName: "Hammersmiths", country: 107, location: "", gender: "M", age: 27, isSharedTalkMember: false, knows: 1, learns: 9, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[209] = new TextChatUser(<ITextChatUser>{ userId: 209, isSelf: false, firstName: "Isabel", lastName: "Interpreter", country: 108, location: "", gender: "F", age: 28, isSharedTalkMember: true, knows: 1, learns: 10, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[210] = new TextChatUser(<ITextChatUser>{ userId: 210, isSelf: false, firstName: "Jack", lastName: "Jeweler", country: 109, location: "", gender: "M", age: 29, isSharedTalkMember: false, knows: 1, learns: 11, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[211] = new TextChatUser(<ITextChatUser>{ userId: 211, isSelf: false, firstName: "Kelly", lastName: "Knitter", country: 110, location: "", gender: "F", age: 30, isSharedTalkMember: false, knows: 2, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[212] = new TextChatUser(<ITextChatUser>{ userId: 212, isSelf: false, firstName: "Larry", lastName: "Landscaper", country: 111, location: "", gender: "M", age: 31, isSharedTalkMember: false, knows: 2, learns: 3, learns2: 21, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[213] = new TextChatUser(<ITextChatUser>{ userId: 213, isSelf: false, firstName: "Megan", lastName: "Mayor", country: 112, location: "", gender: "F", age: 32, isSharedTalkMember: true, knows: 2, learns: 4, learns2: 22, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[214] = new TextChatUser(<ITextChatUser>{ userId: 214, isSelf: false, firstName: "Nathan", lastName: "Neurosurgeon", country: 113, location: "", gender: "M", age: 33, isSharedTalkMember: false, knows: 2, learns: 5, learns2: 23, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[215] = new TextChatUser(<ITextChatUser>{ userId: 215, isSelf: false, firstName: "Oscar", lastName: "Outfitter", country: 114, location: "", gender: "M", age: 34, isSharedTalkMember: false, knows: 3, learns: 1, learns2: 25, roomTypingIn: undefined, isIdle: false, isPinned: true });
            //someUsers[216] = new TextChatUser(<ITextChatUser>{ userId: 216, isSelf: false, firstName: "Peggy", lastName: "Plumber", country: 115, location: "", gender: "F", age: 35, isSharedTalkMember: true, knows: 3, learns: 2, learns2: 25, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[217] = new TextChatUser(<ITextChatUser>{ userId: 217, isSelf: false, firstName: "Quincy", lastName: "Quartermaster", country: 116, location: "", gender: "M", age: 36, isSharedTalkMember: true, knows: 3, knows2: 29, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[218] = new TextChatUser(<ITextChatUser>{ userId: 218, isSelf: false, firstName: "Rebecca", lastName: "Reporter", country: 117, location: "", gender: "F", age: 37, isSharedTalkMember: false, knows: 3, knows2: 27, learns: 5, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[219] = new TextChatUser(<ITextChatUser>{ userId: 219, isSelf: false, firstName: "Scott", lastName: "Reporter", country: 118, location: "", gender: "M", age: 38, isSharedTalkMember: false, knows: 4, knows2: 26, learns: 1, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[220] = new TextChatUser(<ITextChatUser>{ userId: 220, isSelf: false, firstName: "Tyler", lastName: "Steward", country: 119, location: "", gender: "M", age: 39, isSharedTalkMember: true, knows: 4, knows2: 25, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[221] = new TextChatUser(<ITextChatUser>{ userId: 221, isSelf: false, firstName: "Ursula", lastName: "Tattooist", country: 120, location: "", gender: "F", age: 40, isSharedTalkMember: false, knows: 4, knows2: 25, learns: 3, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[222] = new TextChatUser(<ITextChatUser>{ userId: 222, isSelf: false, firstName: "Victoria", lastName: "Umpire", country: 121, location: "", gender: "F", age: 41, isSharedTalkMember: false, knows: 5, knows2: 21, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[223] = new TextChatUser(<ITextChatUser>{ userId: 223, isSelf: false, firstName: "Walter", lastName: "Valet", country: 122, location: "", gender: "M", age: 42, isSharedTalkMember: false, knows: 5, knows2: 23, learns: 2, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[224] = new TextChatUser(<ITextChatUser>{ userId: 224, isSelf: false, firstName: "Xandra", lastName: "Wrestler", country: 123, location: "", gender: "F", age: 43, isSharedTalkMember: true, knows: 5, knows2: 22, learns: 4, roomTypingIn: undefined, isIdle: false, isPinned: false });
            //someUsers[225] = new TextChatUser(<ITextChatUser>{ userId: 225, isSelf: false, firstName: "Yanis", lastName: "Yardmaster", country: 124, location: "", gender: "M", age: 44, isSharedTalkMember: false, knows: 5, learns: 4, roomTypingIn: undefined, isIdle: true, isPinned: false });
            //someUsers[226] = new TextChatUser(<ITextChatUser>{ userId: 226, isSelf: false, firstName: "Zach", lastName: "Zoologist", country: 125, location: "", gender: "M", age: 45, isSharedTalkMember: false, knows: 6, knows2: 21, learns: 1, roomTypingIn: undefined, isIdle: false, isPinned: true });
            //angular.copy(Object.keys(someUsers).map(val => someUsers[val]), this.onlineUsers);
            //angular.copy(Object.keys(someUsers).map(val => someUsers[val]), this.idleUsers);
            //angular.copy(Object.keys(someUsers).map(val => someUsers[val]), this.justLeftUsers);
        };
        ChatUsersService.prototype.forEachUser = function (fn) {
            angular.forEach(this.derivedUserLists, function (list) {
                angular.forEach(list, function (user) { return fn(user); });
            });
        };
        ChatUsersService.prototype.removeUserFromLists = function (userId) {
            var user;
            angular.forEach(this.derivedUserLists, function (list) {
                for (var i = list.length - 1; i >= 0; i--)
                    if (list[i].userId === userId)
                        user = list.splice(i, 1)[0];
            });
            return user;
        };
        ChatUsersService.prototype.addUser = function (user) {
            this.removeUserFromLists(user.userId);
            if (user.isIdle)
                this.idleUsers.unshift(user);
            else {
                var index = this.onlineUsers.length;
                for (var i = 0; i <= this.onlineUsers.length - 1; i++)
                    if (this.onlineUsers[i].isPinned === false) {
                        index = i;
                        break;
                    }
                this.onlineUsers.splice(index, 0, user);
            }
        };
        ChatUsersService.prototype.setIdleTo = function (userId, idle) {
            var user = this.removeUserFromLists(userId);
            user.isIdle = idle;
            if (idle)
                this.idleUsers.unshift(user);
            else
                this.onlineUsers.unshift(user);
        };
        ChatUsersService.prototype.removeUser = function (userId) {
            var user = this.removeUserFromLists(userId);
            this.justLeftUsers.unshift(user);
            if (this.justLeftUsers.length > ChatUsersService.preservedQuitters)
                this.justLeftUsers.pop();
        };
        ChatUsersService.prototype.sortBy = function (sortingOption) {
            var _this = this;
            if (sortingOption === void 0) { sortingOption = null; }
            var sorter = function (user) {
                switch (sortingOption) {
                    case UsersSortingOptions.Name: return user.firstName;
                    case UsersSortingOptions.Knows: return Languages.languagesById[Number(user.knows)].text;
                    case UsersSortingOptions.Learns: return Languages.languagesById[Number(user.learns)].text;
                    case UsersSortingOptions.Country: return _this.countries[user.country].text;
                    default: return -user.userId;
                }
            };
            angular.forEach(this.derivedUserLists, function (list) {
                var sortedPinnedUsers = _this.$filter("orderBy")(_this.$filter("filter")(list, { isPinned: true }), sorter);
                var sortedNormalUsers = _this.$filter("orderBy")(_this.$filter("filter")(list, { isPinned: false }), sorter);
                angular.copy(sortedPinnedUsers.concat(sortedNormalUsers), list);
            });
        };
        ChatUsersService.prototype.getUser = function (userId) {
            var theUser;
            this.forEachUser(function (user) {
                if (user.userId === userId)
                    theUser = user;
            });
            return theUser;
        };
        ChatUsersService.prototype.unmarkRecentUsers = function () {
            this.forEachUser(function (user) {
                var lobbyIndex = user.recentlyJoinedRooms.indexOf(Config.lobbySpecialRoom.name);
                if (lobbyIndex !== -1)
                    user.recentlyJoinedRooms.splice(lobbyIndex, 1);
            });
        };
        ChatUsersService.preservedQuitters = 20;
        ChatUsersService.$inject = ["$timeout", "userService", "$filter", "serverResources"];
        return ChatUsersService;
    }());
    Services.ChatUsersService = ChatUsersService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ContactsService = (function () {
        function ContactsService($http, $q, $state, authService) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.$state = $state;
            this.authService = authService;
            this.contactList = [];
            if (!this.authService.isAuthenticated())
                return;
            this.getContacts().then(function (contacts) { return Array.prototype.push.apply(_this.contactList, contacts); });
        }
        ContactsService.prototype.getContacts = function () {
            var _this = this;
            return this.$http.get(Config.EndPoints.getContactsList).then(function (res) { return _this.$q.resolve(res.data); });
        };
        Object.defineProperty(ContactsService.prototype, "contacts", {
            get: function () {
                return this.contactList;
            },
            enumerable: true,
            configurable: true
        });
        ContactsService.prototype.add = function (member) {
            this.contactList.push(member);
            return this.$http.post(Config.EndPoints.postContactsAdd, { contactUserId: member.id, sourceState: this.$state.current.name.replace("root.", "") });
        };
        ContactsService.prototype.remove = function (contactUserId) {
            this.contactList.splice(this.contactList.indexOf(this.contactList.filter(function (member) { return member.id === contactUserId; })[0]), 1);
            return this.$http.post(Config.EndPoints.postContactsRemove, { contactUserId: contactUserId, sourceState: this.$state.current.name });
        };
        ContactsService.prototype.isUserInContacts = function (userId) {
            return this.contactList.filter(function (member) { return member.id === userId; }).length === 1;
        };
        ContactsService.$inject = ["$http", "$q", "$state", "authService"];
        return ContactsService;
    }());
    Services.ContactsService = ContactsService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    (function (LogLevel) {
        LogLevel[LogLevel["Info"] = 0] = "Info";
        LogLevel[LogLevel["Warn"] = 1] = "Warn";
        LogLevel[LogLevel["Error"] = 2] = "Error";
    })(Services.LogLevel || (Services.LogLevel = {}));
    var LogLevel = Services.LogLevel;
    ;
    var EnhancedLog = (function () {
        function EnhancedLog() {
            var _this = this;
            // ========== Helper methods ==========
            this.getErrorMessage = function (msg, location) {
                return (msg.stack || msg.message || ((typeof msg === "string" || msg instanceof String) ? msg : JSON.stringify(msg)))
                    + (location != undefined ? "\n    at " + location : "");
            };
            this.getMessage = function (tag, data) { return tag + (data ? " = " + JSON.stringify(data) : ""); };
            this.logTo = function (tag, data, logger, level) {
                var msg = _this.getMessage(tag, data);
                EnhancedLog.http.post(Config.EndPoints.remoteLog, { logger: logger, level: level, path: window.location.pathname, message: msg });
                switch (level) {
                    case LogLevel.Error:
                        _this.consoleError(tag, data);
                        debugger;
                        break;
                    case LogLevel.Warn:
                        _this.consoleWarn(tag, data);
                        break;
                    default:
                        _this.consoleInfo(tag, data);
                        break;
                }
            };
            // ========== Override $log methods ==========
            this.trace = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.debug = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.log = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.info = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.warn = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Warn); };
            this.error = function (msg, location) {
                if (msg) {
                    var errorMsg = _this.getErrorMessage(msg, location);
                    _this.logTo(errorMsg, null, Config.Loggers.angular, LogLevel.Error);
                }
            };
            // ========== Log to console ==========
            this.consoleInfo = function (tag, data) { return console.info(_this.getMessage(tag, data)); };
            this.consoleWarn = function (tag, data) { return console.warn(_this.getMessage(tag, data)); };
            this.consoleError = function (tag, data) { return console.error(_this.getMessage(tag, data)); };
            // ========== Enhanced logging methods ==========
            // Guidelines: Avoid using the "WithString" versions of these methods. If you have to use them (because your logTag is dynamic),
            //			   make sure the string is in one word, only Letters (a-z, A-Z), underscore, and digits (but don't start with a digit)
            this.appInfo = function (tag, data) { return _this.logTo(tag, data, Config.Loggers.client, LogLevel.Info); };
            this.appWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.client, LogLevel.Warn); };
            this.appError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.client, LogLevel.Error); };
            this.ajaxInfo = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Info); };
            this.ajaxWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Warn); };
            this.ajaxError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Error); };
            this.signalRInfo = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Info); };
            this.signalRWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Warn); };
            this.signalRError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Error); };
            // Use this only if you really can't use signalRError(...)
            this.signalRErrorWithString = function (tagString, data) { _this.logTo(tagString, data, Config.Loggers.signalR, LogLevel.Error); };
        }
        return EnhancedLog;
    }());
    Services.EnhancedLog = EnhancedLog;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var MembersService = (function () {
        function MembersService($http, userService, $log) {
            this.$http = $http;
            this.userService = userService;
            this.$log = $log;
        }
        MembersService.prototype.getMembers = function (searchParams) {
            return this.$http.post(Config.EndPoints.postMembersList, searchParams);
        };
        MembersService.prototype.getVoiceOutMembers = function (searchParams) {
            return this.$http.post(Config.EndPoints.postVoiceOutList, searchParams);
        };
        MembersService.$inject = ["$http", "userService", "$log"];
        return MembersService;
    }());
    Services.MembersService = MembersService;
})(Services || (Services = {}));
/// <reference path="../Interfaces.ts"/>
/// <reference path="SignalRConnectionService.ts"/>
/// <reference path="AppHubServices.ts"/>
/// <reference path="../../Scripts/typings/simplewebrtc/simplewebrtc.d.ts"/>
var Services;
(function (Services) {
    var SimpleWebRtcService = (function () {
        function SimpleWebRtcService($q, $document, $log, $connection, voiceHub) {
            this.$q = $q;
            this.$document = $document;
            this.$log = $log;
            this.$connection = $connection;
            this.voiceHub = voiceHub;
            this.signalling = voiceHub;
        }
        SimpleWebRtcService.prototype.checkCapabilities = function () {
            var _this = this;
            var deferred = this.$q.defer();
            if (this.isMicAbsent) {
                deferred.reject("device");
                return deferred.promise;
            }
            if (!this.hasBrowserCapabilities()) {
                deferred.reject("browser");
                return deferred.promise;
            }
            if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    var mics = devices.filter(function (device) { return device.kind === 'audioinput'; });
                    _this.isMicAbsent = !mics.length;
                    if (_this.isMicAbsent) {
                        deferred.reject("device");
                    }
                    deferred.resolve();
                });
            }
            else {
                deferred.resolve();
            }
            return deferred.promise;
        };
        SimpleWebRtcService.prototype.init = function () {
            var _this = this;
            var deferred = this.$q.defer();
            // if we already initiated SimpleWebRTC object, resolve immediately
            if (this.rtc) {
                deferred.resolve();
                return deferred.promise;
            }
            // starting hub connection (if haven't yet started)
            this.$connection.start().then(function () {
                _this.initSimpleWebrtc(deferred);
                _this.voiceHub.emit("init");
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        SimpleWebRtcService.prototype.hasBrowserCapabilities = function () {
            return navigator && navigator.mediaDevices && window.RTCPeerConnection && !this.isMicAbsent;
        };
        SimpleWebRtcService.prototype.startRoomAudioCall = function (roomId, onPeerCreatedCallback) {
            var _this = this;
            this.onPeerCreatedCallback = onPeerCreatedCallback;
            this.startDeferred = this.$q.defer();
            this.startDeferred.promise.catch(function (err) {
                // if call haven't been started. report about finishing anyway
                _this.stopAudioCall(("unsupported_" + err));
                return _this.$q.reject(err);
            }).finally(function () { return _this.startDeferred = null; });
            var promise = this.startDeferred.promise;
            // if no roomId - reject immediately
            if (!roomId) {
                this.startDeferred.reject();
                return promise;
            }
            this.roomId = roomId;
            this.checkCapabilities()
                .then(function () {
                return _this.init();
            }, function (reason) {
                // reject if capabilities checking failed
                _this.startDeferred.reject(reason);
                return _this.$q.reject(reason);
            })
                .then(function () {
                // startDeferred could be then rejected by rtc 'localMediaError' handler and resloved by 'readyToCall'
                _this.rtc.startLocalVideo();
            });
            return promise;
        };
        SimpleWebRtcService.prototype.switchSelfMute = function (isMuted) {
            if (!this.localAudioTrack)
                return;
            this.localAudioTrack.enabled = isMuted;
        };
        SimpleWebRtcService.prototype.initSimpleWebrtc = function (deferred) {
            var _this = this;
            var rtc = new SimpleWebRTC({
                connection: this.signalling,
                debug: true,
                localVideoEl: '',
                remoteVideosEl: '',
                autoRequestMedia: false,
                enableDataChannels: false,
                media: {
                    audio: true,
                    video: false
                },
                receiveMedia: {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 0
                }
            });
            rtc.on("connectionReady", function () {
                _this.rtc = rtc;
                deferred.resolve();
            });
            rtc.on("readyToCall", function () {
                _this.rtc.joinRoom(_this.roomId, function (err, res) {
                    if (err && _this.startDeferred) {
                        _this.startDeferred.reject("join");
                        return;
                    }
                    if (_this.startDeferred) {
                        _this.startDeferred.resolve(res);
                    }
                });
            });
            rtc.on("localMediaError", function (err) {
                if (_this.startDeferred) {
                    _this.startDeferred.reject("device");
                }
                _this.$log.appWarn("RtcLocalMediaError", { error: err.name || err });
            });
            rtc.on("localStream", function (stream) {
                _this.localAudioTrack = stream.getAudioTracks()[0];
            });
            rtc.on("videoAdded", function (video, peer) {
                video.classList.add("rtc-video");
                _this.$document.find("body").append(video);
            });
            // set handlers for peer connection and disconnection events
            rtc.on("createdPeer", function (peer) {
                if (!peer || !peer.pc)
                    return;
                if (_this.onPeerCreatedCallback)
                    _this.onPeerCreatedCallback(peer);
                peer.pc.on("iceConnectionStateChange", function () {
                    if (peer.pc.iceConnectionState === "closed") {
                        _this.removePeerStreamElement(peer);
                    }
                });
            });
        };
        SimpleWebRtcService.prototype.stopAudioCall = function (reason) {
            var _this = this;
            if (reason === void 0) { reason = "hangout"; }
            this.$log.appInfo("StoppingAudioCall", { reason: reason });
            this.removePeerStreamElement();
            var deferred = this.$q.defer();
            if (!this.rtc) {
                deferred.resolve();
                return deferred.promise;
            }
            this.voiceHub.emit("callFinished", this.roomId, reason, function () {
                _this.$log.appInfo("CallFinishedReceived");
                if (_this.rtc) {
                    _this.rtc.leaveRoom();
                    _this.rtc.stopLocalVideo();
                }
                _this.localAudioTrack = null;
                _this.roomId = null;
                deferred.resolve();
            });
            return deferred.promise;
        };
        SimpleWebRtcService.prototype.removePeerStreamElement = function (peer) {
            if (peer && peer.videoEl)
                peer.videoEl.remove();
            else
                this.$document.find("body > .rtc-video").remove();
        };
        SimpleWebRtcService.$inject = ["$q", "$document", "$log", "$connection", "voiceHubService"];
        return SimpleWebRtcService;
    }());
    Services.SimpleWebRtcService = SimpleWebRtcService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var SpinnerService = (function () {
        function SpinnerService() {
            this.showSpinner = {
                show: false
            };
        }
        return SpinnerService;
    }());
    Services.SpinnerService = SpinnerService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var TextChatRoomsService = (function () {
        function TextChatRoomsService($cookies, userService) {
            var _this = this;
            this.$cookies = $cookies;
            this.privateRoomIdFrom = function (partnerId) { return partnerId < _this.localUser.userId ? partnerId + "-" + _this.localUser.userId : _this.localUser.userId + "-" + partnerId; };
            this.partnerIdFrom = function (privateRoomId) {
                var userIds = privateRoomId.split("-").map(function (userId) { return Number(userId); });
                return _this.localUser.userId === userIds[0] ? userIds[1] : userIds[0];
            };
            this.localUser = userService.getUser();
        }
        Object.defineProperty(TextChatRoomsService.prototype, "rooms", {
            get: function () { return this.chatRooms; },
            enumerable: true,
            configurable: true
        });
        TextChatRoomsService.prototype.initiateRoomService = function () { this.chatRooms = {}; };
        TextChatRoomsService.prototype.addRoom = function (roomModel) {
            this.addRoomIdToCookies(roomModel);
            return this.chatRooms[roomModel.roomId] = roomModel;
        };
        TextChatRoomsService.prototype.deleteRoom = function (roomId) {
            delete this.chatRooms[roomId];
            this.removeRoomIdFromCookies(roomId);
        };
        TextChatRoomsService.prototype.getRoomsFromPreviousSession = function () {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            var cookiedRooms = angular.fromJson(cookieValue);
            return cookiedRooms ? cookiedRooms : {};
        };
        TextChatRoomsService.prototype.addRoomIdToCookies = function (room) {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            var cookiedRooms = cookieValue ? angular.fromJson(cookieValue) : {};
            cookiedRooms[room.roomId] = {
                stateName: room.state,
                text: room.text
            };
            this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
        };
        TextChatRoomsService.prototype.removeRoomIdFromCookies = function (roomId) {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            if (!cookieValue)
                return;
            var cookiedRooms = angular.fromJson(cookieValue);
            delete cookiedRooms[roomId]; // = null;
            this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
        };
        TextChatRoomsService.$inject = ["$cookies", "userService"];
        return TextChatRoomsService;
    }());
    Services.TextChatRoomsService = TextChatRoomsService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var StatesService = (function () {
        function StatesService($rootScope, $state, $stateParams, $stickyState, $templateCache, $log, $deepStateRedirect, userService, $cookies) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$stickyState = $stickyState;
            this.$templateCache = $templateCache;
            this.$log = $log;
            this.$deepStateRedirect = $deepStateRedirect;
            this.userService = userService;
            this.$cookies = $cookies;
            this.stateNamesHistory = [];
            // Record all states the users navigate to successfuylly
            this.$rootScope.$on("$stateChangeSuccess", function (event, toState) {
                _this.stateNamesHistory.push(toState.name);
                if (_this.stateNamesHistory.length > 100)
                    _this.stateNamesHistory.shift(); // Keep the history small
            });
        }
        StatesService.prototype.resetAllStates = function () {
            var _this = this;
            this.userService.clearUserData();
            // Forces all sticky states to reset.We don't want unauthenticated views to linger around
            this.$stickyState.reset("*");
            // Clean the $templateCache
            angular.forEach(States, function (state) {
                if (state.isRemoteTemplate)
                    _this.$templateCache.remove(state.templateUrl);
            });
        };
        StatesService.prototype.getStateParams = function () {
            return this.$stateParams;
        };
        StatesService.prototype.getStateCopyByName = function (name) {
            for (var key in States) {
                if (States.hasOwnProperty(key)) {
                    var state = States[key];
                    if (state.name === name) {
                        return angular.copy(state);
                    }
                }
            }
            return undefined;
        };
        StatesService.prototype.resetState = function (stateName) {
            var stateToReset = this.getStateCopyByName(stateName);
            this.$stickyState.reset(stateName);
            this.$deepStateRedirect.reset(stateName);
            if (stateToReset.isRemoteTemplate)
                this.$templateCache.remove(stateToReset.templateUrl);
        };
        StatesService.prototype.closeState = function (stateNameToClose) {
            var _this = this;
            // Determine the destination state
            var currentStateName = this.$state.current.name;
            var destinationStateName = States.home.name;
            var destinitionStateParams = {};
            var inactiveStates = this.$stickyState.getInactiveStates();
            for (var i = this.stateNamesHistory.length; i-- > 0;) {
                var candidateStateName = this.stateNamesHistory[i], found = false;
                angular.forEach(inactiveStates, function (inactiveState) {
                    // ReSharper disable ClosureOnModifiedVariable
                    if (candidateStateName.indexOf(stateNameToClose) == -1 && (candidateStateName === inactiveState.name || candidateStateName === currentStateName)) {
                        found = true;
                        destinitionStateParams = inactiveState.locals.globals.$stateParams;
                    }
                    // ReSharper restore ClosureOnModifiedVariable
                });
                if (found) {
                    destinationStateName = candidateStateName;
                    break;
                }
            }
            this.removeStateFromCookies(stateNameToClose);
            // If the current state is already the destination state, it's as easy as reset the state to be closed
            if (this.$state.includes(destinationStateName)) {
                this.$log.appInfo("ClosingStateImmediately", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                this.resetState(stateNameToClose);
            }
            else {
                this.$log.appInfo("ClosingStateInitiated", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                var successListener = this.$rootScope.$on("$stateChangeSuccess", function () {
                    successListener(); // remove curent listener
                    if (_this.$state.includes(destinationStateName)) {
                        _this.resetState(stateNameToClose);
                        _this.$log.appInfo("ClosingStateCompleted", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                    }
                    else {
                        _this.$log.appError("ClosingStateFailedOnDestStateMismatch", { currentState: _this.$state.current.name, expectedState: destinationStateName });
                    }
                });
                var failureListener = this.$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    failureListener(); // remove curent listener
                    _this.$log.appError("ClosingStateFailedOnStateChangeError", { from: fromState.name, to: toState.name, error: error });
                });
                this.$state.go(destinationStateName, destinitionStateParams);
            }
        };
        //========== Implements $states features ======================================================================================
        StatesService.prototype.go = function (to, params, options) { return this.$state.go(to, params, options); };
        StatesService.prototype.goAndReload = function (to, params) { return this.$state.go(to, params, { reload: true }); };
        StatesService.prototype.reload = function () { return this.$state.reload(); };
        Object.defineProperty(StatesService.prototype, "current", {
            get: function () { return this.$state.current; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(StatesService.prototype, "params", {
            get: function () { return this.$stateParams; },
            enumerable: true,
            configurable: true
        });
        ;
        StatesService.prototype.includes = function (state, params) { return this.$state.includes(state, params); };
        StatesService.prototype.is = function (state, params) { return this.$state.is(state, params); };
        StatesService.prototype.get = function (state, context) { return this.$state.get(state, context); };
        StatesService.prototype.href = function (state, params, options) { return this.$state.href(state, params, params); };
        StatesService.prototype.removeStateFromCookies = function (stateNameToClose) {
            var cookiesString = this.$cookies.get(Config.CookieNames.lastStates);
            if (!cookiesString)
                return;
            var stateNameParts = stateNameToClose.split(".");
            var statesInCookies = angular.fromJson(cookiesString);
            var stateNameIndx = statesInCookies.indexOf(stateNameParts[1]);
            if (stateNameIndx !== -1) {
                statesInCookies.splice(stateNameIndx, 1);
                this.$cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
            }
        };
        StatesService.$inject = ["$rootScope", "$state", "$stateParams", "$stickyState", "$templateCache", "$log", "$deepStateRedirect", "userService", "$cookies"];
        return StatesService;
    }());
    Services.StatesService = StatesService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    function translationErrorsHandlerService($log) {
        return function (translationId) {
            $log.appError("MissedTranslationResource", { missedTranslationId: translationId });
        };
    }
    Services.translationErrorsHandlerService = translationErrorsHandlerService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var VoiceOutService = (function () {
        function VoiceOutService($http, $log) {
            this.$http = $http;
            this.$log = $log;
        }
        VoiceOutService.prototype.getVoiceOutMembers = function (searchParams) {
            return this.$http.post(Config.EndPoints.postVoiceOutList, searchParams);
        };
        VoiceOutService.prototype.invite = function (memberIds, contacts) {
            var _this = this;
            var invite = { toIds: memberIds, contacts: contacts };
            return this.$http.post(Config.EndPoints.postVoiceInvite, invite)
                .error(function (errorData) { _this.$log.appWarn("InviteVoiceMemberPost_Failed", errorData); });
        };
        VoiceOutService.$inject = ["$http", "$log"];
        return VoiceOutService;
    }());
    Services.VoiceOutService = VoiceOutService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalSelectLanguageController = (function () {
        function ModalSelectLanguageController($scope, $uibModalInstance, serverResources, currentId) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.currentId = currentId;
            this.languages = Languages.languagesById;
            this.languageSelect = { selectedId: undefined, blockedId: undefined };
            this.languageSelect.selectedId = currentId;
            serverResources.getSelectLangResources().then(function (translate) { _this.moreLabel = translate; });
        }
        Object.defineProperty(ModalSelectLanguageController.prototype, "secondTierButtonLabel", {
            get: function () {
                var id = this.languageSelect.selectedId;
                return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? this.languages[id].text : this.moreLabel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalSelectLanguageController.prototype, "selectSecondTierClass", {
            get: function () {
                var id = this.languageSelect.selectedId;
                return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? "active" : undefined;
            },
            enumerable: true,
            configurable: true
        });
        ModalSelectLanguageController.prototype.secondTierLangFilter = function (value) { return value.tier > 1; };
        ;
        ModalSelectLanguageController.prototype.onSelect = function (langId) {
            this.$uibModalInstance.close(langId);
        };
        ModalSelectLanguageController.prototype.clear = function () {
            this.$uibModalInstance.close(undefined);
        };
        ModalSelectLanguageController.$inject = ["$scope", "$uibModalInstance", "serverResources", "currentId"];
        return ModalSelectLanguageController;
    }());
    Services.ModalSelectLanguageController = ModalSelectLanguageController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalSelectLanguageService = (function () {
        function ModalSelectLanguageService($uibModal, $q, $log) {
            this.$uibModal = $uibModal;
            this.$q = $q;
            this.$log = $log;
            this.modalCssClass = "lang-select-modal";
        }
        ModalSelectLanguageService.prototype.getLanguage = function (currentId, elementOrCssClass) {
            var _this = this;
            var cssClass = angular.isString(elementOrCssClass) ? elementOrCssClass : "";
            var modalDefferal = this.$q.defer();
            var modalResult = this.$uibModal.open({
                //animation: false,
                templateUrl: "select-language-service-modal-template.tpl",
                controller: Services.ModalSelectLanguageController,
                controllerAs: "modalSelect",
                resolve: { currentId: function () { return currentId; } },
                windowTopClass: this.modalCssClass + " " + cssClass,
                //backdropClass : "backdrop-transparent",
                backdrop: true
            });
            if (!cssClass && elementOrCssClass) {
                var $element = elementOrCssClass;
                modalResult.rendered.then(function () {
                    var boundElOffset = $element.offset(), boundElHeight = $element.outerHeight(), modal = $("." + _this.modalCssClass + " .modal-dialog");
                    var documentScrollTop = document.documentElement.scrollTop
                        || document.body.scrollTop;
                    var modalTop = boundElOffset.top + boundElHeight - documentScrollTop + 10;
                    if (document.body.clientHeight < modalTop + modal.outerHeight())
                        modalTop = boundElOffset.top - modal.outerHeight() - documentScrollTop - 10;
                    modal.css({ marginTop: "0", top: modalTop + "px" });
                });
            }
            this.resolveModalData(modalResult, modalDefferal, currentId);
            return modalDefferal.promise;
        };
        ModalSelectLanguageService.prototype.resolveModalData = function (modalResult, deffered, curentId) {
            modalResult.result.then(function (languageId) {
                deffered.resolve(languageId);
            }, function () {
                deffered.resolve(curentId);
            });
        };
        ModalSelectLanguageService.$inject = ["$uibModal", "$q", "$log", "$window"];
        return ModalSelectLanguageService;
    }());
    Services.ModalSelectLanguageService = ModalSelectLanguageService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var EmailIsNotConfirmedModalController = (function () {
        function EmailIsNotConfirmedModalController($uibModalInstance, $state, userService) {
            this.$uibModalInstance = $uibModalInstance;
            this.$state = $state;
            this.userService = userService;
            this.verificationEmailSent = false;
            this.verificationEmailSentFail = false;
            this.emailAddress = userService.getUser().email;
        }
        EmailIsNotConfirmedModalController.prototype.resendEmail = function () {
            var _this = this;
            this.verificationEmailSent = true;
            this.userService.resendEmailVerification().then(function (isSent) {
                _this.verificationEmailSentFail = !isSent;
            });
        };
        EmailIsNotConfirmedModalController.prototype.goToProfile = function () {
            this.$state.go(States.profile.name);
            this.$uibModalInstance.close(true);
        };
        EmailIsNotConfirmedModalController.$inject = ["$uibModalInstance", "$state", "userService"];
        return EmailIsNotConfirmedModalController;
    }());
    Services.EmailIsNotConfirmedModalController = EmailIsNotConfirmedModalController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalWindowService = (function () {
        function ModalWindowService($uibModal, $q, $state) {
            this.$uibModal = $uibModal;
            this.$q = $q;
            this.$state = $state;
        }
        ModalWindowService.prototype.open = function (messageHtml, modalButtons, staticBackdrop) {
            if (staticBackdrop === void 0) { staticBackdrop = true; }
            var modalDefferal = this.$q.defer();
            var modalResult = this.$uibModal.open({
                templateUrl: "modal-window-service-template.tpl",
                controller: Services.ModalWindowServiceController,
                controllerAs: "modal",
                backdrop: staticBackdrop ? "static" : true,
                keyboard: true,
                resolve: {
                    message: function () { return messageHtml; },
                    buttons: function () { return modalButtons; }
                }
            });
            this.resolveModalData(modalResult, modalDefferal);
            return modalDefferal.promise;
        };
        ModalWindowService.prototype.openEmailIsNotConfirmModal = function () {
            var _this = this;
            var modalDefferal = this.$q.defer();
            this.$uibModal.open({
                templateUrl: "modal-email-not-confirmed-template.tpl",
                controller: Services.EmailIsNotConfirmedModalController,
                controllerAs: "modal",
                keyboard: true
            })
                .result.then(function () {
                modalDefferal.resolve();
            }, function () {
                if (_this.$state.is(States.emailNotConfirmed.name))
                    _this.$state.go(States.home.name);
                modalDefferal.resolve();
            });
            return modalDefferal.promise;
        };
        ModalWindowService.prototype.resolveModalData = function (modalResult, deffered) {
            modalResult.result.then(function (isConfirmed) {
                deffered.resolve(isConfirmed);
            }, function (errorData) {
                deffered.resolve(false);
            });
        };
        ModalWindowService.$inject = ["$uibModal", "$q", "$state"];
        return ModalWindowService;
    }());
    Services.ModalWindowService = ModalWindowService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalWindowServiceController = (function () {
        function ModalWindowServiceController($scope, $uibModalInstance, serverResources, message, buttons) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.message = message;
            this.buttons = buttons;
            this.defaultButtons = [
                {
                    label: "Cancel",
                    cssClass: "btn btn-toggle",
                    result: false
                },
                {
                    label: "OK",
                    cssClass: "btn btn-success",
                    result: true
                }
            ];
            if (!buttons || buttons.length === 0) {
                serverResources.getModalWindowResourcrs().then(function (translates) {
                    _this.defaultButtons[0].label = translates.cancel;
                    _this.defaultButtons[1].label = translates.ok;
                });
                this.buttons = this.defaultButtons;
            }
            else {
                this.buttons = buttons.reverse();
            }
        }
        ModalWindowServiceController.prototype.buttonClick = function (buttonIndex) {
            var clickedButton = this.buttons[buttonIndex];
            if (clickedButton.callBackFn && typeof (clickedButton.callBackFn) === "function") {
                clickedButton.callBackFn();
            }
            this.$uibModalInstance.close(clickedButton.result);
        };
        ModalWindowServiceController.$inject = ["$scope", "$uibModalInstance", "serverResources", "message", "buttons"];
        return ModalWindowServiceController;
    }());
    Services.ModalWindowServiceController = ModalWindowServiceController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ServerResourcesProvider = (function () {
        function ServerResourcesProvider() {
            this.$get = ["$q", "$translate", function ($q, $translate) { return new ServerResourcesService($q, $translate); }];
        }
        ServerResourcesProvider.prototype.setupTranslationService = function ($translateProvider) {
            var translations = this.getTranslateResourcesFromHtml();
            $translateProvider
                .translations("en", translations)
                .useMissingTranslationHandler("translationErrorsHandler")
                .preferredLanguage("en")
                .useSanitizeValueStrategy(null);
        };
        ServerResourcesProvider.prototype.getTranslateResourcesFromHtml = function () {
            return angular.fromJson(document.getElementById("tranlsation-json").innerText);
        };
        return ServerResourcesProvider;
    }());
    Services.ServerResourcesProvider = ServerResourcesProvider;
    //Andriy: I think I can simplify this logic
    var ServerResourcesService = (function () {
        function ServerResourcesService($q, $translate) {
            this.$q = $q;
            this.$translate = $translate;
            this.buttonsResourcesPrefix = "buttons";
            this.maiboxResourcesPrefix = "mailbox";
            this.textChatResourcesPrefix = "textChat";
            this.editProfileResourcesPrefix = "editProfile";
            this.voiceOutResourcesPrefix = "voiceOut";
            this.siteResourcesPrefix = "site";
            this.responceCodes = {};
            this.months = {};
            this.countries = {};
            this.responceCodes[2 /* EmailAlreadyInUse */] = "messages.emailInUse";
            this.responceCodes[1 /* VerifyYourEntries */] = "messages.entriesAreInvalid";
            this.responceCodes[0 /* NewClientRequired */] = "messages.hellolingoUpdated";
            this.responceCodes[6 /* WrongPassword */] = "messages.incorrectPassword";
            this.responceCodes[5 /* WeakPassword */] = "messages.provideStrongerPassword";
            this.responceCodes[4 /* UnhandledIssue */] = "messages.tryAgain";
            this.responceCodes[3 /* UnrecognizedLogin */] = "messages.verifyPassword";
        }
        ServerResourcesService.prototype.getServerResponseText = function (code) {
            var defer = this.$q.defer();
            this.$translate(this.responceCodes[code]).then(function (translate) {
                defer.resolve(translate);
            });
            return defer.promise;
        };
        ;
        ServerResourcesService.prototype.getMonths = function () {
            var months = [];
            for (var i = 1; i < 13; i++)
                months[i] = { id: i, text: this.months[i] };
            return months;
        };
        ServerResourcesService.prototype.getCountries = function () {
            var countries = [];
            for (var country in this.countries) {
                countries[country] = this.countries[country];
            }
            countries[100].displayOrder = 1;
            countries[101].displayOrder = 2;
            countries[104].displayOrder = 3;
            countries[108].displayOrder = 4;
            countries[111].displayOrder = 5;
            countries[107].displayOrder = 6;
            countries[109].displayOrder = 7;
            countries[127].displayOrder = 8;
            countries[123].displayOrder = 9;
            countries[113].displayOrder = 10;
            return countries;
        };
        ServerResourcesService.prototype.resolveTranslationsAsync = function () {
            this.resloveMonths();
            this.resolveCountries();
            this.resolveLanguageFilterResource();
        };
        ServerResourcesService.prototype.getMailboxResources = function () {
            var translateResources = [
                (this.buttonsResourcesPrefix + ".yes"),
                (this.buttonsResourcesPrefix + ".no"),
                (this.buttonsResourcesPrefix + ".send"),
                (this.maiboxResourcesPrefix + ".youCannotWriteMoreThanOneEmailMsg"),
                (this.maiboxResourcesPrefix + ".messageTextRequired"),
                (this.maiboxResourcesPrefix + ".archiveThreadConfirm")];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) { return defer.resolve(translates); });
            return defer.promise;
        };
        ServerResourcesService.prototype.getTextChatInputPrepareResources = function () {
            var translateResources = [(this.textChatResourcesPrefix + ".sayHi"),
                (this.textChatResourcesPrefix + ".yourEmail"),
                (this.textChatResourcesPrefix + ".yourSkypeId"),
                (this.textChatResourcesPrefix + ".enterSecretRoom")];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var mailboxResourcrs = {
                    sayHi: translates[translateResources[0]],
                    yourEmail: translates[translateResources[1]],
                    yourSkypeId: translates[translateResources[2]],
                    enterSecretRoom: translates[translateResources[3]]
                };
                defer.resolve(mailboxResourcrs);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getProfileViewResources = function () {
            var translateResources = [
                (this.buttonsResourcesPrefix + ".mail"),
                (this.buttonsResourcesPrefix + ".privateChat"),
                (this.buttonsResourcesPrefix + ".voiceCall"),
                (this.buttonsResourcesPrefix + ".invite")
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources)
                .then(function (translate) {
                var profieResources = {};
                for (var _i = 0, translateResources_1 = translateResources; _i < translateResources_1.length; _i++) {
                    var resource = translateResources_1[_i];
                    var button = resource.split(".")[1];
                    profieResources[button] = translate[resource];
                }
                defer.resolve(profieResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getTextChatRoomResources = function () {
            var translateResources = [
                (this.textChatResourcesPrefix + ".firstMessage"),
                (this.textChatResourcesPrefix + ".toolTips.sharedTalk"),
                (this.textChatResourcesPrefix + ".toolTips.skype"),
                (this.textChatResourcesPrefix + ".toolTips.visit"),
                (this.textChatResourcesPrefix + ".toolTips.sendEmail"),
                (this.textChatResourcesPrefix + ".toolTips.openWithSkype"),
                (this.textChatResourcesPrefix + ".toolTips.errorTitle"),
                (this.textChatResourcesPrefix + ".toolTips.emailIsInvalid"),
                (this.textChatResourcesPrefix + ".toolTips.skypeIsInvalid"),
                (this.textChatResourcesPrefix + ".toolTips.visitSecretRoom"),
                (this.textChatResourcesPrefix + ".toolTips.secretRoomIsInvalid")
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var textChatResources = {};
                for (var resource in translates) {
                    var splitted = resource.split(".");
                    var key = splitted[splitted.length - 1];
                    textChatResources[key] = translates[resource];
                }
                defer.resolve(textChatResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getProfileResources = function () {
            var translateResources = [
                (this.editProfileResourcesPrefix + ".profileUpdated"),
                (this.buttonsResourcesPrefix + ".ok")
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var profileResources = {};
                profileResources.profileUpdated = translates[translateResources[0]];
                profileResources.ok = translates[translateResources[1]];
                defer.resolve(profileResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getSelectLangResources = function () {
            var defer = this.$q.defer();
            this.$translate(this.siteResourcesPrefix + ".more").then(function (translate) {
                defer.resolve(translate);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getModalWindowResourcrs = function () {
            var defer = this.$q.defer();
            var translateResources = [(this.buttonsResourcesPrefix + ".cancel"), (this.buttonsResourcesPrefix + ".ok")];
            this.$translate(translateResources).then(function (translate) {
                var modalWindowResources = {};
                modalWindowResources.ok = translate[translateResources[0]];
                modalWindowResources.cancel = translate[translateResources[1]];
                defer.resolve(modalWindowResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getVoiceOutInviteFormResources = function () {
            var defer = this.$q.defer();
            var translateResources = [(this.voiceOutResourcesPrefix + ".shareWithPartners"), (this.voiceOutResourcesPrefix + ".invitingMembers")];
            this.$translate(translateResources).then(function (translate) {
                var voiceOutResources = {};
                voiceOutResources.shareWithPartners = translate[translateResources[0]];
                voiceOutResources.invitingMembers = translate[translateResources[1]];
                defer.resolve(voiceOutResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getVoiceOutRequestModalResources = function () {
            var defer = this.$q.defer();
            var translateResources = [(this.voiceOutResourcesPrefix + ".contactCopiedToClipBoard"), (this.buttonsResourcesPrefix + ".ok")];
            this.$translate(translateResources).then(function (translate) {
                var voiceOutResources = {};
                voiceOutResources.ok = translate[translateResources[1]];
                voiceOutResources.contactCopiedToClipBoard = translate[translateResources[0]];
                defer.resolve(voiceOutResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getVoiceOutRequestResources = function () {
            var defer = this.$q.defer();
            var translateResources = [(this.voiceOutResourcesPrefix + ".deleteInviteConfirm"), (this.buttonsResourcesPrefix + ".yes"), (this.buttonsResourcesPrefix + ".no")];
            this.$translate(translateResources).then(function (translate) {
                var voiceOutResources = {};
                voiceOutResources.deleteInviteConfirm = translate[translateResources[0]];
                voiceOutResources.yes = translate[translateResources[1]];
                voiceOutResources.no = translate[translateResources[2]];
                defer.resolve(voiceOutResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getVoiceOutLangugesFilter = function () {
            return this.languageFilterTranslation;
        };
        ServerResourcesService.prototype.getAccountValidationErrors = function () {
            var translateResources = [
                (this.siteResourcesPrefix + ".defaultAccountError"),
                (this.siteResourcesPrefix + ".passwordLengthErrorMsg"),
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var profileResources = {};
                profileResources.defaultError = translates[translateResources[0]];
                profileResources.passwordMinError = translates[translateResources[1]];
                profileResources.passwordMaxError = translates[translateResources[1]];
                defer.resolve(profileResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getAudioChatResources = function () {
            var translateResources = [
                (this.textChatResourcesPrefix + ".audio.busy"),
                (this.textChatResourcesPrefix + ".audio.unsupportedDevice"),
                (this.textChatResourcesPrefix + ".audio.unsupportedBrowser"),
                (this.textChatResourcesPrefix + ".audio.unsupportedJoin"),
                (this.textChatResourcesPrefix + ".audio.declineUnsupportedDevice"),
                (this.textChatResourcesPrefix + ".audio.declineUnsupportedBrowser"),
                (this.textChatResourcesPrefix + ".audio.declineBusy"),
                (this.textChatResourcesPrefix + ".audio.peerDeclined"),
                (this.textChatResourcesPrefix + ".audio.peerUnsupported"),
                (this.textChatResourcesPrefix + ".audio.peerBusy"),
                (this.textChatResourcesPrefix + ".audio.hangout"),
                (this.textChatResourcesPrefix + ".audio.peerHangout"),
                (this.textChatResourcesPrefix + ".audio.peerDisconnected"),
                (this.textChatResourcesPrefix + ".audio.youreConnected")
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translate) {
                var translation = {
                    busy: translate[translateResources[0]],
                    unsupportedDevice: translate[translateResources[1]],
                    unsupportedBrowser: translate[translateResources[2]],
                    unsupportedJoin: translate[translateResources[3]],
                    declineUnsupportedDevice: translate[translateResources[4]],
                    declineUnsupportedBrowser: translate[translateResources[5]],
                    declineBusy: translate[translateResources[6]],
                    peerDeclined: translate[translateResources[7]],
                    peerUnsupported: translate[translateResources[8]],
                    peerBusy: translate[translateResources[9]],
                    hangout: translate[translateResources[10]],
                    peerHangout: translate[translateResources[11]],
                    peerDisconnected: translate[translateResources[12]],
                    youreConnected: translate[translateResources[13]]
                };
                defer.resolve(translation);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.resloveMonths = function () {
            var _this = this;
            var monthNumbers = ["months.month1", "months.month2", "months.month3", "months.month4", "months.month5", "months.month6", "months.month7", "months.month8", "months.month9", "months.month10", "months.month11", "months.month12"];
            var defer = this.$q.defer();
            this.$translate(monthNumbers).then(function (translate) {
                for (var i = 1; i < 13; i++) {
                    _this.months[i] = translate[("months.month" + i)];
                }
                defer.resolve();
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.resolveCountries = function () {
            var countries = angular.element.parseJSON(document.getElementById("countries-json").innerText);
            for (var code in countries) {
                var countryCode = Number(code.substring(1));
                this.countries[countryCode] = {
                    id: countryCode,
                    text: countries[code]
                };
            }
        };
        ServerResourcesService.prototype.resolveLanguageFilterResource = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.$translate(this.siteResourcesPrefix + ".languageFilter").then(function (translate) {
                _this.languageFilterTranslation = translate;
                defer.resolve();
            });
            return defer.promise;
        };
        ServerResourcesService.$inject = ["$q", "$translate"];
        return ServerResourcesService;
    }());
    Services.ServerResourcesService = ServerResourcesService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    (function (Counters) {
        Counters[Counters["TextChat"] = 1] = "TextChat";
        Counters[Counters["MailBox"] = 2] = "MailBox";
        Counters[Counters["VoiceOut"] = 3] = "VoiceOut";
    })(Services.Counters || (Services.Counters = {}));
    var Counters = Services.Counters;
})(Services || (Services = {}));
/// <reference path="counters.ts" />
/// <reference path="counters.ts" />
/// <reference path="countersstorage.ts" />
var Services;
(function (Services) {
    var TaskbarCounterService = (function () {
        function TaskbarCounterService() {
            this.counters = {};
            this.counters[Services.Counters.TextChat] = 0;
            this.counters[Services.Counters.MailBox] = 0;
            this.counters[Services.Counters.VoiceOut] = 0;
        }
        TaskbarCounterService.prototype.setCounterValue = function (counter, value) {
            this.counters[counter] = value;
        };
        TaskbarCounterService.prototype.getCounterValue = function (counter) {
            return this.counters[counter];
        };
        TaskbarCounterService.prototype.resetCounter = function (counter) {
            this.counters[counter] = 0;
        };
        return TaskbarCounterService;
    }());
    Services.TaskbarCounterService = TaskbarCounterService;
})(Services || (Services = {}));
/// <reference path="itextchatsettings.ts" />
var Services;
(function (Services) {
    (function (TextChatSettingsType) {
        TextChatSettingsType[TextChatSettingsType["AudioNotification"] = 1] = "AudioNotification";
        TextChatSettingsType[TextChatSettingsType["PrivateChat"] = 2] = "PrivateChat";
    })(Services.TextChatSettingsType || (Services.TextChatSettingsType = {}));
    var TextChatSettingsType = Services.TextChatSettingsType;
})(Services || (Services = {}));
/// <reference path="textchatsettingstype.ts" />
var Services;
(function (Services) {
    var TextChatSettingsController = (function () {
        function TextChatSettingsController(settings, $uibModalInstance, $log, textHubService) {
            this.settings = settings;
            this.$uibModalInstance = $uibModalInstance;
            this.$log = $log;
            this.textHubService = textHubService;
            this.initValues = angular.copy(settings);
        }
        TextChatSettingsController.prototype.toggleSettings = function (type) {
            // There should be an ng-repeat of this instead
            switch (type) {
                case Services.TextChatSettingsType.AudioNotification:
                    this.settings.isAudioNotificationOn = !this.settings.isAudioNotificationOn;
                    break;
                case Services.TextChatSettingsType.PrivateChat:
                    this.settings.isPrivateChatOn = !this.settings.isPrivateChatOn;
                    break;
                default:
                    this.$log.appWarn("UnexpectedTextChatSettingType", type);
                    break;
            }
        };
        TextChatSettingsController.prototype.onDoneClick = function () {
            if (this.initValues.isPrivateChatOn !== this.settings.isPrivateChatOn)
                this.textHubService.emit("blockPrivateChat", !this.settings.isPrivateChatOn);
            this.$uibModalInstance.close(this.settings);
        };
        TextChatSettingsController.$inject = ["settings", "$uibModalInstance", "$log", "textHubService"];
        return TextChatSettingsController;
    }());
    Services.TextChatSettingsController = TextChatSettingsController;
})(Services || (Services = {}));
/// <reference path="itextchatsettingsservice.ts" />
var Services;
(function (Services) {
    var TextChatSettingsService = (function () {
        function TextChatSettingsService($q, $uibModal) {
            this.$q = $q;
            this.$uibModal = $uibModal;
        }
        TextChatSettingsService.prototype.openSettings = function (settings) {
            var defer = this.$q.defer();
            var settingsResult = this.$uibModal.open({
                templateUrl: "text-chat-settings.tpl",
                controller: Services.TextChatSettingsController,
                controllerAs: "settings",
                resolve: { settings: function () { return settings; } }
            });
            settingsResult.result.then(function (settings) {
                defer.resolve(settings);
            });
            return defer.promise;
        };
        TextChatSettingsService.$inject = ["$q", "$uibModal"];
        return TextChatSettingsService;
    }());
    Services.TextChatSettingsService = TextChatSettingsService;
})(Services || (Services = {}));
var State = (function () {
    function State(name, url, sticky, args) {
        if (sticky === void 0) { sticky = false; }
        if (args === void 0) { args = null; }
        this.name = name;
        //this.title = title;
        this.url = url;
        this.sticky = sticky;
        if (args != null) {
            this.abstract = args.abstract;
            this.templateUrl = args.templateUrl;
            this.templateLess = args.templateLess;
            this.deepStateRedirect = args.deepStateRedirect;
        }
    }
    return State;
}());
var StatesHelper;
(function (StatesHelper) {
    var statesNotRequiringEmailConfirmations = [];
    function createUiRouterStates($stateProvider) {
        $stateProvider.state("root", {
            abstract: true,
            resolve: {
                userService: "userService",
                //serverResources:"serverResources",
                //Andriy: Minification-safe syntax
                //userExists: ["userService", (userService: Authentication.IUserService) => {
                //	return userService.isInitUserExistAsync();
                //}],
                resolveResources: ["serverResources", function (serverResources) {
                        return serverResources.resolveTranslationsAsync();
                    }]
            }
        });
        // Adding other states
        var stateTitles = angular.element.parseJSON(document.getElementById("titles-json").innerText);
        for (var key in States) {
            var state = States[key];
            var views = {};
            views[state.name] = {};
            // Set the template url for this state
            if (!state.templateLess) {
                if (!state.templateUrl)
                    state.templateUrl = "/partials" + state.url.slice(1);
                views[state.name]["templateUrl"] = state.templateUrl;
            }
            state.isRemoteTemplate = !state.templateLess && state.templateUrl.indexOf("/") === 0;
            // Create the UI State
            ///let uiState: ng.ui.IState & { title: string, sticky: boolean, dsr: Object } = { // intersection state doesn't work, using any
            var uiState = {
                title: stateTitles[key], url: state.url, views: views,
                sticky: state.sticky || false, dsr: state.deepStateRedirect
            };
            // Add default parameters
            switch (state.name) {
                case States.login.name:
                    uiState.params = { emailOfExistingAccount: undefined };
                    break;
                case States.mailboxUser.name:
                    uiState.params = { id: undefined, isNew: { value: undefined, squash: true } };
                    break;
                case States.mailboxInbox.name:
                    uiState.params = { notReload: undefined };
                    break;
                case States.findByLanguages.name:
                    uiState.params = { known: { value: undefined, squash: true }, learn: { value: undefined, squash: true } };
                    break;
            }
            // Add the UI State to the provider
            $stateProvider.state(state.name, uiState);
        }
        ;
        // Define states that don't require a validated email address
        statesNotRequiringEmailConfirmations.push(States.home.name, States.contactUs.name, States.profile.name, States.termsOfUse.name, States.privacyPolicy.name, States.sharedTalk.name, States.livemocha.name);
    }
    StatesHelper.createUiRouterStates = createUiRouterStates;
    //Andriy: It's hack (not dirty).... 
    // Event "StateChangedStart" fired on transition to every nested state. 
    // For example if you need to go to text-chat.lobby it fires 2 times on text-chat state and text-chat.lobby state
    // If we use promises, we need to be sure that logic performs only one time during all transitions.
    // To prevent this i think it's better to move such logic to "StateChangedSuccess" handler which fired 1 time always
    var isDataLoading = false;
    function onStateChangeStart(event, toState, toParam, fromState, $log, spinnerService, authService, userService, $state, $stickyState, modalService, $cookies) {
        $log.appInfo("StateChangeStart", { from: fromState.name, to: toState.name, toParam: toParam });
        spinnerService.showSpinner.show = true;
        if (!userService.isUserDataLoaded) {
            event.preventDefault();
            if (!userService.isInitLoadingStarted) {
                userService.getInitUserDataAsync().then(function (authenticated) {
                    // Bernard: I'm really not sure what I tried to achieve with this.
                    // I had bumped into a bug with which a user could still enter feature for authenticated people while not authenticated...
                    //if (!authenticated) {
                    //	authService.logout();
                    //	$state.go(States.login.name);
                    //} else
                    // Temporarily disabled, need to be tested: restore previous states from cookies
                    //openStatesFromCookies($state, $cookies, authService, toState.name, angular.copy(toParam))
                    $state.go(toState.name, toParam, { reload: true });
                });
            }
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
                userService.getInitUserDataAsync().then(function () {
                    isDataLoading = false;
                    if (userService.getUser().isEmailConfirmed)
                        $state.go(toState.name, toParam, { reload: true });
                    else
                        modalService.openEmailIsNotConfirmModal();
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
        if ((toState.name === States.textChatInvites.name) && fromState.name.length === 0) {
            event.preventDefault();
            $state.go(States.textChatLobby.name);
            return;
        }
        ;
        // With this, the user will always end on the intended page if he got asked to log in to see that authenticated,
        // or, once he logs in, he will return to the last page he was on before logging in
        if (toState.name !== States.login.name)
            authService.setStateToRedirect(toState.name, toParam);
        if (!authService.isAuthenticated() && toState.name === States.emailNotConfirmed.name) {
            event.preventDefault();
            $state.go(States.login.name);
            return;
        }
        if (fromState.name !== States.home.name && toState.name === States.emailNotConfirmed.name && authService.isAuthenticated()) {
            event.preventDefault();
            $state.go(States.home.name).then(function () { $state.go(States.emailNotConfirmed.name); });
            return;
        }
    }
    StatesHelper.onStateChangeStart = onStateChangeStart;
    var UiStateEventNames = (function () {
        function UiStateEventNames() {
        }
        Object.defineProperty(UiStateEventNames, "$stateChangeSuccess", {
            get: function () { return "$stateChangeSuccess"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UiStateEventNames, "$stateChangeStart", {
            get: function () { return "$stateChangeStart"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UiStateEventNames, "$stateNotFound", {
            get: function () { return "$stateNotFound"; },
            enumerable: true,
            configurable: true
        });
        return UiStateEventNames;
    }());
    StatesHelper.UiStateEventNames = UiStateEventNames;
    var statesToSave = {
        "text-chat": "root.text-chat.lobby",
        "voice-out": "root.voice-out.lobby",
        "find": "root.find.languages",
        "mailbox": "root.mailbox.inbox"
    };
    function saveOpenedStateInCookies($state, $cookies) {
        var currentState = $state.current.name;
        var stateNameParts = currentState.split(".");
        if (Object.keys(statesToSave).indexOf(stateNameParts[1]) !== -1) {
            var cookies = $cookies.get(Config.CookieNames.lastStates);
            var statesInCookies = (cookies ? angular.fromJson(cookies) : []);
            var stateToSave = stateNameParts[1];
            if (statesInCookies.indexOf(stateToSave) === -1) {
                statesInCookies.push(stateToSave);
                $cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
            }
        }
    }
    StatesHelper.saveOpenedStateInCookies = saveOpenedStateInCookies;
    function openStatesFromCookies($state, $cookies, authService, toStateName, toParam) {
        if (authService.isAuthenticated()) {
            var cookies = $cookies.get(Config.CookieNames.lastStates);
            if (cookies) {
                var statesInCookies = angular.fromJson(cookies);
                if (statesInCookies.length > 0) {
                    loadStatesFunc(statesInCookies, $state, toStateName, toParam);
                    return;
                }
            }
            $state.go(toStateName, toParam);
        }
        function loadStatesFunc(statesToOpen, $state, currentStateName, currentStateParam) {
            if (statesToOpen.length > 0) {
                $state.go(statesToSave[statesToOpen[0]])
                    .then(function () {
                    if (statesToOpen.length > 1) {
                        var nextStates = statesToOpen.slice(1);
                        loadStatesFunc(nextStates, $state, currentStateName, currentStateParam);
                    }
                    else
                        $state.go(currentStateName, currentStateParam);
                });
            }
        }
    }
    StatesHelper.openStatesFromCookies = openStatesFromCookies;
})(StatesHelper || (StatesHelper = {}));
/// <reference path="stateshelper.ts" />
/// <reference path="state.ts" /> 
var States;
(function (States) {
    States.home = new State("root.home", "^/", true);
    States.termsOfUse = new State("root.terms-of-use", "^/terms-of-use");
    States.privacyPolicy = new State("root.privacy-policy", "^/privacy-policy");
    States.contactUs = new State("root.contact-us", "^/contact-us", true);
    // Account and settings
    States.signup = new State("root.signup", "^/signup", true);
    States.login = new State("root.login", "^/login");
    States.profile = new State("root.profile", "^/profile", true);
    States.emailNotConfirmed = new State("root.home.email-not-confirmed", "^/email-not-confirmed", true, { templateLess: true });
    // Closed Communities
    States.sharedTalk = new State("root.sharedtalk", "^/sharedtalk");
    States.livemocha = new State("root.livemocha", "^/livemocha");
    // Find
    States.find = new State("root.find", "^/find", true, { deepStateRedirect: { default: "root.find.languages" } });
    States.findByLanguages = new State("root.find.languages", "^/find/languages/{known}/{learn}", true, { templateLess: true });
    States.findByName = new State("root.find.name", "^/find/name", true, { templateLess: true });
    States.findBySharedTalk = new State("root.find.sharedtalk", "^/find/sharedtalk", true, { templateLess: true });
    States.findByLivemocha = new State("root.find.livemocha", "^/find/livemocha", true, { templateLess: true });
    // Mailbox
    States.mailbox = new State("root.mailbox", "^/mailbox", true, { deepStateRedirect: { default: "root.mailbox.inbox" } });
    States.mailboxInbox = new State("root.mailbox.inbox", "^/mailbox/inbox", true, { templateLess: true });
    States.mailboxArchives = new State("root.mailbox.archives", "^/mailbox/archives", true, { templateLess: true });
    States.mailboxUser = new State("root.mailbox.user", "^/mailbox/user/{id}/{isNew}", true, { templateLess: true });
    // Text Chat
    States.textChat = new State("root.text-chat", "^/text-chat", true, { deepStateRedirect: { default: "root.text-chat.lobby" } });
    States.textChatLobby = new State("root.text-chat.lobby", "^/text-chat/lobby", true, { templateLess: true });
    States.textChatInvites = new State("root.text-chat.invites", "/invitations", true, { templateLess: true });
    States.textChatRoomPrivate = new State("root.text-chat.private", "^/text-chat/with/{userId}/{firstName}", true, { templateLess: true });
    States.textChatRoomPublic = new State("root.text-chat.public", "^/text-chat/in/{roomId}", true, { templateLess: true });
    States.textChatRoomCustom = new State("root.text-chat.custom", "^/text-chat/room/{roomId}", true, { templateLess: true });
    // Voice Out
    States.voiceOut = new State("root.voice-out", "^/voice-chat", true, { deepStateRedirect: { default: "root.voice-out.lobby" }, templateUrl: "/partials/voice-out" });
    States.voiceOutLobby = new State("root.voice-out.lobby", "^/voice-chat/lobby", true, { templateLess: true });
    States.voiceOutInvite = new State("root.voice-out.invite", "^/voice-chat/invite", true, { templateLess: true });
    States.voiceOutRequests = new State("root.voice-out.requests", "^/voice-chat/requests", true, { templateLess: true });
})(States || (States = {}));
/// <reference path="../../Scripts/typings/signalr/signalr.d.ts" />
var TextChatCtrl = (function () {
    function TextChatCtrl($scope, $log, $cookies, $timeout, $state, $uibModal, spinnerService, chatUsersService, userService, $connection, textHub, simpleWebRtcService, countersService, statesService, textChatSettings, serverResources, contactsService, roomsService) {
        // --------------- CONTROLLER PREPARATION ---------------
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$timeout = $timeout;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.spinnerService = spinnerService;
        this.chatUsersService = chatUsersService;
        this.userService = userService;
        this.$connection = $connection;
        this.textHub = textHub;
        this.simpleWebRtcService = simpleWebRtcService;
        this.countersService = countersService;
        this.statesService = statesService;
        this.textChatSettings = textChatSettings;
        this.serverResources = serverResources;
        this.contactsService = contactsService;
        this.roomsService = roomsService;
        this.activeTrackerCheckInterval = null;
        this.onDemandResetCount = 0;
        this.onDemandResetCountInterval = null;
        this.chatRequests = {};
        this.audioCallRequests = new Set(false);
        this.sounds = {
            messageAdded: new Audio("/Content/Sounds/IncomingMessage.mp3"),
            invitation: new Audio("/Content/Sounds/IncomingUser.mp3")
        };
        this.attachConnectionHandlers = function () { return angular.forEach(_this.connectionHandlers, function (fn, event) { return _this.$connection.on(event, fn); }); };
        this.detachConnectionHandlers = function () { return angular.forEach(_this.connectionHandlers, function (fn, event) { return _this.$connection.off(event, fn); }); };
        this.connectionHandlers = {
            disconnect: function () { },
            starting: function () { },
            start: function () {
                _this.chatUsersService.clearAllUsers();
                _this.audioCallRequests = new Set(false);
                _this.reconnectExistingRooms();
                _this.joinDefaultRooms();
                _this.rejoinRoomsFromCookies();
                _this.applyPendingStateRequest();
                _this.$scope.loading = false;
            },
            reconnect: function () { return _this.$scope.loading = false; },
            reconnecting: function () { return _this.$scope.loading = true; },
            fatalError: function () { return _this.statesService.closeState(States.textChat.name); }
        };
        // =============== CONTROLLER METHODS ===============
        this.showRoom = function (roomId) { return _this.setStateTo(_this.roomsService.rooms[roomId]); };
        this.setStateTo = function (room) { return _this.$state.go(room.state, (room.isPrivate ? { userId: room.userId, firstName: room.text } : { roomId: room.roomId })); };
        this.leaveRoom = function (roomId) {
            var room = _this.roomsService.rooms[roomId];
            var lastRoomMessage = room.accessor.lastMessage;
            _this.textHub.emit("servicePostTo", roomId, 4, lastRoomMessage);
            _this.textHub.emit("leaveRoom", roomId);
            if (room.isUndocked) {
                room.isUndocked = false;
                _this.$scope.undockedRooms.splice(_this.$scope.undockedRooms.indexOf(room), 1);
                if (_this.$scope.undockedRooms.length === 0)
                    $(window).unbind("resize", _this.undockedStateWindowResizeHandler);
            }
            if (room.isPrivate) {
                if (room.audioCallState)
                    _this.cancelAudioCall(roomId, "leftRoom");
            }
            else {
                _this.unMarkRecentUsersIn(roomId);
            }
            _this.roomsService.deleteRoom(roomId);
            if (room.roomId === "english")
                _this.englishRoomTracker.clear();
            _this.setToValidState(); // Find another room to go to now that the current one is closed
        };
        this.undockedStateWindowResizeHandler = function () {
            if ($(window).innerWidth() <= 960)
                angular.forEach(_this.roomsService.rooms, function (room) {
                    if (room.isUndocked)
                        _this.dockRoom(room.roomId);
                });
        };
        this.undockRoom = function (roomId) {
            var room = _this.roomsService.rooms[roomId];
            room.isUndocked = true;
            _this.$scope.undockedRooms.push(room);
            _this.textHub.emit("joinRoom", roomId); // TodoLater: Hack to avoid large scale refactoring: "rejoin" room to get data for new acessor
            $(window).bind("resize", _this.undockedStateWindowResizeHandler);
            _this.setToValidState(); // Find another room to go to now that the current one is closed
        };
        this.dockRoom = function (roomId) {
            var room = _this.roomsService.rooms[roomId];
            room.isUndocked = false;
            room.newMessagesCount = 0;
            _this.$scope.undockedRooms.splice(_this.$scope.undockedRooms.indexOf(room), 1);
            _this.textHub.emit("joinRoom", roomId); // TodoLater: Hack to avoid large scale refactoring: "rejoin" room to get data for new acessor
            _this.setStateTo(room);
            if (_this.$scope.undockedRooms.length === 0)
                $(window).unbind("resize", _this.undockedStateWindowResizeHandler);
        };
        this.onStateChangeSuccess = function (event, toState, toStateParams) {
            var stateDef = { state: toState, params: toStateParams };
            if (_this.$connection.state === Services.SignalRConnectionState.Connecting) {
                _this.pendingStateRequest = stateDef;
                return;
            }
            else {
                _this.applyStateChange(stateDef);
            }
        };
        this.onTextPostedInRoom = function (roomId, message) {
            _this.userActivityTracker.markActive();
            if (!_this.roomsService.rooms[roomId].isPrivate)
                _this.unMarkRecentUsersIn(roomId);
            if (roomId === Languages.english.name)
                _this.englishRoomTracker.markActive();
            _this.textHub.emit("postTo", roomId, message);
        };
        this.onUserTypingInRoom = function (roomId) {
            _this.userActivityTracker.markActive();
            _this.textHub.emit("setTypingActivityIn", roomId);
        };
        this.addMessage = function (msg) {
            var room = _this.roomsService.rooms[msg.roomId];
            // Remove typing indicator
            var user = _this.chatUsersService.getUser(msg.userId);
            if (user)
                user.roomTypingIn = undefined;
            else
                _this.$log.appWarn("UserNotFoundInAddMessage", { msg: msg });
            if (_this.isUserMuted(msg.userId)) {
                _this.$log.appInfo("MutedChatMessage", { mutedUserId: msg.userId, roomId: msg.roomId, text: msg.text });
                return;
            }
            if (room) {
                _this.setMessageOrigin(msg); // TODOLater: Optimally, the message send would have the origin initialized properly
                _this.notifyOfMessageAddition(msg.roomId);
                room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text);
            }
            else {
                var partner = _this.getPartnerFromRoomId(msg.roomId);
                _this.addChatRequest(partner);
            }
            _this.increaseNotificationCount();
        };
        this.getPartnerFromRoomId = function (roomId) {
            var partnerId = _this.roomsService.partnerIdFrom(roomId);
            return _this.chatUsersService.getUser(partnerId);
        };
        this.goToPrivateRoom = function (withUser) {
            var roomId = _this.roomsService.privateRoomIdFrom(withUser.userId);
            if (!_this.roomsService.rooms[roomId]) {
                _this.joinRoom(roomId, withUser.firstName, States.textChatRoomPrivate.name, withUser.userId);
                if (_this.audioCallRequests.contains(roomId))
                    _this.activateAudioCallRequestFor(roomId);
                delete _this.chatRequests[withUser.userId];
            }
            _this.showRoom(roomId);
        };
        this.showUserModal = function (userOrItsId, hideChatButton) {
            var userInModal = angular.isObject(userOrItsId) ? userOrItsId : _this.chatUsersService.getUser(userOrItsId);
            if (!userInModal)
                userInModal = { userId: userOrItsId };
            _this.$uibModal.open({
                templateUrl: "text-chat-user-modal.tpl",
                controller: "TextChatUserModalCtrl",
                controllerAs: "modal",
                resolve: {
                    userInModal: function () { return userInModal; },
                    invite: function () { return _this.goToPrivateRoom; },
                    showChatButton: function () { return !hideChatButton; },
                    showMuteButton: function () { return true; },
                    switchUserMute: function () { return function () { return _this.switchUserMute(userInModal.userId); }; },
                    isMuted: function () { return function () { return _this.isUserMuted(userInModal.userId); }; }
                }
            }).result.finally(function () {
                userInModal.isPinned = _this.contactsService.isUserInContacts(userInModal.userId);
            });
        };
        this.requestAudioCall = function (roomId) {
            if (!_this.isAudioCallAllowed(roomId))
                return;
            _this.$log.appInfo("RequestAudioCallStarted", { roomId: roomId });
            _this.userActivityTracker.markActive();
            _this.roomsService.rooms[roomId].audioCallState = "init";
            var onPeerCreatedCallback = function (peer) { return _this.peerCreatedHandler(_this.roomsService.rooms[roomId], peer); };
            _this.simpleWebRtcService.startRoomAudioCall(roomId, onPeerCreatedCallback)
                .then(function () {
                _this.textHub.emit("requestAudioCall", roomId);
                _this.$log.appInfo("RequestAudioCallSent", { roomId: roomId });
                _this.requestAudioCallTimeoutPromise = _this.$timeout(function (roomId) {
                    var room = _this.roomsService.rooms[roomId];
                    if (room.audioCallState !== "init")
                        return;
                    _this.cancelAudioCall(roomId, "timeout");
                }, TextChatCtrl.audioCallRequestTimeoutInMs, true, roomId);
            }, function (cause) {
                _this.roomsService.rooms[roomId].audioCallState = null;
                _this.renderAudioCallChatMessage(roomId, "unsupported_" + cause);
                _this.$log.appWarn("RequestAudioCallAborted", { cause: cause });
            });
        };
        this.acceptAudioCall = function (roomId) {
            _this.$log.appInfo("AudioCallAcceptRequest", { roomId: roomId });
            _this.audioCallRequests.remove(roomId);
            var onPeerCreatedCallback = function (peer) { return _this.peerCreatedHandler(_this.roomsService.rooms[roomId], peer); };
            _this.simpleWebRtcService.startRoomAudioCall(roomId, onPeerCreatedCallback)
                .then(function () { _this.$log.appInfo("AudioCallAccepted", { roomId: roomId }); }, function () { _this.declineAudioCall(roomId, "unsupported_device"); });
        };
        this.declineAudioCall = function (roomId, reason) {
            if (reason === void 0) { reason = "declined"; }
            _this.$log.appInfo("DeclineAudioCall", { roomId: roomId, reason: reason });
            _this.audioCallCleanup(roomId);
            if (reason !== "declined")
                _this.renderAudioCallChatMessage(roomId, "decline_" + reason);
            _this.textHub.emit("declineAudioCall", roomId, reason);
        };
        this.cancelAudioCall = function (roomId, reason) {
            if (reason === void 0) { reason = "cancelled"; }
            _this.$log.appInfo("CancelAudioCall", { roomId: roomId, reason: reason });
            _this.audioCallCleanup(roomId);
            _this.simpleWebRtcService.stopAudioCall(reason);
            _this.textHub.emit("cancelAudioCall", roomId);
        };
        this.hangUpAudioCall = function (roomId) {
            _this.$log.appInfo("HangUpAudioCall", { roomId: roomId });
            _this.finishAudioCall(roomId);
            _this.textHub.emit("hangoutAudioCall", roomId);
        };
        // ======= Audio call hub message handlers ====
        this.audioCallRequested = function (roomId) {
            _this.$log.appInfo("AudioCallRequested", { roomId: roomId });
            var partnerId = _this.roomsService.partnerIdFrom(roomId);
            if (_this.isUserMuted(partnerId)) {
                _this.$log.appInfo("AudioCallMutedFor", { roomId: roomId, partnerId: partnerId });
                return;
            }
            _this.audioCallRequests.add(roomId);
            var room = _this.roomsService.rooms[roomId];
            if (room) {
                _this.notifyOfMessageAddition(roomId);
            }
            else {
                var partner = _this.getPartnerFromRoomId(roomId);
                _this.addChatRequest(partner);
                _this.increaseNotificationCount();
                return;
            }
            // Send 'busy' if the user already have ongoing audio call
            if (_this.simpleWebRtcService.roomId && _this.simpleWebRtcService.roomId !== roomId) {
                _this.declineAudioCall(roomId, "busy");
                return;
            }
            // Check capabilities and reply accordingly
            _this.simpleWebRtcService.checkCapabilities().then(function () {
                room.audioCallState = "requested";
                _this.increaseNotificationCount();
            }, function (reason) { return _this.declineAudioCall(roomId, "unsupported_" + reason); });
        };
        this.switchUserMute = function (userId) {
            var _a = _this.isUserMuted(userId) ?
                ["ChatUserUnmuted", function (id) { _this.removeMutedUserIdFromCookies(id); }, 8] :
                ["ChatUserMuted", function (id) { return _this.addMutedUserIdToCookies(id); }, 7], logTag = _a[0], action = _a[1], servicePostId = _a[2];
            _this.$log.appInfo(logTag, { userId: userId });
            _this.textHub.emit("servicePostTo", _this.currentRoomId() ? _this.currentRoomId() : "none", servicePostId, userId);
            action(userId);
        };
        this.openSettings = function () {
            var settings = {
                isAudioNotificationOn: Runtime.TextChatSettings.playMessageAddedSound.valueOf(),
                isPrivateChatOn: !_this.userService.getUser().isNoPrivateChat
            };
            var settingsResult = _this.textChatSettings.openSettings(settings);
            settingsResult.then(function (settings) {
                Runtime.TextChatSettings.playMessageAddedSound = settings.isAudioNotificationOn;
                _this.userService.setNoPrivateChat(!settings.isPrivateChatOn);
            });
        };
        this.isRoomShown = function (room) {
            var params = _this.$state.params;
            // Yes, all the conditions are needed, because angular calls this in weird states
            // And yes, the toString() is needed, becayse the cast to IRoomStateParams is for convenience, but in reality, params are stored as strings while the room.userId is a number
            if (room.isPrivate && params && params.userId)
                return params.userId.toString() === room.userId.toString();
            else if (room.state === States.textChatRoomCustom.name && params && params.roomId)
                return params.roomId === room.roomId;
            else
                return _this.$state.includes(room.state, { roomId: room.roomId });
        };
        this.localUser = userService.getUser();
        this.roomsService.initiateRoomService();
        // Listen to state changes
        $scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, function (event, toState, toStateParams) { return _this.onStateChangeSuccess(event, toState, toStateParams); });
        $scope.$on(StatesHelper.UiStateEventNames.$stateChangeStart, function (event, toState, toParam, fromState, fromParams) { return _this.onStateChangeStart(event, toState, toParam, fromState, fromParams); });
        $scope.$on("$destroy", function () { _this.disconnectAll(); _this.$log.signalRInfo("OnTextChatDetroy"); });
        // Assign scope members - View properties
        this.$scope.rooms = this.roomsService.rooms;
        this.$scope.currentRoomId = function () { return _this.currentRoomId(); };
        this.$scope.undockedRooms = [];
        this.$scope.firstName = this.localUser.firstName;
        this.$scope.lastName = this.localUser.lastName;
        this.$scope.loading = true;
        this.$scope.inactive = false;
        this.$scope.chatRequests = this.chatRequests;
        this.$scope.countries = this.serverResources.getCountries();
        this.$scope.languages = Languages.languagesById;
        this.$scope.hasNewChatRequests = false;
        this.$scope.isAudioCallAllowed = this.isAudioCallAllowed;
        this.$scope.chatRequestsCount = function () { var cnt = 0; angular.forEach(_this.chatRequests, function (req) { if (!req.isRejected)
            cnt++; }); return cnt; };
        this.$scope.newChatRequestsCount = function () { var cnt = 0; angular.forEach(_this.chatRequests, function (req) { if (req.isNew && !req.isRejected)
            cnt++; }); return cnt; };
        this.$scope.missedChatRequestsCount = function () { var cnt = 0; angular.forEach(_this.chatRequests, function (req) { if (req.isMissed && !req.isRejected)
            cnt++; }); return cnt; };
        this.$scope.currentChatRequestsCount = function () { return _this.$scope.chatRequestsCount() - _this.$scope.missedChatRequestsCount(); };
        this.$scope.newUsersCount = function () { var cnt = 0; angular.forEach(_this.chatUsersService.onlineUsers, function (user) { if (user.recentlyJoinedRooms.indexOf(Config.lobbySpecialRoom.name) !== -1)
            cnt++; }); return cnt; };
        this.$scope.isUserMuted = function (userId) { return _this.isUserMuted(userId); };
        this.$scope.isInvitePopupShown = false;
        this.$scope.isRoomShown = this.isRoomShown;
        this.$scope.isLobbyTabShown = function () { return $state.includes(States.textChatLobby.name); };
        this.$scope.isPrivateChatTabShown = function () { return $state.includes(States.textChatInvites.name); };
        // Assign scope members - View methods
        this.$scope.leaveRoom = this.leaveRoom;
        this.$scope.joinPrivateRoom = this.goToPrivateRoom;
        this.$scope.undockRoom = this.undockRoom;
        this.$scope.dockRoom = this.dockRoom;
        this.$scope.onRoomInputKeyDown = function ($event, roomId) { return _this.onRoomInputKeyDown($event, roomId); };
        this.$scope.showChatRequests = function () { return _this.$state.go(States.textChatInvites.name); };
        this.$scope.hideRequest = function (userId) { _this.hideRequest(userId); };
        this.$scope.openLobby = function () { return _this.$state.go(States.textChatLobby.name); };
        this.$scope.openSettings = this.openSettings;
        this.$scope.onTextPostedInRoom = this.onTextPostedInRoom;
        this.$scope.onUserTypingInRoom = this.onUserTypingInRoom;
        this.$scope.showUserModal = this.showUserModal;
        this.$scope.switchUserMute = this.switchUserMute;
        this.$scope.requestAudioCall = this.requestAudioCall;
        this.$scope.cancelAudioCall = this.cancelAudioCall;
        this.$scope.acceptAudioCall = this.acceptAudioCall;
        this.$scope.declineAudioCall = this.declineAudioCall;
        this.$scope.hangoutAudioCall = this.hangUpAudioCall;
        this.$scope.closeChat = function () { return _this.statesService.closeState(States.textChat.name); };
        // Track user for activity
        this.userActivityTracker = new ActiveTracker(TextChatCtrl.userIdleAfter, TextChatCtrl.userDeadAfter, function () { return _this.textHub.emit("setUserActive"); }, function () { return _this.textHub.emit("setUserIdle"); }, function () { _this.$scope.inactive = true; _this.disconnectAll(); });
        // Reset the onDemandResetCount every 5 minutes. This means that the client can have occasional issues, but if that happens to often, we'll quick them out
        this.onDemandResetCountInterval = setInterval(function () {
            if (_this.onDemandResetCount !== 0) {
                $log.signalRInfo("ResettingOnDemandResetCountToZero", { onDemandResetCount: _this.onDemandResetCount });
                _this.onDemandResetCount = 0;
            }
        }, 5 * 60 * 1000 /* 5 min */);
        // Get audio message resources
        this.serverResources.getAudioChatResources().then(function (translations) { return _this.audioMessages = translations; });
        // Initialize hub and connection
        this.attachHubClientHandlers();
        this.attachConnectionHandlers();
        this.$connection.start();
    }
    TextChatCtrl.prototype.attachHubClientHandlers = function () {
        var _this = this;
        this.textHub
            .on("setInitialCountOfUsers", function (countOfUsers) { return _this.chatUsersService.countOfUsers = countOfUsers; })
            .on("updateCountOfUsers", function (roomId, count) { return _this.chatUsersService.countOfUsers.forPublicRooms[roomId] = count; })
            .on("addInitialUsers", function (users) { _this.addInitialUsers(users); })
            .on("addUser", function (user) { return _this.addUserToChat(user); })
            .on("removeUser", function (userId) {
            if (_this.chatRequests[userId])
                _this.chatRequests[userId].isMissed = true;
            var privateRoomId = _this.roomsService.privateRoomIdFrom(userId);
            var privateRoom = _this.roomsService.rooms[privateRoomId];
            if (privateRoom) {
                if (privateRoom.audioCallState && privateRoom.audioCallState !== "connected")
                    _this.audioCallDeclined(privateRoomId, "leftRoom");
            }
            else {
                _this.audioCallCleanup(privateRoomId);
            }
            _this.chatUsersService.removeUser(userId);
        })
            .on("addInitialUsersTo", function (roomId, users) { return _this.addInitialUsersTo(roomId, users); })
            .on("addUserTo", function (roomId, userId) { return _this.addUserTo(roomId, userId); })
            .on("removeUserFrom", function (roomId, userId) {
            if (_this.chatRequests[userId])
                _this.chatRequests[userId].isMissed = true;
            var room = _this.roomsService.rooms[roomId];
            // TODOLATER: I think we no longer can receive a RemoveUserFrom for a room we're not in. This was a previous problem that no longer applies. We should log an event if a room is missing. If it doesn't happen in production, remove this check
            if (room) {
                room.accessor.removeUser(userId);
                if (room.isPrivate && room.audioCallState && room.audioCallState !== "connected")
                    _this.audioCallDeclined(roomId, "leftRoom");
            }
            else if (!/^\d+-\d+$/.exec(roomId))
                _this.$log.signalRError("RemoveUserFromMissingRoomError", roomId);
            else {
                _this.audioCallCleanup(roomId);
            }
        })
            .on("markUserAsTyping", function (roomId, userId) {
            // This check is necessary, due to the user receiving is own typingIn while not listed among the users
            if (userId !== _this.localUser.userId && !_this.isUserMuted(userId))
                _this.chatUsersService.getUser(userId).roomTypingIn = roomId;
        })
            .on("unmarkUserAsTyping", function (userId) {
            var user = _this.chatUsersService.getUser(userId);
            // The "If" below is needed b/c the requested user might be the local user, and it's not listed in users
            if (user)
                user.roomTypingIn = undefined;
        })
            .on("addInitialMessages", function (messages) { return _this.addInitialMessages(messages); })
            .on("addMessage", function (message) { return _this.addMessage(message); })
            .on("requestAudioCall", function (roomId) { return _this.audioCallRequested(roomId); })
            .on("cancelAudioCall", function (roomId) { return _this.audioCallCancelled(roomId); })
            .on("declineAudioCall", function (roomId, reason) { return _this.audioCallDeclined(roomId, reason); })
            .on("hangoutAudioCall", function (roomId, userId) { return _this.audioCallHangouted(roomId, userId); })
            .on("audioCallConnected", function (roomId, userId) {
            // End the local call if it has been connected in another session
            var isSameUser = userId === _this.localUser.userId;
            if (!_this.roomsService.rooms[roomId] || isSameUser && _this.roomsService.rooms[roomId].audioCallState !== "connected")
                _this.audioCallCleanup(roomId);
        })
            .on("resetClient", function () {
            // TODOLater: Resets are too destructive, as they remove all current rooms except the active one. We should do a better job at rejoining existing rooms
            _this.$log.signalRInfo("ExecutingOnDemandResetFromServer", { onDemandResetCount: _this.onDemandResetCount });
            _this.onDemandResetCount++;
            if (_this.onDemandResetCount >= 10) {
                _this.$log.signalRInfo("GivingUpOnTooManyResetDemands");
                _this.statesService.closeState(States.textChat.name);
                return;
            }
            _this.$connection.restart();
        })
            .on("setUserIdle", function (userId) {
            // Overwrite other connection from this user broadcasting an idle message if the local connection isn't idle
            if (_this.localUser.userId === userId) {
                if (!_this.userActivityTracker.isIdle)
                    _this.textHub.emit("setUserActive");
            }
            else
                _this.chatUsersService.setIdleTo(userId, true);
        })
            .on("setUserActive", function (userId) {
            if (_this.localUser.userId !== userId)
                _this.chatUsersService.setIdleTo(userId, false);
        });
    };
    TextChatCtrl.prototype.reconnectExistingRooms = function () {
        var _this = this;
        angular.forEach(this.roomsService.rooms, function (room) {
            room.accessor.reset();
            _this.textHub.emit("joinRoom", room.roomId);
        });
    };
    TextChatCtrl.prototype.joinDefaultRooms = function () {
        // TODOLater: get people in their own room if the room cookie doesn't exist (which means it's their first visit)
        // Get people in their own rooms as well
        // Disable for now. We need to make it more intelligent (dont rejoin on reconnect, join only when it's valuable for the community
        //this.joinRoom(Languages.languagesById[this.localUser.knows].name);
        //if (this.localUser.knows2) {
        //	this.joinRoom(Languages.languagesById[this.localUser.knows2].name);
        //}
        //if (this.localUser.learns !== Languages.english.id) // There too many English learners to join that room by default
        //	this.joinRoom(Languages.languagesById[this.localUser.learns].name);
        //if (this.localUser.learns2 && this.localUser.learns2 !== Languages.english.id) {
        //	this.joinRoom(Languages.languagesById[this.localUser.learns2].name);
        //}
    };
    ;
    TextChatCtrl.prototype.rejoinRoomsFromCookies = function () {
        var rooms = this.roomsService.getRoomsFromPreviousSession();
        for (var roomId in rooms)
            if (!this.roomsService.rooms[roomId]) {
                var room = rooms[roomId];
                try {
                    var isPrivate = room.stateName === States.textChatRoomPrivate.name;
                    this.joinRoom(roomId, room.text, room.stateName, isPrivate ? this.roomsService.partnerIdFrom(roomId) : null);
                }
                catch (e) {
                    this.$log.appInfo("dumpFailingRoomFromCookie", { roomId: roomId });
                    this.roomsService.removeRoomIdFromCookies(roomId); // clear the potentially corrupted bits from the cookie
                }
            }
    };
    TextChatCtrl.prototype.addInitialUsers = function (users) {
        var _this = this;
        this.chatUsersService.clearAllUsers();
        angular.forEach(users, function (user) {
            var newUser = new TextChatUser(user);
            newUser.isPinned = _this.contactsService.isUserInContacts(user.userId);
            _this.chatUsersService.addUser(newUser);
        });
        this.chatUsersService.sortBy();
    };
    TextChatCtrl.prototype.disconnectAll = function () {
        this.textHub.off();
        this.$connection.stop();
        this.detachConnectionHandlers();
        clearInterval(this.onDemandResetCountInterval);
        clearInterval(this.activeTrackerCheckInterval);
        this.userActivityTracker.clear();
        if (this.englishRoomTracker)
            this.englishRoomTracker.clear();
    };
    TextChatCtrl.prototype.currentRoomId = function () {
        var params = this.$state.params;
        var roomId = params.roomId;
        if (params.userId)
            roomId = this.roomsService.privateRoomIdFrom(params.userId);
        return roomId;
    };
    TextChatCtrl.prototype.setToValidState = function () {
        for (var roomId in this.roomsService.rooms)
            if (!this.roomsService.rooms[roomId].isUndocked) {
                this.showRoom(roomId);
                return;
            }
        this.$state.go(States.textChatLobby.name);
    };
    TextChatCtrl.prototype.joinRoom = function (roomId, roomText, roomStateName, withUserId) {
        var _this = this;
        if (withUserId === void 0) { withUserId = null; }
        // Add room to local service
        var isPrivate = States.textChatRoomPrivate.name === roomStateName;
        var roomUrl = this.statesService.href(this.statesService.get(roomStateName), isPrivate ? { userId: withUserId, firstName: roomText } : { roomId: roomId });
        var room = this.roomsService.addRoom(new TextChatRoomModel(roomId, roomText, roomUrl, roomStateName, withUserId));
        // Join roomn on the server
        this.textHub.emit("joinRoom", roomId);
        this.$timeout(function () {
            room.accessor.initForFirstVisit();
            room.accessor.loading = true;
        }, 0);
        // Listen to English room inactivity
        if (room.roomId === Languages.english.name) {
            this.englishRoomTracker = new ActiveTracker(TextChatCtrl.bootOfEnglishAfter - 1, TextChatCtrl.bootOfEnglishAfter, function () { }, function () { }, function () {
                _this.$log.appInfo("InactiveUserBootedFromEnglishRoom", { userId: _this.localUser.userId });
                _this.leaveRoom(Languages.english.name);
            });
            this.englishRoomTracker.markActive();
        }
    };
    TextChatCtrl.prototype.notifyOfMessageAddition = function (roomId) {
        var params = this.$state.params;
        if (params.roomId !== roomId && (!params.userId || params.userId.toString() !== this.roomsService.partnerIdFrom(roomId).toString()))
            this.roomsService.rooms[roomId].newMessagesCount++;
        if (Runtime.TextChatSettings.playMessageAddedSound)
            this.sounds.messageAdded.play();
    };
    TextChatCtrl.prototype.soundNotifificationOfNewInvite = function () {
        if (Runtime.TextChatSettings.playUserNewInvitation)
            this.sounds.invitation.play();
    };
    TextChatCtrl.prototype.setMessageOrigin = function (msg) {
        msg.origin = msg.firstName === "[News]" ? MessageOrigin.news : MessageOrigin.otherUser;
    };
    // =============== VIEW EVENT HANDLERS ===============
    TextChatCtrl.prototype.onStateChangeStart = function (event, toState, toParam, fromState, fromParam) {
        if (this.$state.includes(States.textChat.name) === false)
            return;
        // Unmark last seen messages in chatRoom
        if (this.currentRoomId())
            if (this.roomsService.rooms[this.currentRoomId()])
                this.roomsService.rooms[this.currentRoomId()].accessor.resetLastSeenMark();
        // Unmark users who recently joined
        if (fromState.name === States.textChatLobby.name)
            this.chatUsersService.unmarkRecentUsers();
        if (fromParam && fromParam.roomId)
            this.unMarkRecentUsersIn(fromParam.roomId);
        // Unmark chat requests
        if (fromState.name === States.textChatInvites.name)
            angular.forEach(this.chatRequests, function (req, userId) { req.isNew = false; });
        // Prevent going to undocked room states
        if (this.roomsService.rooms[toParam.roomId] && this.roomsService.rooms[toParam.roomId].isUndocked) {
            this.spinnerService.showSpinner.show = false;
            event.preventDefault();
        }
    };
    TextChatCtrl.prototype.applyStateChange = function (stateDef) {
        this.userActivityTracker.markActive(); // Mark user as active
        if (this.$state.includes(States.textChat.name) === false)
            return; // Exit if this feature isn't the target
        this.countersService.resetCounter(Services.Counters.TextChat); // Reset State-wide counter
        // Handle visits to the invitations tab
        if (stateDef.state.name === States.textChatLobby.name) { }
        else if (stateDef.state.name === States.textChatInvites.name) {
            this.$scope.hasNewChatRequests = false;
            this.$scope.isInvitePopupShown = false;
        }
        else if ([States.textChatRoomCustom, States.textChatRoomPublic, States.textChatRoomPrivate]
            .some(function (state) { return stateDef.state.name === state.name; })) {
            var roomId = stateDef.params.roomId ? stateDef.params.roomId : this.roomsService.privateRoomIdFrom(stateDef.params.userId);
            // Make sure no one enters with a tampered with url that doesn't match name restrictions
            if (stateDef.state.name === States.textChatRoomCustom.name && !Config.Regex.secretRoom.test(roomId)) {
                this.$log.appInfo("MalformedRoomRequested", { roomId: roomId });
                this.$state.go(States.textChatLobby.name);
                return;
            }
            // Join room if needed
            if (!this.roomsService.rooms[roomId]) {
                var roomText = roomId;
                if (stateDef.state.name === States.textChatRoomPublic.name) {
                    var language = Languages.languagesStorage[roomId];
                    var topic = Config.TopicChatRooms.topicChatStorage[roomId];
                    roomText = language ? language.text : topic.text;
                }
                else if (stateDef.state.name === States.textChatRoomPrivate.name) {
                    roomText = stateDef.params.firstName;
                }
                this.joinRoom(roomId, roomText, stateDef.state.name, stateDef.params.userId);
            }
            var room = this.roomsService.rooms[roomId];
            room.newMessagesCount = 0; // Reset message counter on the room:
        }
    };
    TextChatCtrl.prototype.unMarkRecentUsersIn = function (roomId) {
        var currentRoom = this.roomsService.rooms[roomId];
        if (currentRoom && currentRoom.accessor) {
            angular.forEach(currentRoom.accessor.roomUsers, function (user) {
                var roomIndex = user.recentlyJoinedRooms.indexOf(currentRoom.roomId);
                if (roomIndex !== -1)
                    user.recentlyJoinedRooms.splice(roomIndex, 1);
            });
        }
    };
    // =============== HUB CLIENT METHODS ===============
    TextChatCtrl.prototype.addUserTo = function (roomId, userId) {
        var room = this.roomsService.rooms[roomId];
        if (!room)
            return; //Andriy: this case is possible when user is currently not in private room, but his connection is in private room connection list
        var user = this.chatUsersService.getUser(userId);
        if (!user) {
            // We unfortunately have cases, on the server, where a user is in a room, but not in the chat, or vice versa. That, inevitably causes some issues if we don't catch it
            this.$log.signalRWarn("UserIdNotFoundInAddUserTo", { userId: userId });
            return;
        }
        user.recentlyJoinedRooms.push(roomId);
        room.accessor.addUser(user);
    };
    TextChatCtrl.prototype.addInitialUsersTo = function (roomId, initialUsers) {
        var _this = this;
        // Wrapped in a try-catch because this is called by SignalR, which swallow errorsand prevent them from being logged remotely :-(
        var room = this.roomsService.rooms[roomId];
        if (!room)
            return; // Happens when the user has closed the room before the list of users arrived to the client
        // Timeout is there to try to deal with the occasional issue on first load of the chat: "AddInitialUsersTo = TypeError: Cannot read property 'addUser' of undefined"
        this.$timeout(function () {
            angular.forEach(initialUsers, function (userId) {
                var user = _this.chatUsersService.getUser(userId);
                if (user) {
                    user.recentlyJoinedRooms = [];
                    room.accessor.addUser(user);
                }
                else {
                    // We unfortunately have cases, on the server, where a user is in a room, but not in the chat, or vice versa. That, inevitably causes some issues if we don't catch it
                    _this.$log.signalRWarn("UserIdNotFoundInAddInitialUsersTo", { userId: userId });
                }
            });
            // Add the local user to the user list
            var user = _this.localUser;
            user.isSelf = true;
            user.recentlyJoinedRooms = [];
            _this.roomsService.rooms[roomId].accessor.addUser(user);
        });
    };
    TextChatCtrl.prototype.addInitialMessages = function (messages) {
        var _this = this;
        this.$timeout(function () {
            angular.forEach(messages, function (msg) {
                if (!_this.isUserMuted(msg.userId)) {
                    _this.setMessageOrigin(msg); // TODOLATER: Optimally, the message send would have the origin initialized properly
                    var room = _this.roomsService.rooms[msg.roomId];
                    if (!room)
                        return; // Happens when the user has closed the room before the list of users arrived to the client
                    room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text);
                    room.accessor.resetLastSeenMark();
                }
            });
            // Enable rooms view
            // Unfortunately, we can't target a particular room, because initialMessages doesn't group messages by room. 
            // Rooms are only indicated within individiual messages. There can be many rooms in the list of messages,
            // or even none if a room has no message. Hence, we need to enable all rooms. That's quite suboptimal. 
            angular.forEach(_this.roomsService.rooms, function (room) { return room.accessor.loading = false; });
            //Enable Chat view
            _this.spinnerService.showSpinner.show = false;
            _this.$scope.$apply();
        });
    };
    TextChatCtrl.prototype.addChatRequest = function (user) {
        // Exit if...
        if (this.userService.getUser().isNoPrivateChat)
            return;
        if (this.chatRequests[user.userId]) {
            this.chatRequests[user.userId].isMissed = false;
            return;
        }
        // Add the request
        this.chatRequests[user.userId] = { user: user, isNew: true, isMissed: false, isRejected: false };
        // Notify user
        this.soundNotifificationOfNewInvite();
        this.$scope.hasNewChatRequests = true;
        this.showPopupInvitation(this.chatRequests[user.userId]);
    };
    TextChatCtrl.prototype.hideRequest = function (userId) {
        var invitedToRoomId = this.roomsService.privateRoomIdFrom(userId);
        this.textHub.emit("servicePostTo", invitedToRoomId, 6, undefined);
        this.chatRequests[userId].isRejected = true;
        if (this.$scope.currentChatRequestsCount() === 0)
            this.statesService.go(States.textChatLobby.name);
    };
    TextChatCtrl.prototype.activateAudioCallRequestFor = function (roomId) {
        if (this.audioCallRequests.contains(roomId))
            this.audioCallRequested(roomId);
        this.audioCallRequests.remove(roomId);
    };
    TextChatCtrl.prototype.addUserToChat = function (args) {
        var user = new TextChatUser(args);
        user.isPinned = this.contactsService.isUserInContacts(user.userId);
        user.isSelf = user.userId === this.localUser.userId;
        this.chatUsersService.addUser(user);
        user.recentlyJoinedRooms.push(Config.lobbySpecialRoom.name);
        if (this.chatRequests[user.userId])
            this.chatRequests[user.userId].isMissed = false;
    };
    TextChatCtrl.prototype.isAudioCallAllowed = function (roomId) {
        // Check if any other room currently has audioCall activity
        for (var id in this.roomsService.rooms) {
            if (this.roomsService.rooms[id].audioCallState) {
                this.renderAudioCallChatMessage(roomId, "busy");
                return false;
            }
        }
        return true;
    };
    TextChatCtrl.prototype.audioCallCancelled = function (roomId) {
        this.$log.appInfo("AudioCallCancelled", { roomId: roomId });
        this.decreaseNotificationCount();
        this.audioCallCleanup(roomId);
    };
    TextChatCtrl.prototype.audioCallDeclined = function (roomId, reason) {
        this.$log.appInfo("AudioCallDeclined", { roomId: roomId });
        var room = this.roomsService.rooms[roomId];
        if (!room || this.audioCallRequests.contains(roomId)) {
            this.audioCallCleanup(roomId);
            return;
        }
        this.audioCallCleanup(roomId);
        reason = "peer_" + reason;
        // Map Reason to message
        var messageKey = reason;
        if (reason.indexOf("unsupported") > -1)
            messageKey = "peer_unsupported";
        if (reason.indexOf("leftRoom") > -1)
            messageKey = "peer_disconnected";
        this.renderAudioCallChatMessage(roomId, messageKey);
        // Stop the audio call;
        this.simpleWebRtcService.stopAudioCall(reason);
    };
    TextChatCtrl.prototype.audioCallHangouted = function (roomId, userId) {
        this.$log.appInfo("AudioCallHungUp", { roomId: roomId });
        if (userId === this.localUser.userId)
            return;
        if (!this.roomsService.rooms[roomId])
            return;
        this.finishAudioCall(roomId, "peer_hangout");
    };
    TextChatCtrl.prototype.finishAudioCall = function (roomId, reason) {
        var _this = this;
        if (reason === void 0) { reason = "hangout"; }
        var room = this.roomsService.rooms[roomId];
        if (room && (!room.audioCallState || room.audioCallState === "finishing"))
            return;
        var eventData = { roomId: roomId, userId: this.localUser.userId, reason: reason };
        this.$log.appInfo("AudioCallFinishing", eventData);
        this.audioCallCleanup(roomId);
        if (room)
            room.audioCallState = "finishing";
        this.renderAudioCallChatMessage(roomId, reason);
        this.simpleWebRtcService.stopAudioCall(reason).then(function () {
            if (room)
                room.audioCallState = null;
            _this.$log.appInfo("AudioCallFinished", eventData);
        });
    };
    TextChatCtrl.prototype.cancelAudioCallTimeout = function () {
        if (this.requestAudioCallTimeoutPromise) {
            this.$timeout.cancel(this.requestAudioCallTimeoutPromise);
            this.requestAudioCallTimeoutPromise = null;
        }
    };
    TextChatCtrl.prototype.renderAudioCallChatMessage = function (roomId, reason) {
        var _this = this;
        var messageText;
        switch (reason) {
            case "busy":
                messageText = this.audioMessages.busy;
                break;
            case "unsupported_device":
                messageText = this.audioMessages.unsupportedDevice;
                break;
            case "unsupported_browser":
                messageText = this.audioMessages.unsupportedBrowser;
                break;
            case "unsupported_join":
                messageText = this.audioMessages.unsupportedJoin;
                break;
            case "decline_unsupported_device":
                messageText = this.audioMessages.declineUnsupportedDevice;
                break;
            case "decline_unsupported_browser":
                messageText = this.audioMessages.declineUnsupportedBrowser;
                break;
            case "decline_busy":
                messageText = this.audioMessages.declineBusy;
                break;
            case "peer_declined":
                messageText = this.audioMessages.peerDeclined;
                break;
            case "peer_unsupported":
                messageText = this.audioMessages.peerUnsupported;
                break;
            case "peer_busy":
                messageText = this.audioMessages.peerBusy;
                break;
            case "hangout":
                messageText = this.audioMessages.hangout;
                break;
            case "peer_hangout":
                messageText = this.audioMessages.peerHangout;
                break;
            case "peer_disconnected":
                messageText = this.audioMessages.peerDisconnected;
                break;
            default:
                this.$log.appError("FailedToMapReasonToMessage", { reason: reason });
                return;
        }
        // Display the message in the chat
        var text = JSON.stringify({ audioMessage: messageText });
        this.$timeout(function () { return _this.roomsService.rooms[roomId].accessor.addMessage(MessageOrigin.system, null, null, null, text); }); // Timeout b/c automated responses arrive too soon when activateAudioCallRequestFor() is triggered
    };
    TextChatCtrl.prototype.audioCallCleanup = function (roomId) {
        this.cancelAudioCallTimeout();
        var room = this.roomsService.rooms[roomId];
        if (room)
            room.audioCallState = null;
        // Clean the private room audioState
        if (this.audioCallRequests.contains(roomId)) {
            this.audioCallRequests.remove(roomId);
        }
    };
    TextChatCtrl.prototype.peerCreatedHandler = function (room, peer) {
        var _this = this;
        if (!room.audioCallState)
            return; // room has to be in init or requested audio call state;
        if (room.audioCallState !== "connected") {
            this.$log.appInfo("AudioCallConnected", { roomId: room.roomId, userId: this.localUser.userId });
            this.cancelAudioCallTimeout();
            room.audioCallState = "connected";
            var text = JSON.stringify({ audioStarted: this.audioMessages.youreConnected });
            room.accessor.addMessage(MessageOrigin.system, null, null, null, text);
            this.textHub.emit("audioCallConnected", room.roomId);
        }
        if (!peer || !peer.pc)
            return;
        peer.pc.on("iceConnectionStateChange", function (event) {
            if (peer.pc.iceConnectionState === "closed") {
                if (!room.audioCallState)
                    return; // room has to be in connected call state
                _this.finishAudioCall(room.roomId, "peer_disconnected");
            }
        });
    };
    // ======= Unsorted Methods ====
    TextChatCtrl.prototype.increaseNotificationCount = function () {
        if (this.$state.includes(States.textChat.name) === false) {
            var counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            this.countersService.setCounterValue(Services.Counters.TextChat, counterVal + 1);
        }
    };
    TextChatCtrl.prototype.decreaseNotificationCount = function () {
        if (this.$state.includes(States.textChat.name) === false) {
            var counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            if (counterVal > 0)
                this.countersService.setCounterValue(Services.Counters.TextChat, counterVal - 1);
        }
    };
    TextChatCtrl.prototype.onRoomInputKeyDown = function ($event, roomId) {
        var sortedRoomIds = Object.keys(this.roomsService.rooms);
        // Move undocked rooms to the end of the array
        var fxMoveRoomToEnd = function (room) { return sortedRoomIds.push(sortedRoomIds.splice(sortedRoomIds.indexOf(room.roomId), 1)[0]); };
        this.$scope.undockedRooms.forEach(fxMoveRoomToEnd);
        if (sortedRoomIds.length <= 1)
            return;
        var roomIdIndex = sortedRoomIds.indexOf(roomId);
        //Arrow Up = 38 
        if ($event.keyCode === 38 && roomIdIndex > 0) {
            if (this.roomsService.rooms[roomId].isUndocked)
                this.roomsService.rooms[sortedRoomIds[roomIdIndex - 1]].accessor.setFocusOnInput();
            this.showRoom(sortedRoomIds[roomIdIndex - 1]);
        }
        // Arrow Down = 40
        if ($event.keyCode === 40 && roomIdIndex < sortedRoomIds.length - 1) {
            var nextRoomIndex = roomIdIndex + 1;
            var selectedRoom = this.roomsService.rooms[sortedRoomIds[nextRoomIndex]];
            if (!selectedRoom.isUndocked)
                this.showRoom(sortedRoomIds[nextRoomIndex]);
            else
                selectedRoom.accessor.setFocusOnInput();
        }
    };
    TextChatCtrl.prototype.showPopupInvitation = function (chatRequest) {
        if (!this.$scope.isInvitePopupShown) {
            this.$scope.isInvitePopupShown = true;
            this.$scope.popupChatRequest = chatRequest;
        }
    };
    TextChatCtrl.prototype.addMutedUserIdToCookies = function (userId) {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (!cookiesValueString)
            cookiesValueString = "[]";
        var mutedUsers = JSON.parse(cookiesValueString);
        if (!mutedUsers.some(function (id) { return id === userId; }))
            mutedUsers.push(userId);
        this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
    };
    TextChatCtrl.prototype.isUserMuted = function (userId) {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (!cookiesValueString)
            return false;
        var mutedUsers = JSON.parse(cookiesValueString);
        return mutedUsers.some(function (id) { return id === userId; });
    };
    TextChatCtrl.prototype.removeMutedUserIdFromCookies = function (userId) {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (cookiesValueString) {
            var mutedUsers = JSON.parse(cookiesValueString);
            var indx = mutedUsers.indexOf(userId);
            if (indx !== -1) {
                mutedUsers.splice(indx, 1);
                this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
            }
        }
    };
    TextChatCtrl.prototype.applyPendingStateRequest = function () {
        if (this.pendingStateRequest)
            this.applyStateChange(this.pendingStateRequest);
        this.pendingStateRequest = null;
    };
    TextChatCtrl.audioCallRequestTimeoutInMs = 2 * 60 * 1000; // 2 mins
    TextChatCtrl.userDeadAfter = 7 * 24 * 3600 * 1000; // 7 days
    TextChatCtrl.userIdleAfter = 45 * 60 * 1000; // 45 mins 
    TextChatCtrl.bootOfEnglishAfter = 30 * 60 * 1000; // 15 mins 
    // =============== CONSTRUCTOR =============== 
    TextChatCtrl.$inject = ["$scope", "$log", "$cookies", "$timeout", "$state", "$uibModal", "spinnerService", "chatUsersService", "userService",
        "$connection", "textHubService", "simpleWebRtcService", "countersService", "statesService", "textChatSettings", "serverResources",
        "contactsService", "textChatRoomsService"];
    return TextChatCtrl;
}());
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬ CLASSES AND ENUMS FOR THIS CONTROLLER ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
var MessageOrigin = (function () {
    function MessageOrigin() {
    }
    MessageOrigin.self = "Self";
    MessageOrigin.otherUser = "OtherUser";
    MessageOrigin.news = "News";
    MessageOrigin.system = "System";
    return MessageOrigin;
}());
;
var TextChatUser = (function () {
    function TextChatUser(user) {
        this.isSelf = false;
        this.recentlyJoinedRooms = [];
        this.isPinned = false;
        for (var prop in user)
            this[prop] = user[prop];
    }
    return TextChatUser;
}());
var TextChat;
(function (TextChat) {
    var TextChatLobbyController = (function () {
        function TextChatLobbyController($scope, $uibModal, chatUsersService, userService, contactsService, statesService, serverResources) {
            var _this = this;
            this.$uibModal = $uibModal;
            this.chatUsersService = chatUsersService;
            this.userService = userService;
            this.contactsService = contactsService;
            this.statesService = statesService;
            this.serverResources = serverResources;
            this.onlineUsers = this.chatUsersService.onlineUsers;
            this.idleUsers = this.chatUsersService.idleUsers;
            this.justLeftUsers = this.chatUsersService.justLeftUsers;
            this.lobbyRoomId = Config.lobbySpecialRoom.name;
            this.isRoomJoined = function (roomId) { return _this.joinedRooms[roomId]; };
            this.languages = Languages.languagesById;
            this.countries = this.serverResources.getCountries();
            var currentUser = this.userService.getUser();
            _a = this.getCustomListsOfRooms(currentUser), this.preferredRooms = _a[0], this.otherRooms = _a[1];
            // Watch for changes in the count of users
            $scope.$watchCollection(function () { return _this.chatUsersService.countOfUsers; }, function (newCounts) {
                _this.privateUsersCount = newCounts.inPrivateRooms;
                _this.secretRoomsUsersCount = newCounts.inSecretRooms;
            });
            $scope.$watchCollection(function () { return _this.chatUsersService.countOfUsers.forPublicRooms; }, function (newCounts) {
                var allRooms = _this.preferredRooms.concat(_this.otherRooms);
                angular.forEach(allRooms, function (room) { return room.countOfUsers = newCounts[room.roomId]; });
            });
            var _a;
        }
        TextChatLobbyController.prototype.getCustomListsOfRooms = function (user) {
            var _this = this;
            var preferredRooms = new Array();
            var userLangIds = [user.knows, user.knows2, user.learns, user.learns2].filter(function (n) { return n !== null; }); // filter removes null elements
            angular.forEach(userLangIds, function (langId) {
                var language = Languages.languagesById[langId];
                var room = { roomId: language.name, roomLabel: language.text, countOfUsers: _this.chatUsersService.countOfUsers[language.name], iconCssClass: "chat-room-icon" };
                preferredRooms.push(room);
            });
            var otherRooms = new Array();
            angular.forEach(Config.publicChatRooms, function (roomDefinition) {
                if (userLangIds.some(function (id) { return Languages.languagesById[id].name === roomDefinition.name; }))
                    return;
                var room = { roomId: roomDefinition.name, roomLabel: roomDefinition.text, countOfUsers: _this.chatUsersService.countOfUsers[roomDefinition.name], iconCssClass: "chat-room-icon" };
                switch (roomDefinition.name) {
                    case Config.TopicChatRooms.hellolingo.name:
                        room.iconCssClass = "about-icon";
                        preferredRooms.push(room);
                        break;
                    default: otherRooms.push(room);
                }
            });
            return [preferredRooms, otherRooms];
        };
        TextChatLobbyController.prototype.chooseMember = function (userId) {
            var _this = this;
            var userInModal = this.chatUsersService.getUser(Number(userId));
            this.$uibModal.open({
                templateUrl: "text-chat-user-modal.tpl",
                controller: "TextChatUserModalCtrl",
                controllerAs: "modal",
                resolve: {
                    userInModal: function () { return userInModal; },
                    invite: function () { return function (user) { return _this.goToPrivate({ user: user }); }; },
                    showChatButton: true,
                    showMuteButton: true,
                    switchUserMute: function () { return function () { return _this.switchUserMute({ userId: userInModal.userId }); }; },
                    isMuted: function () { return function () { return _this.isUserMuted({ userId: userInModal.userId }); }; }
                }
            }).result.finally(function () {
                userInModal.isPinned = _this.contactsService.isUserInContacts(userInModal.userId);
            });
        };
        TextChatLobbyController.prototype.sortUsersByName = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Name);
        };
        TextChatLobbyController.prototype.sortUsersByKnows = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Knows);
        };
        TextChatLobbyController.prototype.sortUsersByLearns = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Learns);
        };
        TextChatLobbyController.prototype.sortUsersByCountry = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Country);
        };
        TextChatLobbyController.$inject = ["$scope", "$uibModal", "chatUsersService", "userService", "contactsService", "statesService", "serverResources"];
        return TextChatLobbyController;
    }());
    TextChat.TextChatLobbyController = TextChatLobbyController;
})(TextChat || (TextChat = {}));
var TextChat;
(function (TextChat) {
    var TextChatLobbyDirective = (function () {
        function TextChatLobbyDirective() {
            this.link = function ($scope, element, attr, lobby) { };
            this.$scope = {};
            this.templateUrl = "text-chat-lobby.tpl";
            this.controller = "TextChatLobbyCtrl";
            this.controllerAs = "lobby";
            this.bindToController = {
                joinedRooms: "=",
                goToPrivate: "&",
                isUserMuted: "&",
                switchUserMute: "&"
            };
            this.rerstrict = "E";
            this.replace = true;
        }
        return TextChatLobbyDirective;
    }());
    TextChat.TextChatLobbyDirective = TextChatLobbyDirective;
})(TextChat || (TextChat = {}));
var TextChat;
(function (TextChat) {
    var TextChatUserModalCtrl = (function () {
        function TextChatUserModalCtrl(statesService, $uibModalInstance, userInModal, invite, showChatButton, showMuteButton, switchUserMute, isMuted) {
            var _this = this;
            this.statesService = statesService;
            this.$uibModalInstance = $uibModalInstance;
            this.userInModal = userInModal;
            this.invite = invite;
            this.showChatButton = showChatButton;
            this.showMuteButton = showMuteButton;
            this.switchUserMute = switchUserMute;
            this.isMuted = isMuted;
            this.closeModal = function () { return _this.$uibModalInstance.close(); };
        }
        TextChatUserModalCtrl.prototype.goToPrivateChat = function () {
            this.invite(this.userInModal);
            this.$uibModalInstance.close();
        };
        TextChatUserModalCtrl.prototype.goToMailbox = function () {
            var mailBoxMemberStateParams = {
                id: this.userInModal.userId,
                isNew: "new"
            };
            this.statesService.go(States.mailboxUser.name, mailBoxMemberStateParams);
            this.$uibModalInstance.close();
        };
        TextChatUserModalCtrl.$inject = ["statesService", "$uibModalInstance", "userInModal", "invite", "showChatButton", "showMuteButton", "switchUserMute", "isMuted"];
        return TextChatUserModalCtrl;
    }());
    TextChat.TextChatUserModalCtrl = TextChatUserModalCtrl;
})(TextChat || (TextChat = {}));
var Validation;
(function (Validation) {
    //Andriy: This will overwrite the default Angular email validator with more strict rules
    var ValidationEmailDirective = (function () {
        function ValidationEmailDirective() {
            var _this = this;
            //Regex tested against 15K existing addresses and adjusted for new TLDs. No need to support IP Adresses
            this.emailRegexp = /^[_a-z0-9]+[a-z0-9.+-]*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,15}$/i;
            this.require = "ngModel";
            this.restrict = "A";
            this.link = function (scope, elm, attrs, ctrl) {
                var emailRegExpLocal = _this.emailRegexp;
                if (ctrl && ctrl.$validators.email) {
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || emailRegExpLocal.test(modelValue);
                    };
                }
            };
        }
        return ValidationEmailDirective;
    }());
    Validation.ValidationEmailDirective = ValidationEmailDirective;
})(Validation || (Validation = {}));
/// <reference path="../../Scripts/typings/signalr/signalr.d.ts" />
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutCtrl = (function () {
        function VoiceOutCtrl($scope, $log, $http, $cookies, $timeout, $interval, $state, $uibModal, countersService, spinnerService, serverResources) {
            var _this = this;
            this.$scope = $scope;
            this.$log = $log;
            this.$http = $http;
            this.$cookies = $cookies;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.countersService = countersService;
            this.serverResources = serverResources;
            this.$scope.loading = true;
            this.assignScopeMembers();
            this.getInvitesAndRequests();
            $scope.$on(StatesHelper.UiStateEventNames.$stateChangeStart, function (event, toState) {
                switch (toState.name) {
                    case States.voiceOutInvite.name:
                        if (!_this.$scope.isActivated || !_this.$scope.hasActivePlatforms()) {
                            event.preventDefault();
                            _this.$state.go(States.voiceOutLobby.name);
                            spinnerService.showSpinner.show = false;
                        }
                        break;
                    case States.voiceOutRequests.name:
                        if (!_this.$scope.isActivated) {
                            event.preventDefault();
                            _this.$state.go(States.voiceOutLobby.name);
                            spinnerService.showSpinner.show = false;
                        }
                        else {
                            _this.$scope.loading = true;
                            _this.loadReplies().then(function () { _this.$scope.loading = false; });
                            _this.$http.post("/api/voice-out/mark-requests-collected", null);
                            _this.countersService.resetCounter(Services.Counters.VoiceOut);
                        }
                        break;
                }
            });
            if ($state.is(States.voiceOutRequests.name))
                this.initVoiceOutRequestsState();
            $scope.$on("$destroy", function () {
                if (_this.loadRepliesIntervalPromise)
                    _this.$interval.cancel(_this.loadRepliesIntervalPromise);
            });
        }
        VoiceOutCtrl.prototype.assignScopeMembers = function () {
            var _this = this;
            this.$scope.countries = this.serverResources.getCountries();
            this.$scope.languages = Languages.languagesById;
            this.$scope.isStateLobby = function () { return _this.$state.includes(States.voiceOutLobby.name); };
            this.$scope.isStateInvite = function () { return _this.$state.includes(States.voiceOutInvite.name); };
            this.$scope.isStateRequests = function () { return _this.$state.includes(States.voiceOutRequests.name); };
            this.$scope.hasActivePlatforms = function () {
                return _this.$scope.platforms.filter(function (p) { return p.isActivated; }).length;
            };
        };
        VoiceOutCtrl.prototype.getInvitesAndRequests = function () {
            var _this = this;
            this.$http.get(Config.EndPoints.getVoiceOutState)
                .then(function (stateResponse) {
                _this.$scope.loading = false;
                var state = stateResponse.data;
                _this.$scope.isActivated = state.isActivated;
                _this.$scope.platforms = state.platforms;
                _this.$scope.invites = state.invites;
                _this.$scope.requests = state.requests;
                var isInviteStateWithNoActivePlatforms = _this.$state.includes(States.voiceOutInvite.name) &&
                    !_this.$scope.hasActivePlatforms();
                if (!state.isActivated || isInviteStateWithNoActivePlatforms)
                    _this.$state.go(States.voiceOutLobby.name);
            });
            this.loadRepliesIntervalPromise = this.$interval(function () {
                _this.loadReplies();
            }, 5 * 60 * 1000);
        };
        VoiceOutCtrl.prototype.loadReplies = function () {
            var _this = this;
            var promise = this.$http.get(Config.EndPoints.getVoiceOutRequests);
            promise.then(function (res) {
                _this.$scope.requests = res.data;
            });
            return promise;
        };
        VoiceOutCtrl.prototype.initVoiceOutRequestsState = function () {
            this.loadReplies();
            this.$http.post("/api/voice-out/mark-requests-collected", null);
            this.countersService.resetCounter(Services.Counters.VoiceOut);
        };
        VoiceOutCtrl.$inject = ["$scope", "$log", "$http", "$cookies", "$timeout", "$interval", "$state", "$uibModal", "countersService", "spinnerService", "serverResources"];
        return VoiceOutCtrl;
    }());
    VoiceOut.VoiceOutCtrl = VoiceOutCtrl;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutLobby = (function () {
        function VoiceOutLobby() {
            this.restrict = "AE";
            this.scope = {
                platforms: "=",
                isActivated: "=",
                invitationsReceived: "=",
                invitationsSent: "=",
                isInviteAllowed: "="
            };
            this.templateUrl = "/Partials/Voice-Out-Lobby";
            this.controller = VoiceOutLobbyController;
            this.controllerAs = "ctrl";
        }
        return VoiceOutLobby;
    }());
    VoiceOut.VoiceOutLobby = VoiceOutLobby;
    var VoiceOutLobbyController = (function () {
        function VoiceOutLobbyController($scope, $log, $http) {
            this.$scope = $scope;
            this.$log = $log;
            this.$http = $http;
        }
        VoiceOutLobbyController.prototype.toggleState = function ($event) {
            var targetEndPoint = this.$scope.isActivated ? "/api/voice-out/deactivate" : "/api/voice-out/activate";
            this.$http.post(targetEndPoint, null);
            this.$scope.isActivated = !this.$scope.isActivated;
        };
        VoiceOutLobbyController.prototype.togglePlatform = function (platform) {
            this.$http.post("/api/voice-out/set-platform", {
                platformId: platform.id,
                activated: !platform.isActivated,
                platformName: platform.platformName,
                platformUserId: platform.platformUserId
            });
        };
        VoiceOutLobbyController.$inject = ["$scope", "$log", "$http"];
        return VoiceOutLobbyController;
    }());
    VoiceOut.VoiceOutLobbyController = VoiceOutLobbyController;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutRequests = (function () {
        function VoiceOutRequests() {
            this.restrict = "AE";
            this.templateUrl = "/Partials/Voice-Out-Requests";
            this.scope = {
                requests: "=",
                isInviteAllowed: "="
            };
            this.controller = VoiceOutRequestsCtrl;
            this.controllerAs = "ctrl";
            this.bindToController = {
                platforms: "="
            };
        }
        return VoiceOutRequests;
    }());
    VoiceOut.VoiceOutRequests = VoiceOutRequests;
    var VoiceOutRequestsCtrl = (function () {
        function VoiceOutRequestsCtrl($scope, $log, $http, $state, $uibModal, modalService, serverResources) {
            var _this = this;
            this.$scope = $scope;
            this.$log = $log;
            this.$http = $http;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.modalService = modalService;
            this.serverResources = serverResources;
            this.$scope.currentRequestsCount = function () { return _this.$scope.requests ? _this.$scope.requests.filter(function (r) { return !r.isSeen; }).length : 0; };
            this.$scope.seenRequestsCount = function () { return _this.$scope.requests ? _this.$scope.requests.filter(function (r) { return r.isSeen; }).length : 0; };
            this.$scope.languages = Languages.languagesById;
            this.$scope.countries = serverResources.getCountries();
        }
        VoiceOutRequestsCtrl.prototype.showRequestModal = function (request) {
            this.markRequestAsSeen(request);
            var pristinePlatforms = angular.copy(this.platforms).map(function (p) { return angular.extend(p, { isActivated: true, platformUserId: "" }); });
            var contacts = [];
            for (var platform in request.contactInfo) {
                var pl = pristinePlatforms.filter(function (p) { return p.platformName.toLowerCase() === platform.toLowerCase(); })[0];
                pl.platformUserId = request.contactInfo[platform];
                contacts.push(pl);
            }
            this.$uibModal.open({
                templateUrl: "voice-out-request-modal-template.tpl",
                controller: "VoiceOutRequestModalCtrl",
                controllerAs: "rm",
                resolve: {
                    user: function () { return request.fromUser; },
                    contacts: function () { return contacts; }
                }
            });
        };
        VoiceOutRequestsCtrl.prototype.closeRequest = function (request) {
            var _this = this;
            this.serverResources.getVoiceOutRequestResources().then(function (translate) {
                var modalMessage = "<h4 class=\"text-center\">" + translate.deleteInviteConfirm + "</h4>";
                _this.modalService.open(modalMessage, [
                    { label: "" + translate.yes, cssClass: "btn btn-warning", result: true },
                    { label: "" + translate.no, cssClass: "btn btn-success", result: false }
                ])
                    .then(function (result) {
                    if (!result)
                        return;
                    _this.$http.post("/api/voice-out/mark-request-closed", { fromId: request.fromId });
                    _this.$scope.requests.splice(_this.$scope.requests.indexOf(request), 1);
                });
            });
        };
        VoiceOutRequestsCtrl.prototype.markRequestAsSeen = function (request) {
            //Andriy: I think we should have the same logic as for other features, if user comes to feature, counter comes to 0.
            //this.countersService.setCounterValue(Services.Counters.VoiceOut, this.countersService.getCounterValue(Services.Counters.VoiceOut) - 1);
            if (!request.isSeen)
                this.$http.post("api/voice-out/mark-request-seen", { fromId: request.fromId });
            request.isSeen = true;
        };
        VoiceOutRequestsCtrl.$inject = ["$scope", "$log", "$http", "$state", "$uibModal", "modalService", "serverResources"];
        return VoiceOutRequestsCtrl;
    }());
    VoiceOut.VoiceOutRequestsCtrl = VoiceOutRequestsCtrl;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    /* Use ng-model or ng-checked + ng-toggle, but not ng-model + ng-toggle */
    var PlatformPill = (function () {
        function PlatformPill($parse, $timeout) {
            var _this = this;
            this.$parse = $parse;
            this.$timeout = $timeout;
            this.restrict = 'AE';
            this.require = '?ngModel';
            this.replace = true;
            this.scope = {
                platform: '=',
                ngTo: '=',
                mode: '@'
            };
            this.templateUrl = "platform-pill-template.tpl"; //Andriy:it was moved to Partials/Voice-Out.cshtml
            this.link = function (scope, elem, attrs) {
                scope.isToggleMode = scope.mode === 'toggle';
                if (scope.isToggleMode) {
                    // On click swap value and trigger ngToggle function
                    elem.click(function (e) {
                        _this.$timeout(function () { scope.platform.isActivated = !scope.platform.isActivated; });
                        if (attrs.ngToggle) {
                            var expressionHandler = _this.$parse(attrs.ngToggle);
                            expressionHandler(scope.$parent, { $platform: scope.platform });
                        }
                    });
                }
            };
        }
        PlatformPill.uniqueId = 1;
        PlatformPill.$inject = ["$parse", "$timeout"];
        return PlatformPill;
    }());
    VoiceOut.PlatformPill = PlatformPill;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutFormInviteCtrl = (function () {
        function VoiceOutFormInviteCtrl($scope, $uibModalInstance, serverResources, platforms, members) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.platforms = platforms;
            this.members = members;
            this.isAtLeastOneActiveContact = true;
            this.triedToSubmit = false;
            var membersCount = members.length;
            if (membersCount === 1) {
                this.inviteTitle = "<span class=\"first-name\">" + members[0].firstName + "</span><span class=\"last-name\">" + members[0].lastName + "</span>";
                serverResources.getVoiceOutInviteFormResources().then(function (translate) {
                    _this.shareWithLabel = translate.shareWithPartners;
                });
            }
            else {
                serverResources.getVoiceOutInviteFormResources().then(function (translate) {
                    _this.shareWithLabel = translate.shareWithPartners;
                    _this.inviteTitle = "<span class=\"first-name\">" + translate.invitingMembers + "</span><span class=\"last-name\">(" + membersCount + ")</span>";
                });
            }
        }
        VoiceOutFormInviteCtrl.prototype.inviteMember = function () {
            this.triedToSubmit = true;
            this.isAtLeastOneActiveContact = this.platforms.some(function (p) { return p.isActivated && !!p.platformUserId; });
            if (this.inviteForm.$valid && this.isAtLeastOneActiveContact) {
                var contacts = this.getInviteContacts(this.platforms);
                this.$uibModalInstance.close(contacts);
            }
        };
        VoiceOutFormInviteCtrl.prototype.closeForm = function () {
            this.$uibModalInstance.dismiss();
        };
        VoiceOutFormInviteCtrl.prototype.getInviteContacts = function (platforms) {
            var contactsData = {};
            for (var i = 0; i < platforms.length; i++) {
                if (!platforms[i].isActivated || !platforms[i].platformUserId)
                    continue;
                contactsData[platforms[i].platformName] = platforms[i].platformUserId;
            }
            return contactsData;
        };
        VoiceOutFormInviteCtrl.$inject = ["$scope", "$uibModalInstance", "serverResources", "platforms", "members"];
        return VoiceOutFormInviteCtrl;
    }());
    VoiceOut.VoiceOutFormInviteCtrl = VoiceOutFormInviteCtrl;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutInvite = (function () {
        function VoiceOutInvite($compile) {
            this.$compile = $compile;
            this.restrict = "AE";
            this.templateUrl = "/Partials/Voice-Out-Invite";
            this.link = function ($scope, element, attr, ctrl) { };
            this.controller = VoiceOut.VoiceOutInviteCtrl;
            this.controllerAs = "voInviteCtrl";
            this.bindToController = {
                invites: "=",
                platforms: "="
            };
            this.replace = true;
        }
        return VoiceOutInvite;
    }());
    VoiceOut.VoiceOutInvite = VoiceOutInvite;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutInviteCtrl = (function () {
        function VoiceOutInviteCtrl($log, voiceOutService, modalLanguagesService, modalService, $uibModal, serverResources, findMembersFilter) {
            this.$log = $log;
            this.voiceOutService = voiceOutService;
            this.modalLanguagesService = modalLanguagesService;
            this.modalService = modalService;
            this.$uibModal = $uibModal;
            this.serverResources = serverResources;
            this.findMembersFilter = findMembersFilter;
            this.selectedMemberIndexes = new Array();
            this.viewLanguageSelect = { learnId: 1 };
            this.viewLanguages = Languages.languagesById;
            this.viewIsSelectionBarShown = false;
            this.viewMaybeHasMoreMembers = true;
            this.sortParam = Filters.SortMembersBy.id;
            this.loadingMoreMemebers = false;
            this.viewCountries = serverResources.getCountries();
            this.getMembers();
        }
        Object.defineProperty(VoiceOutInviteCtrl.prototype, "viewLearnLangLabel", {
            get: function () {
                var lang = this.viewLanguages[this.viewLanguageSelect.learnId];
                return lang ? lang.text : "               "; // !!! These are special non-breakable white spaces! Do not replace with normal spaces
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VoiceOutInviteCtrl.prototype, "viewKnowLangLabel", {
            get: function () {
                var lang = this.viewLanguages[this.viewLanguageSelect.knownId];
                return lang ? lang.text : "               "; // !!! These are special non-breakable white spaces! Do not replace with normal spaces
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VoiceOutInviteCtrl.prototype, "viewSelectedMembersCount", {
            get: function () { return this.selectedMemberIndexes.length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VoiceOutInviteCtrl.prototype, "filteredMembers", {
            get: function () {
                this.viewVoiceOutMembers = this.findMembersFilter(this.viewVoiceOutMembers, this.sortParam);
                return this.viewVoiceOutMembers;
            },
            enumerable: true,
            configurable: true
        });
        VoiceOutInviteCtrl.prototype.viewInviteMember = function ($event, memberIndex) {
            if ($event)
                $event.stopPropagation();
            this.clearMembersSelection();
            this.selectedMemberIndexes.push(memberIndex);
            this.inviteMembers(false);
        };
        VoiceOutInviteCtrl.prototype.viewIsMemberInvited = function (member) {
            return angular.isArray(this.invites) && this.invites.some(function (i) { return i == member.id; });
        };
        VoiceOutInviteCtrl.prototype.viewShowMemberProfile = function (memberIndex, member) {
            var _this = this;
            var modalInstance = this.$uibModal.open({
                template: "<div class='modal-content'>\n                              <profile-view user='ctrl.memberData' \n                                            show-buttons='true'\n                                            mail-button='true'\n                                            is-mail-dimmed ='true'\n                                            go-to-mailbox='ctrl.goToMailbox()'\n                                            voice-out-invite-button = '" + (!this.viewIsMemberInvited(member) ? 'true' : 'false') + "'\n                                            goto-voiceout-invite='ctrl.voiceOutInvite()'\n                                            load-profile='true'></profile-view>\n                           </div>",
                controller: VoiceOut.VoiceOutProfileModalCtrl,
                controllerAs: "ctrl",
                resolve: {
                    member: function () { return member; }
                }
            });
            modalInstance.result.then(function (toInvite) { if (toInvite)
                _this.viewInviteMember(undefined, memberIndex); });
        };
        VoiceOutInviteCtrl.prototype.viewSelectMember = function (memberIndex) {
            var index = this.selectedMemberIndexes.indexOf(memberIndex);
            if (index === -1)
                this.selectedMemberIndexes.push(memberIndex);
            else
                this.selectedMemberIndexes.splice(index, 1);
            this.viewIsSelectionBarShown = !(this.selectedMemberIndexes.length === 0);
        };
        VoiceOutInviteCtrl.prototype.viewInviteSelectedMembers = function () {
            this.inviteMembers(true);
        };
        VoiceOutInviteCtrl.prototype.viewClearInviteSelection = function () {
            this.clearMembersSelection();
        };
        VoiceOutInviteCtrl.prototype.inviteMembers = function (multiple) {
            var _this = this;
            var membersToInvite = new Array();
            this.selectedMemberIndexes.forEach(function (index) {
                membersToInvite.push(_this.viewVoiceOutMembers[index]);
            });
            var inviteData = this.$uibModal.open({
                templateUrl: "voice-out-invite-modal-template.tpl",
                controller: VoiceOut.VoiceOutFormInviteCtrl,
                resolve: {
                    platforms: function () { return angular.copy(_this.platforms.filter(function (p) { return p.isActivated; })); },
                    members: function () { return membersToInvite; }
                },
                controllerAs: "vif"
            });
            inviteData.result.then(function (contacts) {
                var memberIdsToInvite = _this.selectedMemberIndexes.map(function (index) { return _this.viewVoiceOutMembers[index].id; });
                _this.voiceOutService.invite(memberIdsToInvite, contacts).then(function () {
                    _this.invites = _this.invites.concat(memberIdsToInvite);
                    _this.selectedMemberIndexes.forEach(function (index) { _this.viewVoiceOutMembers[index].invited = true; });
                    _this.clearMembersSelection();
                    var _loop_1 = function(platformName) {
                        platform = _this.platforms.filter(function (p) { return p.platformName === platformName; })[0];
                        platform.platformUserId = contacts[platformName];
                    };
                    var platform;
                    for (var platformName in contacts) {
                        _loop_1(platformName);
                    }
                });
            }, function () {
                if (!multiple)
                    _this.clearMembersSelection();
            });
        };
        VoiceOutInviteCtrl.prototype.clearMembersSelection = function () {
            var _this = this;
            this.selectedMemberIndexes.forEach((function (i) { return _this.viewVoiceOutMembers[i].selected = false; }));
            this.selectedMemberIndexes.splice(0);
            this.viewIsSelectionBarShown = false;
        };
        VoiceOutInviteCtrl.prototype.getMembers = function () {
            var _this = this;
            this.loadingMoreMemebers = true;
            this.viewMaybeHasMoreMembers = true;
            this.voiceOutService.getVoiceOutMembers({ learnId: this.viewLanguageSelect.learnId, knownId: this.viewLanguageSelect.knownId })
                .success(function (members) {
                _this.viewVoiceOutMembers = members;
                _this.viewMaybeHasMoreMembers = angular.isArray(members) && members.length >= 100;
                _this.loadingMoreMemebers = false;
            })
                .error(function (data) { _this.$log.appWarn("LoadVoiceOutMembersFailed", data); _this.loadingMoreMemebers = false; });
        };
        VoiceOutInviteCtrl.prototype.viewGetMoreMembers = function () {
            var _this = this;
            this.loadingMoreMemebers = true;
            var currentSearchParams = { learnId: this.viewLanguageSelect.learnId, knownId: this.viewLanguageSelect.knownId };
            var belowId = this.getLowestMemberId();
            var searchParams = angular.extend({ belowId: belowId }, currentSearchParams);
            this.voiceOutService.getVoiceOutMembers(searchParams)
                .success(function (members) {
                if (members && members.length > 0) {
                    Array.prototype.push.apply(_this.viewVoiceOutMembers, members);
                }
                _this.viewMaybeHasMoreMembers = angular.isArray(members) && members.length >= 100;
                _this.loadingMoreMemebers = false;
            })
                .error(function (data) { _this.$log.appWarn("LoadMoreUsersFailed", data); _this.loadingMoreMemebers = false; });
        };
        VoiceOutInviteCtrl.prototype.handleSameLanguage = function (viewLanguageSelect, setLang) {
            if (viewLanguageSelect.knownId === viewLanguageSelect.learnId)
                switch (setLang) {
                    case "learn":
                        viewLanguageSelect.knownId = undefined;
                        break;
                    case "know":
                        viewLanguageSelect.learnId = undefined;
                        break;
                    default:
                }
        };
        VoiceOutInviteCtrl.prototype.viewSetLanguage = function (langFIlter) {
            this.handleSameLanguage(this.viewLanguageSelect, langFIlter);
            this.getMembers();
        };
        VoiceOutInviteCtrl.prototype.updateSortParam = function (param) {
            this.sortParam = param;
        };
        VoiceOutInviteCtrl.prototype.getLowestMemberId = function () {
            var memberWithLowestId = this.viewVoiceOutMembers.reduce(function (p, v) { return p.id < v.id ? p : v; });
            return memberWithLowestId.id;
        };
        VoiceOutInviteCtrl.$inject = ["$log", "voiceOutService", "modalLanguagesService", "modalService", "$uibModal", "serverResources", "findMembersFilter"];
        return VoiceOutInviteCtrl;
    }());
    VoiceOut.VoiceOutInviteCtrl = VoiceOutInviteCtrl;
    ;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var VoiceOutProfileModalCtrl = (function () {
        function VoiceOutProfileModalCtrl(member, statesService, $uibModalInstance) {
            this.statesService = statesService;
            this.$uibModalInstance = $uibModalInstance;
            this.memberData = member;
            this.memberData.userId = member.id;
        }
        VoiceOutProfileModalCtrl.prototype.goToMailbox = function () {
            this.toInviteMember = false;
            this.$uibModalInstance.close(this.toInviteMember);
            this.statesService.go(States.mailboxUser.name, { id: this.memberData.userId, isNew: "new" });
        };
        VoiceOutProfileModalCtrl.prototype.voiceOutInvite = function () {
            this.toInviteMember = true;
            this.$uibModalInstance.close(this.toInviteMember);
        };
        VoiceOutProfileModalCtrl.$inject = ["member", "statesService", "$uibModalInstance"];
        return VoiceOutProfileModalCtrl;
    }());
    VoiceOut.VoiceOutProfileModalCtrl = VoiceOutProfileModalCtrl;
})(VoiceOut || (VoiceOut = {}));
var VoiceOut;
(function (VoiceOut) {
    var RequestModalDirective = (function () {
        function RequestModalDirective() {
            this.restrict = "E";
            this.scope = {};
            this.templateUrl = "Angular/VoiceOut/VoiceOutRequestModal/RequestModalTemplate.html";
            this.controller = RequestModalController;
            this.controllerAs = "rm";
            this.bindToController = {
                request: "="
            };
            this.replace = true;
        }
        RequestModalDirective.prototype.link = function () { };
        ;
        return RequestModalDirective;
    }());
    VoiceOut.RequestModalDirective = RequestModalDirective;
    var RequestModalController = (function () {
        function RequestModalController($scope, $http, $state, $uibModalInstance, modalService, user, contacts, serverResources) {
            this.$scope = $scope;
            this.$http = $http;
            this.$state = $state;
            this.$uibModalInstance = $uibModalInstance;
            this.modalService = modalService;
            this.user = user;
            this.contacts = contacts;
            this.serverResources = serverResources;
            this.$scope.languages = Languages.languagesById;
            this.$scope.countries = serverResources.getCountries();
            this.$scope.user = user;
            this.$scope.contacts = contacts;
        }
        RequestModalController.prototype.goToMailbox = function () {
            var mailBoxMemberStateParams = {
                id: this.$scope.user.id,
                isNew: "new"
            };
            this.$state.go(States.mailboxUser.name, mailBoxMemberStateParams);
            this.$uibModalInstance.close();
        };
        RequestModalController.prototype.toClipboard = function (text) {
            var _this = this;
            var textArea = $("<textarea />");
            textArea.css({
                position: "fixed",
                top: "0",
                left: "0",
                padding: "0",
                border: "none",
                outline: "none",
                boxShadow: "none",
                background: "transparent",
                // Ensure it has a small width and height. Setting to 1px / 1em
                // doesn't work as this gives a negative w/h on some browsers.
                width: "2em",
                height: "2em"
            });
            textArea.val(text);
            $("body").append(textArea);
            textArea.get(0).select();
            try {
                var successful = document.execCommand("copy");
                if (!successful)
                    return;
                this.$uibModalInstance.close();
                this.serverResources.getVoiceOutRequestModalResources().then(function (translate) {
                    var modalMessage = "<h4 class=\"text-center\">" + translate.contactCopiedToClipBoard + "</h4>";
                    _this.modalService.open(modalMessage, [
                        { label: "" + translate.ok, cssClass: "btn btn-success", result: true }
                    ]);
                });
            }
            catch (err) {
            }
            textArea.remove();
        };
        RequestModalController.$inject = ["$scope", "$http", "$state", "$uibModalInstance", "modalService", "user", "contacts", "serverResources"];
        return RequestModalController;
    }());
    VoiceOut.RequestModalController = RequestModalController;
})(VoiceOut || (VoiceOut = {}));
/// <reference path="References.d.ts" />
var _this = this;
//---------- Catch javascript errors -------------------------------------
// There are other mechanisms for catching angular/Ajax/SignalR errors, but they don't catch early problems (before Angular runs fully, for e.g.)
window.onerror = function (msg, url, line) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/api/log", true);
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify({
        logger: "javascript",
        level: "Error",
        path: window.location.pathname,
        message: "JavascriptError = " + JSON.stringify({ error: msg, url: url, line: line })
    }));
    debugger; // Do not remove! This helps catching errors during development
};
//---------- Configuration Settings -------------------------------------
var Config;
(function (Config) {
    // This version number is validated by the Checkpoint Api Endpoint (see CheckpointController.cs)
    // If you need to force all users to use a new version (usually for compatibility with a new server),
    // configure the endpoint the reject earlier versions
    Config.clientVersion = "113";
    var Loggers;
    (function (Loggers) {
        Loggers.client = "WebClient";
        Loggers.angular = "Angular";
        Loggers.ajax = "Ajax";
        Loggers.signalR = "SignalRClient";
    })(Loggers = Config.Loggers || (Config.Loggers = {}));
    var Ajax;
    (function (Ajax) {
        Ajax.timewarningInMs = 3000;
        Ajax.timeoutInMs = 10000;
    })(Ajax = Config.Ajax || (Config.Ajax = {}));
    var EndPoints;
    (function (EndPoints) {
        EndPoints.postDeleteAccount = "/api/account/delete";
        EndPoints.getResendEmailVerification = "/api/account/resend-email-verification";
        EndPoints.postTilesFilter = "/api/account/filter";
        EndPoints.profileUrl = "/api/account/profile";
        EndPoints.postContactUsMessage = "/api/care/message";
        EndPoints.getContactsList = "/api/contact-list";
        EndPoints.postContactsAdd = "/api/contact-list/add";
        EndPoints.postContactsRemove = "/api/contact-list/remove";
        EndPoints.remoteLog = "/api/log";
        EndPoints.postMail = "/api/mailbox/post-mail";
        EndPoints.getListOfMails = "/api/mailbox/get-list-of-mails";
        EndPoints.getMailContent = "/api/mailbox/get-mail-content";
        EndPoints.postArchiveThread = "/api/mailbox/archive";
        EndPoints.getMemberProfile = "/api/members/get-profile";
        EndPoints.postMembersList = "/api/members/list";
        EndPoints.postVoiceOutList = "/api/voice-out/list";
        EndPoints.postVoiceInvite = "/api/voice-out/invite";
        EndPoints.getVoiceOutState = "/api/voice-out/state";
        EndPoints.getVoiceOutInvites = "/api/voice-out/sent-invites";
        EndPoints.getVoiceOutRequests = "/api/voice-out/requests";
    })(EndPoints = Config.EndPoints || (Config.EndPoints = {}));
    var CookieNames;
    (function (CookieNames) {
        // Must match server-side cookie names
        CookieNames.deviceTag = "DeviceTag";
        CookieNames.oldUiCulture = "OldUiCulture";
        CookieNames.sessionTag = "SessionTag";
        CookieNames.uiCulture = "UiCulture";
        // Client cookie only
        CookieNames.playMessageAddedSound = "PlayMessageAddedSound";
        CookieNames.sharedSkypeId = "SharedSkypeId";
        CookieNames.sharedSecretRoom = "SharedSecretRoom";
        CookieNames.sharedEmailAddress = "SharedEmailAddress";
        CookieNames.playUserNewInvitation = "PlayUserNewInvitation";
        CookieNames.mutedUsers = "MutedUsers";
        CookieNames.roomsFromPreviousSession = "RoomsFromPreviousSession";
        CookieNames.lastStates = "LastStates";
    })(CookieNames = Config.CookieNames || (Config.CookieNames = {}));
    ;
    Config.lobbySpecialRoom = { name: "text-chat-lobby", text: null };
    var TopicChatRooms;
    (function (TopicChatRooms) {
        TopicChatRooms.hellolingo = { name: "hellolingo", text: "Hellolingo" };
        TopicChatRooms.topicChatStorage = {
            "hellolingo": TopicChatRooms.hellolingo
        };
    })(TopicChatRooms = Config.TopicChatRooms || (Config.TopicChatRooms = {}));
    Config.publicChatRooms = [
        Languages.english, Languages.french, Languages.spanish, Languages.german, Languages.japanese,
        Languages.korean, Languages.chinese, Languages.russian, Languages.italian, Languages.portuguese,
        Languages.dutch, Languages.persian, Languages.arabic, Languages.romanian, Languages.polish,
        Languages.greek, Languages.swedish,
        TopicChatRooms.hellolingo
    ];
    Config.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    var Regex;
    (function (Regex) {
        Regex.secretRoom = /^[a-zA-Z0-9]{6,20}$/;
    })(Regex = Config.Regex || (Config.Regex = {}));
})(Config || (Config = {}));
//---------- App Booststrap --------------------------------------------------------------------------------------
var app = angular.module("app", ["app.invitePopup", "app.filters", "ngCookies", "ct.ui.router.extras", "ui.bootstrap", "ngAnimate", "ngSanitize", "pascalprecht.translate"]);
app.config(["$locationProvider", "$httpProvider", "$stateProvider", "$stickyStateProvider", "$urlRouterProvider",
    "$connectionProvider", "$translateProvider", "serverResourcesProvider", "$cookiesProvider",
    function ($locationProvider, $httpProvider, $stateProvider, $stickyStateProvider, $urlRouterProvider, $connectionProvider, $translateProvider, serverResourcesProvider, $cookiesProvider) {
        // Create all the needed states for the app
        StatesHelper.createUiRouterStates($stateProvider);
        // 404s: Intercept unrecognized urls, report them and redirect to home page or text chat lobby.
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.get("$log").appWarn("Angular404", { url: $location.path() });
            $injector.get("$state").go(States.home.name);
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
        // ...
        $connectionProvider.hubs = ["textChatHub", "voiceChatHub"];
        //Andriy: Get translation resources from HTML and configure $translate service.
        serverResourcesProvider.setupTranslationService($translateProvider);
    }
]);
//---------- Runtime Settings --------------------------------------------------------------------------------------
var Runtime;
(function (Runtime) {
    var TextChatSettings = (function () {
        function TextChatSettings() {
        }
        Object.defineProperty(TextChatSettings, "playMessageAddedSound", {
            get: function () { return Runtime.getBooleanCookie(Config.CookieNames.playMessageAddedSound, true); },
            set: function (val) { Runtime.saveBooleanCookie(Config.CookieNames.playMessageAddedSound, val); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextChatSettings, "playUserNewInvitation", {
            get: function () { return Runtime.getBooleanCookie(Config.CookieNames.playUserNewInvitation, true); },
            set: function (val) { Runtime.saveBooleanCookie(Config.CookieNames.playUserNewInvitation, true); },
            enumerable: true,
            configurable: true
        });
        return TextChatSettings;
    }());
    Runtime.TextChatSettings = TextChatSettings;
    function getBooleanCookie(cookieName, defaultValue) {
        var val = Runtime.ngCookies.get(cookieName);
        return val == undefined ? defaultValue : val === "true";
    }
    Runtime.getBooleanCookie = getBooleanCookie;
    function saveBooleanCookie(cookieName, val) { Runtime.ngCookies.put(cookieName, val ? "true" : "false"); }
    Runtime.saveBooleanCookie = saveBooleanCookie;
})(Runtime || (Runtime = {}));
//---------- App Runtime --------------------------------------------------------------------------------------
app.run(["$rootScope", "$cookies", "$state", "$interval", "$log", "$window", "$http", "authService", "userService", "spinnerService",
    "$stickyState", "serverResources", "modalService",
    function ($rootScope, $cookies, $state, $interval, $log, $window, $http, authService, userService, spinnerService, $stickyState, serverResources, modalService) {
        // This configures the EnhancedLog. Injecting $http directly didnt work because of injection circular dependencies :-(
        Services.EnhancedLog.http = $http;
        // Needed for proper state behavior
        $rootScope.$state = $state;
        // Load cookies
        Runtime.ngCookies = $cookies;
        Runtime.uiCultureCode = $cookies.get(Config.CookieNames.uiCulture);
        Runtime.sessionTag = $cookies.get(Config.CookieNames.sessionTag);
        // Track page refresh events and window size
        $log.appInfo("InitialWindowSize", { width: $(window).innerWidth(), height: $(window).innerHeight() });
        $(window).resize(function () {
            clearTimeout(_this.resizeTimeout);
            _this.resizeTimeout = setTimeout(function () {
                $log.appInfo("WindowResized", { width: $(window).innerWidth(), height: $(window).innerHeight() });
            }, 500);
        });
        // Handle some angular state change events
        $rootScope.$on("$stateChangeStart", function (event, toState, toParam, fromState /*, fromParam*/) {
            StatesHelper.onStateChangeStart(event, toState, toParam, fromState, $log, spinnerService, authService, userService, $state, $stickyState, modalService, $cookies);
        });
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParam, fromState /*, fromParam*/) {
            $log.appInfo("StateChangeSuccess", { from: fromState.name, to: toState.name, toParam: toParam });
            spinnerService.showSpinner.show = false;
            // Force window to scoll back up. This is necessary, unless we have a fix taskbar. because the current scroll situation will remain in the target state (like when the dashboard is scrolled down and we click the find tile)
            $window.scrollTo(0, 0);
            if (toState.name === States.emailNotConfirmed.name)
                !userService.getUser().isEmailConfirmed
                    ? modalService.openEmailIsNotConfirmModal()
                    : $state.go(States.home.name);
            StatesHelper.saveOpenedStateInCookies($state, $cookies);
        });
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            $log.appError("StateChangeError", { from: fromState.name, to: toState.name });
            spinnerService.showSpinner.show = false;
            throw error; /* It's not clear if I have to rethrow errors, but some docs suggest I wouldn't otherwise catch ALL errors */
        });
        // Check with the server every 5 minutes (to report client version) and get server notifications and requests
        var checkCount = 0;
        var newClientRequestReceived = false;
        var check = function () { return $http.post("/api/check", { version: Config.clientVersion, count: checkCount++ })
            .success(function (response) {
            if (response.message && response.message.code === 0 /* NewClientRequired */) {
                if (newClientRequestReceived) {
                    $log.appInfo("ForcingPageRefreshToGetNewClient");
                    window.onbeforeunload = null; // This prevent "Confirm Navigation" Alert that verifies the user actually want to refresh the page
                    window.location.href = window.location.href;
                }
                newClientRequestReceived = true;
                serverResources.getServerResponseText(response.message.code).then(function (serverMessage) {
                    $rootScope.taskBarAlert(serverMessage);
                });
            }
        }); };
        check();
        $interval(check, 300000); // 5 minutes
        // Set message on reload/leave to prevent loss of data from user
        $window.onbeforeunload = function () {
            if (!Config.isFirefox) {
                if ($state.includes(States.signup.name) || ($state.includes(States.mailboxUser.name) && $state.params["isNew"])) {
                    $log.appInfo("PageRefreshOrClosePrevented", { state: $state.current.name });
                    return ""; //Not displaying any message at this time. It has little value (Chrome doesn't show it anyway;
                }
            }
            $log.appInfo("PageRefreshOrCloseAccepted", { state: $state.current.name });
            return undefined;
        };
    }]);
//---------- Services --------------------------------------------------------------------------------------
app.service("$log", Services.EnhancedLog); // $Log Substitute
app.service("statesService", Services.StatesService);
app.service("userService", Authentication.UserService);
app.service("authService", Authentication.AuthenticationService.factory());
app.service("spinnerService", Services.SpinnerService);
app.service("membersService", Services.MembersService);
app.service("mailboxServerService", MailBox.MailboxServerService);
app.service("chatUsersService", Services.ChatUsersService);
app.service("textChatRoomsService", Services.TextChatRoomsService);
app.service("simpleWebRtcService", Services.SimpleWebRtcService);
app.service("textHubService", Services.TextChatHubService);
app.service("voiceHubService", Services.VoiceChatHubService);
app.service("modalService", Services.ModalWindowService);
app.service("countersService", Services.TaskbarCounterService);
app.service("modalLanguagesService", Services.ModalSelectLanguageService);
app.service("voiceOutService", Services.VoiceOutService);
app.service("contactsService", Services.ContactsService);
app.service("textChatSettings", Services.TextChatSettingsService);
app.service("translationErrorsHandler", ["$log", Services.translationErrorsHandlerService]);
//---------- Providers --------------------------------------------------------------------------------------
app.provider("$connection", Services.SignalRConnectionServiceProvider);
app.provider("serverResources", Services.ServerResourcesProvider);
//---------- Controllers --------------------------------------------------------------------------------------
app.controller("TextChatCtrl", TextChatCtrl);
app.controller("TaskbarCtrl", TaskbarCtrl);
app.controller("TextChatLobbyCtrl", TextChat.TextChatLobbyController);
app.controller("FindCtrl", Find.FindMembersCtrl);
app.controller("MailboxCtrl", MailBox.MailBoxCtrl);
app.controller("VoiceOutCtrl", VoiceOut.VoiceOutCtrl);
app.controller("VoiceOutRequestModalCtrl", VoiceOut.RequestModalController);
app.controller("TextChatUserModalCtrl", TextChat.TextChatUserModalCtrl);
app.controller("UserProfileCtrl", Profile.ProfileController);
app.controller("UserProfileModalCtrl", Profile.ProfileModalController);
app.controller("ProfileLanguageSelectCtrl", Profile.LanguageSelectController);
app.controller("ContactUsCtrl", ContactUsCtrl);
app.controller("HomeFindBlockCtrl", HomeFindBlockCtrl);
//---------- Directives --------------------------------------------------------------------------------------
app.directive("optionPicker", ["$state", function ($state) { return new OptionPicker($state); }]);
app.directive("textChatRoom", ["$sce", "$cookies", "$timeout", "serverResources", "userService", "chatUsersService", "$state", function ($sce, $cookies, $timeout, serverResources, userService, chatUsersService, $state) { return new TextChatRoom($sce, $cookies, $timeout, serverResources, userService, chatUsersService, $state); }]);
app.directive("allowPattern", function () { return new AllowPattern(); });
app.directive("trimPassword", function () { return new TrimPasswordDirective(); });
app.directive("strictEmailValidator", function () { return new Validation.ValidationEmailDirective(); });
app.directive("onEnter", function () { return new OnEnter(); });
app.directive("title", ["$rootScope", "serverResources", function ($rootScope, serverResources) { return new Title($rootScope, serverResources); }]);
app.directive("focusOnShow", ["$timeout", function ($timeout) { return new FocusOnShow($timeout); }]);
app.directive("signUp", Authentication.SignUpDirective.factory());
app.directive("logInOrOut", Authentication.LogInOrOutDirective.factory());
app.directive("logIn", Authentication.LogInDirective.factory());
app.directive("showDuringChangeState", ShowDuringChangeState.factory());
app.directive("tooltipLink", function () { return new TooltipLink(); });
app.directive("textChatLobby", function () { return new TextChat.TextChatLobbyDirective; });
app.directive("inputPreparer", ["$cookies", "serverResources", function ($cookies, serverResources) { return new InputPreparer($cookies, serverResources); }]);
app.directive("messageStatus", function () { return new MailBox.MessageStatusDirective(); });
app.directive("messagesHistory", function () { return new MailBox.MessagesHistoryDirective(); });
app.directive("userProfile", function () { return new Profile.ProfileDirective(); });
app.directive("profileLanguageSelect", function () { return new Profile.ProfileLanguageSelectDirective(); });
app.directive("profileView", function () { return new ProfileViewDirective(); });
app.directive("hellolingoDashboard", function () { return new Dashboard.DashboardDirective(); });
app.directive("dashboardTile", function () { return new Dashboard.DashboardTileDirective(); });
app.directive("voiceOutLobby", function () { return new VoiceOut.VoiceOutLobby(); });
app.directive("voiceOutInvite", ["$compile", function ($compile) { return new VoiceOut.VoiceOutInvite($compile); }]);
app.directive("voiceOutRequests", function () { return new VoiceOut.VoiceOutRequests(); });
app.directive("platformPill", ["$parse", "$timeout", function ($parse, $timeout) { return new VoiceOut.PlatformPill($parse, $timeout); }]);
app.directive("pinLabel", function () { return new Dashboard.TilePinDirective(); });
app.directive("switch", ["$parse", function ($parse) { return new SwitchDirective($parse); }]);
app.directive("tileWidget", ["$parse", "$compile", "$injector", function ($parse, $compile, $injector) { return new Dashboard.WidgetTileDirective($parse, $compile, $injector); }]);
app.directive("contactsTileWidget", function () { return new Contacts.DashboardWidget(); });
app.directive("languageSelect", ["modalLanguagesService", function (modalLanguagesService) { return new LanguageSelectDirective(modalLanguagesService); }]);
app.directive("selectLanguagesWidget", ["$compile", "serverResources", function ($compile, serverResources) { return new LanguageSelectWidgetDIrective($compile, serverResources); }]);
app.directive("taskbarButton", ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log", "statesService", function (countersService, $timeout, authService, $state, $stickyState, $log, statesService) { return new TaskButtonDirective(countersService, $timeout, authService, $state, $stickyState, $log, statesService); }]);
app.directive("uiCultureDropDown", ["$templateCache", "authService", "$stickyState", "$state", "modalService", function ($templateCache, authService, $stickyState, $state, modalService) { return new UiCultureDropDown($templateCache, authService, $stickyState, $state, modalService); }]);
// ----- onFinishRender -----
// This works on ngRepeat and anything else that has a scope.$last
// Used by the taskbar-button as on-finish-render that listens to ngRepeatFinished
//app.directive("onFinishRender", ["$timeout", ($timeout): ng.IDirective => {
//  return {
//	restrict: "A",
//	link: (scope/*, element, attr*/) => {
//	  if (scope["$last"] === true) // Needed to cheat here because scope.$last isn't in TypeScript
//		$timeout(() => { scope.$emit("ngRepeatFinished"); });
//	}
//  };
//}]);
//---------- Custom provider --------------------------------------------------------------------------------------
app.config(["$httpProvider", function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get)
            $httpProvider.defaults.headers.get = {}; // Initialize get if not there
        // Disable IE ajax request caching, Otherwise partial views get cached
        $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
        $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
        //This does't seem to be needed, and it's said to cause other issues
        //$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    }]);
//---------- Helpers --------------------------------------------------------------------------------------
var Helper;
(function (Helper) {
    function safeApply(scope) {
        if (!scope.$$phase)
            scope.$apply(); // <== This is know to be bad practices!!!
    }
    Helper.safeApply = safeApply;
})(Helper || (Helper = {}));
//---------- Resources --------------------------------------------------------------------------------------
//app.factory("ResourceName", ["$resource", $resource =>
//  $resource("/api/something/:id", { id: "@id" }, { update: { method: "PUT" } })
//]);
/// <reference path="../Web/Angular/app.ts" />
var UnitTests;
(function (UnitTests) {
    describe("BasicTextChatCtr", function () {
        it("init test", function () {
            expect(true).toBeTruthy();
        });
        //beforeEach(angular.mock.module("app"));
        //let $controllerService: ng.IControllerService;
        //it("check text chat controller", () => {
        //	inject(($controller) => { $controllerService = $controller; });
        //	let $scope = {} as ITextChatScope;
        //	let chatController: TextChatCtrl = $controllerService("TextChatCtrl", { $scope: $scope }) as TextChatCtrl;
        //	expect(chatController).toBeDefined();
        //});
    });
})(UnitTests || (UnitTests = {}));
//module UnitTests {
//	describe("Text Chat Lobby", () => {
//		describe("Controller", () => {
//			beforeEach(angular.mock.module("app"));
//			it("Predefined menu items", () => {
//				const learnFrench = Languages.french.id;
//				const knowSpanish = Languages.spanish.id;
//				let userServiceMock = <Authentication.IUserService>{ getUser: () => { return { knows: knowSpanish, learns: learnFrench } } };
//				let lobbyController = new TextChatLobby.TextChatLobbyController(undefined, undefined, undefined, undefined, userServiceMock, undefined);
//				let prefferedMenuItems = lobbyController.getPreferredMenu(undefined);
//				expect(prefferedMenuItems.length).toBe(5);
//			});
//		});
//	});
//} 
//# sourceMappingURL=tests.js.map