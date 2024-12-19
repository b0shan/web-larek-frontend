import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekAPI } from './components/WebLarekAPI';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { ICard, IOrder } from './types';
import { OrderContacts, OrderPayment } from './components/Order';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);

const modalWindow = ensureElement<HTMLElement>('#modal-container');
const pageBody = document.body;
const page = new Page(pageBody, events);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(modalWindow, events);
const paymentForm = new OrderPayment(cloneTemplate(paymentTemplate), events, appData);
const contactForm = new OrderContacts(cloneTemplate(contacsTemplate), events, appData);

api.getCardList()
    .then(appData.getCatalog.bind(appData))
    .catch((err) => console.error('Ошибка загрузки каталога:', err));

events.on('cards:changed', () => {
    page.counter = appData.basket.length;
    page.gallery = appData.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:selected', item),
        });
        return card.renderComponent(item);
    });
});

events.on('card:selected', (item: ICard) => appData.getPreview(item));

events.on('preview:changed', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('card:basket', item);
            events.emit('preview:changed', item);
            card.button = appData.basket.indexOf(item) < 0
                ? (item.price === null ? 'Не для продажи' : 'В корзину')
                : 'Убрать из корзины';
            modal.close();
        },
    });
    modal.render({
        content: card.renderComponent({
            id: item.id,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            button: appData.basket.indexOf(item) < 0
                ? (item.price === null ? 'Не для продажи' : 'В корзину')
                : 'Убрать из корзины',
        }),
    });
});

events.on('card:basket', (item: ICard) => appData.toggleBasket(item));

events.on('basket:open', () => {
    modal.render({
        content: basket.renderComponent(),
    });
});

events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.sum = appData.getBasketTotal();
    basket.items = appData.basket.map((basketCard, index) => {
        const newCard = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.deleteCardFromBasket(basketCard),
        });
        newCard.index = index + 1;
        return newCard.renderComponent({
            title: basketCard.title,
            price: basketCard.price,
        });
    });
});

events.on('order:open', () => {
    paymentForm.clearPayment();
    modal.render({
        content: paymentForm.renderForm({
            address: appData.order.address || '',
            valid: false,
            errors: [],
        }),
    });
    const isValid = appData.validOrder();
    events.emit('order:validation:state', { valid: isValid });
    events.emit('form:update');
});

events.on(/^order\..*:changed/, (data: { field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>; value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:validation:state', (data: { valid: boolean }) => {
    const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
    if (submitButton) submitButton.disabled = !data.valid;
});

events.on('order:submit', () => {
    modal.render({
        content: contactForm.renderForm({
            phone: appData.order.phone || '',
            email: appData.order.email || '',
            valid: false,
            errors: [],
        }),
    });
    events.emit('form:update');
});

events.on('contacts:submit', () => {
    const orderData = appData.createOrder();

    api.orderItems(orderData)
        .then((result) => {
            const successWindow = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close(),
            });

            appData.clearBasket();
            appData.resetOrder();
            paymentForm.resetForm();
            contactForm.resetForm();

            modal.render({
                content: successWindow.renderComponent({ total: result.total }),
            });
        })
        .catch((err) => {
            console.error('При заказе возникла ошибка:', err);
        });
});

events.on('formErrors:changed', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    paymentForm.valid = !payment && !address;
    paymentForm.errors = Object.values({ payment, address }).filter((i) => !!i).join('; ');
    contactForm.valid = !email && !phone;
    contactForm.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

events.on('form:update', () => {
    paymentForm._address.value = appData.order.address || '';
    contactForm._email.value = appData.order.email || '';
    contactForm._phone.value = appData.order.phone || '';
    const isValid = appData.validOrder();
    events.emit('order:validation:state', { valid: isValid });
});

events.on('modal:open', () => page.locked = true);
events.on('modal:closed', () => page.locked = false);
