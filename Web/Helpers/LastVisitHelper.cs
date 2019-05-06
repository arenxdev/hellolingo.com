using System;
using System.Linq;
using System.Net.Http;
using System.Web;
using Considerate.Hellolingo.DataAccess;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public class LastVisitHelper : ILastVisitHelper
	{
		private HttpRequestBase _mvcContext;
		private HttpRequestMessage _webApiContext;

		public void SaveUserLastVisit(string currentUserName, HttpRequestBase mvcContext)
		{
			_mvcContext = mvcContext;
			SaveLastVisit(currentUserName);
		}

		public void SaveUserLastVisit(string currentUserName, HttpRequestMessage webApiContext)
		{
			_webApiContext = webApiContext;
			SaveLastVisit(currentUserName);
		}

		private void SaveLastVisit(string userName)
		{
			using (var db = new HellolingoEntities())
			{
				var user = db.Users.FirstOrDefault(u => u.AspNetUser.UserName == userName);
				if (user != null) user.LastVisit = DateTime.Now;
				try
				{
					db.SaveChanges();
				}
				catch (Exception e)
				{
					LogError(e);
				}
			}
		}

		private void LogError(Exception e)
		{
			if (_mvcContext != null) Log.Error(LogTag.UserLastVisitUpdateError, e, _mvcContext);
			else Log.Error(LogTag.UserLastVisitUpdateError, e, _webApiContext);
		}
	}
}

