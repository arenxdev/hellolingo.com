module Profile {

	export class ProfileController {
		static $inject = ["$scope", "$http", "$timeout", "$uibModal", "$log", "userService", "statesService", "$window", "modalService", "serverResources"];

		languages = Languages.langsById;
		countries:ICountry[];
		months: Array<IMonth>;
		years = Years.getYears();
		translationLabels:{[resource:string]:string}={};

		constructor($scope: ng.IScope, private $http:ng.IHttpService, private $timeout:ng.ITimeoutService, private $uibModal: ng.ui.bootstrap.IModalService, 
			private $log: Services.EnhancedLog, private userService: Authentication.IUserService, private statesService: Services.StatesService,
			private $window: ng.IWindowService, private modalService: Services.IModalWindowService,
			public serverResources:Services.IServerResourcesService) {
			this.getLocalizedResources();
			this.user= this.userService.getUser();
			this.editProfile = this.user;
			this.months = this.serverResources.getMonths();
			this.countries = this.serverResources.getCountries();
		}
		
		user:IAuthUser;
		editProfile: IUserProfile;
		profileValidation: ProfileFormValidation;
		serverValidation: IServerValidationResult = { show: false, message: undefined, code: undefined, isModal:false };
		profileForm: IProfileFormController;
		modalWindowInstance:ng.ui.bootstrap.IModalServiceInstance;

		updateLearns = (langs: number[]) => [this.editProfile.learns, this.editProfile.learns2, this.editProfile.learns3] = langs;
		updateKnows = (langs: number[]) => [this.editProfile.knows, this.editProfile.knows2, this.editProfile.knows3] = langs;
		setCountry = (countryId:number) => this.editProfile.country = countryId;
		setMonth = (index: number) => this.editProfile.birthMonth = this.months[index].id;
		setYear = (year: number) => this.editProfile.birthYear = year;

		saveProfile() {
			this.profileValidation.enabled = true;
			if (this.serverValidation.show) {
				this.setServerValidationToDefaults(this.serverValidation);
			}
			if (this.profileValidation.isFormValid) {
				this.$log.appInfo("ValidProfileFormSubmitted", {form: this.editProfile});
				this.showModal();
			} else {
				this.$log.appInfo("InvalidProfileFormSubmitted", { validationReport: this.profileValidation.validationReport, user: this.userService.getUser(), form: this.editProfile });
			}
		}
		
		showModal() {
			this.modalWindowInstance = this.$uibModal.open({
					templateUrl: "edit-profile-password.tpl",
					controller: "UserProfileModalCtrl",
					controllerAs: "profileModal",
					resolve: {
						//Andriy: it used lambda to correct reference this keyword within modal controller
						submitForm: () => (userPassword: string, modalWindowInstance: ng.ui.bootstrap.IModalServiceInstance) => {
							this.postDataToServer(this.editProfile, this.userService, userPassword, modalWindowInstance, this.serverValidation);
						},
						serverValidation:()=>this.serverValidation
					}
				});
		}

		postDataToServer(editProfile: IUserProfile, userService: Authentication.IUserService, userPassword: string, modalWindowInstance: angular.ui.bootstrap.IModalServiceInstance, serverValidation: IServerValidationResult) {
			editProfile.currentPassword = userPassword;
			userService.update(editProfile).
				then((response: Authentication.IUserUpdateServerResponseMessage) => {
					if (response.isUpdated) {
						this.handleUpdateSuccessServerResponse(response, modalWindowInstance);
					} else {
						this.serverResources.getServerResponseText(response.message.code).then((serverMessage) => {
							serverValidation.message = serverMessage;
						});
						serverValidation.show = true;
						serverValidation.code = response.message.code;
						if (response.message.code === Backend.WebApi.WebApiResponseCode.WrongPassword) {
							serverValidation.isModal = true;
						} else {
							modalWindowInstance.close();
							serverValidation.isModal = false;

						}
						this.$timeout(() => {
							serverValidation.message = undefined;
							serverValidation.show = false;
						}, 5000);
					}
				},
				() => {
					//Error logged in User Service
				});
			
		}

		handleUpdateSuccessServerResponse(response: Authentication.IUserUpdateServerResponseMessage, modalWindowInstance: angular.ui.bootstrap.IModalServiceInstance) {
			modalWindowInstance.close();
			modalWindowInstance.result.then(() => {
				this.modalService.open("<h4>" + this.translationLabels["profileUpdated"] + "</h4>", [{ label: this.translationLabels["ok"], cssClass: "btn btn-success", result: true }]).then(() => {
					let statePromise: any = this.statesService.reload();
					statePromise.then(() => {
						this.statesService.closeState(States.profile.name);
					});
				});
			});
		}

		setServerValidationToDefaults(serverValidation: IServerValidationResult) {
			this.serverValidation.show = false;
			this.serverValidation.message = undefined;
			this.serverValidation.code = undefined;
			this.serverValidation.isModal = false;
		}

		cleanLocation = () => {
			this.editProfile.location = FormInputsRegulator.cleanLocation(this.editProfile.location);
		};

		cleanPassword(): void {
			if (this.editProfile.password === "") {
				this.editProfile.password = undefined;
			}
		}

		cleanRetypePassword(): void {
			if (this.editProfile.reTypePassword === "") {
				this.editProfile.reTypePassword = undefined;
			}
		}

		showDeleteAccountModal() {
			this.$log.appInfo("CancelAccountRequested", { userId: this.editProfile.id });
			const deleteResult = this.modalWindowInstance = this.$uibModal.open({
				templateUrl: "edit-profile-delete-account.tpl",
				controller: DeleteProfileModalCtrl,
				controllerAs: "deleteModal",
				resolve: { id: () => this.editProfile.id }
			});
			deleteResult.result.then((result) => {
				if (result) {
					this.statesService.resetAllStates();
					this.statesService.goAndReload(States.home.name);
				} else {
					this.$log.appInfo("CancelAccountCancelled", { userId: this.editProfile.id });
				}
			}, () => {//Andriy: when click outside modal window
					this.$log.appInfo("CancelAccountCancelled", { userId: this.editProfile.id });
			});
		}

		getLocalizedResources() {
			this.serverResources.getProfileResources().then((translates:Services.IProfileResources) => {
				this.translationLabels["profileUpdated"] = translates.profileUpdated;
				this.translationLabels["ok"] = translates.ok;
			});

		}
	}
}