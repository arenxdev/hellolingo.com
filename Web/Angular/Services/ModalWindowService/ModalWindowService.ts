module Services {
	export class ModalWindowService implements IModalWindowService {
		static $inject = ["$uibModal","$q", "$state"];

		constructor(private $uibModal: ng.ui.bootstrap.IModalService, private $q: ng.IQService, private $state: ng.ui.IStateService) { }

		open(messageHtml:string, modalButtons?:Array<IModalButton>, staticBackdrop: boolean = true): ng.IPromise<boolean> {
			const modalDefferal = this.$q.defer();
			const modalResult = this.$uibModal.open({
				templateUrl: "modal-window-service.tpl",
				controller: ModalWindowServiceController,
				controllerAs: "modal",
				backdrop: staticBackdrop ? "static" : true,
				keyboard: true,
				resolve: {
					message: () => messageHtml,
					buttons: () => modalButtons
				}
			});
			this.resolveModalData(modalResult,modalDefferal as ng.IDeferred<boolean>);
			return modalDefferal.promise as ng.IPromise<boolean>;
		}

		openEmailIsNotConfirmModal() {
			const modalDefferal = this.$q.defer();
			this.$uibModal.open({
				templateUrl: "modal-email-not-confirmed.tpl",
				controller: EmailIsNotConfirmedModalController,
				controllerAs: "modal",
				keyboard: true				
			})
				.result.then(() => {
					modalDefferal.resolve();
				}, () => {
					if (this.$state.is(States.emailNotConfirmed.name)) this.$state.go(States.home.name);
					modalDefferal.resolve();
				});
			
			return modalDefferal.promise as ng.IPromise<boolean>;
		}

		resolveModalData(modalResult:ng.ui.bootstrap.IModalServiceInstance, deffered:ng.IDeferred<boolean>) {
			modalResult.result.then((isConfirmed: boolean) => {
				deffered.resolve(isConfirmed);
			}, (errorData) => {
				deffered.resolve(false);
				});
		}
	}
}