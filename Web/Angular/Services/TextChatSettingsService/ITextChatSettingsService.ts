/// <reference path="itextchatsettings.ts" />
namespace Services {
	export interface ITextChatSettingsService {
		openSettings: (settings: ITextChatSettings) => ng.IPromise<ITextChatSettings>;
	}
}