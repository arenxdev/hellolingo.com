
module Authentication {

    export interface ILoginCredentials {
        userName: string;
        password: string;
    }

	export interface ILoginServerResponse extends Backend.WebApi.WebApiResponse {
		isAuthenticated: boolean;
		userData?: IAuthUser;
	}

	export interface ISignUpServerResponse extends Backend.WebApi.WebApiResponse {
		isAuthenticated: boolean;
		userData?:IAuthUser;
	}

	export interface IProfileServerResponse extends Backend.WebApi.WebApiResponse {
		isAuthenticated: boolean;
		userData?: IAuthUser;
		unreadMessagesCount?: number;
		tileFilters:Array<Dashboard.ITileFilter>;
	}

	export interface IUserUpdateServerResponseMessage extends Backend.WebApi.WebApiResponse {
		isUpdated: boolean;
	}

	export interface IUserDeletedServerResponseMessage extends Backend.WebApi.WebApiResponse {
		isSuccess: boolean;
	}

}