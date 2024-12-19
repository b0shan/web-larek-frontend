import { TOrderContacts, TOrderPayment } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class OrderPayment extends Form<TOrderPayment> {
    protected _address: HTMLInputElement;
    protected buttonCash: HTMLButtonElement;
    protected buttonOnline: HTMLButtonElement;
    protected isProcessingPayment: boolean = false; // Флаг для предотвращения рекурсии

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this._address = container.elements.namedItem('address') as HTMLInputElement;
        this.buttonOnline = container.elements.namedItem('card') as HTMLButtonElement;
        this.buttonCash = container.elements.namedItem('cash') as HTMLButtonElement;

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
    }

    set address(value: string) {
        this._address.value = value;
    }

    setPayMethod(value: HTMLElement) {
        if (this.isProcessingPayment) return; // Прерываем, если метод уже выполняется

        this.isProcessingPayment = true; // Устанавливаем флаг
        this.clearPayment(); // Сбрасываем состояние других кнопок
        this.toggleClass(value, 'button_alt-active', true); // Активируем выбранную кнопку
        this.events.emit('order:changed', {
            payment: value.getAttribute('name') || '',
            button: value,
        }); // Генерируем событие
        this.isProcessingPayment = false; // Сбрасываем флаг
    }

    clearPayment() {
        this.toggleClass(this.buttonCash, 'button_alt-active', false);
        this.toggleClass(this.buttonOnline, 'button_alt-active', false);
    }

    resetForm() {
        this._address.value = ''; // Очищам поле адреса
        this.clearPayment(); // Сбрасываем состояние кнопок
    }
}


export class OrderContacts extends Form<TOrderContacts> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this._email = container.elements.namedItem('email') as HTMLInputElement;
        this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    resetForm() {
        this._email.value = ''; // Очищаем поле email
        this._phone.value = ''; // Очищаем поле телефна
    }
}
