using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Considerate.Hellolingo.AspNetIdentity;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Emails;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.I18N;
using Considerate.Hellolingo.Models;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Hellolingo.WebApp.Models;
using Considerate.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Ninject;

namespace Considerate.Hellolingo.WebApp.Controllers
{
	public class AccountController : Controller
	{

		private ApplicationSignInManager _signInManager;
		private ApplicationUserManager   _userManager;
		private readonly IHellolingoEntities _db;
		private IEmailSender _sgManager;


		public AccountController()
		{
			_db = new HellolingoEntities();
		}

		public AccountController(IHellolingoEntities db, ApplicationUserManager userManager, ApplicationSignInManager signInManageranger, IEmailSender sgManager)
		{
			_db            = db;
			_userManager   = userManager;
			_signInManager = signInManageranger;
			SgManager      = sgManager;
		}

		public AccountController(IHellolingoEntities db)
		{
			_db = db;
		}

		private ApplicationUserManager UserManager
		{
			get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
			set { _userManager = value; }
		}

		private ApplicationSignInManager SignInManager
		{
			get { return _signInManager ?? ( _signInManager = HttpContext.GetOwinContext().Get<ApplicationSignInManager>() ); }
			set { _signInManager = value; }
		}

	    private IEmailSender SgManager
		{
		    get { return _sgManager ?? (_sgManager = Injection.Kernel.Get<IEmailSender>()); }
		    set { _sgManager = value; }
		}

		[AllowAnonymous]
		public RedirectToRouteResult Index()
		{
			return RedirectToAction("Index", "Home");
		}

		[AllowAnonymous]
		[Route("validate-email")]
		public async Task<ActionResult> ValidateEmail(string id, string t)
		{
			if(id == null || t == null)
			{
				Log.Warn(LogTag.EmailValidationMissingParams, Request, new { aspNetUserId = id, encodedToken = t });
				return View(new EmailConfirmationViewModel());
			}
			using(_db)
			{
				//Andriy: decodedExtendedToken has format "token:email"
				string decodedExtendedToken = EmailConfirmationHelper.TokenDecode(t);

				string[] compositeToken = decodedExtendedToken.Split(':');
				AspNetUser aspNetUser = await UserManager.FindByIdAsync(id);
				if (!compositeToken[1].Equals(aspNetUser.Email, StringComparison.InvariantCulture))
				{
					Log.Warn(LogTag.EmailValidationWrongEmail, Request, new { aspNetUserId = id, decodedToken = compositeToken[0], email = compositeToken[1]  });
				    return View(new EmailConfirmationViewModel());
				}
				if(aspNetUser.EmailConfirmed)
				{
					Log.Warn(LogTag.EmailValidationIsAlreadyDone, Request, new { aspNetUserId = id, encodedToken = t});
					await SignInManager.SignInAsync(aspNetUser, false, false);
					return View(new EmailConfirmationViewModel { isSuccess = true });
				}
				string securityToken = compositeToken[0];
				var result = await UserManager.ConfirmEmailAsync(id, securityToken);
				if(result.Succeeded)
				{
					User user = await _db.Users.FindAsync(aspNetUser.Users.FirstOrDefault()?.Id);
					user.StatusId = UserStatuses.Valid;
					try
					{
						await _db.SaveChangesAsync();
					}
					catch(Exception ex)
					{
						Log.Error(LogTag.SaveUserEmailConfirmedStatusError, ex, new { UserId = user.Id });
						return View(new EmailConfirmationViewModel());
					}
					// Sign anyone out and sign the new user in
					await SignInManager.SignInAsync(aspNetUser, false, false);
					return View(new EmailConfirmationViewModel { isSuccess = true });
				}
				Log.Error(LogTag.EmailValidationFailed, Request, new { userId = id, errors = string.Join(";", result?.Errors), tokenFromEmail = t, decodedToken = decodedExtendedToken });
				return View(new EmailConfirmationViewModel());
			}
		}


		[AllowAnonymous]
		[Route("forgot-password")]
		public ActionResult ForgotPassword()
		{
			return View();
		}

		
		[HttpPost]
		[AllowAnonymous]
		[ValidateAntiForgeryToken]
		public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
		{
			model.InvalidEmail = false;
			if (!ModelState.IsValid)
			{
				Log.Warn(LogTag.InvalidModelStateInForgotPassword, Request, new { email = model.Email });
				return View(model);
			}
			var aspNetUser = await UserManager.FindByNameAsync(model.Email);
			if(aspNetUser == null || aspNetUser.Users.First().StatusId == UserStatuses.Deleted)
			{
				Log.Warn(LogTag.EmailNotFoundForPasswordResetRequest, Request, new { email = model.Email });
				model.InvalidEmail = true;
				return View(model);
			}

			string code = await UserManager.GeneratePasswordResetTokenAsync(aspNetUser.Id);
			var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = aspNetUser.Id, code }, protocol: Request.Url?.Scheme);
			int userId = aspNetUser.Users.First().Id;

			await SgManager.SendPasswordRecoveryMail(userId, aspNetUser.Email, EmailResources.ResetPassword, EmailResources.ResetPasswordBody.Replace("#CallbackUrl#", callbackUrl));
			Log.Info(LogTag.EmailSent_PasswordReset, Request, new { userId, email = model.Email });

			return RedirectToAction("ForgotPasswordConfirmation", "Account");
		}

		
		[AllowAnonymous]
		public ActionResult ForgotPasswordConfirmation()
		{
			return View();
		}

	
		[AllowAnonymous]
		public ActionResult ResetPassword(string code)
		{
			//Andriy: It's for clear understanding where code value goes.
			//return code == null ? View("Error") : View(new ResetPasswordViewModel() { Code = code });
			return View(new ResetPasswordViewModel{ Code = code });
		}

	
		[HttpPost]
		[AllowAnonymous]
		[ValidateAntiForgeryToken]
		public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
		{
			model.InvalidEmail = false;
			model.PasswordsDiffer = false;
			if (ModelState.IsValid == false) {
				Log.Warn(LogTag.InvalidModelStateInResetPassword, Request, model);
				return View(model);
			}

			if (model.Password != model.ConfirmPassword) {
				Log.Warn(LogTag.PasswordDiffersAtPasswordReset, Request, new { email = model.Email });
				model.PasswordsDiffer = true;
				return View(model);
			}

			var aspNetUser = await UserManager.FindByNameAsync(model.Email);
			if(aspNetUser == null) {
				Log.Warn(LogTag.EmailNotFoundForPasswordReset, Request, new { email = model.Email });
				model.InvalidEmail = true;
				return View(model);
			}

			var result = await UserManager.ResetPasswordAsync(aspNetUser.Id, model.Code, model.Password);
			if(result.Succeeded) {
				Log.Info(LogTag.PasswordResetDone, Request, new { aspNetUserId = aspNetUser.Id });
				// I'd love to sign the user in and send him to the home page but, somehow, _signInManager is null
				//await _signInManager.SignInAsync(aspNetUser, false, false);
				//return RedirectToRoute("");
				return RedirectToRoute("Login");
			}

			Log.Warn(LogTag.PasswordResetFailed, Request, new { aspNetUserId = aspNetUser.Id, model, result });
			AddErrors(result);
			return View();
		}

		private void AddErrors(IdentityResult result)
		{
			foreach (var error in result.Errors)
			{
				ModelState.AddModelError("", error);
			}
		}
	}
}
