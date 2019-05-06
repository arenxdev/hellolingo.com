interface ITaskButtonScope extends ng.IScope {
	buttonId: string; // State assoiated with taskbar button
	iconUrl: string;  // Picture url on icon
	actionClick(): void; 
	closeState():void;
	hideClose: boolean;   //Hide close button on icon to prevent close state (for home state)
	showCounter: boolean; // Should button have counter or not
	counterVal: number;    // Counter value for Icon
	showCounterBadge: boolean; //Should we show counter
	isIconShown(stateName: string): boolean;   // Should we show icon on taskbar
	showButton:boolean; //Force show icon for new notifications.
	isCurrentState():boolean;  // is it current Icon state.
}