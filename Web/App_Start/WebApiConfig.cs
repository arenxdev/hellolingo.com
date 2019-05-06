using System.Diagnostics;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.CustomFilters;
using Newtonsoft.Json.Serialization;

namespace Considerate.Hellolingo.WebApp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
			// Web API configuration and services

			// Register Web Api Usage Handler
			GlobalConfiguration.Configuration.MessageHandlers.Add(new WebApiUsageHandler());
			
			// Register Global Web Api Exception Logger
			config.Services.Replace(typeof(IExceptionLogger), new WebApiExceptionLogger());

			// Default [Authorize] attribute for all Web Api Controllers
			config.Filters.Add(new AuthorizeAttribute());
			
			// Force Web Api to output only JSON
			config.Formatters.Clear();

			// Configure Json for camelCase format
			var formatter = new JsonMediaTypeFormatter();
			formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
			config.Formatters.Add(formatter);
     
			// Web API routes
			config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
