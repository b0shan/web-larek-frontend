import { IEvents } from './base/events';

export class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) { 
		Object.assign(this, data);
	}

	sendUpdates(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}