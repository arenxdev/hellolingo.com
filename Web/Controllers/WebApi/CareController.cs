using System;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Considerate.Helpers;
using Microsoft.AspNet.Identity;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	public class CareController : BaseApiController
    {
	    private readonly IHellolingoEntities _db;
		private IEmailSender _sgManager;


		public CareController()
	    {
		    _db = new HellolingoEntities();
	    }

	    public CareController(IHellolingoEntities db, IEmailSender sgManager)
	    {
		    _db = db;
		    SgManager = sgManager;
	    }

		private IEmailSender SgManager
		{
			get { return _sgManager ?? ( _sgManager =Injection.Kernel.Get<IEmailSender>()); }
			set { _sgManager = value; }
		}

		[HttpPost]
		[AllowAnonymous]
		[Route("api/care/message")]
	    public async Task Message(ContactUsMessageData model)
	    {
			if ( !ModelState.IsValid ) {
				BadRequest(ModelState); // Note: BadRequest returns non-localized strings part of .net. I don't know if we display those
				return;
			}
			
			var messageDump = new ContactUsDump {
				Email = model.Email,
				Subject = model.Subject,
				Message = model.Message,
				Uri = model.Uri
			};

			if (User.Identity.IsAuthenticated) {
				messageDump.UserId = User.Identity.GetClaims().Id;
				messageDump.Email = _db.AspNetUsers.Find(User.Identity.GetUserId()).Email;
			}

			await SendEmail(messageDump);

			Ok();
	    }

		private async Task SendEmail(ContactUsDump dump)
		{
			var sb = new StringBuilder();
			sb.AppendLine($"From: {dump.UserId?.ToString() ?? "anonymous"} <{dump.Email}>");
			sb.Append(Environment.NewLine);
			sb.AppendLine($"Subject: {dump.Subject}");
			sb.Append(Environment.NewLine);
			//sb.AppendLine($"Uri: {dump.Uri}");
			sb.Append(Environment.NewLine);
			sb.AppendLine(dump.Message);

			string adminAddress = ConfigurationManager.AppSettings["AdminMail"];
			string emailSubject = dump.Subject;

			UserId userId = 0;
			if (User.Identity.IsAuthenticated)
				userId = User.Identity.GetClaims().Id;
			await SgManager.SendContactUsMail(userId, adminAddress, dump.Email, emailSubject, sb.ToString());
			Log.Info(LogTag.EmailSent_ContactUsForm, new { email = dump.Email });
		}
	}
}
