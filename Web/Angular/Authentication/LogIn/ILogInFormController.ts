module Authentication {
    export interface ILogInController extends ng.IFormController {
        email: ng.INgModelController;
        password: ng.INgModelController;
    }
}