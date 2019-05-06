interface IHomeFindBlockScope extends ng.IScope {
	findLanguages: Find.ILanguageSelect;
	languageChanged();
}

class HomeFindBlockCtrl {
	public static $inject = ["$scope", "statesService"];

	constructor(private $scope: IHomeFindBlockScope, private statesService: Services.StatesService) {
		this.$scope.findLanguages = {};
		this.$scope.languageChanged = () => {
			const knownId = this.$scope.findLanguages.knownId;
			const learnId = this.$scope.findLanguages.learnId;
			this.statesService.go(States.findByLanguages.name,
			{
				known: (Languages.langsById[knownId] && Languages.langsById[knownId].name) || "any",
				learn: Languages.langsById[learnId] && Languages.langsById[learnId].name
			});
		};
	}
}