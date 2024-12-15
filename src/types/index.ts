// Слой данных
// Интерфейс для данных полученных через API
export interface IWebLarekAPI {
	getCardItem: (id: string) => Promise<ICard>; // Получает список карточек товара.
	getCardList: () => Promise<ICard[]>; // Получает карточку товара по ID.
	orderItems(order: IOrder): Promise<IOrderSuccess>; // Отправляет заказ и возвращает результат.
}

// Работа с карточками
// Карточка
export interface ICard {
	id: string;
	title: string;
	price: number | null;
	description: string;
	image: string;
	label: CardCategory;
	button: string;
}

// Категория для карточки
export type CardCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'хард-скилл'
	| 'кнопка';

// Реакция на клик по карточке
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
//Интерфейс для списка
export interface ICardList {
	total: number;
	items: ICard[];
}

// Интерфейс класса AppData
export interface IAppData {
	order: IOrder | null;
	list: ICard[];
	preview: string | null;
	basket: ICard[];
}

// Тип карточки для главной страницы
export type TCardPage = Pick<ICard,'id' | 'title' | 'price' | 'image' | 'label'>;

// Тип карточки для корзины
export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;

// Корзина
export interface IBasket {
	items: TCardBasket[];
	sum: number | null;
}

// Заказ
export interface IOrder {
	total: number;
	items: string[];
	email: string;
	phone: string;
	address: string;
	payment: string;
}

// Тип оплаты заказа
export type PaymentMethod = 'онлайн' | '' | 'при получении';

// Тип для заказа (тип оплаты и адрес)
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
// Тип для заказа (почта и телефон)
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type TOrderField = TOrderContacts & TOrderPayment;
// Интерфейс выполнения успешной операции
export interface IOrderSuccess {
	id: string;
	total: number;
}

// Тип ошибок форм заказа
export type TFormErrors = Partial<Record<keyof IOrder, string>>;

// Слой представления
// Интерфейс для страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Интерфейс для формы
export interface IForm {
	valid: boolean;
	errors: string[];
}

// Интерфейс модального окна
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс успешного оформления заказа
export interface ISuccess {
	total: number;
}
export interface ISuccessActions {
	onClick: () => void;
}

