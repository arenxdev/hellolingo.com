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
