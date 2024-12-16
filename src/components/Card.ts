import { ICard} from './../types/index';
import { ICardActions } from '../types';
import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './Component';
import { labels } from '../utils/constants';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);}
		}
	}

	set id(value: string) {this.container.dataset.id = value;}
	set title(value: string) {this.setText(this._title, value);}
	set description(value: string) {this.setText(this._description, value);}
	
	set price(value: string) {
		if (value) {
			this.setText(this._price,`${value.toString().length <= 4 ? value : formatNumber(Number(value))} синапсов`);
		} else {
		this.setText(this._price, `Бесценно`);
		this.disabledButton(this._button, true);}
	}
	
	set image(value: string) {this.setImage(this._image, value, this.title);}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, labels.get(value), true);
	}

	set button(value: string) {this._button.textContent = value;}
}

export class BasketCard extends Card {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(`.basket__item-delete`,container);
		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}
	set index(value: number) {this.setText(this._index, value);}
}
