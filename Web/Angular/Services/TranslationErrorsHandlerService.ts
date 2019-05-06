namespace Services {
	export function translationErrorsHandlerService($log:Services.EnhancedLog) {
		return (translationId)=> {
			$log.appError("MissedTranslationResource", { missedTranslationId: translationId });
		}
	}
}