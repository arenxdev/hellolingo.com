namespace Validation {
	export type ValidationErrors = { [error: string]: boolean };
	export type FormValidationErrors = { [field: string]: ValidationErrors };
}