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