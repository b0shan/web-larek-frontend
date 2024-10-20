# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```



## Архитектура проекта
построена на паттерне MVP (Model-View-Presenter), который разделяет ответственность между тремя основными компонентами:

Model (Модель): отвечает за управление данными. Она получает, сохраняет и обрабатывает информацию, например, данные о товарах или заказах, поступающие с сервера. Также обрабатывает данные форм и отправляет их обратно на сервер.
View (Представление): отображает интерфейс и взаимодействует с пользователем, показывая информацию, полученную из Model.Cтраница с товарами, модальное окно корзины или форма заказа.
Presenter (Представитель): является посредником между Model и View. Он получает события от View (например, нажатие кнопок) и, используя Model, обновляет данные, а затем отображает изменения во View.

View реагирует на действия пользователя и передает события в Presenter.
Presenter получает эти события и запрашивает или обновляет данные через Model.
После обновления данных Presenter обновляет View, чтобы пользователь видел актуальные данные.

Приложение состоит из следующих основных классов:

EventEmitter: управляет подписками на события и их вызовом.


AppData (Model): отвечает за все данные приложения, такие как информация о товарах, заказах и пользователях.
Component (View): базовый класс для всех компонентов пользовательского интерфейса.
Modal: отображает модальные окна.
Basket: отвечает за отображение содержимого корзины.
Form: форма оформления заказа.
Success: отображает страницу успешного заказа.

Основные типы данных, используемые в приложении:

IItem (товар): описывает структуру данных товара. Используется в классах, связанных с отображением товаров, например, в Basket и AppData.
```
interface IItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
```
IOrder (заказ): описывает данные заказа. Используется в классе Form и в AppData для отправки и получения данных о заказах.
```
interface IOrder {
  orderId: string;
  items: IItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}
```
IEventEmitter: описывает механизм работы с событиями. Используется в классе EventEmitter для установки, отмены и вызова событий.
```
interface IEventEmitter {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}
```
Процессы в приложении реализованы через событийную модель с использованием класса EventEmitter. Например:

Добавление товара в корзину инициируется событием itemAddedToBasket, которое обрабатывается Presenter и обновляет данные в Model.
Оформление заказа инициирует событие orderPlaced, которое передает данные на сервер через AppData.








