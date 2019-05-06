using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Hubs;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Models
{
	public class ContactUsMessageData
	{
		public string Subject { get; set; }
		public string Email { get; set; }
		public string Uri { get; set; }

		[Required]
		public string Message { get; set; }
	}

	public class ContactUsDump
	{
		public ContactUsDump()
		{
			CreateDateTimeString = DateTime.Now.ToString("yyyy-MM-dd hh:mm");
		}
		public string CreateDateTimeString { get; set; }
		public UserId UserId { get; set; }
		public string Subject { get; set; }
		public string Email { get; set; }
		public string Uri { get; set; }
		public string Message { get; set; }
	}
}