namespace Considerate.Hellolingo.Emails
{
	public class QuotaValidationResult
	{
		public static QuotaValidationResult Success = new QuotaValidationResult(true,null);
		public static QuotaValidationResult GetValidationExccedResult(QuotaExceedData data)=>new QuotaValidationResult(false,data);

		private QuotaValidationResult(bool isValid, QuotaExceedData exceedData)
		{
			IsValid=isValid;
			ExceedData = exceedData;
		}

		public bool IsValid { get; private set;}
		public QuotaExceedData ExceedData { get; set;}
	}

	public class QuotaExceedData
	{
		public static QuotaExceedData Create(EmailQuotaType quota, int limit, int value) => new QuotaExceedData(quota, limit, value);

		private QuotaExceedData(EmailQuotaType quota, int limit, int value)
		{
			QuotaType = quota;
			Quota = limit;
			Value = value;
		}
		public EmailQuotaType QuotaType { get; private set; }
		public int Quota { get; private set; }
		public int Value { get; private set; }
	}
}