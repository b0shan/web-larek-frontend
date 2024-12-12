import { Model } from './Model';

export interface IAppData {
    catalog: ICard[]; // Массив объектов каталога товаров.
    basketItems: string[]; // Массив идентификаторов товаров в корзине.
    currentItemID: string | null; // Идентификатор открытого товара.
    formErrors: string[]; // Массив ошибок формы.
}




export class AppData extends Model<IAppData> {
    getCatalog(): ICard[]// получение массива каталога товаров.
    getProductID(id: string): void // Возвращает данные товара по его ID.
    toggleBasket(itemID: string): void // Добавляет или удаляет товар из корзины.
    totalBasket(): number // Возвращает общую сумму корзины.
    clearBasket(): void // очищает корзину.  
    setPayMethod(payment: string): void // для выбора способа оплаты.
    setAddress(address: string): void // для указания адреса доставки.
    setPhone(phone: string): void // для указания номера телефона для заказа.
    setEmail(email: string): void // для указания электронной почты для заказа.
    validateOrder(): boolean // проводит проверку валидности заказа и отправляет событие об изменении.
    resetOrder(): void // сбрасывает данные о заказе.
}