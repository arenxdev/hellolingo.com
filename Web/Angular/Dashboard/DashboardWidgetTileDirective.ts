namespace Dashboard {
	export class WidgetTileDirective {
		static $inject = ["$parse", "$compile", "$injector"];

		constructor(private $parse: ng.IParseService, private $compile: ng.ICompileService, private $injector) {}

		restrict = "E";
		link = (scope: ng.IScope, element: ng.IRootElementService, attrs) => {
			var directiveNameGetter = this.$parse(attrs.directive);
			var directiveName = directiveNameGetter(scope);
			var widget = this.$compile(`<${directiveName}></${directiveName}>`)(scope);
			element.replaceWith(widget);
		}
	}
}