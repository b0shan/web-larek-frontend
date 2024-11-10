###последний тест обещаю


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
- src/scss/styles.scss — корневой файл стилей
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

# Класс Api:
Назначение: Класс для работы с API, выполняет отправку и получение данных с сервера.
В конструктор передаются базовый URL сервера и опциональный объект с заголовком запроса.
  Методы:
  ```
  get: выполняет GET-запрос на указанный в параметрах эндпоинт и возвращает промис с объектом, полученным в ответе от сервера.
  post: принимает объект с данными, которые будут отправлены в теле запроса в формате JSON, и отправляет их на эндпоинт,
  переданный как параметр при вызове метода.
  ```

# Класс EventEmitter: 
Назначение: Управляет подписками на события, устанавливает, снимает и вызывает обработчики событий.
  Методы:
  ```
  on(event: string, callback: Function): void – Подписка на событие.
  off(event: string, callback: Function): void – Отмена подписки на событие.
  emit(event: string, data?: any): void – Вызов события с данными.
  ```

# Класс Model: Абстрактный класс, предназначен для работы с данными и внесения изменений.
Его конструктор создает новый экземпляр модели с указанными данными и событиями, которые реализует IEvents.
  
  Методы:
   ```
   sendUpdates(data: any): void – Отправка события с обновленными данными.
   ```

# Класс AppData (наследник Model): 
Назначение: Хранит данные приложения, включая каталог товаров, элементы корзины, данные заказа и ошибки формы.

  Поля
  ```
  catalog (ICard[]) – Массив объектов каталога товаров.
  basketItems (string[]) – Массив идентификаторов товаров в корзине.
  currentItemID (string | null) – Идентификатор открытого товара.
  formErrors (string[]) – Массив ошибок формы.
  ```

  Методы:
  ```
  getCatalog(): ICard[]- получение массива каталога товаров.
  getProductID(id: string): void – Возвращает данные товара по его ID.
  toggleBasket(itemID: string): void – Добавляет или удаляет товар из корзины.
  totalBasket(): number – Возвращает общую сумму корзины.
  clearBasket(): void - очищает корзину.  
  setPayMethod(payment: string): void – для выбора способа оплаты.
  setAddress(address: string): void – для указания адреса доставки.
  setPhone(phone: string): void – для указания номера телефона для заказа.
  setEmail(email: string): void – для указания электронной почты для заказа.
  validateOrder(): boolean – проводит проверку валидности заказа и отправляет событие об изменении.
  resetOrder(): void – сбрасывает данные о заказе.
  ```

# Класс Component: абстрактный класс для всех компонентов пользовательского интерфейса.
  Назначение: Базовый класс для создания UI-компонентов с методами для работы с DOM.
  Конструктор принимает HTMLElement
  Методы:
  ```
  setText(element: HTMLElement, text: string): void – Устанавливает текст элемента.
  setElementDisabled(element: HTMLElement, disabled: boolean): void – Блокирует элемент. 
  hideElement(element: HTMLElement): void – Скрывает элемент.
  showElement(element: HTMLElement): void – Показывает элемент.
  setImage(element: HTMLElement, src: string, alt: string): void – Устанавливает изображение и альтернативный текст.
  renderComponent(data: any): HTMLElement – Создаёт и возвращает компонент.
  ```

# Класс Modal: 
  Назначение: Управляет модальными окнами.
  Методы:
  ```
  open(): void – Открывает модальное окно.
  close(): void – Закрывает модальное окно.
  render(): void – Отображает модальное окно.
  ```

# Класс Page 
  Является компонентом страницы и управляет элементами страницы. 
  Добавляет слушатель при нажатии на корзину. 
  Поля HTML-элементов: 
  -обертка страницы. 
  -отображение каталога с карточками.
  -отображения корзины.
  -кол-во товаров в корзине.

  Свойства:
  ```
  counter - устанавливка значение счетчика
  catalog - обновление содержимого каталога новыми элементами.
  ```
  Методы:
  ```
  setText(element: HTMLElement, text: string): void - для установки текстового содержимого элемента. Он используется внутри сеттера counter.
  updateCatalog(items: HTMLElement[]): void - для обновления содержимого каталога.
  toggleLock(isLocked: boolean): void - для блокировки или разблокировки страницы.
  ```
  
  
# Класс Basket: 
  Назначение: Компонент для отображения и управления корзиной товаров.
  Конструктор принимает HTMLElement и объект IEvents
  Методы:
  ```
  updateItems(items: HTMLElement[]): void — обновляет содержимое списка товаров в корзине.
  updateSum(total: number): void – обновляет отображаемую сумму корзины.
  clearItems(): void — очищает корзину, устанавливая пустой список товаров.
  setButtonDisabled(isDisabled: boolean): void - управляет активностью кнопки оформления заказа в зависимости от наличия товаров.
  ```

# Класс Card: 
  Назначение: Компонент для отображения карточки товара.
  Его конструктор принимает контейнер и объект типа ICardOperations, который определяет действия, доступные при взаимодействии с карточкой товара.
  Поля:
  ```
  cardTitle (string): Название товара.
  cardDescription (string): Описание товара.
  cardId (string): Идентификатор товара.
  cardPrice (number | null): Цена товара.
  actionButton (HTMLElement): Кнопка действия.
  cardImage (string): URL изображения товара.
  cardCategory (CategoryCard): Категория товара.
  itemIndex (number): Порядковый номер товара для нумерации в корзине.
  ```

  Методы:
  ```
  setId(id: string): void  — Устанавливает уникальный идентификатор карточки.
  getId(): string - Возвращает идентификатор карточки.
  setTitle(title: string): void  — Устанавливает заголовок карточки.
  getTitle(): string — Возвращает текущий заголовок карточки.
  setDescription(description: string): void - Устанавливает описание карточки.
  getDescription(): string — Возвращает текущее описание карточки.
  setPrice(price: number | null): void - Устанавливает цену карточки.
  getPrice(): string — Возвращает текущую цену карточки в виде строки.
  setImage(url: string): void — Устанавливает URL изображения для карточки.
  setCategory(category: string): void - Устанавливает категорию карточки
  getCategory(): string — Возвращает текущую категорию карточки.
  setButton(text: string): void — Устанавливает текст на кнопке карточки. Этот метод используется, чтобы обновить текст кнопки, например, от "Добавить в корзину" на "Убрать из корзины" в зависимости от состояния товара.
  ```



# Класс Form:  
  Назначение: Класс для управления формой заказа, включая валидацию и отображение ошибок.

  Поля:
  valid(value: boolean) - устанавливает состояние кнопки в зависимости от валидности полей формы
  errors(value: string) - устанавливает текст об ошибке в области для вывода ошибок.

  Методы:
  ```
  resetFields(): void – Очищает поля формы.
  inputChange(event: Event): void – Обрабатывает изменения в полях ввода.
  renderForm(data: IFormView): void – Отображает форму на странице.
  ```


# Класс OrderPay (наследник Form)
  Конструктор принимает HTMLElement и объект IEvents
  Использует тип TOrderPay
  Инициализирует кнопки для выбора способа оплаты, которые будут использованы в методах, а также поле для ввода адреса. 
  При активации кнопок оплаты устанавливается обработчик событий, который передает выбранные данные.   
  Свойства:
  ```
  address: HTMLInputElement - поле для ввода адреса.
  buttonCash: HTMLButtonElement -  Кнопка для выбора наличного расчета.
  buttonOnline: HTMLButtonElement -  Кнопка для выбора онлайн-оплаты.
  ```
  Методы:
  ```
  clearPay(): void - снимает класс активного состояния с кнопки
  togglePay(activeButton: HTMLButtonElement): void - очищает статус кнопок и устанавливает новую активную кнопку.
  ```

  # Класс ContactsOrder (наследник Form)
  Конструктор принимает HTMLElement и объект IEvents
  Инициализирует поля формы с почтой и телефоном.
  Свойства:
  ```
  email: string - устанавливает почту
  phone: string - устанавливает номер телефона
  ```

# Класс Success (наследник Component)
  Назначение: Компонент для отображения экрана успешного оформления заказа.
  Поля:
  ```
  message (string) – Сообщение об успешном оформлении заказа.
  ```
  Методы:
  ```
  renderSuccessMessage(message: string): void – Отображает сообщение об успешной операции.
  onClose(): void – Закрывает сообщение об успехе.
  ```

## Основные типы данных, используемые в приложении :
```
// Интерфейс для данных полученных через API
interface IResponseAPI {
  getCardList: () => Promise<ICard[]>; - Получает список карточек товара.
  getCard: (id: string) => Promise<ICard>; - Получает карточку товара по ID.
  orderItems(order: IOrder): Promise<IOrderSuccess>; - Отправляет заказ и возвращает результат.
}

//Интерфейс карточки
interface ICard {
  id: string; - Уникальный идентификатор товара
  title: string; - Название товара
  category: CategoryCard; - Категория товара
  description: string; - Описание товара
  image: string; - URL изображения товара
  price: number | null; - Цена товара (может быть null)
  button: string; - Текст кнопки действия
}

// Категории карточек
type CategoryCard =
  | 'софт-скилл'
  | 'другое'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скилл';

//Интерфейс для заказа
interface IOrder {
  items: string[]; - Массив идентификаторов товаров в заказе
  total: number; -Общая сумма заказа
  email: string; -Электронная почта
  number: string; - Номер телефона
  address: string; - Адрес доставки
  payment: string; - Способ оплаты
}

//Интерфейс успешной операции
interface IOrderSuccess{
  id: string; - Уникальный идентификатор заказа
  total: number; - Общая сумма заказа
}

//IForm: интерфейс для формы.
interface IForm{
  errors: string[]; - Массив ошибок формы
  validForm: boolean; - Валидация формы
}

//Интерфейс класса EventEmitter:
interface IEventEmitter {
  on(event: string, callback: Function): void; - Подписка на событие
  off(event: string, callback: Function): void; - Отмена подписки
  emit(event: string, data?: any): void; - Вызов события с данными
}
```






