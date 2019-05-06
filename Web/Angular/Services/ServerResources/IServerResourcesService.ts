module Services {

	export interface IProfileResources {
		profileUpdated: string;
		ok: string;
	}

	export interface IModalWindowResources {
		ok: string;
		cancel:string;
	}

	export interface IAccountValidationErrors {
		defaultError: string;
		passwordMinError: string;
		passwordMaxError:string;
	}

	export interface IAudioMessagesResources {
		busy                      : string;
		unsupportedDevice         : string;
		unsupportedBrowser        : string;
		unsupportedJoin           : string;
		declineUnsupportedDevice  : string;
		declineUnsupportedBrowser : string;
		declineBusy               : string;
		peerDeclined              : string;
		peerUnsupported           : string;
		peerBusy                  : string;
		hangout                   : string;
		peerHangout               : string;
		peerDisconnected          : string;
		youreConnected            : string;
	}

	export interface IServerResourcesService {
		getServerResponseText(code: Backend.WebApi.WebApiResponseCode): ng.IPromise<string>;
		getMonths(): Array<IMonth>;
		getCountries(): Array<ICountry>;
		getProfileResources(): ng.IPromise<IProfileResources>;
		getSelectLangResources(): ng.IPromise<string>;
		getModalWindowResourcrs(): ng.IPromise<IModalWindowResources>;
		getLanguagesFilter(): string;
		getAccountValidationErrors(): ng.IPromise<IAccountValidationErrors>;
		getAudioChatResources():ng.IPromise<IAudioMessagesResources>;
	}
}