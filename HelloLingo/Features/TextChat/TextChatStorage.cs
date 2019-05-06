using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Helpers;

namespace Considerate.Hellolingo.TextChat {

	public class TextChatDbStorage : ITextChatStorage
	{
		public async Task AddMessageAsync(ITextChatMessage msg)
		{
			using (var db = new HellolingoEntities()) {
				var record = new DataAccess.TextChat{
					When = msg.When,
					RoomId = msg.RoomId,
					UserId = msg.UserId,
					DeviceTag = msg.DeviceTag,
					FirstName = msg.FirstName,
					LastName = msg.LastName,
					Text = msg.Text,
					Visibility = (byte) msg.Visibility,
				};
				db.TextChats.Add(record);
				await db.SaveChangesAsync();
			}
		}

		public List<ITextChatMessage> GetHistory(RoomId roomId, List<Enumerables.MessageVisibility> withVisibilities, int messageCount)
		{
			using (var db = new HellolingoEntities())
			{
				// [Replaced by a SPROC call to try to improve perf issues]
				var entityResult = db.TextChats.AsNoTracking()
					.OrderByDescending(a => a.ID)
					.Where(a => a.RoomId == roomId && withVisibilities.Any(b => (byte)b == a.Visibility))
					// THIS NEXT LINE IS CRITICAL!!!! NOT USING MAKES THE QUERY WAY SLOWER, TO THE POINT THAT IT BRINGS 
					// THE SERVER DOWN WHEN THE IIS APPLICATION POOL IS RECYCLED AND ALL USERS ARE RELOADING ALL THEIR ROOMS. 
					// EF ACTUALLY LOADS THE FULL DEFINITION OF THE USER WHEN ToList IS CALLED... WHICH WILL CLEARLY TAKE A WHOLE LOT OF TIME.
					.Select(a => new { a.ID, a.When, a.UserId, a.FirstName, a.RoomId, a.Text, a.Visibility })
					.Take(messageCount).ToList().OrderBy(a => a.ID);

				//var entityResult = db.TextChat_GetHistory(messageCount, roomId, string.Join(",", withVisibilities.Cast<int>()));

				return entityResult.Select(
					msg => (ITextChatMessage) new TextChatMessage {
						When = msg.When,
						UserId = msg.UserId,
						FirstName = msg.FirstName,
						RoomId = msg.RoomId,
						Text = msg.Text,
						Visibility = (Enumerables.MessageVisibility) msg.Visibility
					}).OrderBy(msg => msg.When).ToList();
			}
		}

		public List<IPrivateChatStatus> GetPrivateChatStatuses(int userId)
		{
			using (var db = new HellolingoEntities())
			{
				var entityResult =  db.TextChatTrackers.AsNoTracking()
					.OrderByDescending(a => a.StatusAt)
					.Where(a => a.UserId == userId && a.Status != TrackerStatus.AutoBlocked)
					.Select(a => new { a.Status, a.StatusAt, a.Partner}) // IMPORTANT LINE: It prevents EF from having to load all related data (e.g. users, statuses details, etc...)
					.ToList();

				return entityResult.Select(
					status => (IPrivateChatStatus) new PrivateChatStatus {
						Partner = new TextChatUser {
							FirstName = status.Partner.FirstName,
							Id = status.Partner.Id,
							LastName = status.Partner.LastName,
							Country = status.Partner.CountryId,
							Location = status.Partner.Location,
							Gender = status.Partner.Gender,
							Age = AgeInYearsHelper.GetAgeFrom(status.Partner.BirthYear, status.Partner.BirthMonth),
							Knows = status.Partner.KnowsId,
							Learns = status.Partner.LearnsId,
							Knows2 = status.Partner.Knows2Id,
							Learns2 = status.Partner.Learns2Id
						},
						StatusId = status.Status,
						StatusAt = status.StatusAt
					}).ToList();
			}
		}

	}

}