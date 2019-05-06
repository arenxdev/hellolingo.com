using Moq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Considerate.HellolingoMock.DbContext
{
	public static class DbSetMockHelper
	{
		public static Mock<DbSet<T>> GetDbSetMock<T>(IEnumerable<T> entityData) where T :class
	    {
		    IQueryable<T> queryData = entityData.AsQueryable();
			var dbSetMock = new Mock<DbSet<T>>();
			dbSetMock.As<IDbAsyncEnumerable<T>>().Setup(u => u.GetAsyncEnumerator()).Returns(new FakeDbAsyncEnumerator<T>(queryData.GetEnumerator()));
			dbSetMock.As<IQueryable<T>>        ().Setup(u => u.Provider)            .Returns(new FakeDbAsyncQueryProvider<T>(queryData.Provider));
			dbSetMock.As<IQueryable<T>>        ().Setup(u => u.Expression)          .Returns(queryData.Expression);
			dbSetMock.As<IQueryable<T>>        ().Setup(u => u.ElementType)         .Returns(queryData.ElementType);
			dbSetMock.As<IQueryable<T>>        ().Setup(u => u.GetEnumerator())     .Returns(queryData.GetEnumerator());
			return dbSetMock;
		}
	}
}
