/// <reference path="counters.ts" />
module Services {
	export interface ITaskbarCounterService {
		setCounterValue(counter: Counters, value: number);
		getCounterValue(counter: Counters);
		resetCounter(counter: Counters);
	}
}