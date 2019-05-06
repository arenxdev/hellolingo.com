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