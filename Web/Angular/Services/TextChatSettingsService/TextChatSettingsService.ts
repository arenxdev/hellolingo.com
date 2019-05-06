/// <reference path="itextchatsettingsservice.ts" />
namespace Services {
	export class TextChatSettingsService implements ITextChatSettingsService {
		static $inject = ["$q", "$uibModal"];

		constructor(private $q: ng.IQService, private $uibModal: ng.ui.bootstrap.IModalService) { }

		openSettings(settings: ITextChatSettings) {
			const defer = this.$q.defer<ITextChatSettings>();
			const settingsResult = this.$uibModal.open({
				templateUrl: "text-chat-settings.tpl",
				controller: TextChatSettingsCtrl,
				controllerAs: "settings",
				resolve: { settings: () => settings }
			});
			settingsResult.result.then((settings: ITextChatSettings) => {
				defer.resolve(settings);
			});
			return defer.promise;
		}
	}
}