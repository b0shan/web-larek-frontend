import { TOrderContacts, TOrderPayment } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';
import { AppData } from './AppData';

export class OrderPayment extends Form<TOrderPayment> {
    public  _address: HTMLInputElement;
    protected buttonCash: HTMLButtonElement;
    protected buttonOnline: HTMLButtonElement;
    protected isProcessingPayment: boolean = false; 

    constructor(protected container: HTMLFormElement, protected events: IEvents, private appData: AppData) {
        super(container, events);

        this._address = container.elements.namedItem('address') as HTMLInputElement;
        this.buttonOnline = container.elements.namedItem('card') as HTMLButtonElement;
        this.buttonCash = container.elements.namedItem('cash') as HTMLButtonElement;

        // Обработка изменения адреса
        this._address.addEventListener('input', () => {
            this.appData.setOrderField('address', this._address.value);
        });

        // Обработка выбора способа оплаты
        if (this.buttonOnline) {
            this.buttonOnline.addEventListener('click', () => {
                this.setPayMethod(this.buttonOnline);
            });
        }

        if (this.buttonCash) {
            this.buttonCash.addEventListener('click', () => {
                this.setPayMethod(this.buttonCash);
            });
        }

        // Слушаем обновления модели и синхронизируем данные с формой
        this.events.on('form:update', () => {
            this._address.value = this.appData.order.address || '';
            this.updatePaymentButtonState(this.appData.order.payment);
        });
    }

    setPayMethod(button: HTMLElement) {
        if (this.isProcessingPayment) return;
        this.isProcessingPayment = true;

        const paymentMethod = button.getAttribute('name') || ''; // Получаем метод оплаты
        this.appData.setOrderField('payment', paymentMethod); // Обновляем модель через AppData
        this.updatePaymentButtonState(paymentMethod); // Обновляем состояние кнопок

        this.isProcessingPayment = false; // Сбрасываем флаг
    }

    updatePaymentButtonState(paymentMethod: string) {
        const buttons = [this.buttonCash, this.buttonOnline];
        buttons.forEach((button) => {
            const isActive = button.getAttribute('name') === paymentMethod;
            this.toggleClass(button, 'button_alt-active', isActive); 
        });
    }

    clearPayment() {
        this.toggleClass(this.buttonCash, 'button_alt-active', false);
        this.toggleClass(this.buttonOnline, 'button_alt-active', false);
    }

    resetForm() {
        this._address.value = ''; // Очищаем поля адреса
        this.clearPayment(); // Сбрасываем состояние кнопок
    }
}

export class OrderContacts extends Form<TOrderContacts> {
    public  _email: HTMLInputElement;
    public  _phone: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents, private appData: AppData) {
        super(container, events);

        this._email = container.elements.namedItem('email') as HTMLInputElement;
        this._phone = container.elements.namedItem('phone') as HTMLInputElement;

        // Обработка изменений полей
        this._email.addEventListener('input', () => {
            this.appData.setOrderField('email', this._email.value);
        });

        this._phone.addEventListener('input', () => {
            this.appData.setOrderField('phone', this._phone.value);
        });

        // Слушаем обновлени модели и синхронизируем данные с формой
        this.events.on('form:update', () => {
            this._email.value = this.appData.order.email || '';
            this._phone.value = this.appData.order.phone || '';
        });
    }

    resetForm() {
        this._email.value = ''; // Очищаем поле email
        this._phone.value = ''; // Очищаем поле телефона
    }
}
