module Profile {

	export class ProfileLangsPicker implements ng.IDirective {
		link = (/*$scope, element, attr*/) => { };
		scope = {};
		templateUrl = "profile-langs-picker.tpl";
		controller = ProfileLangsPickerCtrl;
		controllerAs = "pickerCtrl";
		bindToController = {
			currentLanguages: "=",
			blockedLanguages: "=",
			updateLanguages: "="
		};
		restrict = "E";
		replace = true;
	}

	export class ProfileLangsPickerCtrl {

		//Bind from outer scope
		currentLanguages: Array<number>;
		blockedLanguages: Array<number>;
		updateLanguages: (langs: number[]) => void;

		languages = Languages.langsById;
		comboCount: number;

		constructor() {
			const langCount = this.currentLanguages.filter(value => Boolean(value)).length;
			this.comboCount = langCount === 0 ? 1 : langCount;
		}

		isBlockedLang = (langId: number) => this.currentLanguages.indexOf(langId) !== -1 || this.blockedLanguages.indexOf(langId) !== -1;
		isValidLang = (lang: ILanguage) => lang; // This is needed to ignore undefined values in view filters. The array of languages has gaps filled with those undefined values

		setLang(langIndex: number, langVal: number) {
			this.currentLanguages[langIndex] = langVal;
			this.updateLanguages(this.currentLanguages);
		}

		removeLang() {
			this.comboCount--;
			this.setLang(this.comboCount, undefined);
		}

	}

}