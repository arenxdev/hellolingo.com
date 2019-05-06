module Services {
	export interface IModalWindowService {
		open(messageHtml: string, modalButtons?: Array<IModalButton>, staticBackdrop?: boolean): ng.IPromise<boolean>;
		openEmailIsNotConfirmModal(): ng.IPromise<boolean>;
	}
}