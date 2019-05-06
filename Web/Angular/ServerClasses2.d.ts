
// This is Auto-Generated from a T4 Templates
// It contains classes and enums that have the [TsClass] or [TsEnum] attribute

// !!!!!! IN CASE OF TROUBLE!!!!!! READ THIS
// !!!!!! IN CASE OF TROUBLE!!!!!! READ THIS
// !!!!!! IN CASE OF TROUBLE!!!!!! READ THIS

// If Error == "Running transformation: System.Reflection.ReflectionTypeLoadException: Unable to load one or more of the requested types. Retrieve the LoaderExceptions property for more information."
//
// 1) Build your solution!
// 2) Right-click the .tt template and select "Run Custom Tool"
//
// If that's still doesn't work, rename the .tt Template and do 1) and 2) again



 
 
 

 


declare module Backend.WebApi {
	interface WebApiResponse {
		message: Backend.WebApi.WebApiResponseMessage;
	}
	interface WebApiResponseMessage {
		code: Backend.WebApi.WebApiResponseCode;
		codeName: string;
	}
}

