module Services {
	export interface IModalButton {
		label: string;
		cssClass: string;
		callBackFn?: any;
		result:boolean;
	}
}