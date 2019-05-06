namespace Dashboard {

	export interface IDashboardCategory {
		id: number;
		title?: string;
	}

	export interface IDashboardTile {
		id: number;
		type: TileType;
		title?: string;
		description?: string;
		isPlanned?: boolean;
		isNew?: boolean;
		cssClass?: string;
		stateName?: string;
		stateParams?: TextChat.IRoomStateParams;
		url?: string;
		widgetDirective?: string;
	}

	export interface ITileFilter {
		tileId: number;
		filterId: TileFilterValue;
	}

	export enum TileFilterValue {
		Promote = 1,
		Demote = 2
	}

	export enum TileType {
		Header = 1,
		Feature = 2,
		Url = 3,
		Widget = 4
	}

}