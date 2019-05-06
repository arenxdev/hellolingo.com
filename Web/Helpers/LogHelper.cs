using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.WebApp.Hubs;
using Considerate.Helpers.Communication;
using log4net;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public static class Log {

		private static readonly ILog AspNetLog =        LogManager.GetLogger("AspNet");
		private static readonly ILog SignalRServerLog = LogManager.GetLogger("SignalRServer");
		private const string TagFiller = "AspNet>.>.>.";
		private const string TagFillerForSignalR = "SignalRServer>.>.>.";
		public static bool IsErrorToBeTreatedAsWarning(string message) => ErrorsToTreatAsWarnings.Any(message.StartsWith);
		private static string TagDataToString(LogTag tag, object data) => tag + (data == null ? "" : " = " + JsonConvert.SerializeObject(data));

		private static readonly string[] ErrorsToTreatAsWarnings = {
			"A potentially dangerous Request.Path value was detected from the client"
		};


		// =============== DEBUG ===============

		public static void Debug(LogTag tag, HttpRequestBase request, object data = null) { Debug(TagDataToString(tag, data), request); }
		public static void Debug(LogTag tag, HttpRequestMessage request, object data = null) { Debug(TagDataToString(tag, data), request); }
		internal static void Debug(LogTag tag, object data = null) { AspNetLog.Debug($"{TagFiller}	{TagDataToString(tag, data)}"); }
		private static void Debug(string message, HttpRequestMessage request) {
			try { AspNetLog.Debug(new NetHelper.HttpInfo(request).LogHead + message); } 
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Debug(LogTag tag, HttpRequestMessage request)" }); }
		}
		private static void Debug(string message, HttpRequestBase request) {
			try { AspNetLog.Debug(new NetHelper.HttpInfo(request).LogHead + message); } 
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Debug(LogTag tag, HttpRequestBase request)" }); }
		}


		// =============== INFO ===============

		public static void Info(LogTag tag, HttpRequestBase request, object data = null) { Info(TagDataToString(tag, data), request); }
		public static void Info(LogTag tag, HttpRequestMessage request, object data = null) { Info(TagDataToString(tag, data), request); }
		internal static void Info(LogTag tag, object data = null) { AspNetLog.Info($"{TagFiller}	{TagDataToString(tag, data)}"); }
		private static void Info(string message, HttpRequestMessage request) {
			try { AspNetLog.Info(new NetHelper.HttpInfo(request).LogHead + message); } 
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Info(LogTag tag, HttpRequestMessage request)" }); }
		}
		private static void Info(string message, HttpRequestBase request) {
			try { AspNetLog.Info(new NetHelper.HttpInfo(request).LogHead + message); } 
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Info(LogTag tag, HttpRequestBase request)" }); }
		}


		// =============== WARN ===============

		public static void Warn(LogTag tag, HttpRequestBase request, object data = null) { Warn(TagDataToString(tag, data), request); }
		public static void Warn(LogTag tag, HttpRequestMessage request, object data = null) { Warn(TagDataToString(tag, data), request); }
		public static void Warn(LogTag tag, Exception exception, object data = null) { AspNetLog.Warn($"{TagFiller}	{TagDataToString(tag, data)}", exception); }

		internal static void Warn(LogTag tag, object data = null) { AspNetLog.Warn($"{TagFiller}	{TagDataToString(tag, data)}"); }
		private static void Warn(string message, HttpRequestMessage request) {
			try { AspNetLog.Warn(new NetHelper.HttpInfo(request).LogHead + message); }
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Warn(string message, HttpRequestMessage request)" }); }
		}
		private static void Warn(string message, HttpRequestBase request) {
			try { AspNetLog.Warn(new NetHelper.HttpInfo(request).LogHead + message); } 
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Warn(string message, HttpRequestBase request)" }); }
		}


		// =============== ERROR ===============

		public static void Error(LogTag tag) { AspNetLog.Error($"{TagFiller}	{tag}");}
		public static void Error(LogTag tag, object data) {AspNetLog.Error($"{TagFiller}	{TagDataToString(tag, data)}"); }
		public static void Error(LogTag tag, Exception exception, object data = null) {AspNetLog.Error($"{TagFiller}	{TagDataToString(tag, data)}", exception); }
		public static void Error(LogTag tag, HttpRequestBase request, object data = null) { Error(TagDataToString(tag, data), request); }
		public static void Error(LogTag tag, HttpRequestMessage request, object data = null) { Error(TagDataToString(tag, data), request); }
		public static void Error(LogTag tag, HttpRequestBase request, Exception exception, object data = null) { Error(TagDataToString(tag, data), request, exception); }
		public static void Error(LogTag tag, HttpRequestMessage request, object data, Exception exception) { Error(TagDataToString(tag, data), request, exception); }
		public static void Error(LogTag tag, HttpRequestMessage request, Exception exception, bool includeBody = false) { Error(tag.ToString(), request, exception, includeBody); }

		private static void Error(string message, HttpRequestMessage request, Exception exception = null, bool includeBody = false) {
			try {
				var httpInfo = new NetHelper.HttpInfo(request);
				AspNetLog.Error((includeBody? httpInfo.LogHeadAndBodyAndResponseReady : httpInfo.LogHead) + message, exception);
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Error(string message, HttpRequestMessage request, Exception exception = null, bool includeBody = false)" }); }
		}
		private static void Error(string message, HttpRequestBase request, Exception exception = null) {
			try { AspNetLog.Error(new NetHelper.HttpInfo(request).LogHead + message, exception); }
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "Error(string message, HttpRequestBase request, Exception exception = null, bool includeBody = false)"}); }
		}


		// =============== REPORTS ===============

		internal static void Reports(List<LogReport> reports, HttpRequestMessage request) {
			foreach (var report in reports)
				switch (report.Level) {
					case LogLevel.Info: Info(report.Tag, request, report.Data); break;
					case LogLevel.Warn: Warn(report.Tag, request, report.Data); break;
					case LogLevel.Error: Error(report.Tag, request, report.Data); break;
					default: Error(LogTag.UnknownReportLevel, request, report); break;
				}
		}
		internal static void Reports(List<LogReport> reports, HttpRequestBase request) {
			foreach (var report in reports)
				switch (report.Level) {
					case LogLevel.Info: Info(report.Tag, request, report.Data); break;
					case LogLevel.Warn: Warn(report.Tag, request, report.Data); break;
					case LogLevel.Error: Error(report.Tag, request, report.Data); break;
					default: Error(LogTag.UnknownReportLevel, request, report); break;
				}
		}

		// =============== DATA IN AND OUT ===============

		public static async void DataInAndOut(HttpResponseMessage response) {
			try
			{
				var info = new NetHelper.HttpInfo(response.RequestMessage);
				string logMessage;
				if (response.Content != null) {
					// Reading the string straight messes up with Asp.Net, which ends up the following error (only on the new server - Apr 2016):
					// "Server cannot append header after HTTP headers have been sent."
					// So, instead of reading (as in commented out line), we make a copy of it and read the copy.
					// var responseContent =  await response.Content.ReadAsStringAsync();
					var stream = new MemoryStream();
					await response.Content.CopyToAsync(stream);
					var responseContent = Encoding.UTF8.GetString(stream.ToArray());
					logMessage = info.LogHeadAndBodyAndResponseReady + responseContent;
				}
				else logMessage = info.LogHeadAndBody;

				// That's not the right place to figure out if this is an error or not
				// but I haven't found better than here, because error handling on web api only catches error 500
				if (response.StatusCode == System.Net.HttpStatusCode.OK || response.StatusCode == System.Net.HttpStatusCode.NoContent) AspNetLog.Info(logMessage);
				else if (response.StatusCode == System.Net.HttpStatusCode.InternalServerError) AspNetLog.Error(logMessage);
				else AspNetLog.Warn(logMessage);
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "DataInAndOut(HttpResponseMessage response)"}); }
		}


		// =============== UI CULTURE DEFAULT ===============

		public static void UiCultureChange(string currentUiCulture, string uiCultureFromCookie, string oldUiCultureFromCookie, 
			string userAcceptedLanguages, HttpRequestBase request, string newSessionTag = null) {
			try {
				var obj = new { UiCulture = currentUiCulture, OldUiCulture = oldUiCultureFromCookie, UserAcceptedLanguages = userAcceptedLanguages };
				AspNetLog.Info(new NetHelper.HttpInfo(request).LogHead + "UiCultureChange = " + JsonConvert.SerializeObject(obj));
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "UiCultureChange(...)"}); }
		}


		// =============== COOKIE TAGS ===============

		public static void CookieTags(string oldSessionTag, HttpRequestBase request) {
			try {
				var httpInfo = new NetHelper.HttpInfo(request);
				var userAcceptedLanguages = request.RequestContext.HttpContext.Request.UserLanguages ?? new string[0];
				var cookieTags = new NetHelper.CookieTags {
					OldSessionTag = oldSessionTag,
					NewSessionTag = httpInfo.SessionTag,
					DeviceTag = httpInfo.DeviceTag,
					UiCulture = CookieHelper.GetValue(CookieHelper.CookieNames.UiCulture, request),
					UserAcceptedLanguages = string.Join(",", userAcceptedLanguages)
				};
				AspNetLog.Info(httpInfo.LogHead + "CookieTags = " + JsonConvert.SerializeObject(cookieTags));
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "CookieTags(string oldSessionTag, HttpRequestBase request)"}); }
		}


		// =============== REFERRER URL ===============
		public static void ReferrerUrl(HttpRequestBase request) {
			try {
				if (request.UrlReferrer != null)
				AspNetLog.Info(new NetHelper.HttpInfo(request).LogHead + "ReferrerUrl = " + request.UrlReferrer);
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "ReferrerUrl(HttpRequestBase request)"}); }
		}


		// =============== BROWSER CAPABILITIES ===============
		public static void BrowserCapabilities(HttpRequestBase request) {
			try {
				var browser = request.Browser;
				var obj = new {
					request.UserAgent, browser.Browser, browser.Cookies, browser.Crawler, browser.InputType,
					browser.IsMobileDevice, browser.JavaApplets, browser.MajorVersion, browser.MinorVersion,
					browser.MobileDeviceManufacturer, browser.MobileDeviceModel, request.Browser.Platform
				};
				AspNetLog.Info(new NetHelper.HttpInfo(request).LogHead + "BrowserCapabilities = " + JsonConvert.SerializeObject(obj));
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "BrowserCapabilties(HttpRequestBase request)"}); }
		}


		// =============== CLIENT-SIDE ===============
		public static void Client(string logger, LogLevel level, string path, string message, HttpRequestMessage request) {
			var logHead = new NetHelper.HttpInfo(request, path, "").LogHead;
			var logLine = $"{logHead}{message}";
			switch (level) {
				case LogLevel.Info: LogManager.GetLogger(logger).Info(logLine); break;
				case LogLevel.Warn: LogManager.GetLogger(logger).Warn(logLine); break;
				case LogLevel.Error: LogManager.GetLogger(logger).Error(logLine); break;
				default: Error(LogTag.UnknownClientReportLevel, request, new { logger, level, path, message }); break;
			}
		}


		// =============== SIGNALR SERVER ===============

		// --------------- Info -------------------------
		public static void SignalR(LogTag tag, object data = null) { SignalRAction(SignalRServerLog.Info, "SignalR(LogTag tag, object data)", TagDataToString(tag, data)); }
		public static void SignalR(LogTag tag, object data, HubCallerContext context) { SignalRAction(SignalRServerLog.Info, "SignalR(LogTag tag, object data, HubCallerContext context)", TagDataToString(tag, data), context); }
		public static void SignalR(LogTag tag, HubCallerContext context) { SignalRAction(SignalRServerLog.Info, "SignalR(LogTag tag, HubCallerContext context)", tag.ToString(), context); }

		private static void SignalR(string message) { SignalRServerLog.Info($"{TagFillerForSignalR}	{message}"); }

		// --------------- Warnings ---------------------
		public static void SignalRWarn(LogTag tag, object data, HubCallerContext context) { SignalRAction(SignalRServerLog.Warn, "SignalRWarn(LogTag tag, object data, HubCallerContext context)", TagDataToString(tag, data), context); }
		public static void SignalRWarn(LogTag tag, HubCallerContext context) { SignalRAction(SignalRServerLog.Warn, "SignalRWarn(LogTag tag, HubCallerContext context)", tag.ToString(), context); }

		// --------------- Errors ---------------------
		public static void SignalRError(LogTag tag, object data, HubCallerContext context) {
			var source = "SignalRError(LogTag tag, object data, HubCallerContext context)";
			SignalRAction(SignalRServerLog.Error, source, TagDataToString(tag, data), context);
		}
		public static void SignalRError(LogTag tag, object data, Exception exception, HubCallerContext context) {
			const string source = "SignalRError(LogTag tag, object data, Exception exception, HubCallerContext context)";
			try { SignalRAction(SignalRServerLog.Error, source, TagDataToString(tag, new { data, exception }), context); }
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source }); }
		}
		public static void SignalRError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext) {
			try {
				var context = invokerContext.Hub.Context;
				var method = $"/{invokerContext.MethodDescriptor.Hub.Name}/{invokerContext.MethodDescriptor.Name}";
				var logHead = new NetHelper.HttpInfo(context.Request.GetHttpContext().Request, context.RequestCookies).LogHeadNoPath;
				var msg = $"ERROR = {JsonConvert.SerializeObject(new {ErrorMessage = exceptionContext.Error.Message})}";
				SignalRServerLog.Error($"{logHead}{method}	{msg}", exceptionContext.Error);
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "SignalRError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext)"}); }
		}

		// --------------- Reports  ---------------------
		internal static void SignalRLogReports(List<LogReport> reports, HubCallerContext context) {
			foreach (var report in reports)
				switch (report.Level) {
					case LogLevel.Info:  SignalR(report.Tag, report.Data, context); break;
					case LogLevel.Warn:  SignalRWarn(report.Tag, report.Data, context); break;
					case LogLevel.Error: SignalRError(report.Tag, report.Data, context); break;
					default: SignalRError(LogTag.UnknownReportLevel, new { report }, context); break;
				}
		}

		// --------------- Data In And Out ---------------------

		public static void SignalRIn(IHubIncomingInvokerContext context) {
			try {
				// Let's not log everything. Some stuff are just too numerous
				if (context.MethodDescriptor.Name == "Ack") return;  // Valuable, but way to numerous
				if (context.MethodDescriptor.Name == "Ping") return; 
				if (context.MethodDescriptor.Name == "SetTypingActivityIn") return;
				
				var logHead = new NetHelper.HttpInfo(context.Hub.Context.Request.GetHttpContext().Request, context.Hub.Context.RequestCookies).LogHeadNoPath;
				var path = $"/{context.MethodDescriptor.Hub.Name}/{context.MethodDescriptor.Name}";
                var message = TagDataToString(LogTag.InArgs, context.Args);

				SignalRServerLog.Info($"{logHead}{path}	{message}");
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source = "SignalR(IHubIncomingInvokerContext context)" }); }
		}

		public static void SignalROut(IEnumerable<ConnectionId> connectionIds, HubClientInvoker message) {
			var path = $"TextChatHub/{message.MethodName}";
            SignalR($"{path}	{TagDataToString(LogTag.OutArgs, new { ConnectionIds = connectionIds, Args = message.ArgsString } )}");
		}
		public static void SignalROut(ConnectionId connectionId, List<QueuedMessage<HubClientInvoker>> messages) {
			foreach (var message in messages) {
				var call = message.Message;
				var method = call.MethodName;
				var logArgs = call.ArgsString;

				// Logged as a bundle in other parts of the code
				if (method == "AddUser") return;
				if (method == "RemoveUser") return;
				if (method == "AddUserTo") return;
				if (method == "AddInitialUsersTo") return;
				if (method == "RemoveUserFrom") return;
				if (method == "AddMessage") return;
				if (method == "AddInitialMessage") return;
				if (method == "SetUserIdle") return;
				if (method == "AddPrivateChatStatus") return;
				if (method == "MarkAllCaughtUp") return;
				if (method == "SetInitialCountOfUsers") return;

				// Not critical to log this
				if (method == "MarkUserAsTyping") return;
				if (method == "UnmarkUserAsTyping") return;
				if (method == "UpdateCountOfUsers") return;

				// To big to log in full
				if (method == "AddInitialMessages" || method == "AddInitialUsers")
					logArgs = "..."; // Clean log of the content of AddInitialMessages, because it's too long to log.

				var path = $"TextChatHub/{method}";
                SignalR($"{path}	{TagDataToString(LogTag.OutArgs, new { ConnectionId = connectionId, message.OrderId, Args = logArgs } )}");
			}
		}

		
		// --------------- Helper  ---------------------
		private static void SignalRAction(Action<string> logAction, string source, string message) {
			try { logAction($"{TagFillerForSignalR}	{message}"); }
			catch (Exception e) { Error(LogTag.LoggingError, e, new { source }); }
		}
		private static void SignalRAction(Action<string> logAction, string source, string message, HubCallerContext context) {
			try {
				var logHead = new NetHelper.HttpInfo(context.Request.GetHttpContext().Request, context.RequestCookies).LogHeadNoPath;
				var path = context.Request.LocalPath;
				logAction($"{logHead}{path}	{message}");
			} catch (Exception e) { Error(LogTag.LoggingError, e, new { source }); }
		}

	}
}