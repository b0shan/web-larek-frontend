import { Model } from './Model';
import { ICard, IOrder } from '../types/index';
import { TOrderField, TFormErrors } from '../types/index';

export interface IAppData {
    order: IOrder | null;
}

export class AppData extends Model<IAppData> {
    catalog: ICard[] = [];
	basketItems: ICard[] = [];
	preview: string | null;
    order: IOrder = {
		total: 0,
		items: [],
		email: '',
		number: '',
		address: '',
		payment: '',
	};

	formErrors: TFormErrors = {};

    getCatalog(items: ICard[]) {    // получение массива каталога товаров.
		items.forEach((item) => (this.catalog = [...this.catalog, item]));
		this.sendUpdates('cards:changed');
    }
   
    getProductID(item: ICard) {
        return Number(this.basketItems.indexOf(item)) + 1;
    }

    addBasket(item: ICard) {
		this.basketItems = [...this.basketItems, item];
		this.sendUpdates('basketItems:changed');
	}

    removeBasket(item: ICard) {
        this.basketItems = this.basketItems.filter((card) => card.id !== item.id);
		this.sendUpdates('basketItems:changed');
    }

    totalBasket() {
		return this.basketItems.reduce((total, card) => total + card.cardPrice, 0);
	}

    clearBasket() {
		this.basketItems = [];
		this.sendUpdates('basketItems:changed');
	}

    setPayMethod(value: string) {
		this.order.payment = value;
	}

    setAddress(value: string) {
		this.order.address = value;
	}

    setPhone(value: string) {
		this.order.number = value;
	}

    setEmail(value: string) {
		this.order.email = value;
	}

    clearOrder() {
		this.order = {
			total: 0,
			items: [],
			email: '',
			number: '',
			address: '',
			payment: '',
		};
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.sendUpdates('preview:changed', item);
	}

	getButtonStatus(item: ICard) {
		if (item.cardPrice === null) {
			return 'Не для продажи';
		}
		if (!this.basketItems.some((card) => card.id == item.id)) {
			return 'В корзину';
		} else {
			return 'Убрать из корзины';
		}
	}

	addCardToBasket(item: ICard) {
		this.basketItems = [...this.basketItems, item];
		this.sendUpdates('basket:changed');
	}

	deleteCardFromBasket(item: ICard) {
		this.basketItems = this.basketItems.filter((card) => card.id !== item.id);
		this.sendUpdates('basket:changed');
	}

	toggleBasketCard(item: ICard) {
		return !this.basketItems.some((card) => card.id === item.id)
			? this.addCardToBasket(item)
			: this.deleteCardFromBasket(item);
	}

	getBasketTotal() {
		return this.basketItems.reduce((total, card) => total + card.cardPrice, 0);
	}

	getCardIndex(item: ICard) {
		return Number(this.basketItems.indexOf(item)) + 1;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = `Не указана почта`;
		}
		if (!this.order.number) {
			errors.number = `Не указан номер телефона`;
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

	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

	setOrderPayment(value: string) {
		this.order.payment = value;
	}

	setBasketToOrder() {
		this.order.items = this.basketItems.map((card) => card.id);
		this.order.total = this.getBasketTotal();
	}


}








