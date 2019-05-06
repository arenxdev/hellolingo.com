module Services {
	export interface IModalSelectLanguageService {
		getLanguage: (currentId: number, underTheElementOrCssClass?: ng.IAugmentedJQuery | string)=>ng.IPromise<number>;
	}
}