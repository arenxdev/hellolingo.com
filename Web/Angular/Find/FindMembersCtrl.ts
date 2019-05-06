/// <reference path="../References.d.ts" />

module Find {
	export class FindMembersCtrl {

		lastStateName:string;
		lastStateParams:any;
		user: IAuthUser;

		static $inject = ["$scope", "$timeout", "userService", "statesService", "membersService", "$log", "$uibModal", "serverResources", "findMembersFilter"];
		constructor($scope: IFindScope,
			        private $timeout: ng.ITimeoutService,
			        private userService: Authentication.IUserService,
			        private statesService: Services.StatesService,
					private membersService: Services.IMembersService,
					private $log: Services.EnhancedLog,
					private $uibModal: ng.ui.bootstrap.IModalService,
					private serverResources: Services.IServerResourcesService,
					private findMembersFilter) {
			this.countries = serverResources.getCountries();
			this.user = this.userService.getUser();

			if (this.user) {
				$scope.isSharedTalkMember = this.user.isSharedTalkMember;
				$scope.isLivemochaMember = this.user.isLivemochaMember;
				$scope.isSharedLingoMember = this.user.isSharedLingoMember;
			}

			$scope.$on("$stateChangeSuccess", (event: ng.IAngularEvent, toState: State, toStateParams: any, fromState: State, fromStateParams: any) => {

				// Exit if the current state isn't related to the this feature
				if (!this.statesService.includes(States.find.name)) return;

				// Always make sure that the scrollable div has the focus, so that it can be scrolled directly with up/down pageUp/pageDown keys
				this.$timeout(() => { $("#FindViewContent").focus(); }, 0);

				// Exit if there is nothing to change to prevents reloads/reset/scrollUp of the list
				var areParamsIdentical = (toStateParams.known === "" && toStateParams.learn === "") || (this.lastStateParams && toStateParams.known === this.lastStateParams.known && toStateParams.learn === this.lastStateParams.learn);
				if (toState.name === this.lastStateName && areParamsIdentical) return; 

				// Scroll the scrollable view to the top
				this.$timeout(() => { $("#FindViewContent").scrollTop(0); }, 0);

				// Language search case
				if (toState.name === States.findByLanguages.name) {
					if (!this.lastStateName) {
						var stateLangs = this.getLanguagesFromState();

						// If we don't have any languages specified in url and have authenticated user that came from some other place
						// add his native language as a learn search criteria to embrace language exchange concept
						if (!stateLangs.learnId && !stateLangs.knownId && this.user) {
							this.languageSelect.learnId = this.user.knows;
							this.goToLanguagesState();
							return;
						}

						this.loadUsersByLanguages();
					}
					else if (this.lastStateName === States.findByLanguages.name) this.loadUsersByLanguages();
					else this.goToLanguagesState(); // if we have already used search, go to state according to previous selection
				}

				if (toState.name === States.findByName.name && !this.user) this.statesService.go(States.find.name);

				this.lastStateName = toState.name;
				this.lastStateParams = toStateParams;

				// Reset form
				this.nameSelect.isSharedTalkMember = false;
				this.nameSelect.isLivemochaMember = false;
				this.nameSelect.isSharedLingoMember = false;

				// Initialize find
				switch (statesService.current.name) {
					case States.findByName.name      : this.loadUsersByName(); break;
					case States.findBySharedTalk.name: this.nameSelect.isSharedTalkMember = true; this.loadUsersByName(); break;
					case States.findByLivemocha.name : this.nameSelect.isLivemochaMember = true; this.loadUsersByName(); break;
					case States.findBySharedTalk.name: this.nameSelect.isSharedLingoMember = true; this.loadUsersByName(); break;
				}
			});
		}

		loadUsersByLanguages() {
			var stateLangs = this.getLanguagesFromState();
			this.languageSelect.learnId = stateLangs.learnId;
			this.languageSelect.knownId = stateLangs.learnId !== stateLangs.knownId ? stateLangs.knownId : undefined;

			this.membersService.getMembers({ learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId })
				.success((members: ILightUser[]) => { this.foundMembers = members; })
				.error(data => { this.$log.appWarn("LoadUsersByLanguagesFailed", data); });
			this.maybeHasMoreMembers = true;
		};


		//  Used by view
		languages = Languages.langsById;
		countries:ICountry[];
		secondTierLangFilter(value) { return value.tier > 1 };

		nameState = States.findByName;
		languagesState = States.findByLanguages;
		sharedTalkState = States.findBySharedTalk;
		livemochaState = States.findByLivemocha;

		languageSelect: ILanguageSelect = { learnId: 1 };
		nameSelect: INameSelect = { isSharedTalkMember: false, isLivemochaMember: false , isSharedLingoMember: false }

		foundMembers: ILightUser[];
		maybeHasMoreMembers = true;
		sortParam = Filters.SortMembersBy.Id;
		loadingMoreMemebers = false;

		setLearns(langId: number) {
			if (this.languageSelect.knownId === langId)
				this.languageSelect.knownId = undefined; // Prevent known language = to learned language
			// Set or clear the language selection
			this.languageSelect.learnId = this.languageSelect.learnId === langId ? undefined : langId;
			this.goToLanguagesState();
		};

		setKnows(langId: number) {
			if (this.languageSelect.learnId === langId)
				this.languageSelect.learnId = undefined; // Prevent learned language = to known language
			// Set or clear the language selection
			this.languageSelect.knownId = this.languageSelect.knownId === langId ? undefined : langId;
			this.goToLanguagesState();
		};

		updateSortParam(param: Filters.SortMembersBy) {
			this.sortParam = param;
		}

		showFoundMembers() {
			return this.findMembersFilter(this.foundMembers, this.sortParam);
		}

		private goToLanguagesState() {
			this.statesService.go(States.findByLanguages.name,
			{
				known: (this.languageSelect.knownId && Languages.langsById[this.languageSelect.knownId].name) || "any",
				learn: this.languageSelect.learnId && Languages.langsById[this.languageSelect.learnId].name
			});
		}

		private getLanguagesFromState() {
			var searchParams = this.statesService.getStateParams();
			var learnId = searchParams["learn"] && searchParams["learn"] !== "any" && Languages[searchParams["learn"]] ? 
						  Languages[searchParams["learn"]].id : undefined;

			var knownId = searchParams["known"] && searchParams["known"] !== "any" && Languages[searchParams["known"]] ? 
						  Languages[searchParams["known"]].id : undefined;

			return { learnId, knownId };
		}

		setMembership(target: string) {
			// Two memberships cannot be selected at once because the backend support lookup on only one at a time
			if (target === "SharedTalk") { this.nameSelect.isLivemochaMember = this.nameSelect.isSharedLingoMember = false; }
			else if (target === "Livemocha") { this.nameSelect.isSharedTalkMember = this.nameSelect.isSharedLingoMember = false; }
			else if (target === "SharedLingo") { this.nameSelect.isSharedTalkMember = this.nameSelect.isLivemochaMember = false; }
			this.loadUsersByName();
		}

		loadUsersByName() {
			this.membersService.getMembers( this.nameSelect ) // Lose code: getMembers accept any kind of object... but namning matters for the server
				.success((members: ILightUser[]) => { this.foundMembers = members; })
				.error(data => { this.$log.appWarn("LoadUsersByNameFailed", data); });
			this.maybeHasMoreMembers = true;
		};

		loadMoreUsers() {
			// Put the focus back on the list, because the load more button is gone and scrolling with the keyboard is gone with it
			 $("#FindViewContent").focus();

			var isFindByLanguagesState = this.statesService.current.name === States.findByLanguages.name;
			var currentSearchParams = isFindByLanguagesState ? { learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId }
															 : this.nameSelect;

			var belowId = this.getLowestMemberId();

			var searchParams = angular.extend({ belowId }, currentSearchParams);
			this.loadingMoreMemebers = true;
			this.membersService.getMembers(searchParams)
				.success((members: ILightUser[]) => {
					if (members && members.length > 0) {
						Array.prototype.push.apply(this.foundMembers, members);
						if (members.length < 100) this.maybeHasMoreMembers = false;
					} else {
						this.maybeHasMoreMembers = false;
					}
					this.loadingMoreMemebers = false;
				})
			     .error(data => { this.$log.appWarn("LoadMoreUsersFailed", data); this.loadingMoreMemebers = false; });
		}

		chooseMember(user: ILightUser) {
			if (this.user.id === user.id) return;
			this.$uibModal.open({
				templateUrl: "modal-profile-view.tpl",
				controllerAs: "modalCtrl",
				controller: () => <IModalProfileViewCtrl>{ user, showButtons: () => Boolean(this.user), hasPinButton: () => this.statesService.current.name !== States.findByLanguages.name }
			});
		}

		contactMember = (id: UserId) => this.statesService.go(States.mailboxUser.name, { id, isNew: "new" });


		private getLowestMemberId() {
			var memberWithLowestId = this.foundMembers.reduce((p, v) => p.id < v.id ? p : v);
			return memberWithLowestId.id;
		}
	}
}