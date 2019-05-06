class ProfileViewDirective implements ng.IDirective {
	restrict = "E";
	link() { }; 
	scope = {};
	templateUrl = "profile-view.tpl";
	controller = ProfileViewCtrl;
	controllerAs = "pv";
	bindToController = {
		user: "=",
		showButtons: "=",

		hasPinButton: "=",
		hasMailButton: "=",
		hasLightMailButton: "=",
		hasViewChatButton: "=",
		hasRequestChatButton: "=",
		hasAcceptChatRequestButton: "=",
		hasChatRequestedMessage: "=",
		hasRequestingChatLoader: "=",

		chatRequestedMessage: "@",
		listOfRooms: "=",

		onTitleClick: "&",
		onRequestChat: "&",
		ignoreChatRequest: "&?",
		onSwitchUserMute: "=",
		isMuted: "="
	};
	replace = true;
}