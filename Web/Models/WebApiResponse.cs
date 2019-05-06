using Newtonsoft.Json;
using TypeLite;

namespace Considerate.Hellolingo.WebApp.Models
{
	[TsClass(Module = "Backend.WebApi")]
	public class WebApiResponse
	{
		public WebApiResponse() { }
		public WebApiResponse(WebApiResponseMessage message) { Message = message; }

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public WebApiResponseMessage Message { get; set; }
	}

	[TsClass(Module = "Backend.WebApi")]
	public class WebApiResponseMessage
	{
		public static readonly WebApiResponseMessage InvalidEntry                = new WebApiResponseMessage(WebApiResponseCode.VerifyYourEntries       );
		public static readonly WebApiResponseMessage EmailAlreadyInUse           = new WebApiResponseMessage(WebApiResponseCode.EmailAlreadyInUse       );
		public static readonly WebApiResponseMessage UnrecognizedEmailOrPassword = new WebApiResponseMessage(WebApiResponseCode.UnrecognizedLogin       );
		public static readonly WebApiResponseMessage UnhandledIssue              = new WebApiResponseMessage(WebApiResponseCode.UnhandledIssue          );
        public static readonly WebApiResponseMessage WeakPassword                = new WebApiResponseMessage(WebApiResponseCode.WeakPassword            );
        public static readonly WebApiResponseMessage NewClientRequired           = new WebApiResponseMessage(WebApiResponseCode.NewClientRequired       );
		public static readonly WebApiResponseMessage WrongPassword               = new WebApiResponseMessage(WebApiResponseCode.WrongPassword           );
		public static readonly WebApiResponseMessage IsUpdated                   = new WebApiResponseMessage(WebApiResponseCode.IsUpdated               );

		public WebApiResponseCode Code { get; set; }
		public string CodeName { get; set; } // This is clarity (debugging client, reading logs), because integer codes aren't too clear
		
		public WebApiResponseMessage (WebApiResponseCode code) {
			Code = code;
			CodeName = code.ToString();
		}
	}

	// IMPORTANT: DO NOT REORDER (if possible). This is ported to Typescript and would disrupt the clients running older versions of the code before they even can know a new version exists
	[TsEnum(Module = "Backend.WebApi")]
	public enum WebApiResponseCode {
		NewClientRequired, // Especially don't move this!
		VerifyYourEntries,
		EmailAlreadyInUse,
		UnrecognizedLogin,
		UnhandledIssue,
		WeakPassword,
		WrongPassword,
		IsUpdated
	}

}
