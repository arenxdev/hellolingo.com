module Services {
	export class ModalSelectLanguageController {
		static $inject = ["$scope", "$uibModalInstance", "serverResources", "currentId"];
		moreLabel:string;

		constructor($scope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, serverResources:Services.IServerResourcesService, private currentId: number) {
			this.languageSelect.selectedId = currentId;
			serverResources.getSelectLangResources().then((translate) => { this.moreLabel = translate; });
		}

		languages      = Languages.langsById;
		languageSelect = { selectedId: undefined, blockedId: undefined };

		get secondTierButtonLabel() {
			const id = this.languageSelect.selectedId;
			return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? this.languages[id].text : this.moreLabel;
		}

		get selectSecondTierClass() {
			const id = this.languageSelect.selectedId;
			return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? "active" : undefined;
		}

		secondTierLangFilter(value) { return value.tier > 1 };

		onSelect(langId: number) {
			this.$uibModalInstance.close(langId);
		}
		clear() {
			this.$uibModalInstance.close(undefined);
		}
	}
}