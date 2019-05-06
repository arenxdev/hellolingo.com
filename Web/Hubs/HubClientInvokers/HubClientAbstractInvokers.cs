using System;
using Considerate.Helpers.JsonConverters;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Hubs
{
	[JsonObject(MemberSerialization.OptIn)]
	public abstract class HubClientInvoker
	{
		[JsonProperty("method")]
		public virtual string MethodName => GetType().Name.Replace("Invoker", "");
		public virtual void Invoke(IClientProxy hubClient) => hubClient.Invoke(MethodName); // It makes sense to implement this as an extension method for IClientProxy
		public virtual string ArgsString => "(null)"; // For logging purposes
	}
	
	[JsonObject(MemberSerialization.OptIn)]
	public abstract class HubClientInvoker<TArg> : HubClientInvoker
	{
		protected HubClientInvoker() { }
		protected HubClientInvoker(TArg arg) { Args = new Tuple<TArg>(arg); }
		
		[JsonProperty("args")]
		[JsonConverter(typeof(TupleJsonArrayConverter))]
		public Tuple<TArg> Args { get; set; }
		
		public override string ArgsString => JsonConvert.SerializeObject(Args);

		public override void Invoke(IClientProxy hubClient) => hubClient.Invoke(MethodName, Args.Item1);
	}

	[JsonObject(MemberSerialization.OptIn)]
	public abstract class HubClientInvoker<TArg1, TArg2> : HubClientInvoker
	{
		protected HubClientInvoker() { }
		protected HubClientInvoker(TArg1 arg1, TArg2 arg2) { Args = new Tuple<TArg1, TArg2>(arg1, arg2); }

		[JsonProperty("args")]
		[JsonConverter(typeof(TupleJsonArrayConverter))]
		public Tuple<TArg1, TArg2> Args { get; set; }
		
		public override string ArgsString => JsonConvert.SerializeObject(Args);

		public override void Invoke(IClientProxy hubClient) => hubClient.Invoke(MethodName, Args.Item1, Args.Item2);
	}

	[JsonObject(MemberSerialization.OptIn)]
	public abstract class HubClientInvoker<TArg1, TArg2, TArg3> : HubClientInvoker
	{
		protected HubClientInvoker() { }
		protected HubClientInvoker(TArg1 arg1, TArg2 arg2, TArg3 arg3) { Args = new Tuple<TArg1, TArg2, TArg3>(arg1, arg2, arg3); }

		[JsonProperty("args")]
		[JsonConverter(typeof(TupleJsonArrayConverter))]
		public Tuple<TArg1, TArg2, TArg3> Args { get; set; }

		public override string ArgsString => JsonConvert.SerializeObject(Args);

		public override void Invoke(IClientProxy hubClient) => hubClient.Invoke(MethodName, Args.Item1, Args.Item2, Args.Item3);
	}

}