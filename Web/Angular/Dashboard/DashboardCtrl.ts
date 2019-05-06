namespace Dashboard {

	export class DashboardCtrl implements ng.IDirective {

		static $inject = ["$scope", "userService"];
		constructor($scope, private userService: Authentication.IUserService) { this.scope = angular.extend($scope, this.scope); }

		scope = Helpers.extend(<{ showTileInfo: boolean, isPinMode: boolean }>{}, {
			categories: this.tileCategories,
			categorizedTiles: this.categorizedTiles,
			pinnedTiles: this.pinnedTiles,
			isPinnedTile: (tileId: number) => this.userService.getTiles().indexOf(tileId) !== -1,
			switchInfoView: () => this.switchInfoView(),
			switchPinMode: () => this.switchPinMode()
		});

		private get tileCategories(): IDashboardCategory[] { return [
			// Categories are displayed as ordered
			{ id: 1 }, /* Contact List */
			{ id: 2, title: "i18nCategoryAllFeatures" },
			{ id: 3, title: "i18nCategoryFuture" }
		]; }

		private get categorizedTiles(): { [categoryId: number]: IDashboardTile[] } {
			let tiles = {
				1: [ // Contact list
					{ id: 601, type: TileType.Widget, cssClass: "contact-list", widgetDirective: "contacts-tile-widget" },
				],
				2: [ // All Features
					{ id: 102, type: TileType.Feature, title: "i18nTileTextChatTitle",         description: "i18nTileTextChatDesc",         stateName: States.textChat.name, cssClass: "icon-text-chat" },
					{ id: 104, type: TileType.Feature, title: "i18nTileFindTitle",             description: "i18nTileFindDesc",             stateName: States.findByLanguages.name, cssClass: "icon-find" },
					{ id: 105, type: TileType.Feature, title: "i18nTileMailboxTitle",          description: "i18nTileMailboxDesc",          stateName: States.mailbox.name, cssClass: "icon-mailbox" },
					{ id: 106, type: TileType.Feature, title: "i18nTileFindBySharedTalkTitle", description: "i18nTileFindBySharedTalkDesc", stateName: States.findBySharedTalk.name, cssClass: "icon-find-by-sharedtalk"},
					{ id: 107, type: TileType.Feature, title: "i18nTileFindByLivemochaTitle",  description: "i18nTileFindByLivemochaDesc",  stateName: States.findByLivemocha.name, cssClass: "icon-find-by-livemocha"},
					//{ id: 108, type: TileType.Feature, title: "i18nTileAboutHellolingoTitle",  description: "i18nTileAboutHellolingoDesc",  stateName: States.textChatRoomPublic.name, stateParams: { roomId: Config.TopicChatRooms.hellolingo.name }, cssClass: "icon-about-hellolingo" },
					{ id: 109, type: TileType.Feature, title: "i18nTileProfileTitle",          description: "i18nTileProfileDesc",          stateName: States.profile.name, cssClass: "icon-profile" },
					{ id: 118, type: TileType.Feature, title: "i18nTileChatHistoryTitle",      description: "i18nTileChatHistoryDesc",      stateName: States.textChatHistory.name, cssClass: "icon-chat-history" },
					{ id: 123, type: TileType.Feature, title: "i18nTileI18NTitle",             description: "i18nTileI18NDesc",             stateName: States.featureI18N.name, cssClass: "icon-in-your-language" },
					{ id: 901, type: TileType.Url,     title: "i18nTileSharedLingoTitle",      description: "i18nTileNotAvailDesc",         url: "https://sharedlingo.hellolingo.com", cssClass: "icon-sharedlingo" },
				],
				3: [ // Future
					{ id: 110, type: TileType.Feature, isPlanned: true, cssClass: "icon-your-resources", title: "i18nTileYourResourcesTitle", description: "i18nTileYourResourcesDesc" },
					{ id: 114, type: TileType.Feature, isPlanned: true, cssClass: "icon-advanced-find", title: "i18nTileAdvancedFindTitle", description: "i18nTileAdvancedFindDesc" },
					{ id: 111, type: TileType.Feature, isPlanned: true, cssClass: "icon-your-features", title: "i18nTileYourFeaturesTitle", description: "i18nTileYourFeaturesDesc" },
					{ id: 112, type: TileType.Feature, isPlanned: true, cssClass: "icon-your-mockups", title: "i18nTileYourMockupsTitle", description: "i18nTileYourMockupsDesc" },
					{ id: 122, type: TileType.Feature, isPlanned: true, cssClass: "icon-review-and-edit", title: "i18nTileReviewAndEditTitle", description: "i18nTileReviewAndEditDesc" },
					{ id: 117, type: TileType.Feature, isPlanned: true, cssClass: "icon-learning-content", title: "i18nTileLearningContentTitle", description: "i18nTileLearningContentDesc" },
					{ id: 121, type: TileType.Feature, isPlanned: true, cssClass: "icon-games", title: "i18nTileGamesTitle", description: "i18nTileGamesDesc" },
					{ id: 113, type: TileType.Feature, isPlanned: true, cssClass: "icon-ios-app", title: "i18nTileIosAppTitle", description: "i18nTileIosAppDesc" },
					{ id: 126, type: TileType.Feature, isPlanned: true, cssClass: "icon-android-app", title: "i18nTileAndroidAppTitle", description: "i18nTileAndroidAppDesc" },
					{ id: 115, type: TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "i18nTileSecretTool1Title", description: "i18nTileSecretTool1Desc" },
					{ id: 116, type: TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "i18nTileSecretTool2Title", description: "i18nTileSecretTool2Desc" },
				]
				// Obsolete
				//{ id: 101, type: TileType.Header,  title: "i18nTileHeaderTitle", description: "i18nTileHeaderDesc" },
				//{ id: 119, type: TileType.Feature, title: "i18nTileModularChatTitle",      description: "i18nTileModularChatDesc", cssClass: "icon-modular-chat" },
				//{ id: 124, type: TileType.Feature, isPlanned: true, cssClass: "icon-contacts", title: "Your Partners", description: "A list for your awesome friends, best partners, and valuable contacts" },
				//{ id: 125, type: TileType.Feature, isPlanned: true, cssClass: "icon-windows-phone-app", title: "i18nTileWindowsPhoneAppTitle", description: "i18nTileWindowsPhoneAppDesc" },

			} as { [categoryId: number]: IDashboardTile[] };

			return tiles;
		}

		private get pinnedTiles(): IDashboardTile[] {
			const pinnedTiles: IDashboardTile[] = [];
			const tileIds = this.userService.getTiles();

			// Collect pinned tiles definitions
			for (let i in this.categorizedTiles)
				for (let tile of this.categorizedTiles[i])
					if (tileIds.indexOf(tile.id) !== -1) pinnedTiles.push(tile);
			return pinnedTiles;
		}

		switchInfoView() {
			this.scope.showTileInfo = !this.scope.showTileInfo;
		}

		switchPinMode() {
			this.scope.isPinMode = !this.scope.isPinMode;
			if (!this.scope.isPinMode) {
				this.userService.updateTileFilters();	 // Save changes on server
				this.scope.categorizedTiles = this.categorizedTiles;  // Force Reset view
				this.scope.pinnedTiles = this.pinnedTiles; // Force Reset view
			}
		}
	}
}