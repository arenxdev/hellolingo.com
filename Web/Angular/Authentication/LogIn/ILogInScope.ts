module Authentication {
    export interface ILogInScope extends ng.IScope {
        email: string;
        showExistingAccountAlert: boolean;
        password: string;
        logIn():void;
        isLogInFailed: boolean;
        logInForm: ILogInController;
        validResult: LoginValidationResult;
		logInServerFailedMessage: string;
		goToSignUp(): void;
    }

}