class Helpers {
	public static htmlEncode(text: string) {
		return $("<div />").text(text).html();
	}

	public static isValidEmail(email: string) {
		const regex = /(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)/gi;
		return regex.test(email);
	}

	public static isValidSkype(skype: string) {
		const regex = /^[a-zA-Z][a-zA-Z0-9\.,\-_]{5,31}$/gi; 
		return regex.test(skype);
	}

	public static wrapInDiv(text: string, className: string = "") {
		var div = $(`<div class="${className}"/>`).text(text);
		return $('<div/>').append(div).html();
	}
	public static decodeAttr = (text: string) => $("<div/>").html(text).text();

	public static searchAndWrapInElement(text: string, searchFor: string, className: string, element: string = "span") {
		const regex = new RegExp(`\\b(${Helpers.regExpEscape(searchFor)}\\b)`, "gi");
		// WARNING: $1 might not be properly encoded to be placed in a div
		return text.replace(regex, `<${element} class="${className}">$1</${element}>`);
	}

	public static regExpEscape(str) {
		const specials = /[.*+?|()\[\]{}\\$^]/g;
		return str.replace(specials, "\\$&");
		// Another proposed approach (not evaluted or validated) : return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
	}

	public static listOfBirthYears(): number[] {
		let years: number[] = [];
		const thisYear = new Date().getFullYear();
		for (let i = thisYear - 16; i > thisYear - 95; i--) years.push(i);
		return years;
	}

	public static extend<T, U>(first: T, second: U): T & U {
		let result = {} as any;
		for (let id in first) result[id] = first[id];
		for (let id in second) if (!result.hasOwnProperty(id)) result[id] = second[id];
		return (result as T & U);
	}
}

// No longer used
//class ActiveTracker {
//	private idleStatus = false;
//	private deadStatus = false;

//	private idleTimer: number = null;
//	private deadTimer: number = null;
 
//	constructor(private idleTimeoutInMs: Number, private deadTimeoutInMs: Number, 
//		private onBecomingActive?: () => void,
//		private onBecomingIdle?: () => void,
//		private onBecomingDead?: () => void
//	) { }

//	get isIdle() { return this.idleStatus; }
//	get isDead() { return this.deadStatus; }

//	markActive() {
//		if (this.idleStatus)
//			this.onBecomingActive();

//		this.clear();

//		this.idleStatus = false;
//		this.deadStatus = false;

//		this.idleTimer = setTimeout(() => { this.idleStatus = true; this.onBecomingIdle(); }, this.idleTimeoutInMs);
//		this.deadTimer = setTimeout(() => { this.deadStatus = true; this.onBecomingDead() }, this.deadTimeoutInMs);
//	}

//	clear() {
//		clearTimeout(this.idleTimer);
//		clearTimeout(this.deadTimer);
//	}
//}

class Set<T> {
	private array: Array<T> = [];

	constructor(private failOnDuplicate = true) { }

	public add = (value: T) => {
		if (!this.contains(value)) this.array.push(value);
		else if (this.failOnDuplicate) throw ("Failed to add value to Set. Value already exists");
	}
	public remove = (value: T) => { var index = this.array.indexOf(value, 0); if (index > -1) this.array.splice(index, 1) }
	public contains = (value: T) => this.array.indexOf(value) > -1;
	public any = () => this.array.length !== 0;
}

interface ILiteEvent<T> {
    on(handler: { (data?: T): void }): void;
    off(handler: { (data?: T): void }): void;
}

class LiteEvent<T> implements ILiteEvent<T> {
    private handlers: { (data?: T): void; }[] = [];
    public on = (handler: { (data?: T): void }) => this.handlers.push(handler);
    public off = (handler: { (data?: T): void }) => this.handlers = this.handlers.filter(h => h !== handler);
    public trigger = (data?: T) => this.handlers.slice(0).forEach(h => h(data));
}