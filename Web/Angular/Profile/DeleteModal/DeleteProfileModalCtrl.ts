module Profile {
	export class DeleteProfileModalCtrl  {
		static $inject = ["$scope", "$uibModalInstance", "id", "userService", "statesService", "serverResources"];
		constructor($scope: ng.IScope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private id: number,
			private userService: Authentication.IUserService, private statesService: Services.StatesService, private serverResources:Services.IServerResourcesService) {
			
		}
		psw:string;
		deleteForm: IDeleteFormController;

		deleteAccount(): void {
			this.isValidationEnabled = true;
			this.serverValidation.show = false;
			this.serverValidation.message = undefined;
			this.userService.deleteUser({ userId: this.id, currentPassword: this.psw }).then((data: Authentication.IUserDeletedServerResponseMessage) => {
				if (data.isSuccess) {
					this.$uibModalInstance.close(true);
				} else {
					this.serverValidation.show = true;
					this.serverResources.getServerResponseText(data.message.code).then((translate) => {
						this.serverValidation.message = translate;
					});
				}
			}, () => {});
		}

		cancel():void {
			this.$uibModalInstance.close(false);
		}
		isValidationEnabled = false;
		isPasswordValid() {
			return this.isValidationEnabled ? this.deleteForm.password.$valid : true;
		}
		serverValidation = {show:false, message:undefined};
		
	}
}