
class Title implements ng.IDirective {
  restrict= "E";

  static $inject = ["$rootScope", "serverResources"];
  constructor(private $rootScope: IRootScope, private serverResources: Services.IServerResourcesService) { }

  link: ng.IDirectiveLinkFn = () => {
	var listener = (event, toState) => this.$rootScope.title = toState.title;
    this.$rootScope.$on("$stateChangeSuccess", listener);
  };
}

interface IRootScope extends ng.IRootScopeService {
  title:string;
}
