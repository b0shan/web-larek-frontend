
import { Component } from './Component';
import { IPage } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

    set counter(value: number) {
		this.setText(this._counter, String(value));
	}

    set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

}