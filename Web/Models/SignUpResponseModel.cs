namespace Considerate.Hellolingo.WebApp.Models
{
	public class SignUpResponseModel: LoginResponseModel
	{
		public static readonly SignUpResponseModel UnhandledIssue = new SignUpResponseModel(WebApiResponseMessage.UnhandledIssue);
		public static readonly SignUpResponseModel EmailAlreadyInUse = new SignUpResponseModel(WebApiResponseMessage.EmailAlreadyInUse);
		public new static readonly SignUpResponseModel InvalidEntry = new SignUpResponseModel(WebApiResponseMessage.InvalidEntry);

		public SignUpResponseModel() {}
		public SignUpResponseModel(WebApiResponseMessage message) : base(message) { }
	}
}