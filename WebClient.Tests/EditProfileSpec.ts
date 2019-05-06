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