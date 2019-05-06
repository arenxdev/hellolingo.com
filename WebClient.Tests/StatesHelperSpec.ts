//describe("States helper", () => {

//	describe("found state", () => {
//	let statesHelper: Services.StatesHelper;
//	let $templateCache: ng.ITemplateCacheService;
//	let $state: ng.ui.IStateService;
//	beforeEach(angular.mock.module("app"));


//		// ReSharper disable InconsistentNaming
//		beforeEach(inject((_$httpBackend_: ng.IHttpBackendService,
//			_$state_: ng.ui.IStateService,
//			_$templateCache_: ng.ITemplateCacheService,
//			_statesHelper_: Services.StatesHelper) => {
//			// ReSharper restore InconsistentNaming
//		UnitTests.Helper.mockHttpService(_$httpBackend_);
//			statesHelper = _statesHelper_;
//		$templateCache = _$templateCache_;
//		$state = _$state_;
//		UnitTests.Helper.mockGeneratedTemplates($templateCache, "partials/SignUpDirective");
//		UnitTests.Helper.mockGeneratedTemplates($templateCache, "Partials/LogInDirective");
//	}));
//	it("getSateByName found", () => {
//		const foundState: State = statesHelper.getStateCopyByName(States.home.name);
//		expect(foundState.name).toEqual(States.home.name);
//	});
//	it("getSateByName not found", () => {
//		const foundState: State = statesHelper.getStateCopyByName("unknown");
//		expect(foundState).toBeUndefined();
//	});


//	});

//	describe("reset state", () => {
//		beforeEach(angular.mock.module("app"));	

//		it("one state with remote template", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetState(States.home.name);

//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith(States.home.name);

//			expect($templateCache.remove).toHaveBeenCalledTimes(1);
//			expect($templateCache.remove).toHaveBeenCalledWith(States.home.templateUrl);
//		});
				
//		it("one state without remote template", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetState(States.textChatRoomChinese.name);

//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith(States.textChatRoomChinese.name);
//			expect($templateCache.remove).not.toHaveBeenCalled();
		
//	});

//		it("reset all states", () => {
//			let $templateCache: ng.ITemplateCacheService;
//			let $stickyState: any;
//			let statesHelper: Services.StatesHelper;
//			// ReSharper disable InconsistentNaming
//			inject((_$stickyState_: any, _$templateCache_: ng.ITemplateCacheService, _statesHelper_: Services.StatesHelper) => {
//				$templateCache = _$templateCache_;
//				$stickyState = _$stickyState_;
//				statesHelper = _statesHelper_;
//			});
//			spyOn($stickyState, "reset");
//			spyOn($templateCache, "remove");
//			statesHelper.resetAllStates();
//			expect($stickyState.reset).toHaveBeenCalledTimes(1);
//			expect($stickyState.reset).toHaveBeenCalledWith("*");
//			let numberOfTempates =0;
//			angular.forEach(States, (state: State) => {
//				if (state.isRemoteTemplate) numberOfTempates++;
//			});
//			expect($templateCache.remove).toHaveBeenCalledTimes(numberOfTempates);
//		});
	
//});
//});