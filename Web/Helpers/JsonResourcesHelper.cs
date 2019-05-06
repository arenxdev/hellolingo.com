using System.Globalization;
using System.Web.Mvc;
using Considerate.Hellolingo.I18N;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Considerate.Hellolingo.WebApp.Helpers
{
	public static class JsonResourcesHelper
	{
		public static MvcHtmlString GetResourcesJson(this HtmlHelper helper)
		{
			var jsonResourcesObject = new {
				Site = new {
					More = StringsFoundation.More,
					DefaultAccountError = StringsFoundation.FormIncompleteOrIncorrect,
					PasswordLengthErrorMsg = StringsFoundation.PasswordLengthErrorMsg,
					LanguageFilter = StringsFoundation.LanguagesFilterLine
				},
				Buttons = new {
					Yes = StringsFoundation.Yes,
					No = MainStrings.No,
					Ok = StringsFoundation.Ok,
					Clear = StringsFoundation.Clear,
					Reply = MainStrings.Reply,
					NewMessage = MainStrings.NewMessage,
				},
				TextChat = ResourcesObjectHelper.GetTextChatResources(),
				EditProfile = new {
					EmailSent = StringsFoundation.PleaseConfirmYourAccountMsg,
					ProfileUpdated = StringsFoundation.ProfileUpdated,
				},
				Messages = new {
					EmailInUse = MainStrings.EmailInUse,
					EntriesAreInvalid = MainStrings.EntriesAreInvalid,
					HellolingoUpdated = MainStrings.HellolingoUpdated,
					IncorrectPassword = MainStrings.IncorrectPassword,
					ProvideStrongerPassword = MainStrings.ProvideStrongerPassword,
					TryAgain = MainStrings.CouldYouTryThatAgain,
					VerifyPassword = MainStrings.VerifyPassword
				},
				Months = new {
					Month1 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(1),
					Month2 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(2),
					Month3 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(3),
					Month4 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(4),
					Month5 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(5),
					Month6 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(6),
					Month7 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(7),
					Month8 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(8),
					Month9 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(9),
					Month10 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(10),
					Month11 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(11),
					Month12 = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(12)
				},
			};

			var countries = ResourcesObjectHelper.GetCountriesResources();
			var statesTitles = ResourcesObjectHelper.GetStatesTitles();
			string translationJson  = JsonConvert.SerializeObject(jsonResourcesObject,Formatting.Indented,new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()});
			string countriesJson    = JsonConvert.SerializeObject(countries,          Formatting.Indented,new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()});
			string statesTitlesJson = JsonConvert.SerializeObject(statesTitles,       Formatting.Indented,new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()});
			return new MvcHtmlString($"<script id=\"tranlsation-json\" type=\"application/json\">{translationJson}</script>" +
			                         $"<script id=\"countries-json\" type=\"application/json\">{countriesJson}</script>" +
									 $"<script id=\"titles-json\" type=\"application/json\">{statesTitlesJson}</script>");
		}

	}
}
