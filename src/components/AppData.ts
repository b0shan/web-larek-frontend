import { Model } from './Model';

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



    getCatalog(items: ICard[]) {    // получение массива каталога товаров.

    }
   
    getProductID(item: ICard) {
        return Number(this.basket.indexOf(item)) + 1;
    }

    addBasket(item: ICard) {
		this.basket = [...this.basket, item];
		this.sendUpdates('basket:changed');
	}

    removeBasket(item: ICard) {
        this.basket = this.basket.filter((card) => card.id !== item.id);
		this.sendUpdates('basket:changed');
    }

    totalBasket() {
		return this.basket.reduce((total, card) => total + card.price, 0);
	}

    clearBasket() {
		this.basket = [];
		this.sendUpdates('basket:changed');
	}

    setPayMethod(value: string) {
		this.order.payment = value;
	}

    setAddress(value: string) {
		this.order.address = value;
	}

    setPhone(value: string) {
		this.order.phone = value;
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


}








