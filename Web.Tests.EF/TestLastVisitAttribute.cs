using System;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.WebApp.CustomFilters;
using Considerate.Hellolingo.WebApp.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Considerate.Hellolingo.WebApp.Tests.EF
{
  [TestClass]
  public class TestLastVisitAttribute
  {
    [TestMethod]
    public void TestLastVisitUpdated()
    {
      var user = new AspNetUser() {UserName = "bernard@hellolingo.com"};
      var filter          = new LastVisitFilter(new LastVisitHelper());
      var filterContext   = new ActionExecutingContext();
      var fakeHttpContext = new Mock<HttpContextBase>();
      var fakeIdentityMock = new Mock<IIdentity>();
      fakeIdentityMock.Setup(i => i.IsAuthenticated).Returns(true);
      fakeIdentityMock.Setup(i => i.Name).Returns(user.UserName);
      fakeIdentityMock.SetupGet(i => i.Name).Returns(user.UserName);
      fakeHttpContext.SetupGet(t => t.User.Identity).Returns(fakeIdentityMock.Object);
      var controllerContext = new Mock<ControllerContext>();
      controllerContext.Setup(t => t.HttpContext).Returns(fakeHttpContext.Object);
      filterContext.HttpContext = fakeHttpContext.Object;
      DateTime before;
      DateTime after;
      using (HellolingoEntities db = new HellolingoEntities())
      {
        User userBefore = db.Users.FirstOrDefault(u => u.AspNetUser.UserName == user.UserName);
        before = userBefore.LastVisit.Value;
      }
      
      filter.OnActionExecuting(filterContext);
      using (HellolingoEntities db = new HellolingoEntities())
      {
        User userAfter = db.Users.FirstOrDefault(u => u.AspNetUser.UserName == user.UserName);
        after = userAfter.LastVisit.Value;
      }
      Assert.IsTrue(after>before);
    }

    [TestMethod]
    public void TestLastVisitNotUpdated()
    {
      //Prepare
      var lastVisitHelperMock = new Mock<ILastVisitHelper>();
      lastVisitHelperMock.Setup(h => h.SaveUserLastVisit(It.IsAny<string>(), It.IsAny<HttpRequestBase>()));

      var filter          = new LastVisitFilter(lastVisitHelperMock.Object);
      
      var fakeHttpContext = new Mock<HttpContextBase>();
      var fakeIdentityMock = new Mock<IIdentity>();
      fakeIdentityMock.Setup(i => i.IsAuthenticated).Returns(false);
      fakeHttpContext.SetupGet(t => t.User.Identity).Returns(fakeIdentityMock.Object);
      var controllerContext = new Mock<ControllerContext>();
      controllerContext.Setup(t => t.HttpContext).Returns(fakeHttpContext.Object);
      var filterContext = new ActionExecutingContext {HttpContext = fakeHttpContext.Object};
      
      //Act
      filter.OnActionExecuting(filterContext);

      //Assert
      lastVisitHelperMock.Verify(h=>h.SaveUserLastVisit(It.IsAny<string>(),It.IsAny<HttpRequestBase>()),Times.Never);
    }
  }
}
