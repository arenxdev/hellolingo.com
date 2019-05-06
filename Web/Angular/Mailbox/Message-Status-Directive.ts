namespace MailBox {
	export class MessageStatusDirective implements ng.IDirective {
		restrict = "A";
		link = ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => {
			let status = $attrs["messageStatusVal"];
			let replyTo = $attrs["messageStatusReplyTo"];

			switch (status) {
				case "10": $element.addClass("message-unread"); break;
				case "11": $element.addClass("message-read"); break;
				case "2":
					if (replyTo === "") {
						$element.addClass("message-sent");
					} else {
						$element.addClass("message-replied");
					}
					break;
				default:
			}
		}
	}
}