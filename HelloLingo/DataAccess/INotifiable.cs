namespace Considerate.Hellolingo.DataAccess
{
	public interface INotifiable
	{
		byte NotifyStatus { get; set; }
		int FromId { get; set; }
		int ToId { get; set; }
		byte ToStatus { get; set; }
		User UserFrom { get; set; }
		User UserTo { get; set; }
	}
}