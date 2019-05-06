module Services {
	export class ModalWindowServiceController {
		static $inject = ["$scope", "$uibModalInstance", "serverResources", "message", "buttons"];
		defaultButtons: Array<IModalButton> = [
			{
				label: "Cancel",
				cssClass: "btn btn-toggle",
				result: false
			},
			{
				label: "OK",
				cssClass: "btn btn-success",
				result: true
			}
		];

		constructor($scope, private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, serverResources: IServerResourcesService,
			        private message, private buttons: Array<IModalButton>) {
			if (!buttons || buttons.length === 0) {
				
				serverResources.getModalWindowResourcrs().then((translates:IModalWindowResources) => {
					this.defaultButtons[0].label = translates.cancel;
					this.defaultButtons[1].label = translates.ok;
				});
				this.buttons = this.defaultButtons;
			} else {
				this.buttons = buttons.reverse();
			}
			
		}

		buttonClick(buttonIndex:number) {
			let clickedButton = this.buttons[buttonIndex];
			if (clickedButton.callBackFn && typeof (clickedButton.callBackFn) ==="function") {
				clickedButton.callBackFn();
			}
			this.$uibModalInstance.close(clickedButton.result);
		}
	}
}