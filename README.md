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
построена на паттерне MVP (Model-View-Presenter), который разделяет ответственность между тремя основными частями приложения:

Model (Модель): отвечает за управление данными. Она получает, сохраняет и обрабатывает информацию, например, данные о товарах или заказах, поступающие с сервера. 
Также обрабатывает данные форм и отправляет их обратно на сервер.
View (Представление): отображает интерфейс и взаимодействует с пользователем, показывая информацию, полученную из Model.Cтраница с товарами, модальное окно корзины или форма заказа.
Presenter (Представитель): является посредником между Model и View. Он получает события от View (например, нажатие кнопок) и, используя Model, обновляет данные, а затем отображает изменения во View.

View реагирует на действия пользователя и передает события в Presenter.
Presenter получает эти события и запрашивает или обновляет данные через Model.
После обновления данных Presenter обновляет View, чтобы пользователь видел актуальные данные.

## Приложение состоит из следующих основных классов:

# Класс Api:Содержит основную логику для отправки запросов. 
В конструктор передаются базовый URL сервера и опциональный объект с заголовком запроса.
  Методы:
  ```
  get: выполняет GET-запрос на указанный в параметрах эндпоинт и возвращает промис с объектом, полученным в ответе от сервера.
  post: принимает объект с данными, которые будут отправлены в теле запроса в формате JSON, и отправляет их на эндпоинт,
  переданный как параметр при вызове метода.
  ```

# EventEmitter: управляет подписками на события и их вызовом.
Класс, обеспечивающий работу событий. Его основная цель — установка, снятие и вызов слушателей событий.
  Методы:
  ```
  on(event: string, callback: Function): подписка на событие.
  off(event: string, callback: Function): отмена подписки на событие.
  emit(event: string, data?: any): вызов события и всех связанных слушателей.
  ```


# Model: Абстрактный класс, предназначен для работы с данными и внесения изменений.
Его конструктор создает новый экземпляр модели с указанными данными и событиями, которые реализует IEvents.
  
  Методы:
   ```
   sendUpdates: используется для передачи событий, содержащих информацию об изменениях данных, к нужным компонентам или модулям.
   ```

# AppData (Model): отвечает за все данные приложения, такие как информация о товарах и заказах.
Класс, отвечающий за работу с данными в приложении. Он управляет всеми данными приложения, включая получение данных от сервера и отправку данных на сервер.
  
  Методы:
  ```
  getCatalog: получение каталога товаров.
  showProductPreview: предпросмотр информации о товаре.
  toggleBasket: для изменения статуса товара («в корзине» / «не в корзине»).
  totalBasket: установка общей суммы корзины.
  indexBasket: для нумерации товаров в корзине.
  clearBasket: очищает корзину.  
  addBasketToOrder: добавляет товары и их сумму из корзины в заказ.
  setPayMethod: для выбора способа оплаты.
  setAddress: для указания адреса доставки.
  setPhone: для указания номера телефона для заказа.
  setEmail: для указания электронной почты для заказа.
  validateOrder: проводит проверку валидности заказа и отправляет событие об изменении.
  resetOrder: сбрасывает данные о заказе.
  ```

# Component (View): абстрактный класс для всех компонентов пользовательского интерфейса.
  Класс для создания переиспользуемых UI компонентов и предоставляет инструментарий для работы с DOM.
  
  Методы:
  ```
  setText: устанавливает текст. Принимает HTML-элемент и сам текст.
  setElementDisabled: устанавливает блокировку элемента. Принимает HTML-элемент и статус блокировки в виде логического значения.  
  hideElement: скрывает HTML-элемент, устанавливая его display в 'none'.
  showElement: показывает HTML-элемент, убирая его свойство display.
  setImage: задает источник изображения и альтернативный текст.
  renderComponent: создает компонент с выбранными данными и возвращает корневой контейнер.
  ```

# Modal(наследник Component): отображает модальные окна.
  Методы:
  ```
  open(): открытие модального окна.
  close(): закрытие модального окна.
  render(): отображение компонента на экране.
  ```
  
# Basket(наследник Component): отвечает за отображение содержимого корзины.
  Компонент для отображения содержимого корзины товаров. Отвечает за показ товаров, добавленных пользователем в корзину, а также за подсчет общей стоимости.
  Методы:
  ```
  renderBasket(): отрисовка корзины с товарами.
  updateBasket(data: IBasket): обновление корзины на основе новых данных.
  ```

# Form(наследник Component):  класс для форма оформления заказа.
  Класс для управления формой, который контролирует визуальное отображение и состояние формы.
  Инициализирует кнопку подтверждения и область для отображения ошибок внутри контейнера, а также добавляет обработчик событий для полей ввода для валидации.

  Методы:
  ```
  resetFields: очищает все поля формы.
  InputChange: обрабатывает изменение данных в полях. Отправляет события об изменениях.
  renderForm: отображает компонент на странице, устанавливая состояние формы, включая валидацию и список ошибок.
  ```
  
# Success (наследник Component)
 Компонент для отображения страницы успешного оформления заказа. Появляется после подтверждения заказа и сообщает пользователю о результате.
 Инициализирует текстовое поле для операции, кнопку и добавляет к ней слушатель событий.

## Основные типы данных, используемые в приложении прописаны в src/types/index.ts:


