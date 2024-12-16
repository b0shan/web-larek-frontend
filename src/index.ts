import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekAPI } from './components/WebLarekAPI';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { BasketCard, Card } from './components/Card';
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
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(modalWindow, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const paymentForm = new OrderPayment(cloneTemplate(paymentTemplate), events);
const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactForm = new OrderContacts(cloneTemplate(contacsTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

api. getCardList().then(appData.getCatalog.bind(appData)).catch((err) => {console.error(err);}); // Инициализация 

events.on('cards:changed', () => {
	page.counter = appData.basket.length;
	page.gallery = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {events.emit('card:selected', item);},});
		return card.renderComponent(item);
	});
});

events.on('card:selected', (item: ICard) => {appData.getPreview(item);});

events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', item);
			events.emit('preview:changed', item);
			modal.close();},
	});
	modal.render({
		content: card.renderComponent({
			id: item.id,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			button: appData.getStatusButton(item),
		}),
	});
});

events.on('card:basket', (item: ICard) => {appData.toggleBasket(item);});
events.on('basket:open', () => {modal.render({content: basket.renderComponent(),});});

events.on('basket:changed', () => {
	page.counter = appData.basket.length;
	basket.sum = appData.getBasketTotal();
	basket.items = appData.basket.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {appData.deleteCardFromBasket(basketCard);},
		});
		newBasketCard.index = appData.getIndex(basketCard);
		return newBasketCard.renderComponent({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

events.on('order:open', () => {
	paymentForm.clearPayment();
	modal.render({content: paymentForm.renderForm({address: '',valid: false,errors: [],}),
	});
});

events.on(
	/^order\..*:changed/,
	(data: {field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;value: string;}) => {appData.setOrderField(data.field, data.value);}
);

events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
	paymentForm.setPayMethod(data.button);
	appData.setOrderPayment(data.payment);
	appData.validOrder();
});

events.on('order:submit', () => {
	modal.render({
		content: contactForm.renderForm({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.setBasketInOrder();
	api
		.orderItems(appData.order)
		.then((result) => {
			console.log(appData.basket, appData.order);
			const successWindow = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.clearBasket();
			appData.resetOrder();
			modal.render({ content: successWindow.renderComponent({ total: result.total }) });
		})
		.catch((err) => {console.error(`При заказе возникла ошибка ${err}`);});
});

events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	paymentForm.valid = !payment && !address;
	paymentForm.errors = Object.values({ payment, address }).filter((i) => !!i).join('; ');
	contactForm.valid = !email && !phone;
	contactForm.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

events.on('modal:open', () => {page.locked = true;});
events.on('modal:closed', () => {page.locked = false;});
