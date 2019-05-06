//module UnitTests {
//	export class Helper {
//        static mockHttpService($httpBackend: ng.IHttpBackendService) {
//            $httpBackend.whenGET("/api/ping").respond(200, "Pong");
//            $httpBackend.whenGET("api/account/profile").respond(200, false);
//            $httpBackend.whenGET("/partials/").respond(200, true);
//			$httpBackend.whenGET(/\.html\?v=/).respond(200, true);
//			$httpBackend.whenPOST("/api/check").respond(200, "OK");
//        }
//		//To get server generated templates from backend local server must be started on http://localhost:52800
//        static mockGeneratedTemplates($templateCache: ng.ITemplateCacheService, templateUrl: string) {
//            let req: XMLHttpRequest = new XMLHttpRequest();
//            req.onload = () => {
//				const template = req.responseText;
//				$templateCache.put(templateUrl, template);
//            };
//            req.onerror = (event: Event) => {
//                console.log(event);
//            }
//			const url = `http://localhost:52800/${templateUrl}`;
//			req.open("get", url, false);
//            req.send();
//        }

//		static getUserServiceMock() {
//			return new UserServiceMock();
//		}

//		static getEnchanceLogMock() {
//			return new EnhanceLogMock();
//		}
//    }

//	export class UserServiceMock implements Authentication.IUserService {
//		create = (user) => <Authentication.IAuthUser>{};
//		update = (profile: Profile.IUserProfile) => <ng.IPromise<Authentication.IUserUpdateServerResponseMessage>>{};
//		isInitUserExistAsync = () => <ng.IPromise<boolean>>{};
//		isUserExist = () => false;
//		getUserName = () => "userName";
//		getUser = () => <Authentication.IAuthUser>{};
//		getUserBasicDetails = () => <Authentication.IUserBasicDetails>{};
//	}

//	export class EnhanceLogMock {//UpdAate with interface
//		//Review this
//		trace = msg => { };
//		debug = msg => { };
//		log = msg => { };
//		info = msg => {};
//		warn = msg => {};
//		error = (msg?, location?) => {};

//		logTo = (msg, logger, level) => { };
//		// ========== Enhanced logging methods ==========

//		public app = (msg, obj?) => { };
//		public appWarn = msg => { };
//		public appError = msg => { };

//		public ajax = msg => { };
//		public ajaxWarn = msg => { };
//		public ajaxError = msg => {};

//		public signalR = msg => { };
//		public signalRWarn = msg => { };
//		public signalRError = msg => {};
//	}
//}