module Authentication {

  export interface IProfileFormController extends ng.IFormController {
    // This contains only those fields that can benefit from angular validation 
    // Other fields are handled separately
    firstName: ng.INgModelController;
    lastName: ng.INgModelController;
    introduction: ng.INgModelController;
  }

  export interface ISignUpFormController extends ng.IFormController {
    email: ng.INgModelController;
    password: ng.INgModelController;
    reTypedPassword: ng.INgModelController;
    isEmailChecked: ng.INgModelController;
  }

}