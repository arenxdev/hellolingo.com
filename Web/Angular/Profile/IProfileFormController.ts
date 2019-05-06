module Profile {
	export interface IProfileFormController extends ng.IFormController {
		introduction: ng.INgModelController;
		location:ng.INgModelController;
		email: ng.INgModelController;
		password: ng.INgModelController;
		reTypedPassword: ng.INgModelController;
	}
}