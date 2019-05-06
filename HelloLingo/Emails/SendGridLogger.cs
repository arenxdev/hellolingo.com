using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.Emails
{
	public class SendGridLogger : ISendGridLogger
	{
		private readonly string _appPath;

		public SendGridLogger(string applicationPhysicalPath)
		{
			_appPath = applicationPhysicalPath;
		}
	    
		public async Task LogEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId = 0)
		{
			string solutionFolder = Directory.GetParent(_appPath).Parent?.FullName;
			string logsFolder = $@"{solutionFolder}\Logs";
			string emailLogsFolder = $@"{logsFolder}\EmailsOut";
			Directory.CreateDirectory(emailLogsFolder);

			string emailDate = DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss");
			string fileName  = $"{emailType}-{userId}-{emailDate}.json";
			string filePath  = $@"{emailLogsFolder}\{fileName}";
			string fileText  = JsonConvert.SerializeObject(new {Type    = emailType.ToString(),
				                                               To      = emailTo,
				                                               Subject = subject,
				                                               Text     = body }, Formatting.Indented );

			await Task.Run(() =>
			{
				if(File.Exists(filePath))
					filePath = filePath.Replace(".json", $"-({DateTime.Now.Ticks}).json");
				File.WriteAllText(filePath, fileText);
			});
		}

		public async Task LogQuotaExceedEmailToDisk(EmailTypes emailType, string emailTo, string subject, string body, int userId)
		{
			string solutionFolder = Directory.GetParent(_appPath).Parent?.FullName;
			string logsFolder = $@"{solutionFolder}\Logs";
			string rejectedEmailLogsFolder = $@"{logsFolder}\EmailsOutRejected";
			Directory.CreateDirectory(rejectedEmailLogsFolder);

			string emailDate = DateTime.Now.ToString("yyyy-MM-ddTHH-mm-ss");
			string fileName  = $"{emailType}-{userId}-{emailDate}.json";
			string filePath  = $@"{rejectedEmailLogsFolder}\{fileName}";
			string fileText  = JsonConvert.SerializeObject(new {Type    = emailType.ToString(),
				                                                To      = emailTo,
				                                                Subject = subject,
				                                                Text    = body }, Formatting.Indented );

			await Task.Run(() =>
			{
				if(File.Exists(filePath))
					filePath = filePath.Replace(".json", $"-({DateTime.Now.Ticks}).json");
				File.WriteAllText(filePath, fileText);
			});
		}
	}
}