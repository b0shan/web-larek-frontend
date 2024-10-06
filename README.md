# Проектная работа "Веб-ларек"

## Базовая архитектура

Интерфейс IItem //для описания товара
```
  id: string; //уникальный ID 
  name: string; //название
  category: string; //категория
  selected: boolean; //статус добавления в корзину 
  price: number; //стоимость 
  image: string; // ссылка на изображение
```

Интерфейс IOrder //для описания всего заказа или содержимого корзины
```
  items: string[]; //массив ID всех товаров в заказе 
  total: number; //общая стоимость всего заказа 
  payment: string; //способ оплаты
  address: string; //адрес доставки 
  email: string; //почта 
  phone: string; //телефон
```

Тип TBasket = Pick<IOrder,'items' | 'total'>; // тип для корзины на основе интерфейса IOrder 

Тип TOrder = Pick<IOrder,'items' | 'total' | 'payment' | 'address' | 'email' | 'phone'>; // тип для корзины на основе интерфейса IOrder 

Интерфейс IPage // для главной страницы 
```
  counter: number; // кол-во товаров в корзине
```

Интерфейс IApi //для описания ответа сервера

Класс Item //для работы с товаром 
```
  Метод render (item: string) //для отображения товара 
  ......... 
  //Метод для изменения состояния наличия в корзине
```

Класс Order  
```
  Метод render //отображение формы заказа
  Метод setValue //для заполения полей ввода в заказе ( адрес, почта, номер)
```

Класс Api //для работы с сервером

Класс Page //класс главной страницы 
```
  //Метод для счетчика товаров 
  //Метод для отображения всех карточек
```





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




