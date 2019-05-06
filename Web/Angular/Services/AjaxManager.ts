/// <reference path="../References.d.ts" />

module Services {

	export class AjaxManager implements ng.IHttpInterceptor {

		static factory($q: ng.IQService, $log: EnhancedLog, $injector: any) { return new AjaxManager($q, $log, $injector); }

		static $inject = ["$q", "$log", "$injector"];
		constructor(private $q: ng.IQService, public $log: EnhancedLog, private $injector: any) { }

		request = (config) => {
			if (!config.timeout)
				config.timeout = Config.Ajax.timeoutInMs;
			config.msBeforeAjaxCall = new Date().getTime();

			// Prevent cross-version caching issue with angular templates
			// This invalidates the browser's cache each time a new client version appears
			if (
				config.url.indexOf("uib/template/") !== 0 // Reserved for inline templates by Angular-Bootstrap
				&& config.url.substr(-".html".length) === ".html" // Equivalent of Ecmascript 6:  config.url.endsWith(".html")
			) {
				config.url = config.url + "?v=" + Config.clientVersion;
			}

			return config;
		};

		response = (response) => {
			const timewarning = response.config.timewarning || Config.Ajax.timewarningInMs;
			if (timewarning) {
				const timeTakenInMs = new Date().getTime() - response.config.msBeforeAjaxCall;
				if (timeTakenInMs > timewarning && response.config.url !==  Config.EndPoints.remoteLog) // We avoid logging issues with the logging endpoint because that creates infinite logging loops that stall browsers
					this.$log.ajaxWarn("SlowServerResponse", { timeTakenInMs, url: response.config.url, data: response.config.data });
			}
			return response;
		};

		responseError = (rejection) => {
			let extraErrorData: Object, errorType: Services.LogTag, downgradeToWarning = false;
			const errorData: Object = { url: rejection.config.url, data: rejection.config.data };

			// Ignore 499 error: Http call has been cancelled due to user activity (refresh or close page)
			if (rejection && rejection.status === 499)
				return rejection;

			// Is this a server error? a timeout? a 401?
			if (rejection && rejection.status === 401) {
				this.$log.ajaxWarn("AjaxUnauthorized", $.extend({}, errorData)); // I'm not sure why there is an extend here. Maybe to leave errorData untouched, somehow
				this.$injector.get("$state").go(States.login.name);
				return rejection;
			} else if (rejection && rejection.status && rejection.data) {
				errorType = "AjaxException";
				extraErrorData = {
					errorMessage: rejection.data.ExceptionMessage || rejection.data.Message,
					status: rejection.status
				};
			} else {
				const timeTakenInMs = new Date().getTime() - rejection.config.msBeforeAjaxCall;
				errorType = "AjaxTimeout";
				downgradeToWarning = true;
				extraErrorData = { timeTaken: timeTakenInMs };
			}

			// Log the error or warning
			if (rejection.config.url !== Config.EndPoints.remoteLog) { // We avoid logging issues with the logging endpoint because that creates infinite logging loops that stall browsers
				if (downgradeToWarning) this.$log.ajaxWarn(errorType, $.extend(extraErrorData, errorData));
				else this.$log.ajaxError(errorType, $.extend(extraErrorData, errorData));
			}

			//Note that rejecting this will log an additional error when loading a partial failed (but not when hitting the api failed...)
			// Reject via this.$q.reject(), otherwise the error will pass as success
			// Normally, you could use return $q.reject(rejection); but this rethrow an error that is logged with $log.
			// By not sending the rejection, we prevent logging things twice. Hopefully, that doesn't break other stuff
			// Update: actually, it breaks stuff by silencing errors and preventing some processes from dealing with them.
			// So, this.$q.reject(rejection) is needed
			return this.$q.reject(rejection);
		};
	}

}