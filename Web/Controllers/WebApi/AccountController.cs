using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Considerate.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Management;
using Considerate.Hellolingo.Regulators;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Controllers.WebApi
{
	public class AccountController : BaseApiController
	{
		private ApplicationSignInManager _signInManager;
		private ApplicationUserManager _userManager;
		private IAuthenticationManager _authenticationManager;
	    private ILastVisitHelper _lastVisitHelper;
		private IEmailSender _sgManager;
		private IDeviceTagManager _dtManager;

		public AccountController() { }

		public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager, IHellolingoEntities entity, ILastVisitHelper lastVisitHelper, IEmailSender emailSender, IAuthenticationManager authenticationManager, IDeviceTagManager deviceTagManager = null) {
			UserManager = userManager;
			AuthenticationManager = authenticationManager;
			SignInManager = signInManager;
			Entity = entity;
			LastVisitHelper = lastVisitHelper;
			EmailSender = emailSender;
			DeviceTagManager = deviceTagManager;
		}

		private ApplicationSignInManager SignInManager {
			get { return _signInManager ?? (_signInManager = HttpContext.Current.GetOwinContext().Get<ApplicationSignInManager>()); }
			set { _signInManager = value; }
		}

		private IAuthenticationManager AuthenticationManager
		{
			get { return _authenticationManager ?? (_authenticationManager = HttpContext.Current.GetOwinContext().Authentication); }
			set { _authenticationManager = value; }
		}

		private ApplicationUserManager UserManager {
			get { return _userManager ?? (_userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>()); }
			set { _userManager = value; }
		}

		private ILastVisitHelper LastVisitHelper
		{
			get { return _lastVisitHelper ?? ( _lastVisitHelper = new LastVisitHelper() ); }
			set { _lastVisitHelper = value; }
		}

		private IEmailSender EmailSender
		{
			get { return _sgManager ?? (_sgManager = Injection.Kernel.Get<IEmailSender>()); }
			set { _sgManager = value; }
		}

		private IDeviceTagManager DeviceTagManager
		{
			get { return _dtManager ?? (_dtManager = Injection.Kernel.Get<IDeviceTagManager>()); }
			set { _dtManager = value; }
		}

		private Result<long> LocalDeviceTag {
			get {
				var cookiesCollection = Request.Headers?.GetCookies();
				var cookies = cookiesCollection?.Count == 0 ? null : cookiesCollection?[0];
				var result = new Result<long>();

				if (!long.TryParse(cookies?[CookieHelper.CookieNames.DeviceTag]?.Value, out result.Value))
					result.Reports.Add(new LogReport(LogTag.MissingDeviceTag));

				return result;
			}
		}

		[AllowAnonymous]
		[Route("api/account/log-in")]
		public async Task<LoginResponseModel> PostLogin(LoginRequestModel model)
		{
			// Get DeviceTag
			var deviceTagResult = LocalDeviceTag;
			if (deviceTagResult.HasLogTag(LogTag.MissingDeviceTag)) {
				Log.Reports(deviceTagResult.Reports, Request);
				return LoginResponseModel.InvalidEntry;
			}
			var deviceTag = deviceTagResult.Value;

			if (!ModelState.IsValid) {
				Log.Error(LogTag.InvalidLogInModelState, Request, new { message = ModelState.Values, model});
				return LoginResponseModel.InvalidEntry;
			}

			var aspNetUser = await UserManager.FindByNameAsync(model.UserName);
			if (aspNetUser == null)
			{
				Log.Info(LogTag.AttemptToLogInWithUnknownUserName, Request, new { model.UserName });
				return LoginResponseModel.UnrecognizedEmailOrPassword;
			}
			var user = aspNetUser.Users.First();
			if (user.Status.Id == UserStatuses.Deleted) {
				Log.Info(LogTag.AttemptToLogInWithInvalidUser, Request, new { userId = user.Id, status = user.Status.Value });
				return LoginResponseModel.UnrecognizedEmailOrPassword;
			}

			var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, true, false);
			if (result != SignInStatus.Success) {
				Log.Info(LogTag.LogInFailed, Request, new { status = result, model });
				return LoginResponseModel.UnrecognizedEmailOrPassword;
			}

			// Update LastVisit date.
			LastVisitHelper.SaveUserLastVisit(model.UserName, Request);

			// Link device to new user
			await DeviceTagManager.LinkDeviceToUser(deviceTag, user.Id);

			// Log success
			Log.Info(LogTag.LogInSuccess, Request, new { userId = user.Id, status = user.Status.Value });
			return new LoginResponseModel { IsAuthenticated = true };
		}

		[HttpPost]
		[AllowAnonymous]
		[Route( "api/account/sign-up" )]
		public async Task<SignUpResponseModel> SignUp( SignUpRequestModel model )
		{
			// Get DeviceTag
			var deviceTagResult = LocalDeviceTag;
			if (deviceTagResult.HasLogTag(LogTag.MissingDeviceTag)) {
				Log.Reports(deviceTagResult.Reports, Request);
				return SignUpResponseModel.InvalidEntry;
			}
			var deviceTag = deviceTagResult.Value;

			//Get IpAddress
			var clientIpAddress = NetHelper.GetClientIpAddressFrom(Request);

			// Validate model
			if (ModelState.IsValid == false)
			{
				Log.Error(LogTag.InvalidSignUpModelState, Request, new { message = ModelState.Values, model});
				return SignUpResponseModel.InvalidEntry;
			}
			// Verify email isn't already used
			if ((await UserManager.FindByNameAsync(model.Email)) != null) {
				Log.Info(LogTag.SignUpEmailAlreadyInUse, Request, new { model.Email });
				return SignUpResponseModel.EmailAlreadyInUse;
			}
			// Create AspNet user
			var aspNetUser = new AspNetUser { UserName = model.Email, Email = model.Email, UiCulture = System.Threading.Thread.CurrentThread.CurrentUICulture.Name};
			var result     = await UserManager.CreateAsync(aspNetUser, model.Password);
			if( !result.Succeeded ) {
				Log.Error(LogTag.AspNetUserCreationError, Request, new { result.Errors });
				return SignUpResponseModel.UnhandledIssue;
			}
			
			// Regulate new user
			var user = await UserFromSignUpModel(model, aspNetUser.Id);
			IAccountRegulator regulator = Injection.Kernel.Get<IAccountRegulator>();
			var logReports = regulator.RegulateNewUser(model.Email, model.Password, user, deviceTag, clientIpAddress);
			Log.Reports(logReports, Request);

			//Save Hellolingo user profile
			var newUser = await StoreNewUser(user);
			if( newUser == null ) {
				Log.Error(LogTag.SignUpUserCreationReturnedNull, Request, new {aspNetUser, model});
				await UserManager.DeleteAsync(aspNetUser); 
				return SignUpResponseModel.UnhandledIssue;
			}

			// Complete non-critical sign up process
			try {
				// Link device to new user
				var ipV4 = NetHelper.GetClientIpAddressAsUIntFrom(Request);
				await DeviceTagManager.LinkDeviceToUser(deviceTag, newUser.Id);

				// Send Email Verification
				if (newUser.StatusId == UserStatuses.PendingEmailValidation)
				await SendConfirmationEmailAsync(aspNetUser, newUser, aspNetUser.Email);

				// Add Welcome Mail
				string message;
				switch (CultureHelper.GetCurrentCulture()) {
					case "fr": message = "\n\nNous sommes ravis de vous compter comme nouveau membre de notre communauté. Nous vous recommandons d’explorer la fonction de recherche de partenaires linguistiques et d’envoyer autant d'emails que vous le souhaitez à des partenaires potentiels. Ils vous répondront ici dans votre messagerie. Vous pouvez aussi vous rendre dans la section de chat vocal et textuel pour commencer à pratiquer tout de suite dans les salons de chat publiques et privés (la fonction chat vocal est disponible en conversation privée)." +
										 "\n\nSi vous avez des soucis, des questions ou des idées, n’hésitez pas à nous contacter via le formulaire de contact ou en répondant directement à cet email. HelloLingo est votre communauté et nous comptons sur vous pour la garder conviviale.Veillez à vous en servir dans un but d’apprentissage linguistique uniquement, soyez respectueux et pensez à reporter les bugs et dérangements quand vous les voyez. C’est la meilleure façon de protéger et d’améliorer HelloLingo." +
										 "\n\nApprenez et prospérez !\nL’équipe HelloLingo"; break;
					case "de": message = "\n\nWir sind erfreut, dich als neues Mitglied unserer Sprachlern - Gemeinschaft zu begrüßen. Wir empfehlen dir die Finden - Funktion zu erkunden und so viele Emails an potentielle Partner zu versenden wie du möchtest. Sie werden dir genau hier antworten, in deiner Mailbox. Du kannst auch zum Text & Voice Chat gehen und sofort beginnen, in öffentlichen oder privaten Räumen zu lernen. Voice Chat Unterhaltungen können von einem beliebigen privaten Raum gestartet werden." +
										 "\n\nSolltest du Probleme, Fragen oder Anregungen haben, lass es uns bitte wissen. Dafür kannst du das Kontaktformular benutzen oder direkt auf diese Email antworten. Hellolingo ist deine Community und wir zählen auf deinen Beitrag dazu, dass sie großartig bleibt. Bitte verwende sie nur zum Sprachen lernen, sei rücksichtsvoll und denke darüber nach, Störungen oder Fehler zu melden, sobald du sie siehst.Das ist der beste Weg, um Hellolingo zu bewahren und zu verbessern." +
										 "\n\nLearn and prosper!\nThe Hellolingo Team"; break;
					case "ko": message = "\n\n우리는 귀하가 언어습득 모임의 새 회원이 되신것을 매우 반갑게 생각합니다. 당신이 우리의 다양한 기능을 탐색해 보고 잠재적 파트너에게 많은 이메일을 보내시는것을 추천합니다. 그들은 당신의 메일박스에 회신할 것입니다. 또한 텍스트&보이스 채팅에서 오픈된 혹은 개인적 채팅룸에서 즉시 연습하실수 있습니다. " +
										 "\n\n만일 다른 사항, 질문 혹은 아이디어가 있으시면 이 이메일로 회신을 주시면 감사하겠습니다. Hellolingo는 당신의 커뮤니티이고 항상 멋지게 유지되길 기대하고 있습니다. 반드시 이 사이트는 언어를 배우는 것으로만 사용해 주시고 다른이들을 배려하며 불편사항이나 버그를 발견하시면 말씀해 주시기 바랍니다. 이것은 Hellolingo를 보호하고 발전시키는 가장 좋은 방법입니다. " +
										 "\n\n배우고 발전하자!\nHellolingo 팀 드림"; break;
					case "nl": message = "\n\nWe zijn heel verheugd om jou als een nieuwe deelnemer in onze gemeenschap te mogen verwelkomen.We raden je aan om vooral de find feature uit te proberen, en zoveel mogelijk e - mails te versturen naar potentiele partners.Ze zullen je hier beantwoorden, in jouw mailbox. Je kan ook naar de tekst&voice chat gaan en direct beginnen met oefenen in publieke of privé kamers. Chats met voice gesprekken kunnen geïnitieerd worden vanuit elke privé kamer." +
										 "\n\nAls je enige problemen, vragen of ideeën hebt, laat het ons alstublieft weten via onze contact formulier, of door direct op deze e-mail te reageren. Hellolingo is jouw gemeenschap en we rekenen op jou om het aangenaam te houden.Zorg ervoor dat je het alleen gebruikt om talen te oefenen, altijd rekening houdt met anderen en niet vergeet om onderbrekingen en bugs te rapporteren wanneer je die ervaart. Dit is de beste manier waarop Hellolingo beschermt en verbetert kan worden." +
										 "\n\nLeer en wees succesvol!\nHet Hellolingo Team"; break;
					case "zh-CN": message = "\n\n非常开心你能加入我们的语言学习社区。我们希望你能尽可能的去探索和尝试各种功能,你可以随时发邮件给你的潜在语言搭档，他们的回复会出现在你的邮箱里。你也可以使用文本 & 语音聊天功能在公共聊天室或者私人聊天室立刻开始进行你的语言练习。任何私人聊天室都是可以进行语音对话的。" +
											"\n\n如果你有任何疑问， 建议或者想法，请随时通过上述联系方式来联系我们。hellolingo是属于你的语言社区，你有责任把它变的越来越好，不是吗？:-)同时，我们希望你在这里进行的只有语言学习这一件事，也请在学习的同时，去关心和体谅他人。如果你遇到了任何bug,请及时反馈给我们，这是让hellolingo能更好的为你服务的最佳方式。" +
											"\n祝：学习进步，生活开心。\n\nhellolingo团队敬上"; break;
					default: message =  "\n\nWe're thrilled to have you as a new member of our language learning community. We recommend you to explore the Find feature and send as many emails as you want to potential partners. They'll reply to you right here, in you mailbox. You can also go to the Text & Voice chat and start practicing immediately in public or private rooms. Voice chat conversations can be initiated from any private room." +
										"\n\nIf you have any issues, questions or ideas, please let us know from the contact form or by replying to this email directly. Hellolingo is your community and we count on you to keep it awesome. Make sure to use it for language learning only, always be considerate of others and think about reporting disruptions or bugs when you see them. This is the best way to protect and improve Hellolingo." +
										"\n\nLearn and prosper!\nThe Hellolingo Team"; break;
										//"\n\nP.S.: We're looking to translate this message in the following languages: 日本語. Email us if you can help.";
				}
				Entity.Mails.Add(new Mail {
					When = DateTime.Now,
					FromId= 1, ToId = user.Id, FromStatus = MailStatuses.Deleted, ToStatus = MailStatuses.New,
					RegulationStatus = MailRegulationStatuses.ManualPass, NotifyStatus = NotifyStatuses.Blocked,
					Subject = "Welcome to Hellolingo!", Message = message, ReplyToMail = null});
				await Entity.SaveChangesAsync();

			} catch (Exception ex) {
				Log.Error(LogTag.CompletingSignUpFailed, Request, new { aspNetUser, model, ex });
			}

			// Sign new user in
			return await SignInCreatedUser(aspNetUser.Id);
		}

		private async Task<SignUpResponseModel> SignInCreatedUser(string aspNetUserId)
		{
			Log.Info(LogTag.SignUpSuccess, Request, new { userId = aspNetUserId});

			//Load assigned User entity to AspNetUser. Need User.Id to generate claim with UserID. Please look AspNetUserPartial.cs.
			AspNetUser aspNetUser = await Entity.AspNetUsers.FindAsync(aspNetUserId);
			
			// Log user in
			await SignInManager.SignInAsync(aspNetUser, false, false);
			User user = aspNetUser.Users.FirstOrDefault();
			var clientUser = ClientSideUserFromUser(user, aspNetUser);
			return new SignUpResponseModel { IsAuthenticated = true, UserData = clientUser };
		}

		private async Task SendConfirmationEmailAsync(AspNetUser aspNetUser, User user, string email, bool isUpdate = false)
		{
			string emailConfirmationUrl = await GetEmailConfirmUrl(aspNetUser.Id, email);
			//User user = aspNetUser.Users.FirstOrDefault();
			await EmailSender.SendSignUpEmailConfirmation(user.Id, email, user.FirstName, user.LastName, emailConfirmationUrl, isUpdate);
			Log.Info(LogTag.EmailSent_EmailConfirmation, Request, new { user.Id, email, emailConfirmationUrl });
		}


		private async Task<string> GetEmailConfirmUrl(string aspNetUserId, string email)
		{
			//Andriy: we can't use token as parameter safe without such encoding, please look here:
			//http://stackoverflow.com/questions/28750480/aspnet-identit-2-1-0-confirmemailasync-always-returns-invalid-token
			string emailTtoken     = await UserManager.GenerateEmailConfirmationTokenAsync(aspNetUserId);
			string extendedToken = $"{emailTtoken}:{email}";
			string encodedToken    = EmailConfirmationHelper.TokenEncode(extendedToken);
			string scheme          = Request.RequestUri.Scheme;
			string host            = Request.RequestUri.Host;
			string port            = Request.RequestUri.Port != 80 ? $":{Request.RequestUri.Port}":null;
			string emailConfirmUrl = $"{scheme}://{host}{port}/validate-email?id={aspNetUserId}&t={encodedToken}";
			return emailConfirmUrl;
		}

		private async Task<User> UserFromSignUpModel(SignUpRequestModel model, string aspNetUserId)
		{
			var now = DateTime.Now;
			return new User {
				AspNetId = aspNetUserId,
				Banned = false, Listed = true, Active = true, // These default values could be managed better than hardcoded here
				Since = now, LastVisit = now,
				FirstName = model.FirstName, LastName = model.LastName,
				KnowsId = model.Knows, LearnsId = model.Learns,
				Knows2Id = model.Knows2, Learns2Id = model.Learns2,
				Knows3Id = model.Knows3, Learns3Id = model.Learns3,
				Gender = model.Gender,
				BirthYear = model.BirthYear, BirthMonth = model.BirthMonth,
				CountryId = model.Country, Location = model.Location,
				Introduction = model.Introduction,
				Tags = await UserTagsFromSignUpModel(model)
			};
		}

		private ClientSideUser ClientSideUserFromUser( User user, AspNetUser aspNetUser)
		{
			return new ClientSideUser {
				Id = user.Id,
				FirstName = user.FirstName, LastName = user.LastName,
				Email = aspNetUser.Email,
				BirthMonth = user.BirthMonth, BirthYear = user.BirthYear,
				Age = AgeInYearsHelper.GetAgeFrom(user.BirthYear, user.BirthMonth),
				Gender = user.Gender,
				Country = user.CountryId, Location = user.Location,
				Learns = user.LearnsId, Learns2 = user.Learns2Id, Learns3 = user.Learns3Id,
				Knows = user.KnowsId, Knows2 = user.Knows2Id, Knows3 = user.Knows3Id,
				Introduction = user.Introduction,
				LookToLearnWithTextChat  = user.Tags.Any(t => t.Id == UserTags.LookToLearnWithTextChat),
				LookToLearnWithVoiceChat = user.Tags.Any(t => t.Id == UserTags.LookToLearnWithVoiceChat),
				LookToLearnWithGames     = user.Tags.Any(t => t.Id == UserTags.LookToLearnWithGames),
				LookToLearnWithMore      = user.Tags.Any(t => t.Id == UserTags.LookToLearnWithMore),
				IsSharedTalkMember       = user.Tags.Any(t => t.Id == UserTags.FormerSharedTalkMember),
				IsLivemochaMember        = user.Tags.Any(t => t.Id == UserTags.LivemochaMember),
				IsSharedLingoMember      = user.Tags.Any(t => t.Id == UserTags.SharedLingoMember),
				WantsToHelpHellolingo    = user.Tags.Any(t => t.Id == UserTags.WantsToHelpHellolingo),
				IsNoPrivateChat          = user.Tags.Any(t => t.Id == UserTags.TextChatNoPrivateChat),
				IsEmailConfirmed         = user.StatusId != UserStatuses.PendingEmailValidation,
			};
		}

		private async Task<User> StoreNewUser( User user ) {
			// Add user
			Entity.Users.Add(user);

			// Validate model changes
			var validationErrors = Entity.GetValidationErrors().ToList();
			if (validationErrors.Count > 0) {
				foreach (var item in validationErrors)
					Log.Error(LogTag.SignUpEntityValidationErrors, Request, new { item.ValidationErrors });
				return null;
			}

			// Save model changes
			try {
				await Entity.SaveChangesAsync();
			} catch (Exception e) {
				Log.Error(LogTag.SignUpEntitySaveChangesError, Request, e);
				return null;
			}

			return user;
		}

		private async Task<ICollection<UsersTagsValue>> UserTagsFromSignUpModel( SignUpRequestModel model ) {
			var userTags = new List<UsersTagsValue>();
			Func<int, Task> addTag = async (id) => { userTags.Add(await Entity.UsersTagsValues.FirstOrDefaultAsync(t=>t.Id==id)); };
			await addTag(UserTags.AgreeWithTermsOfUse); // Not cool: This isn't exactly the concern of this method to define whether the use agrees with the terms of use or not.
			if (model.IsSharedTalkMember)       await addTag(UserTags.FormerSharedTalkMember);
			if (model.IsLivemochaMember)		await addTag(UserTags.LivemochaMember);
			if (model.IsSharedLingoMember)		await addTag(UserTags.SharedLingoMember);
			if (model.LookToLearnWithGames)     await addTag(UserTags.LookToLearnWithGames);
			if (model.LookToLearnWithMore)      await addTag(UserTags.LookToLearnWithMore);
			if (model.LookToLearnWithTextChat)  await addTag(UserTags.LookToLearnWithTextChat);
			if (model.LookToLearnWithVoiceChat) await addTag(UserTags.LookToLearnWithVoiceChat);
			if (model.WantsToHelpHellolingo)    await addTag(UserTags.WantsToHelpHellolingo);
			return userTags;
		}

		[AllowAnonymous]
		[Route("api/account/profile")]
		public async Task<ProfileResponseModel> GetProfile()
		{
			if (!User.Identity.IsAuthenticated)
				return ProfileResponseModel.Unauthenticated;

			var aspNetUser = await UserManager.FindByIdAsync(User.Identity.GetUserId());
			if (aspNetUser == null) {
				Log.Error(LogTag.LoggedInUserNotFound);
				AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
				return ProfileResponseModel.Unauthenticated;
			}
			var user = aspNetUser.Users.First();

			if (user.Status.Id == UserStatuses.Deleted) {
				Log.Info(LogTag.VisitFromDeletedProfile, Request);
				AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
				return ProfileResponseModel.Unauthenticated;
			}

			return new ProfileResponseModel {
				IsAuthenticated = true,
				UserData = ClientSideUserFromUser(user, aspNetUser),
				UnreadMessagesCount = CountOfUnreadMails(user),
				TileFilters = await GetUserTilesFilters(user.Id)
			};
		}

		[Route("api/account/profile")]
		public async Task<ProfileUpdateResponseModel> PostProfile(UserProfileModel model)
		{
			if(ModelState.IsValid == false) {
				Log.Error(LogTag.PostProfile_InvalidModelState, Request, new {message = ModelState.Values, model});
				return ProfileUpdateResponseModel.InvalidEntry;
			}

			AspNetUser aspNetUser = await Entity.AspNetUsers.FindAsync(User.Identity.GetUserId());

			if (!await IsValidUserToUpdateProfile(model.Id, aspNetUser, model.CurrentPassword, UserManager))
				return ProfileUpdateResponseModel.WrongPassword;

			if ( !string.IsNullOrEmpty(model.Password) )
				await UpdateUserPassword(model, aspNetUser);

			SaveUsersChangesResult saveChangesResult = await IsProfileChangeSavable(model, aspNetUser);
			if (saveChangesResult.MailInvalid)
				return ProfileUpdateResponseModel.EmailAlreadyInUse;

			return await UpdateUserProfile(model, saveChangesResult.ChangedProperties);

		}

		private async Task<bool> UpdateUserPassword(UserProfileModel model, AspNetUser identityUser)
		{
			if (string.IsNullOrEmpty(model.Password)) return false;
			IdentityResult result = await UserManager.ChangePasswordAsync(identityUser.Id, model.CurrentPassword, model.Password);
			if (result.Succeeded == false)
				Log.Error(LogTag.FailedUpdateUserPassword, Request, new {modelState  = ModelState.Values, result.Errors});

			return result.Succeeded;
		}

		private async Task<ProfileUpdateResponseModel> UpdateUserProfile(UserProfileModel model, List<string> changedProperties)
		{
			AspNetUser identityUser = await Entity.AspNetUsers.FindAsync(User.Identity.GetUserId());
			User       profileData  = identityUser.Users.First();
			if(changedProperties != null)
			{
				if (changedProperties.Contains(nameof(identityUser.Email)))
				{
					identityUser.Email          = model.Email;
					identityUser.UserName       = model.Email;
					identityUser.EmailConfirmed = false;
					profileData.StatusId = UserStatuses.PendingEmailValidation;
				}
				if(changedProperties.Contains(nameof(profileData.BirthYear))) profileData.BirthYear = model.BirthYear;
				if(changedProperties.Contains(nameof(profileData.BirthMonth))) profileData.BirthMonth = model.BirthMonth;
				if(changedProperties.Contains(nameof(profileData.CountryId))) profileData.CountryId = model.Country;
				if(changedProperties.Contains(nameof(profileData.LearnsId))) profileData.LearnsId = model.Learns;
				if(changedProperties.Contains(nameof(profileData.Learns2Id))) profileData.Learns2Id = model.Learns2;
				if(changedProperties.Contains(nameof(profileData.Learns3Id))) profileData.Learns3Id = model.Learns3;
				if(changedProperties.Contains(nameof(profileData.KnowsId))) profileData.KnowsId = model.Knows;
				if(changedProperties.Contains(nameof(profileData.Knows2Id))) profileData.Knows2Id = model.Knows2;
				if(changedProperties.Contains(nameof(profileData.Knows3Id))) profileData.Knows3Id = model.Knows3;
				if(changedProperties.Contains(nameof(profileData.Introduction))) profileData.Introduction = model.Introduction;
				if(changedProperties.Contains(nameof(profileData.Location))) profileData.Location = model.Location;
			}

			await UpdateUserTagsValues(profileData, model);

			var validationErrors = Entity.GetValidationErrors().ToList();
			if(validationErrors.Count > 0)
			{
				foreach(var item in validationErrors)
					Log.Error(LogTag.UserProfileEntityValidationErrors, Request, new { item.ValidationErrors});
				return ProfileUpdateResponseModel.Updated;
			}

			try
			{
				await Entity.SaveChangesAsync();
			}
			catch(Exception e)
			{
				Log.Error(LogTag.UserProfileEntitySaveChangesError, Request, e);
				return ProfileUpdateResponseModel.Updated;
			}

			if (identityUser.EmailConfirmed == false)
				await SendConfirmationEmailAsync(identityUser, profileData, identityUser.Email, true);

			return ProfileUpdateResponseModel.Updated;
		}


		private async Task<bool> UpdateUserEmailAsync(string email)
		{
			if(await UserManager.FindByNameAsync(email) == null) return true;

			Log.Error(LogTag.EmailAlreadyInUse, Request, new { AspNetUserId = User.Identity.GetUserId(), email});
			return false;
		}

		private async Task UpdateUserTagsValues(User profileData, UserProfileModel model)
		{
			//Andriy: Tags which can changed by user
			var tagIds = new[]
			{
				UserTags.LookToLearnWithGames,
				UserTags.LookToLearnWithMore,
				UserTags.LookToLearnWithTextChat,
				UserTags.LookToLearnWithVoiceChat,
				UserTags.WantsToHelpHellolingo
			};
			foreach (var tagId in tagIds)
			{
				var userTag = profileData.Tags.FirstOrDefault(t => t.Id == tagId);
				if (userTag != null)
				{
					profileData.Tags.Remove(userTag);
				}
			}
			Func<int, Task> addTag = async (id) => { profileData.Tags.Add(await Entity.UsersTagsValues.FirstOrDefaultAsync(t => t.Id == id));};
			if (model.LookToLearnWithGames)     await addTag(UserTags.LookToLearnWithGames);
			if (model.LookToLearnWithMore)      await addTag(UserTags.LookToLearnWithMore);
			if (model.LookToLearnWithTextChat)  await addTag(UserTags.LookToLearnWithTextChat);
			if (model.LookToLearnWithVoiceChat) await addTag(UserTags.LookToLearnWithVoiceChat);
			if (model.WantsToHelpHellolingo)    await addTag(UserTags.WantsToHelpHellolingo);
		}

		private async Task<SaveUsersChangesResult> IsProfileChangeSavable(UserProfileModel model, AspNetUser aspNetUser)
		{
			User user = aspNetUser.Users.First();
			
			UserProfileChangedData changedProperties = await GetChangedPropertiesList(model, aspNetUser, user);
			if (!changedProperties.IsEmailValid)
				return new SaveUsersChangesResult(false) { MailInvalid = true };

			if (changedProperties.ChangedProperties.Any()) {
				bool isChangesSaved = await SaveUsersChanges(changedProperties.ChangedValues, user.Id);
				return new SaveUsersChangesResult(isChangesSaved, changedProperties.ChangedProperties);
			}

			if (changedProperties.IsTagsUpdated) {
				Log.Info(LogTag.PostProfile_TagsOnly, Request, new { userId = user.Id, model});
				return new SaveUsersChangesResult(true);
			}

			Log.Info(LogTag.PostProfile_NoChange, Request, new { userId = user.Id, model});
			return new SaveUsersChangesResult(false);
		}

		private async Task<UserProfileChangedData> GetChangedPropertiesList(UserProfileModel model, AspNetUser identityUser, User userData)
		{
			var changedValues = new UsersChanges();
            var changedProperties = new List<string>();
			if (model.Email != identityUser.Email)
				if (await UpdateUserEmailAsync(model.Email)) {
					changedValues.Email = identityUser.Email;
					changedProperties.Add(nameof(identityUser.Email));
				} else 
					return new UserProfileChangedData { IsEmailValid = false };

			if (model.BirthYear    != userData.BirthYear)    { changedValues.BirthYear    = userData.BirthYear;    changedProperties.Add(nameof(userData.BirthYear)); }
			if (model.BirthMonth   != userData.BirthMonth)   { changedValues.BirthMonth   = userData.BirthMonth;   changedProperties.Add(nameof(userData.BirthMonth)); }
			if (model.Country      != userData.CountryId)    { changedValues.Country      = userData.CountryId;    changedProperties.Add(nameof(userData.CountryId)); }
			if (model.Location     != userData.Location)     { changedValues.Location     = userData.Location;     changedProperties.Add(nameof(userData.Location)); }
			if (model.Knows        != userData.KnowsId)      { changedValues.KnowsId      = userData.KnowsId;      changedProperties.Add(nameof(userData.KnowsId)); }
			if (model.Knows2       != userData.Knows2Id)     { changedValues.Knows2Id     = userData.Knows2Id;     changedProperties.Add(nameof(userData.Knows2Id)); }
			if (model.Knows2       != userData.Knows3Id)     { changedValues.Knows2Id     = userData.Knows2Id;     changedProperties.Add(nameof(userData.Knows3Id)); }
			if (model.Learns       != userData.LearnsId)     { changedValues.LearnsId     = userData.LearnsId;     changedProperties.Add(nameof(userData.LearnsId)); }
			if (model.Learns2      != userData.Learns2Id)    { changedValues.Learns2Id    = userData.Learns2Id;    changedProperties.Add(nameof(userData.Learns2Id)); }
			if (model.Learns3      != userData.Learns3Id)    { changedValues.Learns3Id    = userData.Learns3Id;    changedProperties.Add(nameof(userData.Learns3Id)); }
			if (model.Introduction != userData.Introduction) { changedValues.Introduction = userData.Introduction; changedProperties.Add(nameof(userData.Introduction)); }

			bool isTagsNeedToUpdate = CheckUpdatedTags(model, userData);

			UserProfileChangedData changedData = new UserProfileChangedData {
				ChangedProperties = changedProperties,
				IsTagsUpdated     = isTagsNeedToUpdate
			};
			if(changedData.ChangedProperties.Count > 0) changedData.ChangedValues = changedValues;
			return changedData;
		}

		private bool CheckUpdatedTags(UserProfileModel model, User userData)
		{
			if(  (model.LookToLearnWithTextChat == true && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithTextChat) == null)
			   ||(model.LookToLearnWithTextChat == false && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithTextChat) != null))
			{
				return true;
			}
			if(  (model.LookToLearnWithGames == true && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithGames) == null)
			   ||(model.LookToLearnWithGames == false && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithGames) != null))
			{
				return true;
			}
			if(  (model.LookToLearnWithMore == true && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithMore) == null)
			   ||(model.LookToLearnWithMore == false && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithMore) != null))
			{
				return true;
			}
			if(  (model.LookToLearnWithVoiceChat == true && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithVoiceChat) == null)
			   ||(model.LookToLearnWithVoiceChat == false && userData.Tags.FirstOrDefault(t => t.Id == UserTags.LookToLearnWithVoiceChat) != null))
			{
				return true;
			}
			if(  (model.WantsToHelpHellolingo == true && userData.Tags.FirstOrDefault(t => t.Id == UserTags.WantsToHelpHellolingo) == null)
			   ||(model.WantsToHelpHellolingo == false && userData.Tags.FirstOrDefault(t => t.Id == UserTags.WantsToHelpHellolingo) != null))
			{
				return true;
			}
			return  false;
		}

		private async Task<bool> SaveUsersChanges(UsersChanges changesData, int userId)
		{
			changesData.UserId = userId;
			changesData.DeviceTag = GetDeviceTag();
			changesData.When = DateTime.Now;
			changesData.ChangeType = 11; 
			Entity.UsersChanges.Add(changesData);
			var validationErrors = Entity.GetValidationErrors().ToList();
			if(validationErrors.Count > 0) {
				foreach(var item in validationErrors)
					Log.Error(LogTag.SaveUsersChanges_EntityValidationErrors, Request, new { item.ValidationErrors });
				return false;
			}

			try {
				await Entity.SaveChangesAsync();
			} catch(Exception e) {
				Log.Error(LogTag.SaveUsersChanges_EntityError, Request, e);
				return false;
			}

			return true;
		}

		private async Task<bool> IsValidUserToUpdateProfile(int userIdFromModel, AspNetUser identityUser, string currentPassword, ApplicationUserManager userManager)
		{
			if(userIdFromModel != identityUser.Users.First().Id)
			{
				// This would catch horrible bugs, or hackers
				Log.Error(LogTag.PostProfile_InvalidUserId, Request, new { userIdFromModel, serverUserId = identityUser.Users.First().Id});
				return false;
			}

			if(!await userManager.CheckPasswordAsync(identityUser, currentPassword))
			{
				Log.Info(LogTag.PostProfile_WrongPassword, Request, new { userIdFromModel, serverUserId = identityUser.Users.First().Id} );
				return false;
			}
			return true;
		}


		[AllowAnonymous]
		[Route("api/account/log-out")]
		public LoginResponseModel Logout()
		{
			if (User.Identity.IsAuthenticated)
			{
				Log.Info(LogTag.LogOff, Request, new { LocalUserId });
				AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
				return new LoginResponseModel {IsAuthenticated = false};
			}
			Log.Warn(LogTag.LogOffUnauthenticatedUser, Request);
			return new LoginResponseModel {IsAuthenticated = false};
		}

		[HttpPost]
		[Route("api/account/delete")]
		public async Task<DeleteUserResponseModel> DeleteAccount(DeleteUserRequestModel model)
		{
			if(ModelState.IsValid == false)
			{
				Log.Warn(LogTag.DeleteUser_InvalidModelState, Request, new { message = ModelState.Values, model });
				return DeleteUserResponseModel.InvalidEntry;
			}
			string aspNetUserId = User.Identity.GetUserId();
			AspNetUser aspNetUser = await Entity.AspNetUsers.FindAsync(aspNetUserId);
			User user        = aspNetUser.Users.First();
			if(!await IsValidUserToUpdateProfile(model.UserId, aspNetUser, model.CurrentPassword, UserManager))
			{
				Log.Warn(LogTag.InvalidPasswordOnCancelAccount, Request, new {aspNetUserId = aspNetUser.Id, model });
				return DeleteUserResponseModel.WrongPassword;
			}
			AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
			aspNetUser.UserName = $"({user.Id}){aspNetUser.UserName}";
			user.StatusId  = UserStatuses.Deleted;
			await Entity.SaveChangesAsync();
			return new DeleteUserResponseModel {IsSuccess = true};
		}

		[HttpGet]
		[Route("api/account/resend-email-verification")]
		public async Task SendEmailVerification()
		{
			string aspNetUserId = User.Identity.GetUserId();
			AspNetUser aspNetUser = await UserManager.FindByIdAsync(aspNetUserId);
			User user = aspNetUser.Users.First();
			if (user.StatusId == UserStatuses.PendingEmailValidation)
				await SendConfirmationEmailAsync(aspNetUser, user, aspNetUser.Email, true);
			else
				Log.Warn(LogTag.InvalidSendEmailVerificationNonPendingUser, new { user.Id });
		}

		[Route("api/account/filter")]
		public async Task TilesFilteringUpdate(IEnumerable<TileFilterModel> filters)
		{
			int userId = LocalUserId;
			try {
				Entity.TilesFilterings.RemoveRange(Entity.TilesFilterings.Where(f => f.UserId == userId));
				Entity.TilesFilterings.AddRange(filters.Select(m=>new TilesFiltering {UserId = userId,TileId = m.TileId, FilterId = m.FilterId}));
				await Entity.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				Log.Error(LogTag.UpdateTileFilters_SaveChanges, Request, new {UserId = userId}, ex);
			}
		}

		private int CountOfUnreadMails(User user) => user.MailsTo.Where(m => m.ToId == user.Id && m.ToStatus == MailStatuses.New).Select(m => m.FromId).Distinct().Count();

		private async Task<IEnumerable<TileFilterModel>> GetUserTilesFilters(int userId) {
			IEnumerable<TileFilterModel> filters = await Entity.TilesFilterings.AsNoTracking().Where(f => f.UserId == userId)
															   .Select(f => new TileFilterModel() {
																   FilterId = f.TilesFilter.Id,
																   TileId = f.TileId
															   })
															   .ToArrayAsync();
			return filters;
		}

	}

}
