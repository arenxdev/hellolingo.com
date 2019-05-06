class State {
	name: string;
	url: string;
	sticky: boolean;
	//title: string;
	isRemoteTemplate: boolean;
	templateUrl: string;
	templateLess: boolean;
	abstract: boolean;
	deepStateRedirect: Object;

	constructor(name: string, url: string, sticky: boolean = false,
		args: { abstract?: boolean, templateLess?: boolean, templateUrl?: string, deepStateRedirect?: Object} = null
	) {
		this.name = name;
		//this.title = title;
		this.url = url;
		this.sticky = sticky;
		if (args != null) {
			this.abstract = args.abstract;
			this.templateUrl = args.templateUrl;
			this.templateLess = args.templateLess;
			this.deepStateRedirect = args.deepStateRedirect;
		}
	}
}