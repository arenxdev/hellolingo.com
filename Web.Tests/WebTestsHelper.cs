using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.Hellolingo.WebApp.Tests
{
	public static class WebTestsHelper
	{
	    public static IEnumerable<UsersTagsValue> GetTagsValuesData()
		{
			var tagsValuesData = new List<UsersTagsValue>()
			{
				new UsersTagsValue() {Id = UserTags.LookToLearnWithTextChat},
				new UsersTagsValue() {Id = UserTags.LookToLearnWithVoiceChat},
				new UsersTagsValue() {Id = UserTags.LookToLearnWithGames},
				new UsersTagsValue() {Id = UserTags.LookToLearnWithMore},
				new UsersTagsValue() {Id = UserTags.WantsToHelpHellolingo},
			    new UsersTagsValue() {Id = UserTags.AgreeWithTermsOfUse},
			};
			return tagsValuesData;
		}

		public static HttpRequestMessage GetDefaultAccountControllerRequest()
		{
			HttpRequestMessage message = new HttpRequestMessage();
			message.Method=new HttpMethod("Post");
			message.RequestUri = new Uri("http://localhost");
			message.Content = new ByteArrayContent(new byte[] {});
			message.Headers.Add("Cookie", $"{CookieHelper.CookieNames.DeviceTag}=1;");
			return message;
		}
	}


	[TestClass]
	public class TestMsBuildTask
	{
		[TestMethod]
		public void TestPath()
		{
			string inputPath = @"C:\Users\andri\Source\Workspaces\HelloLingo\UnitTest\WebClient.Tests";
			string outputPath = "";
			var parent = Directory.GetParent(inputPath);
			outputPath=$@"{parent}\Web\Scripts\app";
			Assert.AreEqual(outputPath,@"C:\Users\andri\Source\Workspaces\HelloLingo\UnitTest\Web\Scripts\app");
		}
	}
}
