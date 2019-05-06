module Authentication {

	export interface IUserService {
        create:     (user: IAuthUser) => IAuthUser;
		update:     (profile: Profile.IUserProfile) => ng.IPromise<IUserUpdateServerResponseMessage>;
		deleteUser: (userData: { userId: number, currentPassword: string }) => ng.IPromise<IUserDeletedServerResponseMessage>;
        getInitUserDataAsync: () => ng.IPromise<boolean>;
        isUserExist: () => boolean;
        getUser: () => IAuthUser;
        resendEmailVerification: () => ng.IPromise<boolean>;
		getTiles: () => number[];
		promoteTile: (tileId: number) => void;
		demoteTile: (tileId: number) => void;
		updateTileFilters: () => ng.IPromise<any>;
		isUserDataLoaded: boolean;
		isInitLoadingStarted: boolean;
		clearUserData(): void;
		setNoPrivateChat(bool:boolean);
	}

	export class UserService implements IUserService {
		private currentUser: IAuthUser;
		private filters: { [tileId: number]: Dashboard.ITileFilter };
		public get defaultTileIds() { return [102, 104, /*120,*/ 105, /*106, 107,*/ 108]; }

        isUserDataLoaded     = false;
		isInitLoadingStarted = false;

		static $inject = ["$q", "$http", "$log", "countersService"];
		constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $log: Services.EnhancedLog, private countersService:Services.ITaskbarCounterService) {}

		create = (user) => {
			this.currentUser = user;

			if (!this.currentUser) {
				this.countersService.resetCounter(Services.Counters.MailBox);
			}

			return this.currentUser;
		}

		update(profile: Profile.IUserProfile) {
			return this.$http
				.post(Config.EndPoints.profileUrl, profile)
				.then(
				// If success
				(response: ng.IHttpPromiseCallbackArg<IUserUpdateServerResponseMessage>) => {
					if (response.data.isUpdated) 
						this.create(profile); // Update the local user with the change
					return response.data;
				},
				// If failure
				() => {
					this.$log.ajaxError("PostProfile_PostFailed");
					return false;
				});
		}

		deleteUser(userData) {
			return this.$http
				.post(Config.EndPoints.postDeleteAccount, userData )
				.then(
				// If success
				(response: ng.IHttpPromiseCallbackArg<IUserDeletedServerResponseMessage>) => {
					if (response.data.isSuccess) {
						this.currentUser = undefined;
					}
					return response.data;
				},
				// If failure
				() => {
					this.$log.ajaxError("DeleteProfile_PostFailed");
					return false;
				});
		}

	    getInitUserDataAsync = () => {
			//Andiry: It prevents repted calls to server during changing states, before application get respond from server.
			if (this.isInitLoadingStarted) return;
			this.isInitLoadingStarted = true;

			let deffered = this.$q.defer();
			let httpPromise = this.$http.get(Config.EndPoints.profileUrl);
            httpPromise.then(
                //Success user data loaded
                (response: ng.IHttpPromiseCallbackArg<IProfileServerResponse>) => {
					this.isUserDataLoaded = true;
					this.isInitLoadingStarted = false;
                    if (response.data.isAuthenticated)
						this.handleAuthUserData(response.data);
	                deffered.resolve(response.data.isAuthenticated);
                },
                //Error during loading data
                (arg: ng.IHttpPromiseCallbackArg<any>) => {
					this.currentUser = undefined;
					this.isInitLoadingStarted = false;
					deffered.reject("Error during server request.");
				});
			return deffered.promise as ng.IPromise<boolean>;
        }

        isUserExist = () => angular.isDefined(this.currentUser);

        getUser = () => angular.copy(this.currentUser);

        resendEmailVerification() {
            return this.$http.get(Config.EndPoints.getResendEmailVerification).then(
				(/*response: ng.IHttpPromiseCallbackArg<boolean>*/) => true, () => false
				);
		};

		getTiles = () => {
			var tileIds = this.defaultTileIds;
			for (let index in this.filters) {
				const filter = this.filters[index];
				if (filter.filterId === Dashboard.TileFilterValue.Promote && tileIds.indexOf(filter.tileId) === -1) tileIds.push(filter.tileId);
				else if (filter.filterId === Dashboard.TileFilterValue.Demote && tileIds.indexOf(filter.tileId) !== -1) tileIds.splice(tileIds.indexOf(filter.tileId), 1);
			}
			return tileIds;
		};

		promoteTile = (tileId) => this.setTile(tileId, Dashboard.TileFilterValue.Promote);
		demoteTile = (tileId) => this.setTile(tileId, Dashboard.TileFilterValue.Demote);
		setTile = (tileId, filterId: Dashboard.TileFilterValue) => {
			if (this.filters[tileId]) this.filters[tileId].filterId = filterId;
			else this.filters[tileId] = { tileId, filterId };
		};

		handleAuthUserData(serverResponse: IProfileServerResponse) {
			this.currentUser = angular.copy(serverResponse.userData);
			if (serverResponse.unreadMessagesCount) {
				this.countersService.setCounterValue(Services.Counters.MailBox, serverResponse.unreadMessagesCount);
			}
			this.filters = {};
			if (serverResponse.tileFilters ) {
				for (let i = 0; i < serverResponse.tileFilters.length; i++) {
					this.filters[serverResponse.tileFilters[i].tileId] = serverResponse.tileFilters[i];
				}
			}
		}

		updateTileFilters() {
			let filtersToUpdate = Array<Dashboard.ITileFilter>();
			for (const f in this.filters) {
				filtersToUpdate.push(this.filters[f]);
			}
			return this.$http
				.post(Config.EndPoints.postTilesFilter, filtersToUpdate)
				.then(() => { }, () => { this.$log.ajaxWarn("UpdateTileFilters_PostFailed"); });
		};

		clearUserData() {
			this.currentUser = undefined;
			this.isUserDataLoaded = false;
		}

		setNoPrivateChat(bool: boolean) {
			this.currentUser.isNoPrivateChat = bool;
		}
	}
}