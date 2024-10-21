// IItemResponse: данные о товаре, полученные через API
interface IItemResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
}

//IOrderResponse: данные о заказе, полученные через API
interface IOrderResponse {
  orderId: string;
  items: IItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'canceled';
}

//IItem: модель данных для товаров, используемая в приложении.
interface IItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

//IOrder: модель данных для заказа, используемая для хранения и отображения информации о заказах.
interface IOrder {
  orderId: string;
  items: IItem[];
  totalAmount: number;
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
}

//IBasketView: интерфейс для отображения корзины.
interface IBasketView {
  items: IItem[];
  totalAmount: number;
  addItem(item: IItem): void;
  removeItem(itemId: string): void;
}

//IFormView: интерфейс для формы заказа.
interface IFormView {
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
  validate(): boolean;
  submit(): void;
}

//Интерфейс API-клиента:
interface IApiClient {
  getItems(): Promise<IItemResponse[]>;
  getOrder(orderId: string): Promise<IOrderResponse>;
  submitOrder(order: IOrder): Promise<boolean>;
}

//Интерфейс EventEmitter:
interface IEventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}

//Перечисление событий:
type AppEvents = 'itemAddedToBasket' | 'orderPlaced' | 'formSubmitted';



