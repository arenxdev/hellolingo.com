
class TooltipLink implements ng.IDirective {
	restrict = "A";
	scope = { tooltip: "=tooltipLink" };

	link: ng.IDirectiveLinkFn = (scope: ITooltipLinkScope, $element, $attr: any) => {
		let link = scope.tooltip.link;
		if (link) {
			if (link.toLowerCase().indexOf(window.location.origin) === 0) // Set Hellolingo links to be internal
				$element.attr("href", link.substring(window.location.origin.length)); 
			else if (link.toLowerCase().indexOf("http") === 0) // Opens http url in a new tab
				$element.attr("target", "_blank").attr("href", link); 
			else if (link.charAt(0) === "/") // Opens internal links
				$element.attr("href", link);
			else $element.attr("href", link) //  Open others (email:, skype:)
				.attr("onclick", `javascript:var tmp = window.onbeforeunload; window.onbeforeunload = null; window.location.href='${link}';  window.setTimeout(function () {window.onbeforeunload = tmp;}, 1000);`);
		} else {
			$element.attr("target", "_self").attr("href", "javascript:void(0)");
		}
	};
}

interface ITooltipLinkScope extends ng.IScope {
	tooltip: Tooltip;
}; 