// Интерфейс для данных полученных через API
export interface IResponseAPI {
  getCardList: () => Promise<ICard[]>; // Получает список карточек товара.
  getCard: (id: string) => Promise<ICard>; // Получает карточку товара по ID.
  orderItems(order: IOrder): Promise<IOrderSuccess>; // Отправляет заказ и возвращает результат.
}

//Интерфейс карточки
export interface ICard {
  id: string; // Уникальный идентификатор товара
  title: string; // Название товара
  category: CategoryCard; // Категория товара
  description: string; // Описание товара
  image: string; // URL изображения товара
  price: number | null; // Цена товара (может быть null)
  button: string; // Текст кнопки действия
}

// Категории карточек
export type CategoryCard =
  | 'софт-скилл'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скилл';

//Интерфейс для заказа
export interface IOrder {
  items: string[]; // Массив идентификаторов товаров в заказе
  total: number; // Общая сумма заказа
  email: string; // Электронная почта
  number: string; // Номер телефона
  address: string; // Адрес доставки
  payment: string; // Способ оплаты
}

//Интерфейс успешной операции
export interface IOrderSuccess{
  id: string; // Уникальный идентификатор заказа
  total: number; // Общая сумма заказа
}

//IForm: интерфейс для формы.
export interface IForm{
  errors: string[]; // Массив ошибок формы
  validForm: boolean; // Валидация формы
}

//Интерфейс класса EventEmitter:
export interface IEventEmitter {
  on(event: string, callback: Function): void; // Подписка на событие
  off(event: string, callback: Function): void; // Отмена подписки
  emit(event: string, data?: any): void; // Вызов события с данными
}

export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;

export interface IBasket {
	updateItems: TCardBasket[];
	updateSum: number | null;
}