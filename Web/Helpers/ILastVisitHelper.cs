using System.Net.Http;
using System.Web;

namespace Considerate.Hellolingo.WebApp.Helpers
{
  public interface ILastVisitHelper
  {
    void SaveUserLastVisit(string currentUserName, HttpRequestBase mvcContext);
    void SaveUserLastVisit(string currentUserName, HttpRequestMessage webApiContext);
  }
}