class ShowDuringChangeState implements ng.IDirective {
    constructor(private spinnerService: Services.SpinnerService) {
        
    }

    directiveLink = ($scope: ISpinnerScope, element: ng.IAugmentedJQuery) => {
        $scope.showObject = this.spinnerService.showSpinner;
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
    }
    link = this.directiveLink;
    restrict = "A";

    static factory() {
        const directive = (spinnerService: Services.SpinnerService) =>
            new ShowDuringChangeState(spinnerService);
        directive["$inject"] = ["spinnerService"];
        return directive;
    }
}

interface ISpinnerScope extends ng.IScope {
    showObject:any;
}