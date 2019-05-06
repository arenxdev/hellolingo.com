module Authentication {
  
	export class SignUpUser implements ISignUpUser {

		constructor() {
			switch (Runtime.uiCultureCode) {
				case "ar":    this.knows = 10; break;
				case "es":    this.knows = 2; break;
				case "fa":    this.knows = 21; break;
				case "pl":    this.knows = 23; break;
				case "pt-BR": this.knows = 9; break;
				case "ro":    this.knows = 25; break;
				case "ru":    this.knows = 8; break;
				case "tr":    this.knows = 17; break;
				case "vi":    this.knows = 27; break;
			}
		}

		email: string; password: string;

		firstName: string; lastName: string;
		gender: string;
		birthMonth: number; birthYear: number; age: number;
		country: number; location: string;

		learns: number; learns2: number; learns3: number;
		knows: number; knows2: number; knows3: number;

		lookToLearnWithTextChat = true;
		lookToLearnWithVoiceChat = true;
		lookToLearnWithGames = true;
		lookToLearnWithMore = false;

		isSharedTalkMember: boolean;
		isLivemochaMember: boolean;
		isSharedLingoMember: boolean;

		introduction: string;

		wantsToHelpHellolingo: boolean;
	}

}