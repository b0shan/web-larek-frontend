import { Component } from './Component';
import { createElement, ensureElement } from '../utils/utils';
import { IBasket } from '../types';
import { IEvents } from './base/events';


export class Basket extends Component<IBasket> {
    
    protected _button: HTMLElement;
    protected _list: HTMLElement;
	protected _sum: HTMLElement;
	

    constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._sum = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.updateItems = [];
	}

    set updateItems(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setElementDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement('p', { textContent: 'В корзине пока пусто...' })
			);
			this.setElementDisabled(this._button, true);
		}
	}

    set updateSum(total: number) {
		this.setText(this._sum, `${total} синапсов`);
	}
}