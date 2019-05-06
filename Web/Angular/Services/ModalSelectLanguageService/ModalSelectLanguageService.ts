module Services {
	export class ModalSelectLanguageService implements IModalSelectLanguageService{
		static $inject = ["$uibModal", "$q", "$log", "$window"];
		private modalCssClass = "lang-select-modal";

		constructor(private $uibModal: ng.ui.bootstrap.IModalService, private $q: ng.IQService, private $log: EnhancedLog) { }

		getLanguage(currentId: number, elementOrCssClass?: ng.IAugmentedJQuery | string) {
			var cssClass = angular.isString(elementOrCssClass) ? elementOrCssClass : "";

			const modalDefferal = this.$q.defer();
			const modalResult = this.$uibModal.open({
				//animation: false,
				templateUrl: "select-language-service-modal.tpl",
				controller: ModalSelectLanguageController,
				controllerAs: "modalSelect",
				resolve: { currentId: () => currentId },
				windowTopClass: `${this.modalCssClass} ${cssClass}`,
				//backdropClass : "backdrop-transparent",
				backdrop: true
			});

			if (!cssClass && elementOrCssClass) {
				var $element = elementOrCssClass as ng.IAugmentedJQuery;
				modalResult.rendered.then(() => {
					var boundElOffset = $element.offset(),
						boundElHeight = $element.outerHeight(),
						modal = $(`.${this.modalCssClass} .modal-dialog`);

					var documentScrollTop: number = //((<any>document).scrollingElement && (<any>document).scrollingElement.scrollTop) // <== Experimental FF technology. Doesn't work in production
													document.documentElement.scrollTop
													|| document.body.scrollTop;

					var modalTop = boundElOffset.top + boundElHeight - documentScrollTop + 10;
					if (document.body.clientHeight < modalTop + modal.outerHeight())
						modalTop = boundElOffset.top - modal.outerHeight() - documentScrollTop - 10;
					
					modal.css({ marginTop: "0", top: `${modalTop}px` });
				});
			}


			this.resolveModalData(modalResult, modalDefferal as ng.IDeferred<number>, currentId);
			return modalDefferal.promise as ng.IPromise<number>;
		}

		resolveModalData(modalResult: ng.ui.bootstrap.IModalServiceInstance, deffered: ng.IDeferred<number>, curentId:number) {
			modalResult.result.then((languageId: number) => {
				deffered.resolve(languageId);
			}, () => {
				deffered.resolve(curentId);
			});
		}

		
	}
}