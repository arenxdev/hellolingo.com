module Profile {
	export interface IServerValidationResult {
		show   : boolean;
		message: string;
		code   : Backend.WebApi.WebApiResponseCode,
		isModal: boolean;
	}
}