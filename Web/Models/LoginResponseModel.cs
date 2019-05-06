using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.WebApp.Controllers.WebApi;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class LoginResponseModel: WebApiResponse
	{
		public static readonly LoginResponseModel InvalidEntry = new LoginResponseModel(WebApiResponseMessage.InvalidEntry);
		public static readonly LoginResponseModel UnrecognizedEmailOrPassword = new LoginResponseModel(WebApiResponseMessage.UnrecognizedEmailOrPassword);

		public LoginResponseModel() {}
		public LoginResponseModel(WebApiResponseMessage message) : base(message) { }

		public bool IsAuthenticated { get; set; } = false;

		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public ClientSideUser UserData { get; set; }
		
	}
}
  