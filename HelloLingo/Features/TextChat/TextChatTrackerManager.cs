using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.Helpers;

namespace Considerate.Hellolingo.TextChat {

	public class TextChatTrackerManager {
		
		public static HashSet<UserId> RestrictedMembers = new HashSet<UserId>();
		public static readonly HashSet<UserId> WhitelistedMembers = new HashSet<UserId> { 1 };
		public static readonly List<InviteRule> RestictedInvites = new List<InviteRule> {
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=11, ToKnows=11 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=11, ToKnows=4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=11, ToKnows=8 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=12 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=12, ToKnows=27 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows= 4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows=1, ToLearns=4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows=1, ToLearns=8 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows=1, ToLearns=9 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows=21 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=2, ToKnows=3, ToLearns=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=21 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=3, ToKnows=3 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=3, ToKnows=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=3, ToKnows=11 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=3, ToKnows=4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=6, ToKnows=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=7, ToKnows=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=7, ToKnows=21 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=7, ToKnows=4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=7, ToKnows=8 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=8, ToKnows=3 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=8, ToKnows=4 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=9, ToKnows=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=9, ToKnows=3 },
		};
		public static int RestrictionResetHour = -1; 

		public static readonly List<InviteRule> WhitelistedInvites = new List<InviteRule>{
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=10 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=17 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=2 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=22 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=34 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=7 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=10, ToKnows=9, ToLearns=1 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=12, ToKnows=2 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=12, ToKnows=7 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=12, ToKnows=9 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=10 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=2 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=25 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=27 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=31 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=36 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=7 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=17, ToKnows=9 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=21, ToKnows=10 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=21, ToKnows=2 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=21, ToKnows=7 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=21, ToKnows=9 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=10 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=3 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=2 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=27 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=34 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=7 },
			new InviteRule { FromGender ="M", ToGender="F", FromKnows=44, ToKnows=9 },
		};

		public static async Task<Result<Propagate>> RequestPrivateChat(User user, RoomId roomId, UserId partnerId) {

			int partnerIdEf = partnerId; string roomIdEf = roomId; // Casting named types into their base type because EF doesn't get it otherwise.
			var toStatus = TrackerStatus.Invited;
			var propagate = true;

			using (var db = new HellolingoEntities()) {
				var inviterRecord = db.TextChatTrackers.Find(user.Id, roomIdEf);
				var inviteeRecord = db.TextChatTrackers.Find(partnerIdEf, roomIdEf);
				var partner = db.Users.Find(partnerIdEf);

				if (inviterRecord != null || inviteeRecord != null)
					return new Result<Propagate>(false, LogTag.RequestPrivateChatHasExistingRecord, new {user.Id, roomId, partnerId}, LogLevel.Error);

				// Check if it's a restricted invite
				var restricted = false;
				var userKnows = new List<byte?> { user.KnowsId, user.Knows2Id, user.Knows3Id };
				var userLearns = new List<byte?> { user.LearnsId, user.Learns2Id, user.Learns3Id };
				var isHelper = userKnows.Contains(partner.LearnsId) || (partner.Learns2Id != null && userKnows.Contains(partner.Learns2Id)) || (partner.Learns3Id != null && userKnows.Contains(partner.Learns3Id));

				if (!WhitelistedMembers.Contains(user.Id) && !isHelper) {

					// Reset RestrictedMembers every hour, which allows them to send on restricted invite every hour
					if (DateTime.Now.Hour != RestrictionResetHour) {
						RestrictedMembers = new HashSet<UserId>();
						RestrictionResetHour = DateTime.Now.Hour;
					}

					// Detect if the invite is restricted
					var partnerKnows = new List<byte?> { partner.KnowsId, partner.Knows2Id, partner.Knows3Id };
					var partnerLearns = new List<byte?> { partner.LearnsId, partner.Learns2Id, partner.Learns3Id };
					Func<InviteRule, bool> inviteCheck = control =>  control.FromGender == user.Gender && control.ToGender == partner.Gender
							&& ( control.FromKnows == null || userKnows.Contains(control.FromKnows))
							&& ( control.ToKnows == null || partnerKnows.Contains(control.ToKnows))
							&& ( control.ToLearns == null || partnerLearns.Contains(control.ToLearns));

					// Mark restricted if it matches pattern of restricted invites
					if (RestictedInvites.Any(restrict => inviteCheck(restrict)))
						restricted = true;

					// Mark if users only match on native language
					if ( (userKnows.Contains(partner.KnowsId) || (partner.Knows2Id != null && userKnows.Contains(partner.Knows2Id)) || (partner.Knows3Id != null && userKnows.Contains(partner.Knows3Id)))
						 && !(userLearns.Contains(partner.KnowsId) || (partner.Knows2Id != null && userLearns.Contains(partner.Knows2Id)) || (partner.Knows3Id != null && userLearns.Contains(partner.Knows3Id)))
						 && !(userKnows.Contains(partner.LearnsId) || (partner.Learns2Id != null && userKnows.Contains(partner.Learns2Id)) || (partner.Learns3Id != null && userKnows.Contains(partner.Learns3Id)))
						 && !(userLearns.Contains(partner.LearnsId) || (partner.Learns2Id != null && userLearns.Contains(partner.Learns2Id)) || (partner.Learns3Id != null && userLearns.Contains(partner.Learns3Id)))
					) restricted = true;

					// Derestrict if whitelisted
					if (WhitelistedInvites.Any(allow => inviteCheck(allow)))
						restricted = false;

					// If restricted, block it, unless it's the first one from this user.
					if (restricted) {
						if (RestrictedMembers.Contains(user.Id)) {
							toStatus = TrackerStatus.AutoBlocked;
							propagate = false;
						} else RestrictedMembers.Add(user.Id);
					}
				}

				// Set record for inviter
				db.TextChatTrackers.Add(new TextChatTracker {
					UserId = user.Id, RoomId = roomIdEf, PartnerId = partnerIdEf,
					Status = TrackerStatus.Inviting, StatusAt = DateTime.Now, Initiator = true
				});

				// Set record for invitee
				db.TextChatTrackers.Add(new TextChatTracker {
					UserId = partnerIdEf, RoomId = roomIdEf, PartnerId = user.Id,
					Status = toStatus, StatusAt = DateTime.Now, Initiator = false
				});

				await db.SaveChangesAsync();
			}

			return new Result<Propagate>(propagate);
		}

		public static async Task<Result<bool>> JoinRoom(User user, RoomId roomId) {
			var result = Result<bool>.True;
			if (!roomId.IsPrivate()) return result;

			int userIdEf = user.Id; string roomIdEf = roomId; // Casting named types into their base type because EF doesn't get it otherwise.
			int partnerId = ChatModel.PartnerIdFrom(roomId, user.Id);

			using (var db = new HellolingoEntities()) {
				var userTracker = db.TextChatTrackers.Find(userIdEf, roomIdEf);
				var partnerTracker = db.TextChatTrackers.Find(partnerId, roomIdEf);

				// Handle people directly joining by the url from outside the chat
				if (userTracker == null || partnerTracker == null) {
					await RequestPrivateChat(user, roomId, partnerId);
					result.Reports.AddReport(LogTag.ChatRequestAddedFromJoinRoom, new { userId = user.Id , roomId });
					return result;
				}

				// Set new statuses according to current status
				if ((userTracker.Status == TrackerStatus.Invited || userTracker.Status == TrackerStatus.IgnoredInvite) && partnerTracker.Status == TrackerStatus.Inviting) {
					userTracker.Status = TrackerStatus.AcceptedInvite;
					partnerTracker.Status = TrackerStatus.InviteAccepted;
					userTracker.StatusAt = partnerTracker.StatusAt = DateTime.Now;
					result.Reports = new LogReports(LogTag.ChatRequestAccepted);
				} else if (userTracker.Status == TrackerStatus.InviteAccepted) {
					userTracker.Status = TrackerStatus.SeenInviteResponse;
					userTracker.StatusAt = DateTime.Now;
				}

				await db.SaveChangesAsync();
			}

			return result;
		}

		public static async Task<Result<bool>> IgnorePrivateChat(UserId userId, RoomId roomId, UserId partnerId) {
			int userIdEf = userId, partnerIdEf = partnerId; string roomIdEf = roomId; // Casting named types into their base type because EF doesn't get it otherwise.

			using (var db = new HellolingoEntities()) {
				var inviterRecord = db.TextChatTrackers.Find(partnerIdEf, roomIdEf);
				var inviteeRecord = db.TextChatTrackers.Find(userIdEf, roomIdEf);

				if (inviterRecord == null || inviteeRecord == null)
					return new Result<bool>(false, LogTag.IgnorePrivateChatMissingTrackerRecord, new {userId, roomId, partnerId}, LogLevel.Error);

				// Set record for invitee
				inviteeRecord.Status = TrackerStatus.IgnoredInvite;
				inviteeRecord.StatusAt = DateTime.Now;
				await db.SaveChangesAsync();
			}

			return Result<bool>.True;
		}

		public static async Task<Result<bool>> PostTo(UserId userId, RoomId roomId)
		{
			var result = Result<bool>.True;
			string roomIdEf = roomId; // Casting named types into their base type because EF doesn't get it otherwise.
			int partnerId = ChatModel.PartnerIdFrom(roomId, userId);

			using (var db = new HellolingoEntities()) {
				var partnerRecord = db.TextChatTrackers.Find(partnerId, roomIdEf);
				if (partnerRecord == null)
					return new Result<bool>(false, LogTag.UnexpectedTrackerStatus, new { method = "PostTo", userId, roomId }, LogLevel.Error); 
				if (partnerRecord.Status == TrackerStatus.Invited || partnerRecord.Status == TrackerStatus.AutoBlocked || partnerRecord.Status == TrackerStatus.DeclinedInvite || partnerRecord.Status == TrackerStatus.IgnoredInvite || partnerRecord.Status == TrackerStatus.UnreadMessages)
					return new Result<bool>(true);
				partnerRecord.Status = TrackerStatus.UnreadMessages;
				partnerRecord.StatusAt = DateTime.Now;
				await db.SaveChangesAsync();
			}
			return result;
		}

		public static async Task<Result<bool>> MarkAllCaughtUp(UserId userId, RoomId roomId)
		{
			int userIdEf = userId; string roomIdEf = roomId; // Casting named types into their base type because EF doesn't get it otherwise.
			var result = Result<bool>.True;

			using (var db = new HellolingoEntities()) {
				var userRecord = db.TextChatTrackers.Find(userIdEf, roomIdEf);
				if (userRecord == null)
					return new Result<bool>(false, LogTag.UnexpectedTrackerStatus, new { method = "MarkAllCaughtUp", userId, roomId }, LogLevel.Error); 
				if (userRecord.Status == TrackerStatus.AllCaughtUp || userRecord.Status == TrackerStatus.Inviting || userRecord.Status == TrackerStatus.Invited)
					return result;
				userRecord.Status = TrackerStatus.AllCaughtUp;
				userRecord.StatusAt = DateTime.Now;
				await db.SaveChangesAsync();
			}
			return result;
		}

		public class InviteRule {
			public string FromGender;
			public string ToGender;
			public byte? FromKnows;
			public byte? ToKnows;
			public byte? ToLearns;
		}

	}
}