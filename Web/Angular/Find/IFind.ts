module Find {

	export	interface IFindScope extends ng.IScope {
		isSharedTalkMember: boolean;
		isLivemochaMember: boolean;
		isSharedLingoMember: boolean;
	}

	export interface ILanguageSelect {
		learnId?: number;
		knownId?: number;
	}

	export interface INameSelect {
		firstName?: string;
		lastName?: string;
		isSharedTalkMember?: boolean;
		isLivemochaMember?: boolean;
		isSharedLingoMember?: boolean;
	}

}