module Services {
	export interface IFindMembersSearchParams {
		firstName?: string;
		lastName?: string;
		learnId?: number;
		knownId?: number;
		isSharedTalkMember?: boolean;
		isLivemochaMember?: boolean;
		isSharedLingoMember?: boolean;
		belowId?: number;
	}

	export interface IMembersService {
		getMembers: (searchParams: IFindMembersSearchParams) => ng.IHttpPromise<ILightUser[]>;
	}

	export class MembersService implements IMembersService {
		static $inject = ["$http", "userService", "$log"];
		constructor(private $http: ng.IHttpService, private userService:Authentication.IUserService, private $log:EnhancedLog) { }

		getMembers(searchParams: IFindMembersSearchParams) {
			return this.$http.post(Config.EndPoints.postMembersList, searchParams ) as ng.IHttpPromise<ILightUser[]>;
		}

	}
}