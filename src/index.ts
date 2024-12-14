import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { AppData } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Card, BasketCard } from './components/Card'
import { ICard, IOrder } from './types';
import { Modal } from './components/Modal';
import { OrderPayment, OrderContacts } from './components/Order';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const modalWindow = ensureElement<HTMLElement>('#modal-container');
const pageBody = document.body;
const page = new Page(pageBody, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(modalWindow, events);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const paymentForm = new OrderPayment(cloneTemplate(paymentTemplate), events);
const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactForm = new OrderContacts(cloneTemplate(contacsTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

api.getProductList().then(appData.getCatalog.bind(appData)).catch((err) => {
		console.error(err);
	});

events.on('cards:changed', () => {
	page.counter = appData.basketItems.length;
	page.gallery = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:selected', item);
			},
		});
		return card.renderComponent(item); 
	});
});

// Выбор карточки как элемент превью
events.on('card:selected', (item: ICard) => {
	appData.setPreview(item);
});

// Изменение превью
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:basket', item);
			events.emit('preview:changed', item);
			modal.close();
		},
	});
	modal.renderComponent({
		content: card.renderComponent({
			id: item.id,
			cardTitle: item.cardTitle,
			cardImage: item.cardImage,
			cardDescription: item.cardDescription,
			cardPrice: item.cardPrice,
			cardCategory: item.cardCategory,
			actionButton: appData.getButtonStatus(item),
		}),
	});
});

// // Отправка карточки в корзину
events.on('card:basket', (item: ICard) => {
	appData.toggleBasketCard(item);
});

// Открытие корзины
events.on('basket:open', () => {
	modal.renderComponent({
		content: basket.render(),
	});
});

// // Изменение данных корзины
events.on('basket:changed', () => {
	page.counter = appData.basketItems.length;
	basket.updateSum = appData.getBasketTotal();
	basket.updateItems = appData.basketItems.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteCardFromBasket(basketCard);
			},
		});
		newBasketCard.index = appData.getCardIndex(basketCard);
		return newBasketCard.render({
			title: basketCard.cardTitle,
			price: basketCard.cardPrice,
		});
	});
});

// Открытие формы заказа
events.on('order:open', () => {
	paymentForm.clearPayment();
	modal.render({
		content: paymentForm.renderForm({
			address: '',
			validForm: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей
events.on(
	/^order\..*:changed/,
	(data: {
		field: keyof Pick<IOrder, 'address' | 'number' | 'email'>;
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

// // Изменения в заказе
events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
	paymentForm.togglePayment(data.button);
	appData.setOrderPayment(data.payment);
	appData.validateOrder();
});

// // Подтверджение формы оплаты
events.on('order:submit', () => {
	modal.render({
		content: contactForm.renderForm({
			number: '',
			email: '',
			validForm: false,
			errors: [],
		}),
	});
});

// Подтверджение формы контактов
events.on('contacts:submit', () => {
	appData.setBasketToOrder();
	api.orderItems(appData.order).then((result) => {
			console.log(appData.basketItems, appData.order);
			const successWindow = new Success(cloneTemplate(successTemplate), {
				onClick: () => {modal.close();},
			});
			appData.clearBasket();
			appData.clearOrder();

			modal.render({ content: successWindow.render({ total: result.total }) });
		})
		.catch((err) => {
			console.error(`При заказе возникла ошибка ${err}`);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, number, address, payment } = errors;
	paymentForm.valid = !payment && !address;
	paymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactForm.valid = !email && !number;
	contactForm.errors = Object.values({ email, number })
		.filter((i) => !!i)
		.join('; ');
});

// Открытие модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Закрытие модального окна
events.on('modal:closed', () => {
	page.locked = false;
});