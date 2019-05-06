using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.TextChat;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Moq;
using Considerate.Hellolingo.WebApp.Helpers;

namespace Considerate.HellolingoMock.TextChat {
	public static class Resources
	{
		public static class English
		{
			public const string RoomId = "english";
		}

		public static class French
		{
			public const string RoomId = "french";
		}

		// ========== ALICE ========== 
		public static class Alice
		{
			public const string ConnectionId = "11119951-63d4-4a5a-b43a-85fdb5e00dee";
			public const string ConnectionIdBis = "1115241-5c55-441e-a561-738ed2f80794";
			public static readonly FirstName FirstName = "Alice";
			public static readonly LastName LastName = "A.";
			public static readonly LangId Knows = 1;
			public static readonly LangId Learns = 2;
			public static readonly int UserId = 1;

			public static TextChatUser TextChatUser = new TextChatUser
			{
				FirstName = FirstName,
				LastName = LastName,
				Knows = Knows,
				Learns = Learns,
				Id = UserId
			};

			public static TextChatMessage Message = new TextChatMessage()
			{
				UserId = UserId,
				FirstName = FirstName,
				LastName = LastName,
				ConnectionId = ConnectionId,
				Visibility = Hellolingo.Enumerables.MessageVisibility.Everyone,
				RoomId = English.RoomId,
				Text = Helpers.String.RandomText()
			};

			public static HubCallerContext GetAliceContext()
			{
				var aliceMockRequest = new Mock<IRequest>();
				aliceMockRequest.Setup(r => r.User)
					.Returns(new GenericPrincipal(new ClaimsIdentity(new[]
					{
						new Claim(CustomClaimTypes.UserId, UserId.ToString())
					}), null));
				var aliceMockCookies = new Dictionary<string, Cookie>();
				var aliceDeviceTagCookie = new Cookie(CookieHelper.CookieNames.DeviceTag, UserId.ToString());
				aliceMockCookies.Add(CookieHelper.CookieNames.DeviceTag, aliceDeviceTagCookie);
				aliceMockRequest.Setup(r => r.Cookies).Returns(aliceMockCookies);
				var aliceContext = new HubCallerContext(aliceMockRequest.Object, ConnectionId);
				return aliceContext;
			}
		}

		// ========== BOB ========== 
		public static class Bob
		{
			public static string ConnectionId = "22224dd6-5a52-41fd-9d75-304c67f71202";
			public static readonly FirstName FirstName = "Bob";
			public static readonly LastName LastName = "B.";
			public static readonly LangId Knows = 2;
			public static readonly LangId Learns = 1;
			public static readonly int UserId = 2;

			public static TextChatUser TextChatUser = new TextChatUser
			{
				FirstName = FirstName,
				LastName = LastName,
				Knows = Knows,
				Learns = Learns,
				Id = UserId
			};

			public static ITextChatMessage Message = new TextChatMessage
			{
				UserId = UserId,
				FirstName = FirstName,
				LastName = LastName,
				ConnectionId = ConnectionId,
				Visibility = Hellolingo.Enumerables.MessageVisibility.Everyone,
				RoomId = English.RoomId,
				Text = Helpers.String.RandomText(),
			};

			public static ITextChatMessage Message2 = new TextChatMessage
			{
				UserId = UserId,
				FirstName = FirstName,
				LastName = LastName,
				ConnectionId = ConnectionId,
				Visibility = Hellolingo.Enumerables.MessageVisibility.Everyone,
				RoomId = English.RoomId,
				Text = Helpers.String.RandomText(),
			};

			public static ITextChatMessage Message3 = new TextChatMessage
			{
				UserId = UserId,
				FirstName = FirstName,
				LastName = LastName,
				ConnectionId = ConnectionId,
				Visibility = Hellolingo.Enumerables.MessageVisibility.Everyone,
				RoomId = English.RoomId,
				Text = Helpers.String.RandomText(),
			};

			public static HubCallerContext GetBobContext()
			{
				var bobMockRequest = new Mock<IRequest>();
				bobMockRequest.Setup(r => r.User)
					.Returns(new GenericPrincipal(new ClaimsIdentity(new[]
					{
						new Claim(CustomClaimTypes.UserId, UserId.ToString())
					}), null));
				bobMockRequest.Setup(r => r.User)
				          .Returns(new GenericPrincipal(new ClaimsIdentity(new [] {
					          new Claim(CustomClaimTypes.UserId, Resources.Bob.UserId.ToString()),
				          }), null));
				var bobMockCookies = new Dictionary<string, Cookie>();
				var bobDeviceTagCookie = new Cookie(CookieHelper.CookieNames.DeviceTag, UserId.ToString());
				bobMockCookies.Add(CookieHelper.CookieNames.DeviceTag, bobDeviceTagCookie);
				bobMockRequest.Setup(r => r.Cookies).Returns(bobMockCookies);
				bobMockRequest.Setup(r => r.Cookies).Returns(bobMockCookies);
				var bobContext = new HubCallerContext(bobMockRequest.Object, ConnectionId);
				return bobContext;
			}
		}


		// ========== CAROL ========== 
		public static class Carol
		{
			public static string ConnectionId = "33334356-3b57-414b-b2a2-a017eb7d604d";
			public static string ConnectionIdBis = "33336054-7010-494c-aeed-eebc40373fca";
			public static readonly FirstName FirstName = "Carol";
			public static readonly LastName LastName = "C.";
			public static readonly LangId Knows = 2;
			public static readonly LangId Learns = 3;
			public static readonly int UserId = 3;

			public static ITextChatMessage Message = new TextChatMessage
			{
				UserId = UserId,
				FirstName = FirstName,
				ConnectionId = ConnectionId,
				Visibility = Hellolingo.Enumerables.MessageVisibility.Everyone,
				RoomId = English.RoomId,
				Text = Helpers.String.RandomText(),
			};

			public static HubCallerContext GetCarolContext()
			{
				var carolMockRequest = new Mock<IRequest>();
				var carolMockCookies = new Dictionary<string, Cookie>();
				var carolDeviceTagCookie = new Cookie(CookieHelper.CookieNames.DeviceTag, UserId.ToString());
				carolMockCookies.Add(CookieHelper.CookieNames.DeviceTag, carolDeviceTagCookie);
				carolMockRequest.Setup(r => r.Cookies).Returns(carolMockCookies);
				carolMockRequest.Setup(r => r.User)
					.Returns(new GenericPrincipal(new ClaimsIdentity(new[]
					{
						new Claim(CustomClaimTypes.UserId, UserId.ToString())
					}), null));
				carolMockRequest.Setup(r => r.Cookies).Returns(carolMockCookies);
				var carolContext = new HubCallerContext(carolMockRequest.Object, ConnectionId);
				return carolContext;
			}
			public static HubCallerContext GetCarolBisContext()
			{
				var carolMockRequest = new Mock<IRequest>();
				var carolMockCookies = new Dictionary<string, Cookie>();
				var carolDeviceTagCookie = new Cookie(CookieHelper.CookieNames.DeviceTag, UserId.ToString());
				carolMockCookies.Add(CookieHelper.CookieNames.DeviceTag, carolDeviceTagCookie);
				carolMockRequest.Setup(r => r.Cookies).Returns(carolMockCookies);
				carolMockRequest.Setup(r => r.User)
					.Returns(new GenericPrincipal(new ClaimsIdentity(new[]
					{
						new Claim(CustomClaimTypes.UserId, UserId.ToString())
					}), null));
				carolMockRequest.Setup(r => r.Cookies).Returns(carolMockCookies);
				var carolContext = new HubCallerContext(carolMockRequest.Object, ConnectionIdBis);
				return carolContext;
			}
		}

		// ========== DAN ========== 
		// 444c4292-99c4-4a13-b543-b5f5e316b103
		// 4aad0040-103a-4374-8d93-1bdbb772c309
	}
}
