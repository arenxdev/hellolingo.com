
class OnEnter implements ng.IDirective {
  restrict= "A";
  compile() {
    return (scope, element, attrs) => {
      element.bind("keydown keypress", event => {
        if (event.which === 13) {
          scope.$apply(() => { scope.$eval(attrs.onEnter); });
          event.preventDefault();
        }
      });
    }
  }
}
