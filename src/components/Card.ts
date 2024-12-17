import { ICard } from './../types/index';
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
	protected _index?: HTMLElement;
	protected _deleteButton?: HTMLButtonElement;

	protected _categoryColor = new Map<string, string>([
		['софт-скил', '_soft'],
		['другое', '_other'],
		['дополнительное', '_additional'],
		['кнопка', '_button'],
		['хард-скил', '_hard'],
	]);

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);
		this._index = container.querySelector(`.basket__item-index`);
		this._deleteButton = container.querySelector(`.basket__item-delete`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else if (this._deleteButton) {
				this._deleteButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	set title(value: string) {
		this.setText(this._title, value);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
	set price(value: string) {
		if (value) {
			this.setText(
				this._price,
				`${value.toString().length <= 4 ? value : formatNumber(Number(value))} синапсов`
			);
		} else {
			this.setText(this._price, `Бесценно`);
			this.disabledButton(this._button, true);
		}
	}
	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, labels.get(value), true);
		this._category?.classList?.remove('card__category_soft');
		this._category?.classList?.remove('card__category_other');
		this._category?.classList?.add(`card__category${this._categoryColor.get(value)}`);
	}
	set button(value: string) {
		this._button.textContent = value;
	}
	set index(value: number) {
		this.setText(this._index, value);
	}
}
