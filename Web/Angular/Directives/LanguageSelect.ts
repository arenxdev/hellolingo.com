interface ILanguageSelectScope extends angular.IScope {
	languages: ILanguage[];
	setLangFilter();
	languageLabel: () => string;
	modelCtrl: angular.INgModelController;
	languageChanged?();
}

class LanguageSelectDirective implements ng.IDirective {
	static $inject = ["modalLanguagesService"];
	constructor(private modalLanguagesService: Services.IModalSelectLanguageService) { }

	restrict = "AE";
	require = "ngModel";
	replace = true;
	scope = {
		languageChanged: "&"
	};
	template = ["<span class=\"language-select btn btn-default btn-stripped\" ng-click=\"setLangFilter()\">",
					"{{languageLabel()}}",
					"<span class=\"caret\"></span>",
				"</span>"].join("");
	link = (scope: ILanguageSelectScope, elem: angular.IAugmentedJQuery, attrs: ng.IAttributes, modelCtrl: angular.INgModelController) => {
		scope.languages = Languages.langsById;
		scope.languageLabel = () => {
			const langId = modelCtrl.$modelValue;
			return langId && scope.languages[langId].text ? scope.languages[langId].text : "               "; // !!! These are special non-breakable white spaces! Do not replace with normal spaces
		};

		scope.setLangFilter = () => {
			let currentLangId = modelCtrl.$modelValue;
			this.modalLanguagesService.getLanguage(currentLangId, elem)
									  .then((langId: number) => {
												let haveChanged = langId !== modelCtrl.$modelValue;
												modelCtrl.$setViewValue(langId);
												if (scope.languageChanged && haveChanged) scope.languageChanged();
											});
		}
	}
}