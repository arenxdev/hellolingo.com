using System.Web.Optimization;

namespace Considerate.Hellolingo.WebApp
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		// ==================================================================
		// Don't use . in your bundle names !!! It won't work in release mode
		// ==================================================================
		public static void RegisterBundles(BundleCollection bundles)
		{
			// ===== CONFIG =====
			BundleTable.Bundles.UseCdn = true;
			//BundleTable.EnableOptimizations = true; // Turn minification on for debugging


			// ===== JAVASCRIPT =====
			bundles.Add(GetScriptBundle("~/bundles/jqueryjs", "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js", "window.jQuery", "~/Scripts/bower/jquery/dist/jquery.js"));
			bundles.Add(GetScriptBundle("~/bundles/bootstrapjs", "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js", "$.fn.modal", "~/Scripts/bower/bootstrap/dist/js/bootstrap.js"));
			bundles.Add(GetScriptBundle("~/bundles/signalr", "https://ajax.aspnetcdn.com/ajax/signalr/jquery.signalr-2.2.1.min.js", "$.connection", "~/Scripts/jquery.signalR-2.2.1.js"));
			bundles.Add(new ScriptBundle("~/bundles/otherjs").Include("~/Scripts/bower/simpleWebRTC/simplewebrtc.bundle.js", "~/Scripts/sysend.js"));


			// ===== ANGULAR =====
			bundles.Add(GetScriptBundle("~/bundles/angularjs", "https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js", "window.angular", "~/Scripts/bower/angular/angular.js"));
			bundles.Add(new ScriptBundle("~/bundles/angularaddonsjs").Include(
				"~/Scripts/bower/angular-animate/angular-animate.js",
				"~/Scripts/bower/angular-cookies/angular-cookies.js",
				"~/Scripts/bower/angular-sanitize/angular-sanitize.js",
				"~/Scripts/bower/angular-translate/angular-translate.js",
				"~/Scripts/bower/angular-ui-router/release/angular-ui-router.js",
				"~/Scripts/bower/ui-router-extras/release/ct-ui-router-extras.js",
				"~/Scripts/ui-bootstrap-2.0.1-custom/ui-bootstrap-custom-tpls-2.0.1.js"
			));
			// Not in use at this time (so that we can debug the app better)
			//bundles.Add(new ScriptBundle("~/bundles/angularapp").Include("~/Angular/app.js"));


			// ===== CSS - GLOBAL =====
			// NOTE: CDN is disabled for CSS bundles because implementing a proper fallback seems to be complicated
			bundles.Add(new StyleBundle("~/bundles/bootstrapcss"/*, "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"*/).Include("~/Scripts/bower/bootstrap/dist/css/bootstrap.min.css", new CssRewriteUrlTransform()));
			bundles.Add(new StyleBundle("~/bundles/css").Include(
				"~/Content/CSS/inner-circles-spinner.css",
				"~/Content/CSS-Generated/site.css"
			));

			// ===== CSS- INDIVIDUAL FEATURES =====
			bundles.Add(new StyleBundle("~/bundles/sign-up-css").Include("~/Content/CSS-Generated/sign-up.css"));
			bundles.Add(new StyleBundle("~/bundles/dead-site-landing-css").Include("~/Content/CSS-Generated/dead-site-landing.css"));
			bundles.Add(new StyleBundle("~/bundles/text-chat-css").Include("~/Content/CSS-Generated/text-chat.css"));
			bundles.Add(new StyleBundle("~/bundles/made-by-members-css").Include("~/Content/CSS-Generated/made-by-members.css"));

		}

		private static Bundle GetScriptBundle(string name, string cdnPath, string fallbackExpression, string include)
		{

			// Temporarily disable CDNs
			//var bundle = new ScriptBundle(name, cdnPath) {CdnFallbackExpression = fallbackExpression};
			var bundle = new ScriptBundle(name);


			bundle.Include(include);
			return bundle;
		}
	}
}
