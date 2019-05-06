using System;
using System.Reflection;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Considerate.Hellolingo.WebApp
{
	public class JsonConfig
	{
		public static void ConfigCamelCase()
		{
			HttpConfiguration config = GlobalConfiguration.Configuration;
			config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new SignalRContractResolver();
			config.Formatters.JsonFormatter.UseDataContractJsonSerializer = false;

			var serializer = JsonSerializer.Create(config.Formatters.JsonFormatter.SerializerSettings);
			GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);
		}
	}

	/// <summary>
	/// Converts all objects to camelCase except those that come from SignalR assembly.
	/// </summary>
	public class SignalRContractResolver : DefaultContractResolver
	{
		private readonly Assembly _assembly;
		private readonly IContractResolver _camelCaseContractResolver;
		private readonly IContractResolver _defaultContractSerializer;

		public SignalRContractResolver()
		{
			_defaultContractSerializer = new DefaultContractResolver();
			_camelCaseContractResolver = new CamelCasePropertyNamesContractResolver();
			_assembly = typeof(Connection).Assembly;
		}

		public override JsonContract ResolveContract(Type type)
		{
			if (type.Assembly.Equals(_assembly))
			{
				return _defaultContractSerializer.ResolveContract(type);
			}

			return _camelCaseContractResolver.ResolveContract(type);
		}
	}
}
