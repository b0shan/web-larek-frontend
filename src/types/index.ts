// IItemResponse: данные о товаре, полученные через API
interface IItemResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

//IOrderResponse: данные о заказе, полученные через API
interface IOrderResponse {
  orderId: string;
  items: IItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

//IItem: модель данных для товаров, используемая в приложении.
interface IItem {
  id: string;
  name: string;
  price: number;
}

//IOrder: модель данных для заказа, используемая для хранения и отображения информации о заказах.
interface IOrder {
  orderId: string;
  items: IItem[];
  totalAmount: number;
  email: string;
  number: string;
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
  paymentMethod: string;
  shippingAddress: string;
  email: string;
  number: string;
  validate(): boolean;
  submit(): void;
}

//Интерфейс EventEmitter:
interface IEventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}

//Перечисление событий:
type AppEvents = 'itemAddedToBasket' | 'orderPlaced' | 'formSubmitted';



