import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderSuccess, ICard } from '../types';
import { IWebLarekAPI} from '../types';

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getCardItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({...item,image: this.cdn + item.image,}));
	}
	getCardList(): Promise<ICard[]> {
		return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({...item,image: this.cdn + item.image,}))
		);
	}
	orderItems(order: IOrder): Promise<IOrderSuccess> {
		return this.post(`/order`, order).then((data: IOrderSuccess) => data);
	}
}
