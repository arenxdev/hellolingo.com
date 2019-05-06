namespace Services {
	export class ServerResourcesProvider implements ng.IServiceProvider {
		setupTranslationService($translateProvider: ng.translate.ITranslateProvider) {
			const translations = this.getTranslateResourcesFromHtml();
			$translateProvider
				.translations("en", translations)
				.useMissingTranslationHandler("translationErrorsHandler")
				.preferredLanguage("en")
				.useSanitizeValueStrategy(null);
		}
		private getTranslateResourcesFromHtml() {
			return angular.fromJson(document.getElementById("tranlsation-json").innerText);
		}

		$get = ["$q", "$translate", ($q, $translate) => new ServerResourcesService($q, $translate)];
	}

	//Andriy: I think I can simplify this logic
	export class ServerResourcesService implements IServerResourcesService {
		static $inject = ["$q", "$translate"];

		buttonsResourcesPrefix = "buttons";
		textChatResourcesPrefix = "textChat";
		editProfileResourcesPrefix = "editProfile";

		private siteResourcesPrefix= "site";
		private responceCodes: { [code: number]: string } = {};
		private months: { [month: number]: string } = {};
		private countries: { [code: number]: ICountry } = {};
		private languageFilterTranslation: string;
		
		constructor(private $q: ng.IQService, private $translate: ng.translate.ITranslateService) {
			this.responceCodes[Backend.WebApi.WebApiResponseCode.EmailAlreadyInUse] = "messages.emailInUse";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.VerifyYourEntries] = "messages.entriesAreInvalid";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.NewClientRequired] = "messages.hellolingoUpdated";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.WrongPassword] = "messages.incorrectPassword";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.WeakPassword] = "messages.provideStrongerPassword";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.UnhandledIssue] = "messages.tryAgain";
			this.responceCodes[Backend.WebApi.WebApiResponseCode.UnrecognizedLogin] = "messages.verifyPassword";
		}

		getServerResponseText(code: Backend.WebApi.WebApiResponseCode) {
			const defer = this.$q.defer();
			this.$translate(this.responceCodes[code]).then((translate) => {
				defer.resolve(translate);
			});
			return defer.promise as ng.IPromise<string>;
		};
		
		getMonths() {
			const months: IMonth[] = [];
			for (let i = 1; i < 13; i++)
				months[i] = { id: i, text: this.months[i] };
			return months;
		}

		getCountries() {
			const countries: ICountry[] = [];
			for (let country in this.countries) {
				countries[country] = this.countries[country];
			}
			countries[100].displayOrder = 1;
			countries[101].displayOrder = 2;
			countries[104].displayOrder = 3;
			countries[108].displayOrder = 4;
			countries[111].displayOrder = 5;
			countries[107].displayOrder = 6;
			countries[109].displayOrder = 7;
			countries[127].displayOrder = 8;
			countries[123].displayOrder = 9;
			countries[113].displayOrder = 10;
			return countries;
		}

		resolveTranslationsAsync() {
			this.resloveMonths();
			this.resolveCountries();
			this.resolveLanguageFilterResource();
		}

		getProfileResources() {
			const translateResources: string[] = [
				`${this.editProfileResourcesPrefix}.profileUpdated`,
				`${this.buttonsResourcesPrefix}.ok`
			];
			const defer = this.$q.defer<IProfileResources>();
			this.$translate(translateResources).then((translates) => {
				const profileResources = <IProfileResources>{};
				profileResources.profileUpdated = translates[translateResources[0]];
				profileResources.ok = translates[translateResources[1]];
				defer.resolve(profileResources);
			});
			return defer.promise;
		}

		getSelectLangResources() {
			const defer = this.$q.defer();
			this.$translate(`${this.siteResourcesPrefix}.more`).then((translate) => {
				defer.resolve(translate);
			});
			return defer.promise as ng.IPromise<string>;
		}

		getModalWindowResourcrs() {
			const defer = this.$q.defer<IModalWindowResources>();
			const translateResources = [`${this.buttonsResourcesPrefix}.cancel`, `${this.buttonsResourcesPrefix}.ok`];
			this.$translate(translateResources).then((translate) => {
				const modalWindowResources = <IModalWindowResources>{};
				modalWindowResources.ok = translate[translateResources[0]];
				modalWindowResources.cancel = translate[translateResources[1]];
				defer.resolve(modalWindowResources);
			});
			return defer.promise;
		}


		getLanguagesFilter() {
		     return this.languageFilterTranslation;
		}

		getAccountValidationErrors() {
			const translateResources: string[] = [
				`${this.siteResourcesPrefix}.defaultAccountError`,
				`${this.siteResourcesPrefix}.passwordLengthErrorMsg`,
			];
			const defer = this.$q.defer<IAccountValidationErrors>();
			this.$translate(translateResources).then((translates) => {
				const profileResources = <IAccountValidationErrors>{};
				profileResources.defaultError = translates[translateResources[0]];
				profileResources.passwordMinError = translates[translateResources[1]];
				profileResources.passwordMaxError = translates[translateResources[1]];
				defer.resolve(profileResources);
			});
			return defer.promise;

		}

		getAudioChatResources() {
			const translateResources: string[] = [
				`${this.textChatResourcesPrefix}.audio.busy`,
				`${this.textChatResourcesPrefix}.audio.unsupportedDevice`,
				`${this.textChatResourcesPrefix}.audio.unsupportedBrowser`,
				`${this.textChatResourcesPrefix}.audio.unsupportedJoin`,
				`${this.textChatResourcesPrefix}.audio.declineUnsupportedDevice`,
				`${this.textChatResourcesPrefix}.audio.declineUnsupportedBrowser`,
				`${this.textChatResourcesPrefix}.audio.declineBusy`,
				`${this.textChatResourcesPrefix}.audio.peerDeclined`,
				`${this.textChatResourcesPrefix}.audio.peerUnsupported`,
				`${this.textChatResourcesPrefix}.audio.peerBusy`,
				`${this.textChatResourcesPrefix}.audio.hangout`,
				`${this.textChatResourcesPrefix}.audio.peerHangout`,
				`${this.textChatResourcesPrefix}.audio.peerDisconnected`,
				`${this.textChatResourcesPrefix}.audio.youreConnected`
			];
			const defer = this.$q.defer<IAudioMessagesResources>();
			this.$translate(translateResources).then((translate) => {
				const translation: IAudioMessagesResources = {
					busy                     : translate[translateResources[0]],
					unsupportedDevice        : translate[translateResources[1]],
					unsupportedBrowser       : translate[translateResources[2]],
					unsupportedJoin          : translate[translateResources[3]],
					declineUnsupportedDevice : translate[translateResources[4]],
					declineUnsupportedBrowser: translate[translateResources[5]],
					declineBusy              : translate[translateResources[6]],
					peerDeclined             : translate[translateResources[7]],
					peerUnsupported          : translate[translateResources[8]],
					peerBusy                 : translate[translateResources[9]],
					hangout                  : translate[translateResources[10]],
					peerHangout              : translate[translateResources[11]],
					peerDisconnected         : translate[translateResources[12]],
					youreConnected           : translate[translateResources[13]]
				};
				defer.resolve(translation);
			});
			return defer.promise;
		}

		private resloveMonths() {
			const monthNumbers = ["months.month1", "months.month2", "months.month3", "months.month4", "months.month5", "months.month6", "months.month7", "months.month8", "months.month9", "months.month10", "months.month11", "months.month12"];
			const defer = this.$q.defer();
			this.$translate(monthNumbers).then((translate) => {
				for (let i = 1; i < 13; i++) {
					this.months[i] = translate[`months.month${i}`];
				}
				defer.resolve();
			});
			return defer.promise;
		}

		private resolveCountries() {
			const countries = angular.element.parseJSON(document.getElementById("countries-json").innerText);
			for (let code in countries) {
				const countryCode = Number(code.substring(1));
				this.countries[countryCode] = {
					id: countryCode,
					text: countries[code]
				}
			}
			
		}

		private resolveLanguageFilterResource() {
			const defer = this.$q.defer();
			this.$translate(`${this.siteResourcesPrefix}.languageFilter`).then((translate) => {
				this.languageFilterTranslation = translate;
				defer.resolve();
			});
			return defer.promise;
		}
	}	
}