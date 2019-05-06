namespace Considerate.Hellolingo.WebApp.Models
{
	public class ProfileUpdateResponseModel: WebApiResponse
	{
		public static readonly ProfileUpdateResponseModel WrongPassword            = new ProfileUpdateResponseModel(WebApiResponseMessage.WrongPassword);
		public static readonly ProfileUpdateResponseModel InvalidEntry             = new ProfileUpdateResponseModel(WebApiResponseMessage.InvalidEntry);
		public static readonly ProfileUpdateResponseModel EmailAlreadyInUse        = new ProfileUpdateResponseModel(WebApiResponseMessage.EmailAlreadyInUse);
		public static readonly ProfileUpdateResponseModel Updated                  = new ProfileUpdateResponseModel(WebApiResponseMessage.IsUpdated,true);

		public ProfileUpdateResponseModel() {}

		public ProfileUpdateResponseModel(WebApiResponseMessage message, bool isUpdated=false) : base(message)
		{
			IsUpdated = isUpdated;
		}

		public bool IsUpdated { get; private set; }
		
	}
}