module Profile {
	export class ProfileDirective implements ng.IDirective {
		link             = ($scope, element, attr, profile:ProfileController) => {
			profile.profileValidation = new ProfileFormValidation(profile.profileForm, profile.editProfile,profile.serverResources);
		};
		scope           = {};
		templateUrl      = "edit-profile.tpl";
		controller       = "UserProfileCtrl";
		controllerAs     = "profile";
		bindToController = {};
		restrict         = "E";
		replace          = true;
	}
}