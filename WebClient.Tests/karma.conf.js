module.exports = function (config) {
	config.set({
		
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '..',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: [
                  //Application dependencies:
			      { pattern: "Web/Scripts/bower/angular/angular.js", watched: false },
			      { pattern: "Web/Scripts/bower/angular-ui-router/release/angular-ui-router.js", watched: false },
			      { pattern: "Web/Scripts/bower/angular-cookies/angular-cookies.js", watched: false },
			      { pattern: "Web/Scripts/bower/ui-router-extras/release/ct-ui-router-extras.js", watched: false },
			      { pattern: "Web/Scripts/ui-bootstrap-2.0.1-custom/ui-bootstrap-custom-2.0.1.js", watched: false },
			      { pattern: "Web/Scripts/bower/angular-animate/angular-animate.js", watched: false },
			      { pattern: "Web/Scripts/bower/angular-sanitize/angular-sanitize.js", watched: false },
			      { pattern: "Web/Scripts/bower/angular-translate/angular-translate.js", watched: false },

				  //Tests dependencies:
				  { pattern: "WebClient.Tests/node_modules/angular-mocks/angular-mocks.js", watched: false },
			      { pattern: "WebClient.Tests/node_modules/ng-describe/dist/ng-describe.js", watched: false },
			      { pattern: "WebClient.Tests/node_modules/jasmine-promises/dist/jasmine-promises.js", watched: false },

				  //Compiled application
				  { pattern: "Web/Angular/app.js", watched: true },

				  //Compiled tests
				  { pattern: "WebClient.Tests/tests.js", watched: true }
		],


		// list of files to exclude
		exclude: [
		
		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
}
