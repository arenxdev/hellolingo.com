declare var goog_report_conversion: any;

module Authentication {
	export class SignUpDirective implements ng.IDirective {

		private modalElement: any;

		constructor(private $timeout: ng.ITimeoutService, private authService: IAuthenticationService, private statesService: Services.StatesService,
			private $rootScope: ng.IRootScopeService, private $log: Services.EnhancedLog, private serverResources: Services.IServerResourcesService) {
		}

		restrict = "E";
		scope = {};
		templateUrl = "/partials/Sign-Up-Directive";
		link = ($scope: ISignUpScope, element: ng.IAugmentedJQuery) => {

			// Sign Up Resources
			$scope.months = this.serverResources.getMonths();
			$scope.years = Helpers.listOfBirthYears();
			$scope.languages = Languages.langsById;
			$scope.countries = this.serverResources.getCountries();

			//Sign Up data
			$scope.loading = false;
			$scope.user = new SignUpUser();
			$scope.profileFormValidation = new ProfileFormValidation($scope.profileForm, $scope.user);
			$scope.signUpFormValidation = new SignUpFormValidation($scope.signUpForm, this.serverResources);
			$scope.signUpFailedOnServer = false;

			$scope.setLearns = (langs: number[]) => [$scope.user.learns, $scope.user.learns2, $scope.user.learns3] = langs;
			$scope.setKnows = (langs: number[]) => [$scope.user.knows, $scope.user.knows2, $scope.user.knows3] = langs;

			$scope.setGenderAsMale = () => $scope.user.gender = Enums.Gender.male;
			$scope.setGenderAsFemale = () => $scope.user.gender = Enums.Gender.female;

			$scope.setMonth = (index: number) => {
				$scope.user.birthMonth = $scope.months[index].id;
				$scope.selectedMonth = $scope.months[index].text;
			};
			$scope.setCountry = (c: number) => {
				$scope.user.country = c;
				$scope.selectedCountry = $scope.countries[c];
			};
			$scope.submitProfile = () => {
				$scope.profileFormValidation.enabled = true;
				if ($scope.profileFormValidation.isFormValid) {
					this.$log.appInfo("ValidProfileFormSubmitted", {form: $scope.user});
					this.showModal();
				} else
					this.$log.appInfo("InvalidProfileFormSubmitted", {form: $scope.user});
			};
			$scope.signUp = () => {
				$scope.signUpFailedOnServer = false;
				$scope.signUpFormValidation.enabled = true;

				if ($scope.signUpFormValidation.isFormValid === false) {
					this.$log.appInfo("InvalidSignUpFormSubmitted", {form: $scope.user});
					return;
				}
				this.$log.appInfo("ValidSignUpFormSubmitted", {form: $scope.user});
				$scope.loading = true;
				this.authService.signUp($scope.user)
					.then((data: ILoginServerResponse) => {
						$scope.loading = false;
						if (data.isAuthenticated) {
							goog_report_conversion(); // Report Adwords conversion
							this.closeModal();
							this.statesService.resetAllStates();
							this.statesService.goAndReload(States.home.name/*, { validation: EmailConfirmStatuses.pending }*/);
						} else {
							this.handleSignUpFailure($scope, data);
						}
					});
			};

			$scope.removeIdenticalNames = () => {
				// Clear names when lazy users enter identical first and last names
				if ($scope.user.firstName && $scope.user.lastName && $scope.user.firstName.toLowerCase() === $scope.user.lastName.toLowerCase()) {
					$scope.user.firstName = "";
					$scope.user.lastName = "";
				}
			}
			$scope.cleanFirstName = () => {
				$scope.removeIdenticalNames();
				$scope.user.firstName = FormInputsRegulator.cleanFirstName($scope.user.firstName);
			};
			$scope.cleanLastName = () => {
				$scope.removeIdenticalNames();
				$scope.user.lastName = FormInputsRegulator.cleanLastName($scope.user.lastName);
			};
			$scope.cleanLocation = () => $scope.user.location = FormInputsRegulator.cleanLocation($scope.user.location);

			// TODOLATER: A directive shouldn't know that the app has a $stateChangeStart event.
			// Andriy: I agree in general, directive can expose service which can maintain modal state
			//         Or add this functionality yo StatesHelper
			this.$rootScope.$on("$stateChangeStart", () => {
				if ((this.modalElement.data("bs.modal") || {}).isShown) {
					this.closeModal();
				}
			});
			this.modalElement = element.find("#signUpModal");

			// Prefill user with SharedLingo Data
			try {
				$scope.user.firstName = Runtime.SharedLingoData.first;
				$scope.user.lastName = Runtime.SharedLingoData.last;
				$scope.user.birthYear = Runtime.SharedLingoData.birthYear;
				$scope.user.email = Runtime.SharedLingoData.email;
				if (Runtime.SharedLingoData.gender === "m") $scope.setGenderAsMale();
				if (Runtime.SharedLingoData.gender === "f") $scope.setGenderAsFemale();
				$scope.user.isSharedLingoMember = !!Runtime.SharedLingoData.first;
				if (Runtime.SharedLingoData.natives) $scope.user.knows = this.slLangToHlLang(Runtime.SharedLingoData.natives.split(",")[0]);
				if (Runtime.SharedLingoData.learns) $scope.user.learns = this.slLangToHlLang(Runtime.SharedLingoData.learns.split(",")[0]);
				if ($scope.user.knows === $scope.user.learns) $scope.user.knows = null;
				var country = this.slCountryToHlCountry(Runtime.SharedLingoData.countryCode);
				if (country) $scope.setCountry(country);
				$scope.user.location = Runtime.SharedLingoData.city;
			} catch (e) {
				this.$log.appError("FailImportSharedLingoDataIntoForm", {});
			} 
		};

		slLangToHlLang = (langCode: string):number => {
			switch (langCode) {
				case "EN": return 1;
				case "ES": return 2;
				case "FR": return 3;
				case "ZH": return 7;
				case "RU": return 8;
				case "PT": return 9;
				case "IT": return 6;
				case "PL": return 23;
				case "KO": return 11;
				case "JA": return 4;
				case "HU": return 36;
				case "VI": return 27;
				case "DE": return 5;
				case "NL": return 15;
				case "TH": return 22;
				case "TR": return 17;
				case "AR": return 10;
				case "IN": return 12;
				default: return null;
			}
		}
		slCountryToHlCountry = (countryCode: string):number => {
			switch (countryCode) {
				case "US": return 100;
				case "GB": return 101;
				case "CA": return 102;
				case "FR": return 104;
				case "AU": return 105;
				case "ES": return 106;
				case "JP": return 107;
				case "DE": return 108;
				case "CN": return 109;
				case "IT": return 111;
				case "AR": return 112;
				case "BR": return 113;
				case "IR": return 114;
				case "TR": return 115;
				case "PK": return 117;
				case "MX": return 119;
				case "BE": return 120;
				case "TW": return 121;
				case "TH": return 122;
				case "RU": return 123;
				case "NL": return 124;
				case "Nz": return 125;
				case "PL": return 126;
				case "KR": return 127;
				case "IE": return 129;
				case "EG": return 131;
				case "SE": return 133;
				case "SA": return 134;
				case "MA": return 149;
				case "DZ": return 162;
				case "KW": return 163;
				case "SY": return 171;
				case "BH": return 172;
				case "TN": return 179;
				case "IQ": return 181;
				default: return null;
			}
		}

		showModal = () => this.modalElement.modal("show");

		closeModal = () => {
			this.modalElement.modal("hide");

			//Andriy: it's necessary to clenaup modal window, after temlates are deleted. 
			//Later for modal windows better to use angular-ui bootstrap for modal windows.
			$("body").removeClass("modal-open");
			$(".modal-backdrop").remove();

		};

		handleSignUpFailure($scope: ISignUpScope, serverResponse: Backend.WebApi.WebApiResponse) {
			if (serverResponse.message.code === Backend.WebApi.WebApiResponseCode.EmailAlreadyInUse) {
				this.handleExistingEamilFailure($scope.user.email);
			} else {
				$scope.signUpFailedOnServer = true;
				this.serverResources.getServerResponseText(serverResponse.message.code).then((serverMessage) => {
					$scope.signUpServerFailedMessage = serverMessage;
				});
			}
		};

		handleExistingEamilFailure(email:string) {
			this.statesService.resetState(States.signup.name); // This line doesn't do anything?! The state of the sign up is preserved when using the browser back up button
			var stateParams: ILoginStateParams = { emailOfExistingAccount: email };
			this.statesService.go(States.login.name, stateParams);
		}


		static factory() {
			const directive = ($timeout: ng.ITimeoutService, authService: IAuthenticationService, statesService: Services.StatesService,
				$rootScope: ng.IRootScopeService, $log: Services.EnhancedLog, serverResources: Services.IServerResourcesService) =>
				new SignUpDirective($timeout, authService, statesService, $rootScope, $log, serverResources);
			directive["$inject"] = ["$timeout", "authService", "statesService", "$rootScope", "$log", "serverResources"];
			return directive;
		}
	}
}