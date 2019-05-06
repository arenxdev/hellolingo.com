interface IModalProfileViewCtrl {
	user: ILightUser;
	showButtons?: () => boolean;

	hasLightMailButton?: () => Boolean;
	hasViewChatButton?: () => Boolean;
	isMuted?: () => boolean;

	switchUserMute?: () => void;
}
	