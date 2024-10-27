// Интерфейс для данных полученных через API
interface IResponseAPI {
  getCardList: () => Promise<ICard[]>;
  getCard: (id: string) => Promise<ICard>;
  orderItems(order: IOrder): Promise<IOrderSuccess>;
}

//Интерфейс карточки
interface ICard {
  id: string;
  title: string;
  category: CategoryCard;
  description: string;
  image: string;
  price: number | null;
  button: string;
}

// Категории карточек
type CategoryCard =
  | 'софт-скилл'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скилл';

//Интерфейс для заказа
interface IOrder {
  items: string[];
  total: number;
  email: string;
  number: string;
  address: string;
  payment: string;
}

//Интерфейс успешной операции
interface IOrderSuccess{
  id: string;
  total: number;
}

//IForm: интерфейс для формы.
interface IForm{
  errors: string[];
  validForm: boolean;
}

//Интерфейс класса EventEmitter:
interface IEventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}

//Перечисление событий:
type AppEvents = 'itemAddedToBasket' | 'orderPlaced' | 'formSubmitted';



