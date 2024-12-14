import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { AppData } from './components/AppData';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const appData = new AppData({}, events);