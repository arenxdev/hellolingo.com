using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Features.MailBox;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	public class MailBoxController : BaseApiController
    {
	    private readonly IHellolingoEntities _db;
	    private readonly IMailBoxValidator _mailBoxValidator;

	    public MailBoxController()
	    {
		    _db=new HellolingoEntities();
			_mailBoxValidator = new MailBoxValidator(_db);
	    }

	    public MailBoxController(IHellolingoEntities db, IMailBoxValidator mailBoxValidator)
	    {
		    _db=db;
		    _mailBoxValidator = mailBoxValidator;
	    }

		public class GetContentRequest { public int Id; }

		[Route("api/mailbox/post-mail")]
	    public async Task PostMessage(HellolingoMailMessage model)
	    {
			if (ModelState.IsValid==false) {
				Log.Warn(LogTag.InvalidModelStateReceiveByPostMail, Request, model);
				return;
			}

			var recipientValidation = _mailBoxValidator.IsRecipientValid(model.MemberIdTo);
			Log.Reports(recipientValidation.Reports, Request);
			if (recipientValidation.Value == false)
				return;

			// Nope! You can't email yourself. Sorry!
			var userId = User.Identity.GetClaims().Id;
			if (userId == model.MemberIdTo) {
				Log.Error(LogTag.PostMail_SenderCannotMailHimself, Request, new { userId, model });
				return;
			}

			// Protect from reply spoofing
			var replyToValidation = _mailBoxValidator.IsReplyToValid(model.ReplyTo, userId, model.MemberIdTo);
			Log.Reports(replyToValidation.Reports, Request);
			if (replyToValidation.Value == false)
				return;

			// Determine regulation status
			User user = await GetLocalUser();// _db.AspNetUsers.Find(userId).Users.First();
			var regulationStatus = MailRegulationStatuses.PassAndReview;
		    if (model.ReplyTo != null)
		    {
				regulationStatus = MailRegulationStatuses.AutoPass;
			    var controlledKeywords = new [] {"facebook", "skype", "whatsapp", "instagram", "snapchat", "+", "@", "wechat", "viber", "telegram", "t e l e", "hangouts", "whats app", "número", "skyoe", "twitter", "numero", "messenger", "number", "00", "kakao", " line", " qq" };
				bool isControlled = controlledKeywords.Any(word => CultureInfo.InvariantCulture.CompareInfo.IndexOf(model.Text, word, CompareOptions.IgnoreCase) != -1);
				if (isControlled) regulationStatus = MailRegulationStatuses.PassAndReview;
			}
		    else
		    {
			    // Try autopass when no bad keywords are found and length is long enough, but not if the member has sent too many emails
		    }

			// Store the mail
			// I'm not sure how using (_db) has benefits?
			using (_db)
				_db.Mails_Insert(	regulationStatus: regulationStatus,
									fromId          : userId,                        
					replyToMail     : model.ReplyTo,                          
					toId            : model.MemberIdTo,                        
					subject         : null,                           
					message         : model.Text);
			}

	    [Route("api/mailbox/get-list-of-mails")]
	    public IEnumerable<Mails_GetList_Result> GetMailList() {
		    using (_db)
				return _db.Mails_GetList(User.Identity.GetClaims().Id).ToList();
	    }

		[Route("api/mailbox/get-mail-content")]
	    [HttpPost]
		public async Task<MailContent> GetContent(GetContentRequest request)
	    {
			int userId = User.Identity.GetClaims().Id;
		    var isValidOwner = _mailBoxValidator.IsValidOwner(request.Id, userId);
		    Log.Reports(isValidOwner.Reports, Request);
			if (isValidOwner.Value == false) 
				return null;

			MailContent mailContent;

			using (_db) {
				// Get mail content
				var mail = _db.Mails.Find(request.Id);
				mailContent = new MailContent {Id = mail.Id, Message = mail.Message};

				// Mark email as read if needed
				if (mail.ToId == userId && mail.ToStatus == MailStatuses.New){
					Log.Info(LogTag.MailMarkedAsRead, Request, new {userId, mailId = mail.Id});
					mail.ToStatus = MailStatuses.Read;
					await _db.SaveChangesAsync();
				}
			}

			return mailContent;
		}

		[Route("api/mailbox/archive")]
		[HttpPost]
		public void Archive(GetContentRequest request)
		{
			int userId = User.Identity.GetClaims().Id;
			using (_db)
				_db.Mails_Archive(userId, request.Id);
		}
	}
}
