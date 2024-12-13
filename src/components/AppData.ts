import { Model } from './Model';
import { ICard, IOrder, IBasket } from '../types/index';


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
		return this.basketItems.reduce((total, card) => total + card.price, 0);
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


}








