namespace Services {
	export class TextChatSettingsCtrl {
		static $inject = ["settings", "$uibModalInstance", "$log", "textHubService"];

		private  initValues :ITextChatSettings;

		constructor(private settings: ITextChatSettings,
			private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
			private $log: EnhancedLog,
			private textHubService: TextChatHubService) {
			this.initValues = angular.copy(settings);
		}

		toggleSettings(type: TextChatSettingsType) {
			// There should be an ng-repeat of this instead
			switch (type) {
				case TextChatSettingsType.AudioNotification: this.settings.isAudioNotificationOn = !this.settings.isAudioNotificationOn; break;
				case TextChatSettingsType.PrivateChat: this.settings.isPrivateChatOn = !this.settings.isPrivateChatOn; break;
				default: this.$log.appWarn("UnexpectedTextChatSettingType", type); break;
			}
		}

		onDoneClick() {
			if (this.initValues.isPrivateChatOn !== this.settings.isPrivateChatOn)
				this.textHubService.blockPrivateChat(!this.settings.isPrivateChatOn);
			this.$uibModalInstance.close(this.settings);
		}
	}

	enum TextChatSettingsType {
		AudioNotification = 1,
		PrivateChat = 2
	}

}