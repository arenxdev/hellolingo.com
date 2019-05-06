module Years {
	export let getYears = (from: number = 1920, to: number = 2000) => {
		if (from >= to) {
			throw Error("Year from must be less then year to.");
		}
		let years = new Array<number>();
		for (let i = to; i > from; i--) {
			years.push(i);
		}
		return years;
	}
}