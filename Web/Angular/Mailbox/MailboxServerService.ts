namespace MailBox {

	export interface IMailboxServerService {
		getUserMailList: () => ng.IHttpPromise<Array<IMailMessage>>;
	}

	export class MailboxServerService implements IMailboxServerService {
		static $inject = ["$http"];
		constructor(private $http: ng.IHttpService) {
			
		}

		getUserMailList() {
			let promise: ng.IHttpPromise<Array<IMailMessage>> = this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" });
			return promise;
		}
	}
}