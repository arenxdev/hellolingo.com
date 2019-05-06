using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Validation;
using System.Threading.Tasks;

namespace Considerate.Hellolingo.DataAccess
{
	public interface IHellolingoEntities : IDisposable
	{
		DbSet<TextChat> TextChats { get; set; }
		DbSet<MessageVisibilityType> MessageVisibilityTypes { get; set; }
		DbSet<AspNetRole> AspNetRoles { get; set; }
		DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
		DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
		DbSet<AspNetUser> AspNetUsers { get; set; }
		DbSet<LogEvent> LogEvents { get; set; }
		DbSet<Configuration> Configurations { get; set; }
		DbSet<Country> Countries { get; set; }
		DbSet<Language> Languages { get; set; }
		DbSet<UsersStatus> UsersStatuses { get; set; }
		DbSet<User> Users { get; set; }
		DbSet<PublicUser> PublicUsers { get; set; }
		DbSet<UsersTagsValue> UsersTagsValues { get; set; }
		DbSet<Notify> Notifies { get; set; }
		DbSet<NotifyMedium> NotifyMediums { get; set; }
		DbSet<NotifyStatus> NotifyStatuses { get; set; }
		DbSet<MailRegulationStatus> MailRegulationStatuses { get; set; }
		DbSet<Mail> Mails { get; set; }
		DbSet<MailStatus> MailStatuses { get; set; }
		DbSet<UsersChanges> UsersChanges { get; set; }
		DbSet<SourceFeature> SourceFeatures { get; set; }
		DbSet<TilesFiltering> TilesFilterings { get; set; }
		DbSet<TilesFilter> TilesFilters { get; set; }
		DbSet<VoiceCallOutcome> VoiceCallOutcomes { get; set; }
		DbSet<VoiceCall> VoiceCalls { get; set; }
		DbSet<VoicePlatform> VoicePlatforms { get; set; }
		DbSet<Contact> Contacts { get; set; }
		DbSet<UsersDevice> UsersDevices { get; set; }

		int Mails_Archive(int? userId, long? mailId);
		ObjectResult<Mails_GetList_Result> Mails_GetList(int? id);
		int Mails_Insert(byte? regulationStatus, int? fromId, long? replyToMail, int? toId, string subject, string message);
		ObjectResult<ListedUser> ListedUsers_GetBy(int? count, int? belowId, int? knows, int? learns, string firstName, string lastName, int? country, string location, int? minAge, int? maxAge, int? tag);
		Task<Mail[]> GetMailsToNotify(int count);

		IEnumerable<DbEntityValidationResult> GetValidationErrors();
		Task<int> SaveChangesAsync();
		int SaveChanges();
	}
}