// IItemResponse: данные о товаре, полученные через API
interface IItemResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

//IOrder: модель данных для заказа, используемая для хранения и отображения информации о заказах.
interface IOrder {
  items: IItem[];
  totalAmount: number;
  email: string;
  number: string;
  shippingAddress: string;
  paymentMethod: string;
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



