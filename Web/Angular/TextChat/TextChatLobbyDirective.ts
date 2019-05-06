module TextChat {
	export class TextChatLobbyDirective implements ng.IDirective {
		link = ($scope, element, attr, lobby) => {};
		$scope = {};
		templateUrl="text-chat-lobby.tpl";
		controller = "TextChatLobbyCtrl";
		controllerAs = "lobby";
		bindToController = {
			joinedRooms:"=",
			goToPrivate: "&",
			requestChat: "&",
			isUserMuted: "=",
			onSwitchUserMute: "="
		};
		rerstrict = "E";
		replace = true;
	}
}