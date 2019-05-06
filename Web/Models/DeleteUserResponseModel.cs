namespace Considerate.Hellolingo.WebApp.Models
{
	public class DeleteUserResponseModel: WebApiResponse
	{
		public static readonly DeleteUserResponseModel InvalidEntry = new DeleteUserResponseModel(WebApiResponseMessage.InvalidEntry);
		public static readonly DeleteUserResponseModel WrongPassword = new DeleteUserResponseModel(WebApiResponseMessage.WrongPassword);

		public DeleteUserResponseModel() {}
		public DeleteUserResponseModel(WebApiResponseMessage message) : base(message) { }
		public bool IsSuccess { get; set; } = false;
	}
}