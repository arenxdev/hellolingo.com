
class FocusOnShow implements ng.IDirective {
  restrict= "A";

  static $inject = ["$timeout"];
  constructor(private $timeout: ng.ITimeoutService) {}

  link: ng.IDirectiveLinkFn = ($scope, $element, $attr: any) => {
    if ($attr.ngShow) {
      $scope.$watch($attr.ngShow, newValue => {
        if (newValue === true) this.$timeout(() => {
          var elt = $element.children().find(`#${$attr.focusOnShow}`);
          //elt.attr("autofocus", ""); according JQuery documentation autofocus is not necessary here.
          if (elt) {
                //Andriy:if element disabled it's not possible to set focus. It happens often because during loading rooms input element is disabled.
                elt.prop("disabled", false);
                elt.focus();
            }
        }, 0);
      });
    }
  };
}
