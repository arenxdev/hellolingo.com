
class TasbarButton {
	constructor(public stateName: string, public iconUrl: string, public htmlText?: string, public hasCounter?: boolean, public disableClose?: boolean) { }
}

class TaskbarCtrl {

	static $inject = [ "$rootScope", "$scope", "$element", "$timeout", "$window", "$sce","authService","$state"];

	constructor(
		private $rootScope, private $scope, private $element, private $timeout,
		private $window, private $sce, private authService: Authentication.IAuthenticationService,
		private $state: ng.ui.IStateService
	) {

		var resizeTimeout = null;

		// Set taskbar color
		$scope.darkColor = () => { return this.authService.isAuthenticated(); };
		$scope.hasShadow = () => {
			let isUnderbarState = $state.includes(States.find.name) || $state.includes(States.mailbox.name);
			return isUnderbarState && this.authService.isAuthenticated();
		};

		$scope.logoCollapsed = false;
		$scope.isHomeCurrent = () => { return $state.current.name === States.home.name; };
		$scope.hideTaskBar = () => { return $state.current.name === States.signup.name; };
		$scope.buttonsOnTaskbar = [];

		$scope.showAlert = false;

		$rootScope.taskBarAlert = (message) => {
			$scope.alertMessage = message;
			$scope.showAlert = true;
		};
		
		$scope.addAppButton = (btn: TasbarButton) => {
			$scope.buttonsOnTaskbar.push({
				stateName: btn.stateName,
				text: $sce.trustAsHtml(btn.htmlText),
				iconUrl: btn.iconUrl,
				disableClose: btn.disableClose,
				hasCounter: btn.hasCounter
			});
		};

		$scope.addAppButton(new TasbarButton(States.home.name, "/Images/Icons/taskbar-icon-dashboard-48.png", "Dashboard", false, true));
		$scope.addAppButton(new TasbarButton(States.textChat.name, "/Images/Icons/taskbar-icon-text-chat-48.png", "Text <br>Chat", true));
		$scope.addAppButton(new TasbarButton(States.mailbox.name, "/Images/Icons/taskbar-icon-mailbox-48.png", "Mail<br>Box", true));
		$scope.addAppButton(new TasbarButton(States.find.name, "/Images/Icons/taskbar-icon-find-48.png", "Members<br>Search"));
		$scope.addAppButton(new TasbarButton(States.profile.name, "/Images/Icons/taskbar-icon-profile-48.png", "Profile"));
		$scope.addAppButton(new TasbarButton(States.contactUs.name, "/Images/Icons/taskbar-icon-contact-us-48.png", "Contact<br>Us"));
		//$scope.addAppButton(new TasbarButton(States.network.name, "/Images/Icons/question_mark_40x60.png", "Network"));


		// ========= Automatic adjustment of icons in the taskbar =========
		// Not used for now, but could really be used later

		angular.element($window).bind("resize", () => {
			$timeout.cancel(resizeTimeout);
			resizeTimeout = $timeout($scope.spaceButtonsProperly, 500);
		});

		//$scope.$on("ngRepeatFinished", () => {
		//	$timeout($scope.spaceButtonsProperly, 0); // timeout used because even the $scope.$apply in the target function doesn't guarantee everything is renderer
		//});

		//$scope.onMouseEnterButton = indexOfEnteredButton => {
		//	$scope.spaceButtonsProperly(indexOfEnteredButton);
		//};

		//var collapsedLogoWidth = null;
		//var uncollapsedLogoWidth = null;

		$scope.spaceButtonsProperly = indexOfButtonToKeepUncollapsed => {

			// Collapse Hellolingo logo when space is scarce
			var maxWidth = $element.width();
			$scope.logoCollapsed = maxWidth < 480;

			//	// Get the maxWidth we can afford
			//	var maxWidth = $element.width() - $("#taskbar-right").outerWidth();

			//	// Collect Widths of logo and buttons
			//	if ($scope.logoCollapsed === false) {
			//		uncollapsedLogoWidth = $element.find("#site-logo").outerWidth();
			//		collapsedLogoWidth = uncollapsedLogoWidth - $element.find("#site-logo>img:nth-child(2)").outerWidth();
			//	}
			//	$scope.buttonsOnTaskbar.forEach((buttonDef, index) => {
			//		var button = $element.find(`#taskbarButton-${index}`);
			//		var buttonText = $element.find(`#taskbarButton-${index}>a>span`);
			//		if (buttonDef.collapsedWidth == undefined) {
			//			buttonDef.uncollapsedWidth = button.outerWidth();
			//			buttonDef.collapsedWidth = buttonDef.uncollapsedWidth - buttonText.outerWidth();
			//		}
			//	});

			//	// Reset List of Buttons to be collapsed
			//	var logoToBeCollapsed = false;
			//	$scope.buttonsOnTaskbar.forEach((buttonDef /*, index*/) => { buttonDef.toBeCollapsed = false; });

			//	// Find out which buttons should be collapsed to fit the maxWidth;
			//	var shortEnough = false, previousElementsWidth = undefined;
			//	do {
			//		var indexOfWidestButton, widthOfWidestButton = 0;
			//		var elementsWidth = logoToBeCollapsed ? collapsedLogoWidth : uncollapsedLogoWidth;
			//		$scope.buttonsOnTaskbar.forEach((buttonDef, index) => {
			//			var buttonWidth = buttonDef.toBeCollapsed ? buttonDef.collapsedWidth : buttonDef.uncollapsedWidth;
			//			elementsWidth += buttonWidth;

			//			if (index !== indexOfButtonToKeepUncollapsed && buttonWidth > widthOfWidestButton) {
			//				widthOfWidestButton = buttonWidth;
			//				indexOfWidestButton = index;
			//			}
			//		});

			//		// If buttons don't fit maxwidth, collapse a button, starting with home and then the widest button found
			//		if (elementsWidth >= maxWidth) {
			//			if (logoToBeCollapsed || indexOfButtonToKeepUncollapsed === "logo") {
			//				//TODOLATER: try replacing below with this JQuery.extend($scope.buttonsOnTaskbar[indexOfWidestButton], { collapsed: true, toBeCollapsed: true });
			//				const buttonDef = $scope.buttonsOnTaskbar[indexOfWidestButton];
			//				buttonDef.collapsed = buttonDef.toBeCollapsed = true;
			//			}
			//			if (indexOfButtonToKeepUncollapsed !== "logo") $scope.logoCollapsed = logoToBeCollapsed = true;
			//			Helper.safeApply($scope);
			//		} else shortEnough = true;

			//		// Check if we aren't in an infinite loop with no more possible button to collapse
			//		if (previousElementsWidth === elementsWidth) this.$log.appError("TaskBar_WidthOverflow");
			//		else previousElementsWidth = elementsWidth;
			//	} while (!shortEnough);

			//	// Uncollapse buttons that don't need to be collapsed anymore
			//	$scope.logoCollapsed = logoToBeCollapsed;
			//	$scope.buttonsOnTaskbar.forEach(buttonDef => { buttonDef.collapsed = buttonDef.toBeCollapsed; });
			//	Helper.safeApply($scope);

			//	// Animate the buttons to their final spot
			//	//$timeout(() => {
			//	//	var x = $element.find("#site-logo").outerWidth();
			//	//	$element.find(".taskbar-button").each(function() {
			//	//		if ($(this).css("visibility") === "hidden") { // new button freshly added
			//	//			$(this).css("visibility", "visible");
			//	//			$(this).hide(); // hide button
			//	//			$(this).animate({ left: x }, 0, "swing"); // place new button to its new spot
			//	//			$(this).show(300); // reveal button
			//	//		} else {
			//	//			$(this).animate({ left: /* "+="+ */ x }, 100, "swing"); // move existing element to its new spot
			//	//		}
			//	//		x += $(this).outerWidth();
			//	//	});
			//	//});

		};

		//// Testing Only
		//$scope.removeFirstButton = () => {
		//	$scope.buttonsOnTaskbar.splice(0, 1);
		//	$timeout($scope.spaceButtonsProperly, 0);
		//};

	}
	
}




