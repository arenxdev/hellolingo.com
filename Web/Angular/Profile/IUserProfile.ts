module Profile {
	export interface IUserProfile extends IAuthUser {
		password?: string;
		reTypePassword?: string;
		currentPassword?: string;
	}
}
