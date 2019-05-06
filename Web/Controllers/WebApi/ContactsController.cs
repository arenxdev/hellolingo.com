using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	[Authorize]
	public class ContactsController : BaseApiController
    {
		public ContactsController() { }

		public ContactsController(IHellolingoEntities entities)
		{
			Entity = entities;
		}
		
		[HttpGet]
		[Route("api/contact-list")]
		public IEnumerable<PublicUserLight> List()
		{
			var userId = User.Identity.GetClaims().Id;
			return Entity.Contacts.Where(c => c.UserId == userId).Select(a => a.ContactUser).ToList().Select(c => new PublicUserLight (c));
		}
		
		[HttpPost]
		[Route("api/contact-list/add")]
		public async Task AddUserToContacts(ContactListManageRequestModel model)
		{
			var userId = User.Identity.GetClaims().Id;

			var contact = await Entity.Contacts.FirstOrDefaultAsync(c => c.UserId == userId && c.ContactId == model.ContactUserId);
			if (contact != null) {
				Log.Error(LogTag.UserAlreadyInContacts, Request, new { userId, model.ContactUserId });
				return;
			}

			Entity.Contacts.Add(new Contact
			{
				ContactId = model.ContactUserId,
				UserId = userId,
				When = DateTime.Now,
				Source = GetSourceFeatureFrom(model.SourceState)
			});
			await Entity.SaveChangesAsync();
		}

		[HttpPost]
		[Route("api/contact-list/remove")]
		public async Task RemoveUserFromContacts(ContactListManageRequestModel model)
		{
			var userId = User.Identity.GetClaims().Id;
			var contact = await Entity.Contacts.FirstAsync(c => c.UserId == userId && c.ContactId == model.ContactUserId);
			Entity.Contacts.Remove(contact);
			await Entity.SaveChangesAsync();
		}

		private static byte GetSourceFeatureFrom(string state)
		{
			var requestSource = SourceFeatures.Unknown;
			var stateParts = state.Split('.');
			switch (stateParts[0])
			{
				case "text-chat":
					if (stateParts[1] == "lobby") requestSource = SourceFeatures.TextChatLobby;
					else if (stateParts[1] == "private") requestSource = SourceFeatures.PrivateTextChat;
					else requestSource = SourceFeatures.PublicTextChat;
					break;
				case "find":
					if (stateParts[1] == "name") requestSource = SourceFeatures.FindByName;
					else if (stateParts[1] == "languages") requestSource = SourceFeatures.FindByLanguage;
					break;
				case "home":
					requestSource = SourceFeatures.ContactsList;
					break;
				case "mailbox":
					if (stateParts[1] == "user") requestSource = SourceFeatures.MailboxReadMail;
					break;
			}

			return requestSource;
		}
	}
}
