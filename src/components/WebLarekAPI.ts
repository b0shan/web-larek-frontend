import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderSuccess, ICard } from '../types';

export interface IWebLarekAPI {
	getProductList: () => Promise<ICard[]>;
	getProductItem: (id: string) => Promise<ICard>;
	orderItems: (order: IOrder) => Promise<IOrderSuccess>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.cardImage,
			}))
		);
	}

	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.cardImage,
		}));
	}

	orderItems(order: IOrder): Promise<IOrderSuccess> {
		return this.post('/order', order).then((data: IOrderSuccess) => data);
	}
}