import { Model } from './Model';
import { ICard, IOrder, TOrderField,TFormErrors } from '../types';
import { IAppData } from '../types';

export class AppData extends Model<IAppData> {
	catalog: ICard[] = [];
	basket: ICard[] = [];
	preview: string | null;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
	};

	formErrors: TFormErrors = {};

	getCatalog(items: ICard[]) {
		items.forEach((item) => (this.catalog = [...this.catalog, item]));
		this.sendUpdates('cards:changed', { catalog: this.catalog });
	}

	getPreview(item: ICard) {
		this.preview = item.id;
		this.sendUpdates('preview:changed', item);
	}

	toggleBasket(item: ICard) {
		return !this.basket.some((card) => card.id === item.id)
			? this.addCardToBasket(item)
			: this.deleteCardFromBasket(item);
	}

	addCardToBasket(item: ICard) {
		this.basket = [...this.basket, item];
		this.sendUpdates('basket:changed');
	}

	deleteCardFromBasket(item: ICard) {
		this.basket = this.basket.filter((card) => card.id !== item.id);
		this.sendUpdates('basket:changed');
	}

	getIndex(item: ICard) {
		return Number(this.basket.indexOf(item)) + 1;
	}

	clearBasket() {
		this.basket = [];
		this.sendUpdates('basket:changed');
	}

	resetOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
	}

	// Метод для получения итоговой суммы корзины
	getBasketTotal() {
		return this.basket.reduce((total, card) => total + card.price, 0);
	}

	// Метод для формирования заказа
	createOrder(): IOrder & { total: number; items: string[] } {
		return {
			...this.order,
			total: this.getBasketTotal(),
			items: this.basket.map((card) => card.id),
		};
	}

	setOrderPayment(value: string) {
		this.order.payment = value;
		this.events.emit('formErrors:changed', this.formErrors);
	}

	setOrderAddress(value: string) {
		this.order.address = value;
		this.events.emit('formErrors:changed', this.formErrors);
	}

	setOrderPhone(value: string) {
		this.order.phone = value;
		this.events.emit('formErrors:changed', this.formErrors);
	}

	setOrderEmail(value: string) {
		this.order.email = value;
		this.events.emit('formErrors:changed', this.formErrors);
	}

	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validOrder();
	}

	validOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = `Не указана почта`;
		}
		if (!this.order.phone) {
			errors.phone = `Не указан номер телефона`;
		}
		if (!this.order.address) {
			errors.address = `Не указан адрес`;
		}
		if (!this.order.payment) {
			errors.payment = `Не указан способ оплаты`;
		}
		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
