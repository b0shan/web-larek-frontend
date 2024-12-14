import { Component } from './Component';
import { ICard } from '../types/index';
import { ensureElement} from '../utils/utils';
import { ICardActions } from '../types/index';

export class Card extends Component<ICard> {
	
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _description: HTMLElement;

    labels = new Map<string, string>([
        ['софт-скилл', 'card__category_soft'],
        ['другое', 'card__category_other'],
        ['дополнительное', 'card__category_plus'],
        ['кнопка', 'card__category_button'],
        ['хард-скилл', 'card__category_hard'],
    ]);

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._category = ensureElement<HTMLSpanElement>(`.card__category`);
		this._button = ensureElement<HTMLButtonElement>(`.card__button`);
		this._image = ensureElement<HTMLImageElement>(`.card__image`);
		this._description = ensureElement<HTMLElement>(`.card__text`)!;

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}

		if (this._button) {
			this._button.disabled = !value;
		}
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category?.classList?.remove('card__category_soft');
		this._category?.classList?.remove('card__category_other');
		this._category?.classList?.add(
			`card__category${this.labels.get(value)}`
		);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
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
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);
		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}
	set index(value: number) {
		this.setText(this._index, value.toString());
	}
}
