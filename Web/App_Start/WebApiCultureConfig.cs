using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;

namespace Considerate.Hellolingo.WebApp.App_Start
{
	public class WebApiCultureActivator : IHttpControllerActivator
	{
		public IHttpController Create(HttpRequestMessage request, HttpControllerDescriptor controllerDescriptor, Type controllerType)
		{
			throw new NotImplementedException();
		}
	}
}
