/// <reference path="countersstorage.ts" />
module Services {
	export class TaskbarCounterService implements ITaskbarCounterService {
		counters: CountersStorage;
		constructor() {
			this.counters = <CountersStorage>{};
			this.counters[Counters.TextChat] = 0;
			this.counters[Counters.MailBox] = 0;
		}

		setCounterValue(counter: Counters, value: number) {
			this.counters[counter] = value;
		}

		getCounterValue(counter: Counters) {
			return this.counters[counter];
		}

		resetCounter(counter:Counters) {
			this.counters[counter] = 0;
		}
	}
}

