import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { AppData } from './components/AppData';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Card } from './components/Card'

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const modalWindow = ensureElement<HTMLElement>('#modal-container');
const pageBody = document.body;
const page = new Page(pageBody, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);



api.getProductList().then(appData.getCatalog.bind(appData))
	.catch((err) => {
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
		return card.render(item); 
	});
});