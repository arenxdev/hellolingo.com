namespace Considerate.Hellolingo.Emails
{
	public class EmailNotificationModel
	{
		public int UserIdTo { get; set; }
		public string FirstNameTo { get; set; }
		public string LastNameTo { get; set;}
		public string EmailTo { get; set; }

		public int UserIdFrom { get; set; }
		public string FirstNameFrom { get; set; }
		public string LastNameFrom { get; set;}
		public string TargetCulture { get; set; }


	}
}
