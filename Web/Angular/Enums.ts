module Backend.WebApi {
	export const enum WebApiResponseCode {
		NewClientRequired = 0,
		VerifyYourEntries = 1,
		EmailAlreadyInUse = 2,
		UnrecognizedLogin = 3,
		UnhandledIssue = 4,
		WeakPassword = 5,
		WrongPassword = 6,
		IsUpdated = 7
	}
}

