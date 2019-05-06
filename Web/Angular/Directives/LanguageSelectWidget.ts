/// <reference path="../References.d.ts" />

interface ILanguageSelectWidgetScope extends ng.IScope {
	setLanguage(args: { langFilter: string }): void;
	languageChanged(langFilter: string): void;
	selectedLanguages: Find.ILanguageSelect;
}

class LanguageSelectWidgetDIrective implements ng.IDirective {
	static $inject = ["$compile","serverResources"];
	constructor(private $compile: ng.ICompileService, private serverResources: Services.IServerResourcesService) { }

	restrict = "AE";
	scope = {
		setLanguage: "&",
		selectedLanguages: "="
	};
	template = () => {
		let template = `<h4 class='text-center'>{content}</h4>`;
		const learLangFilterTempl = `<language-select ng-model="selectedLanguages.learnId" language-changed="languageChanged('learn' );"></language-select>`;
		const knowLangFilterTempl = `<language-select ng-model="selectedLanguages.knownId" language-changed="languageChanged('know' );"></language-select>`;
		let  translatedResource = this.serverResources.getLanguagesFilter();
		translatedResource = translatedResource.replace("#learn#", learLangFilterTempl).replace("#know#", knowLangFilterTempl);
		template = template.replace("{content}", translatedResource);
		return template;
	};

	link = (scope: ILanguageSelectWidgetScope, elem: angular.IAugmentedJQuery, attrs: ng.IAttributes) => {
		scope.languageChanged = (langFilter: string) => {
			scope.setLanguage({
				langFilter: langFilter
			});
		};
		
	}
}