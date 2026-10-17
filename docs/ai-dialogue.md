# Как я работал с ChatGPT / Codex

> Формат: отредактированные выдержки из моей реальной сессии. Я выбрал ключевые эпизоды, убрал нецензурную лексику, секреты, личные адреса и служебный контекст. Это не выдуманный диалог и не полный необработанный экспорт.

Я сохранил фактические запросы и ответы. Время взято из исходной записи и показано по Москве. Некоторые эпизоды содержат только мой запрос: ответ не включён в выбранный фрагмент. Исторические ссылки и промежуточные инструкции внутри ответов отражают состояние на момент обсуждения; актуальные ссылки находятся в [README](../README.md).

[Машиночитаемые выдержки с исходными UTC-метками](ai-dialogue-excerpts.json) · [Мой разбор решений и вклада ИИ](process.md)

## 01. Первый дизайн по брифу

**Я · 15.10.2026, 19:10 МСК**

> Сделай мне дизайн в фигме
>
>
>
> ## 01Клиент
>
> **Обжарка «Кварта»**, Минск. Клиент вымышленный, все факты ниже даны для работы.
>
> Маленькая мастерская: обжаривают партиями по 5 кг с 2019 года. Основатели — Аня и Дмитрий, раньше работали бариста. Обжаривают по четвергам, по пятницам развозят по Минску. Свежесть — главное, что они продают: зерно приходит к клиенту на 1–3 день после обжарки.
>
> | Эфиопия Иргачеффецветочный, бергамот, светлая обжарка · 250 г |       32 BYN |
> | ------------------------------------------------------------- | -----------: |
> | Колумбия Уилакарамель, красное яблоко · 250 г                 |       29 BYN |
> | Бразилия Серрадоорех, шоколад, под эспрессо · 250 г           |       26 BYN |
> | Дрип-пакеты, ассорти10 штук                                   |       18 BYN |
> | Подписка2 пачки по 250 г раз в месяц, доставка бесплатно      | 54 BYN / мес |
>
> Адрес мастерской: Минск, ул. Короля, 9 (самовывоз). Часы: пн–пт 8:00–20:00, сб–вс 10:00–18:00. Доставка по Минску в пятницу, от 50 BYN бесплатно.
>
> **Кто покупает:** 25–45 лет, пьют кофе дома или в офисе, большинство заходит с телефона по рекламе в Instagram и Яндексе. **Тон:** тёплый и простой, без пафоса и без «премиального» глянца.

## 02. Фотографический характер изображений

**Я · 15.10.2026, 22:21 МСК**

> Сгенерируй мне эту картинку как будто осеннюю атмосферу и будто по живому сфоткали и допустим в кофейне сзади флажки треугольные гирьлянды и тд

<details>
<summary>Ответ ChatGPT / Codex · 15.10.2026, 22:23 МСК</summary>

Готово — осенняя кофейня, тёплый свет и гирлянды с флажками. Сгенерировано через imagegen.

[Скачать PNG](<локальный путь>) · [Промпт](<локальный путь>)

</details>

## 03. Изображения упаковок для каталога

**Я · 15.10.2026, 23:21 МСК**

> Сделай мне 6 пнг вырезок с этими пакетами

<details>
<summary>Ответ ChatGPT / Codex · 15.10.2026, 23:30 МСК</summary>

Готово — **6 отдельных PNG с прозрачным фоном**, 1254×1254: четыре упаковки из референса и два дополнительных ракурса.

[Скачать все 6 PNG в ZIP](<локальный путь>)

Промпты imagegen также внутри архива.

</details>

## 04. Мобильная версия по моему референсу

**Я · 16.10.2026, 01:21 МСК**

> А теперь обучись на моем примере и создай мне дизайн мобильной верстки и форму заявки, строго соблюдай каждый отступ

## 05. Архитектура и начало работы в VSCodium

**Я · 16.10.2026, 23:41 МСК**

> Давай, архитектура проекта и все на VS Codium, без каких либо заморочек, начинаем создание проекта и архитектуры начнем с того же NPX create и поудаляем лишние

<details>
<summary>Ответ ChatGPT / Codex · 16.10.2026, 23:42 МСК</summary>

Делаем по шагам в **VSCodium: React + обычный CSS, отдельно Python API и SQLite**. Команды выполняешь ты, я объясняю и помогаю с ошибками.

Под `npx create…` берём **Create React App**. Он [официально устарел](https://react.dev/blog/2025/02/14/sunsetting-create-react-app), поэтому при установке будет предупреждение. Раз выбираешь привычный способ без Vite — начнём с него.

**1. Структура проекта**

Будем постепенно собирать такую структуру:

```text
kvarta/
├── frontend/              # Сайт на React
│   ├── public/
│   │   └── images/        # Фото и изображения пакетов
│   ├── src/
│   │   ├── components/    # Шапка, каталог, форма и другие блоки
│   │   ├── data/          # Список товаров и цены
│   │   ├── api/           # Отправка формы в Python API
│   │   ├── App.js         # Собирает страницу из блоков
│   │   ├── App.css        # Стили страницы
│   │   ├── index.js       # Запускает React
│   │   └── index.css      # Общие стили
│   └── package.json       # Зависимости и команды
├── backend/               # Python: заявки, SQLite, Telegram
├── .gitignore             # Что исключить из Git
└── README.md              # Описание проекта
```

Сейчас создаём основу. Файлы бэкенда добавим, когда дойдём до формы.

**2. Создание**

Открой в VSCodium папку, где хочешь хранить проект. Выбери **Terminal → New Terminal**.

Сначала проверь:

```powershell
node -v
npm -v
git --version
```

Если все три команды показали версии, выполняй по очереди:

```powershell
mkdir kvarta
cd kvarta
git init
npx create-react-app@latest frontend
mkdir backend
```

Если установщик спросит разрешение установить пакет — введи `y`.

Здесь:

- `mkdir` создаёт папку.
- `cd` переходит внутрь папки.
- `git init` включает историю изменений для всего проекта.
- `npx create-react-app@latest frontend` создаёт React-приложение в папке `frontend`.

После установки открой **File → Open Folder → kvarta**.

**3. Удаляем демонстрационные файлы**

В `frontend/src` удали, если они есть:

```text
App.test.js
logo.svg
reportWebVitals.js
setupTests.js
```

В `frontend/public` удали:

```text
favicon.ico
logo192.png
logo512.png
manifest.json
```

Теперь заменяем файлы, которые на них ссылались.

`frontend/public/index.html`:

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="Кварта — небольшая мастерская свежей обжарки кофе в Минске."
    />
    <title>Кварта — свежая обжарка кофе</title>
  </head>
  <body>
    <noscript>Для работы формы включите JavaScript.</noscript>
    <div id="root"></div>
  </body>
</html>
```

`root` — место, куда React вставит нашу страницу.

`frontend/src/index.js`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Здесь подключаем стили, находим `root` и показываем компонент `App`. `StrictMode` помогает замечать ошибки во время разработки.

`frontend/src/App.js`:

```jsx
import "./App.css";

function App() {
  return (
    <main>
      <h1>Кварта</h1>
      <p>Свежая обжарка кофе в Минске.</p>
    </main>
  );
}

export default App;
```

Это первый компонент — функция, которая возвращает разметку. `export default` позволяет подключить её в другом файле.

Содержимое `App.css` пока полностью очисти.

`frontend/src/index.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f0e6;
  color: #392f2b;
  font-family: Arial, sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

img {
  display: block;
  max-width: 100%;
}
```

Это общая основа стилей. Шрифт из макета подключим отдельно; Arial сейчас временный.

**4. Запуск**

В терминале:

```powershell
cd frontend
npm start
```

Должна открыться страница **http://localhost:3000** с надписью «Кварта» на светлом фоне. Терминал оставь работающим.

На этом первый шаг: **покажи результат или пришли текст ошибки — дальше разложим страницу на компоненты по твоему макету.**

</details>

## 06. Разделение страницы на компоненты

**Я · 17.10.2026, 00:27 МСК**

> Все сделал, страница запустилась. Давай дальше разложим на компоненты по моему макету, объясняй что и зачем.

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 00:29 МСК</summary>

По твоему макету страницу удобно разделить так:

```text
App
├── Header          — логотип и навигация
├── main
│   ├── Hero        — первый экран «Кофе ещё помнит обжарку»
│   ├── Freshness   — факты: 5 кг, 1–3 дня, с 2019 года
│   ├── Catalog     — ассортимент и переключатели категорий
│   │   └── ProductCard — повторяющаяся карточка кофе
│   ├── Subscription — предложение подписки
│   ├── About       — Аня, Дмитрий и расписание обжарки
│   └── Contacts    — доставка, самовывоз и контакты
│       └── LeadForm — форма заявки
└── Footer          — нижняя часть сайта
```

**Компонент — это функция, которая возвращает часть интерфейса.** Выделяем отдельный компонент, если это самостоятельный блок или повторяющийся элемент. Например, карточек кофе четыре, но код карточки будет один — содержимое передадим через данные.

Сейчас создадим и подключим **Header и Hero**, чтобы разобраться с принципом. Остальные добавим по очереди.

**1. Сохрани работающую основу в Git**

В новом терминале, находясь в корневой папке `kvarta`, выполни:

```powershell
git add frontend
git commit -m "chore: initialize React frontend"
```

Это первая сохранённая точка проекта. Терминал с `npm start` оставь работающим.

**2. Создай папку компонентов**

Внутри `frontend/src` создай:

```text
components/
├── Header.js
└── Hero.js
```

Пока оставляем плоскую структуру — для такого лендинга её достаточно.

**3. Напиши Header**

В `frontend/src/components/Header.js`:

```jsx
function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="#top">
        <span className="header__name">kvarta.</span>

        <span className="header__description">
          Обжарочная
          <br />
          мастерская Минск
        </span>
      </a>

      <nav className="header__nav" aria-label="Основная навигация">
        <a href="#coffee">Кофе</a>
        <a href="#subscription">Подписка</a>
        <a href="#about">О нас</a>
        <a href="#contacts">Доставка</a>
      </nav>

      <a className="header__order" href="#contacts">
        Хочу кофе
      </a>
    </header>
  );
}

export default Header;
```

Что здесь происходит:

- `<header>` обозначает шапку страницы.
- `<nav>` объединяет навигационные ссылки.
- `href="#coffee"` означает переход к элементу с `id="coffee"`. Эти секции создадим дальше.
- Для перехода используем `<a>`. `<button>` понадобится для действий: открыть меню, переключить категорию, отправить форму.
- `className` задаёт CSS-класс. В JSX он называется именно так.
- `header__brand` и `header__nav` — обычные названия классов: по ним видно, к какому блоку относится элемент.
- `export default Header` позволяет подключить компонент из другого файла.

**4. Напиши Hero**

В `frontend/src/components/Hero.js`:

```jsx
function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__eyebrow">
        Свежая обжарка. Маленькие партии.
      </p>

      <h1 className="hero__title" id="hero-title">
        Кофе ещё помнит обжарку
      </h1>

      <p className="hero__question">
        А вы уже выбрали любимую чашку?
      </p>

      <p className="hero__description">
        Обжариваем по 5 кг. Привозим зерно на 1–3 день
        после обжарки домой или в офис.
      </p>

      <a className="hero__link" href="#coffee">
        Выбрать свой кофе
      </a>

      <p className="hero__caption">
        С 2019 года · Аня и Дмитрий · Минск
      </p>
    </section>
  );
}

export default Hero;
```

`Hero` — принятое название первого большого блока страницы.

Здесь `<h1>` — главный заголовок сайта. Дальше у крупных разделов будут `<h2>`, а у отдельных товаров — `<h3>`.

Связка `aria-labelledby="hero-title"` и `id="hero-title"` указывает программам чтения с экрана, какой заголовок описывает секцию.

**5. Подключи компоненты в App.js**

Полностью замени содержимое `frontend/src/App.js`:

```jsx
import Header from "./components/Header";
import Hero from "./components/Hero";

import "./App.css";

function App() {
  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
```

`import` подключает компонент. Запись `<Header />` вставляет его разметку в страницу. Названия React-компонентов начинаются с большой буквы.

**App управляет порядком блоков**, а содержимое каждого блока хранится в своём файле. Например, чтобы изменить текст первого экрана, ты открываешь `Hero.js`.

После сохранения увидишь шапку и текст первого экрана. Это пока каркас: следующий шаг — подключить SF Pro и оформить эти два блока по макету, разобрав контейнер, отступы и адаптив.

</details>

## 07. Шрифт, шапка и первый экран

**Я · 17.10.2026, 00:36 МСК**

> Все сделал, давай теперь подключим SF Pro и оформим шапку и первый экран по моему макету, с точными отступами и адаптивом. Объясняй, что за что отвечает.

## 08. Уточнение поведения анимаций

**Я · 17.10.2026, 00:52 МСК**

> Бутерброд появился, но надо что бы анимации были, то есть зерно кофе будто всплывает вверх и снизу появляется кофе кап, и маленький бегунок на выборе меню по наводке на кнопку допустим о нас и тд следовал туда, а так в целом держим направление и идем дальше

## 09. Блок свежести и каталог

**Я · 17.10.2026, 01:01 МСК**

> Все сделал, анимации работают. Давай дальше блок «5 кг · 1–3 дня · С 2019» и каталог кофе по макету, с адаптивом. Объясняй по шагам, что за что отвечает. Только теперь смотри, кнопка хочу кофе тоже должно быть изначально зерном и меняться на кофе кап

## 10. Подписка, история и плавные состояния

**Я · 17.10.2026, 01:14 МСК**

> Все сделал, каталог и фильтры работают. Давай дальше блок подписки и «О нас» по моему макету, с адаптивом. Пиши по шагам и объясняй, что за что отвечает. Только если что это состояние выбора кофе, то есть оно плавно переливается в эти цвета и грамовка и сделай кнопочки при наводке переплывают на другую, а то резкая анимация

## 11. Доставка, контакты и форма

**Я · 17.10.2026, 01:30 МСК**

> Все сделал, подписка и «О нас» работают. Давай дальше доставку, контакты и форму заявки по моему макету, с адаптивом. Пиши по шагам и объясняй, что за что отвечает. Сам ничего не меняй. И давай сделаем что бы обводка тоже была таким цветом 392F2B типу выделение мышкой

## 12. Отдельный сценарий подписки

**Я · 17.10.2026, 01:58 МСК**

> А когда нажимаю на хочу подписку мне тоже делает шаблон в комментарий и предыдущие комменты как раз чиститься

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 01:59 МСК</summary>

Да. Тогда логика такая:

- **Карточка кофе** добавляет товар в комментарий, сохраняя предыдущие позиции и текст клиента.
- **«Хочу подписку»** очищает комментарий и вставляет шаблон подписки.
- Имя и телефон сохраняются в обоих случаях.

Соберём это через одно состояние, чтобы обработчики не конфликтовали.

**1. Замени `App.js`**

```jsx
import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Freshness from "./components/Freshness";
import Catalog from "./components/Catalog";
import Subscription from "./components/Subscription";
import About from "./components/About";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  const [orderRequest, setOrderRequest] = useState(null);

  function selectCoffee(product) {
    setOrderRequest({
      type: "coffee",
      product,
    });
  }

  function selectSubscription() {
    setOrderRequest({
      type: "subscription",
    });
  }

  return (
    <div className="page" id="top">
      <Header />

      <main>
        <Hero />
        <Freshness />

        <Catalog onSelectCoffee={selectCoffee} />

        <Subscription
          onSelectSubscription={selectSubscription}
        />

        <About />

        <Contacts orderRequest={orderRequest} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
```

Теперь `orderRequest` описывает действие пользователя: выбор конкретного кофе или подписки.

**2. Подключи кнопку подписки**

В `Subscription.js` измени объявление компонента:

```jsx
function Subscription({ onSelectSubscription }) {
```

В существующую ссылку «Хочу подписку» добавь `onClick`:

```jsx
<a
  className="subscription__link"
  href="#contacts"
  onClick={onSelectSubscription}
>
```

Всё содержимое ссылки, включая иконки, оставь прежним.

Теперь нажатие одновременно задаёт шаблон и плавно прокручивает страницу к форме.

**3. Обнови передачу данных в `Contacts.js`**

В начале:

```jsx
function Contacts({ orderRequest }) {
```

Вместо прежнего вызова формы:

```jsx
<LeadForm orderRequest={orderRequest} />
```

**4. Обнови `LeadForm.js`**

Импорт должен содержать `useEffect`:

```jsx
import { useEffect, useRef, useState } from "react";
```

Перед функцией `LeadForm`, после массива `interests`, добавь константу:

```jsx
const SUBSCRIPTION_TEMPLATE =
  "Хочу оформить подписку: 2 пачки по 250 г каждый месяц · " +
  "54 BYN/мес. Доставка бесплатно.";
```

Измени объявление компонента:

```jsx
function LeadForm({ orderRequest }) {
```

Удали старые переменные:

```jsx
const generatedLineRef = useRef("");
const appliedSelectionRef = useRef(null);
```

Вместо них добавь:

```jsx
const appliedRequestRef = useRef(null);
```

Существующий `submitLock` оставь.

**5. Замени старый эффект подстановки целиком**

Удали прежний `useEffect`, который использовал `selectedCoffee`. После строки:

```jsx
const isSending = status === "sending";
```

вставь:

```jsx
useEffect(() => {
  if (
    !orderRequest ||
    isSending ||
    appliedRequestRef.current === orderRequest
  ) {
    return;
  }

  setValues((previous) => {
    if (orderRequest.type === "subscription") {
      return {
        ...previous,
        interest: "subscription",
        comment: SUBSCRIPTION_TEMPLATE,
      };
    }

    const product = orderRequest.product;

    const template =
      `Выбран кофе: ${product.country} ${product.name} · ` +
      `${product.badge} · ${product.price} BYN.`;

    let comment = previous.comment;

    // Убираем автоматический шаблон подписки,
    // если человек вернулся к разовому заказу.
    if (comment === SUBSCRIPTION_TEMPLATE) {
      comment = "";
    } else if (comment.startsWith(`${SUBSCRIPTION_TEMPLATE}\n`)) {
      comment = comment
        .slice(SUBSCRIPTION_TEMPLATE.length)
        .replace(/^\r?\n(?:\r?\n)?/, "");
    }

    const alreadyAdded = comment
      .split(/\r?\n/)
      .some((line) => line.trim() === template);

    return {
      ...previous,
      interest: "order",
      comment: alreadyAdded
        ? comment
        : [comment.trimEnd(), template]
            .filter(Boolean)
            .join("\n\n"),
    };
  });

  appliedRequestRef.current = orderRequest;

  setStatus("idle");
  setMessage("");

  setErrors((previous) => ({
    ...previous,
    comment: undefined,
  }));
}, [orderRequest, isSending]);
```

Что здесь происходит:

- Ветка `subscription` полностью заменяет комментарий шаблоном подписки.
- Ветка кофе создаёт строку выбранного товара.
- `alreadyAdded` проверяет, есть ли такая строка, чтобы повторный клик не размножал её.
- `.join("\n\n")` добавляет между позициями пустую строку.
- `...previous` сохраняет имя, телефон и остальные данные.
- Во время отправки изменение откладывается до завершения запроса.

Существующую проверку ограничения комментария в 1000 символов оставь.

**Результат**

После выбора двух товаров:

```text
Выбран кофе: Эфиопия Иргачеффе · 250 г · 32 BYN.

Выбран кофе: Колумбия Уила · 250 г · 29 BYN.
```

После нажатия «Хочу подписку» комментарий полностью заменится:

```text
Хочу оформить подписку: 2 пачки по 250 г каждый месяц · 54 BYN/мес. Доставка бесплатно.
```

В форме при этом выберется **«Подписка»**. Оба варианта будут передаваться серверу через уже существующее поле `comment`.

После проверки:

```powershell
git add frontend/src
git commit -m "feat: support multiple coffee choices and subscription preset"
```

</details>

## 13. FastAPI, SQLite и Telegram

**Я · 17.10.2026, 02:09 МСК**

> Все сделал, кофе добавляется списком, подписка заменяет комментарий. Теперь давай FastAPI, SQLite, защиту от дублей на 10 минут и Telegram. Пиши по шагам, объясняй код, сам ничего не меняй.

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 02:12 МСК</summary>

Подключаем всё в одном модуле. **Файлы создаёшь и команды выполняешь ты.**

Схема будет такой:

```text
React → FastAPI → SQLite
                    ↓
              очередь уведомлений
                    ↓
                 Telegram
```

Заявка считается принятой после сохранения в SQLite. Если Telegram временно недоступен, сервер повторит отправку.

**1. Подготовь папку бэкенда**

В новом терминале из корня `kvarta`:

```powershell
cd backend
py --version
```

Нужен Python 3.11 или новее.

Создай виртуальное окружение:

```powershell
py -m venv .venv
```

Это отдельная папка с Python-зависимостями проекта. Активировать её необязательно — будем явно использовать её Python.

Создай `backend/requirements.txt`:

```text
fastapi
uvicorn
httpx
phonenumbers
python-dotenv
pydantic>=2,<3
```

Установи зависимости:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Назначение пакетов:

| Пакет | Для чего |
|---|---|
| FastAPI | Принимает HTTP-запросы |
| Uvicorn | Запускает сервер |
| HTTPX | Отправляет сообщения через Telegram API |
| phonenumbers | Проверяет и нормализует телефон |
| python-dotenv | Читает настройки из `.env` |
| Pydantic | Проверяет поля входящего JSON |

SQLite уже входит в Python, отдельно устанавливать его не нужно. [Документация Python](https://docs.python.org/3/library/sqlite3.html).

**2. Исключи секреты и базу из Git**

В корне `kvarta` открой или создай `.gitignore`. Добавь:

```gitignore
backend/.venv/
backend/.env
backend/data/
**/__pycache__/
*.pyc
frontend/.env.local
```

В Git попадут код и структура таблицы. Токен бота и реальные заявки останутся вне репозитория.

**3. Создай настройки**

Создай `backend/.env.example`:

```dotenv
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

DB_PATH=data/leads.sqlite3

ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Скопируй его рядом под именем `.env`.

Создай `backend/config.py`:

```python
import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip()

DB_PATH = Path(os.getenv("DB_PATH", "data/leads.sqlite3"))

if not DB_PATH.is_absolute():
    DB_PATH = BASE_DIR / DB_PATH

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]
```

`BASE_DIR` привязывает путь базы к папке `backend`. Поэтому база будет открываться одна и та же независимо от того, из какой папки запущен сервер.

**4. Создай Telegram-бота**

В Telegram открой [@BotFather](https://t.me/BotFather):

1. Отправь `/newbot`.
2. Задай имя бота.
3. Задай свободный username, заканчивающийся на `bot`.
4. Полученный токен вставь в `backend/.env`:

```dotenv
TELEGRAM_BOT_TOKEN=
```

Открой созданного бота и нажми **Start** или отправь `/start`. Это позволит ему писать тебе. [Инструкция Telegram](https://core.telegram.org/bots/tutorial).

Теперь узнаем ID чата. Создай `backend/get_chat_id.py`:

```python
import httpx

from config import BOT_TOKEN


if not BOT_TOKEN:
    raise SystemExit("Сначала заполни TELEGRAM_BOT_TOKEN в .env")

try:
    response = httpx.get(
        f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates",
        timeout=10,
    )
    response.raise_for_status()
    result = response.json()
except (httpx.HTTPError, ValueError):
    raise SystemExit(
        "Не удалось получить данные. Проверь токен и соединение."
    ) from None

if not result.get("ok"):
    raise SystemExit("Telegram отклонил запрос. Проверь токен.")

chat_ids = set()

for update in result.get("result", []):
    chat = (update.get("message") or {}).get("chat")

    if chat:
        chat_ids.add(chat["id"])

if not chat_ids:
    print("Отправь боту /start и запусти этот файл ещё раз.")
else:
    for chat_id in chat_ids:
        print(f"TELEGRAM_CHAT_ID={chat_id}")
```

Запусти:

```powershell
.\.venv\Scripts\python.exe get_chat_id.py
```

Полученное значение вставь в `.env`:

```dotenv
TELEGRAM_CHAT_ID=
```

Токен хранится **только в `backend/.env`**. Во фронтенд и сообщения сюда его вставлять не нужно.

**5. Создай SQLite и защиту от дублей**

Создай `backend/database.py`:

```python
import json
import sqlite3
import time
from contextlib import contextmanager

from config import DB_PATH


@contextmanager
def connection():
    db = sqlite3.connect(DB_PATH, timeout=10)
    db.row_factory = sqlite3.Row

    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with connection() as db:
        db.execute("PRAGMA journal_mode=WAL")

        db.executescript("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                interest TEXT NOT NULL,
                comment TEXT NOT NULL,
                source_json TEXT NOT NULL,
                created_at REAL NOT NULL,

                telegram_sent_at REAL,
                telegram_attempts INTEGER NOT NULL DEFAULT 0,
                telegram_next_try_at REAL NOT NULL DEFAULT 0,
                telegram_last_error TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_leads_phone_created
            ON leads(phone, created_at);
        """)


def save_lead(payload):
    with connection() as db:
        db.execute("BEGIN IMMEDIATE")

        now = time.time()

        duplicate = db.execute(
            """
            SELECT id
            FROM leads
            WHERE phone = ? AND created_at > ?
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (payload["phone"], now - 600),
        ).fetchone()

        if duplicate:
            return duplicate["id"], True

        cursor = db.execute(
            """
            INSERT INTO leads (
                name,
                phone,
                interest,
                comment,
                source_json,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                payload["name"],
                payload["phone"],
                payload["interest"],
                payload["comment"],
                json.dumps(payload["source"], ensure_ascii=False),
                now,
            ),
        )

        return cursor.lastrowid, False


def pending_notifications():
    with connection() as db:
        rows = db.execute(
            """
            SELECT *
            FROM leads
            WHERE telegram_sent_at IS NULL
              AND telegram_next_try_at <= ?
            ORDER BY id
            LIMIT 10
            """,
            (time.time(),),
        ).fetchall()

        return [dict(row) for row in rows]


def mark_sent(lead_id):
    with connection() as db:
        db.execute(
            """
            UPDATE leads
            SET telegram_sent_at = ?,
                telegram_attempts = telegram_attempts + 1,
                telegram_last_error = NULL
            WHERE id = ?
            """,
            (time.time(), lead_id),
        )


def mark_failed(lead_id, error_code, delay):
    with connection() as db:
        db.execute(
            """
            UPDATE leads
            SET telegram_attempts = telegram_attempts + 1,
                telegram_next_try_at = ?,
                telegram_last_error = ?
            WHERE id = ?
            """,
            (time.time() + delay, error_code, lead_id),
        )
```

Важные места:

- `?` — параметры SQL-запроса. Пользовательский текст передаётся отдельно от SQL.
- `commit()` сохраняет изменения, `rollback()` отменяет незавершённую операцию.
- `600` секунд — десять минут.
- `BEGIN IMMEDIATE` ставит проверку дубля и создание заявки в одну транзакцию.

Именно транзакция закрывает ситуацию с двумя одновременными запросами: второй дождётся первого, увидит сохранённую заявку и вернёт признак дубля.

Поля `telegram_*` хранят состояние уведомления. После перезапуска сервера неотправленные заявки останутся в очереди.

**6. Подключи отправку и повторные попытки Telegram**

Создай `backend/telegram_service.py`:

```python
import asyncio
import json
import logging

import httpx

from config import BOT_TOKEN, CHAT_ID
from database import mark_failed, mark_sent, pending_notifications


logger = logging.getLogger(__name__)

INTEREST_LABELS = {
    "subscription": "Подписка",
    "order": "Разовый заказ",
    "question": "Вопрос",
}


class TelegramDeliveryError(Exception):
    def __init__(self, code, retry_after=0):
        super().__init__(code)
        self.retry_after = retry_after


def build_message(lead):
    source = json.loads(lead["source_json"])
    tags = source.get("tags", {})

    lines = [
        f"Кварта — заявка #{lead['id']}",
        "",
        f"Имя: {lead['name']}",
        f"Телефон: {lead['phone']}",
        f"Интерес: {INTEREST_LABELS[lead['interest']]}",
        "",
        "Реклама:",
    ]

    if tags:
        for key, value in tags.items():
            lines.append(f"{key}: {value[:100]}")
    else:
        lines.append("Метки не переданы")

    lines.extend([
        "",
        f"Страница входа: {source.get('landing_url', '')[:400] or '—'}",
        f"Страница заявки: {source.get('page_url', '')[:400] or '—'}",
        f"Переход с сайта: {source.get('referrer', '')[:400] or '—'}",
        "",
        "Комментарий:",
        lead["comment"] or "—",
    ])

    return "\n".join(lines)[:4000]


async def send_notification(client, lead):
    try:
        response = await client.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={
                "chat_id": CHAT_ID,
                "text": build_message(lead),
                "link_preview_options": {
                    "is_disabled": True,
                },
            },
        )
    except httpx.HTTPError:
        raise TelegramDeliveryError("network_error") from None

    try:
        result = response.json()
    except ValueError:
        raise TelegramDeliveryError("invalid_response") from None

    if not isinstance(result, dict):
        raise TelegramDeliveryError("invalid_response")

    if response.is_success and result.get("ok") is True:
        return

    parameters = result.get("parameters") or {}
    retry_after = int(parameters.get("retry_after", 0))

    code = result.get("error_code", response.status_code)

    raise TelegramDeliveryError(
        f"telegram_{code}",
        retry_after=retry_after,
    )


async def telegram_worker():
    async with httpx.AsyncClient(timeout=10) as client:
        while True:
            try:
                leads = await asyncio.to_thread(
                    pending_notifications
                )

                for lead in leads:
                    try:
                        await send_notification(client, lead)
                    except TelegramDeliveryError as error:
                        delay = max(
                            error.retry_after,
                            min(
                                300,
                                5 * 2 ** min(
                                    lead["telegram_attempts"], 6
                                ),
                            ),
                        )

                        await asyncio.to_thread(
                            mark_failed,
                            lead["id"],
                            str(error),
                            delay,
                        )

                        logger.warning(
                            "Telegram: заявка #%s, ошибка %s",
                            lead["id"],
                            error,
                        )
                    else:
                        await asyncio.to_thread(
                            mark_sent,
                            lead["id"],
                        )

            except Exception:
                logger.exception(
                    "Ошибка обработки очереди уведомлений"
                )

            await asyncio.sleep(2)
```

Что здесь происходит:

- Воркер каждые две секунды проверяет очередь.
- При успешной отправке заполняет `telegram_sent_at`.
- При ошибке записывает её код и время следующей попытки.
- Интервал повторов постепенно увеличивается до пяти минут.
- Если Telegram просит подождать дольше, учитываем его `retry_after`.

Отправляем обычный текст через метод [`sendMessage`](https://core.telegram.org/bots/api#sendmessage). Форматирование HTML из комментария пользователя не выполняется.

**7. Создай FastAPI-приложение**

Создай `backend/main.py`:

```python
import asyncio
import logging
import re
import sqlite3
from contextlib import asynccontextmanager, suppress
from typing import Literal

import phonenumbers
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator

from config import ALLOWED_ORIGINS, BOT_TOKEN, CHAT_ID
from database import init_db, save_lead
from telegram_service import telegram_worker


logging.basicConfig(level=logging.INFO)

# HTTPX не должен печатать URL с токеном Telegram.
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

ALLOWED_TAGS = {
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "utm_id",
    "gclid",
    "yclid",
    "fbclid",
    "ad_id",
}


class LeadSource(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    landing_url: str = Field(default="", max_length=2048)
    page_url: str = Field(default="", max_length=2048)
    referrer: str = Field(default="", max_length=2048)
    tags: dict[str, str] = Field(
        default_factory=dict,
        max_length=10,
    )

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, tags):
        if any(
            len(key) > 40 or len(value) > 200
            for key, value in tags.items()
        ):
            raise ValueError("Слишком длинные рекламные метки")

        return {
            key: value
            for key, value in tags.items()
            if key in ALLOWED_TAGS
        }


class LeadInput(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    name: str = Field(min_length=1, max_length=80)
    phone: str = Field(min_length=1, max_length=32)
    interest: Literal["subscription", "order", "question"]
    comment: str = Field(default="", max_length=1000)
    source: LeadSource = Field(default_factory=LeadSource)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):
        if not re.fullmatch(r"\+?[0-9() .-]+", value):
            raise ValueError("Некорректный телефон")

        try:
            number = phonenumbers.parse(value, "BY")
        except phonenumbers.NumberParseException:
            raise ValueError("Некорректный телефон") from None

        if (
            phonenumbers.region_code_for_number(number) != "BY"
            or not phonenumbers.is_valid_number(number)
            or number.extension
        ):
            raise ValueError("Нужен белорусский номер")

        return phonenumbers.format_number(
            number,
            phonenumbers.PhoneNumberFormat.E164,
        )


@asynccontextmanager
async def lifespan(app):
    if not BOT_TOKEN or not CHAT_ID:
        raise RuntimeError(
            "Заполни TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env"
        )

    init_db()
    task = asyncio.create_task(telegram_worker())

    try:
        yield
    finally:
        task.cancel()

        with suppress(asyncio.CancelledError):
            await task


app = FastAPI(
    title="Kvarta API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, error):
    return JSONResponse(
        status_code=422,
        content={
            "ok": False,
            "message": (
                "Проверьте поля формы: имя, белорусский номер "
                "и длину комментария."
            ),
        },
    )


@app.exception_handler(sqlite3.Error)
async def database_error(request: Request, error):
    logger.error("Ошибка SQLite: %s", type(error).__name__)

    return JSONResponse(
        status_code=503,
        content={
            "ok": False,
            "message": (
                "Не удалось сохранить заявку. "
                "Попробуйте отправить ещё раз."
            ),
        },
    )


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/lead")
def create_lead(lead: LeadInput):
    lead_id, duplicate = save_lead(lead.model_dump())

    return {
        "ok": True,
        "duplicate": duplicate,
    }
```

Основные части:

- `LeadInput` описывает допустимый запрос. Неправильные поля отклоняются до обращения к базе.
- Телефон повторно проверяется на сервере и приводится к единому формату.
- `POST /api/lead` сохраняет заявку или обнаруживает дубль.
- `lifespan` запускает очередь уведомлений вместе с сервером и останавливает её при завершении.
- CORS разрешает React обращаться к API с другого порта. Для браузера `localhost:3000` и `localhost:8000` — разные источники. [Документация FastAPI](https://fastapi.tiangolo.com/tutorial/cors/).

Уведомления в этом варианте обрабатывает **один рабочий процесс API** — запускай командой ниже без добавления нескольких `--workers`.

**8. Запусти сервер**

Из папки `backend`:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Открой:

[http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

Должно появиться:

```json
{"ok": true}
```

Документация API будет здесь:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

При первом запуске автоматически создастся:

```text
backend/data/leads.sqlite3
```

**9. Подключи React к этому адресу**

Создай `frontend/.env.local`:

```dotenv
REACT_APP_API_URL=http://127.0.0.1:8000
```

Это публичный адрес API. Секретов Telegram здесь нет.

Перезапусти React: в его терминале `Ctrl + C`, затем:

```powershell
npm start
```

После изменения `.env.local` перезапуск обязателен.

**10. Добавь передачу рекламного источника**

Это часть ТЗ: менеджер должен видеть рекламу, объявление и страницу входа.

Полностью замени `frontend/src/api/leads.js`:

```jsx
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const SOURCE_KEY = "kvarta:source:v1";

const TAGS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "gclid",
  "yclid",
  "fbclid",
  "ad_id",
];

function captureSource() {
  const params = new URLSearchParams(window.location.search);

  const source = {
    landing_url: window.location.href.slice(0, 2048),
    referrer: document.referrer.slice(0, 2048),

    tags: Object.fromEntries(
      TAGS
        .map((key) => [key, params.get(key)])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => [key, value.slice(0, 200)])
    ),
  };

  try {
    const saved = JSON.parse(
      sessionStorage.getItem(SOURCE_KEY) || "null"
    );

    if (
      saved &&
      typeof saved.landing_url === "string" &&
      typeof saved.referrer === "string" &&
      saved.tags &&
      typeof saved.tags === "object"
    ) {
      return saved;
    }

    sessionStorage.setItem(SOURCE_KEY, JSON.stringify(source));
  } catch {
    // При недоступном sessionStorage сохраняем источник
    // в памяти текущей страницы.
  }

  return source;
}

const firstSource = captureSource();

export async function sendLead(lead) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/lead`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...lead,

        source: {
          ...firstSource,
          page_url: window.location.href.slice(0, 2048),
        },
      }),

      signal: controller.signal,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.ok !== true) {
      throw new Error(
        result?.message ||
          "Не удалось отправить заявку. Попробуйте ещё раз."
      );
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Сервер долго не отвечает. Попробуйте отправить ещё раз."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

Здесь:

- `captureSource()` запоминает первоначальную страницу входа и рекламные метки.
- `sessionStorage` сохраняет их при перезагрузках в текущей вкладке.
- `page_url` показывает страницу, с которой отправили форму.
- `utm_content` или `ad_id` могут содержать идентификатор объявления.

Чтобы данные появились, рекламная ссылка должна содержать соответствующие метки, например:

```text
http://localhost:3000/?utm_source=instagram&utm_campaign=autumn&utm_content=ad_1
```

**11. Проверь весь путь**

Сначала отправь форму со своим белорусским номером.

Ожидаемый результат:

1. В браузере появляется сообщение об успешной заявке.
2. В `backend/data` остаётся файл базы.
3. Обычно через несколько секунд приходит сообщение бота.

Затем обнови страницу и отправь тот же номер ещё раз — можно с другим оформлением пробелов и скобок.

Ответ API должен быть:

```json
{
  "ok": true,
  "duplicate": true
}
```

Новая строка заявки и новое задание уведомления не создаются.

Для проверки рекламы открой тестовую ссылку в приватном окне и отправь заявку с номером, который не использовался последние десять минут. В Telegram должны появиться `utm_source`, `utm_campaign` и `utm_content`.

**12. Проверь два одновременных запроса**

Создай `backend/check_duplicates.py`:

```python
from concurrent.futures import ThreadPoolExecutor

import httpx


payload = {
    "name": "Проверка дублей",
    "phone": "+375291234567",
    "interest": "order",
    "comment": "Проверка двух одновременных запросов",
}


def send_request(_):
    response = httpx.post(
        "http://127.0.0.1:8000/api/lead",
        json=payload,
        timeout=20,
    )

    return response.status_code, response.json()


with ThreadPoolExecutor(max_workers=2) as executor:
    results = list(executor.map(send_request, range(2)))

for result in results:
    print(result)
```

В `phone` поставь свой номер, с которым последние десять минут заявок не было.

Запусти при работающем API:

```powershell
.\.venv\Scripts\python.exe check_duplicates.py
```

Ожидаются два успешных ответа: один с `duplicate: false`, другой с `duplicate: true`. Так проверяется серверная защита, независимо от блокировки кнопки в React.

**13. Посмотри состояние базы**

Создай `backend/check_db.py`:

```python
from database import connection


with connection() as db:
    rows = db.execute("""
        SELECT
            id,
            phone,
            telegram_attempts,
            telegram_sent_at,
            telegram_last_error
        FROM leads
        ORDER BY id DESC
        LIMIT 10
    """).fetchall()

    for row in rows:
        print(dict(row))
```

Запуск:

```powershell
.\.venv\Scripts\python.exe check_db.py
```

Если `telegram_sent_at` заполнено — отправка подтверждена Telegram. Если нет, смотри `telegram_last_error`:

| Значение | Что проверить |
|---|---|
| `network_error` | Соединение с Telegram |
| `telegram_401` | Токен бота |
| `telegram_403` | Доступ бота к чату, блокировку бота |
| `telegram_400` | Правильность `TELEGRAM_CHAT_ID` |

После изменения `backend/.env` перезапусти Python-сервер.

При редком обрыве связи Telegram может принять сообщение, а сервер — не получить подтверждение. Поэтому повторное уведомление теоретически возможно; внутри него остаётся тот же номер заявки. **Самой второй заявки в SQLite при этом не появляется.**

**14. Сохрани этап**

После проверки, из папки `backend`, зафиксируй установленные версии:

```powershell
.\.venv\Scripts\python.exe -m pip freeze | Set-Content -Encoding utf8 requirements.lock.txt
```

Затем из корня `kvarta`:

```powershell
git status --short
```

Убедись, что среди добавляемых файлов нет `.env`, `.venv` и базы. После этого:

```powershell
git add .gitignore backend frontend/src/api/leads.js
git commit -m "feat: add FastAPI leads API with SQLite deduplication and Telegram delivery"
```

Для README выбор базы можно объяснить так:

> SQLite подходит для небольшого потока заявок: не требует отдельного сервера, поддерживает транзакции и хранит очередь уведомлений вместе с заявками. Проверка дубля и вставка выполняются одной транзакцией. Для публикации API потребуется постоянный диск и один экземпляр приложения с этой базой.

Следующий этап после локальной проверки — выбор хостинга с сохранением SQLite и подключение публичного сайта к API.

</details>

## 14. Исключение секретов и базы из коммита

**Я · 17.10.2026, 02:48 МСК**

> Коммит уже сделал, но git push ещё нет. Как теперь убрать из коммита .env, .venv и базу, чтобы на компьютере они остались? Сам ничего не меняй, пиши по шагам.

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 02:49 МСК</summary>

**Перезапишем последний локальный коммит через `--amend`. Файлы останутся на компьютере.** Поскольку `push` ещё не было, принудительная отправка не понадобится.

1. **Открой терминал в корне `kvarta`**, где находятся `backend` и `frontend`.

   Сначала убери из индекса текущие подготовленные изменения:

   ```powershell
   git restore --staged .
   ```

   Это ничего не удаляет и не отменяет правки в файлах. Просто позволяет подготовить исправление коммита отдельно от остальных изменений.

2. **Проверь корневой `.gitignore`.** В нём должны быть эти строки:

   ```gitignore
   backend/.env
   backend/.venv/
   backend/data/
   **/__pycache__/
   *.pyc
   frontend/.env.local
   ```

   Сохрани файл. `.env.example` оставляем в репозитории, если настоящего токена в нём нет.

3. **Убери служебные файлы из индекса Git:**

   ```powershell
   git rm -r --cached --ignore-unmatch -- backend/.env backend/.venv backend/data backend/__pycache__ frontend/.env.local
   ```

   Что означают параметры:

   - `--cached` — убрать из Git, сохранив файлы на компьютере.
   - `-r` — обработать папки со всем содержимым.
   - `--ignore-unmatch` — пропустить пути, которые не были добавлены в Git.

   Вывод вида `rm 'backend/.env'` здесь нормален: благодаря `--cached` локальный файл остаётся.

4. **Добавь `.gitignore` и исправь последний коммит:**

   ```powershell
   git add -- .gitignore
   ```

   Затем:

   ```powershell
   git commit --amend --no-edit
   ```

   `--amend` заменяет последний коммит его исправленной версией. `--no-edit` сохраняет прежнее сообщение коммита. Хеш коммита изменится — это ожидаемо.

5. **Убедись, что файлы больше не отслеживаются:**

   ```powershell
   git ls-files -- backend/.env backend/.venv backend/data backend/__pycache__ frontend/.env.local
   ```

   **Команда должна ничего не вывести.** При этом файлы и папки должны остаться в проводнике VSCodium.

6. **Проверь, не попадали ли они в более ранние коммиты:**

   ```powershell
   git log --all --oneline -- backend/.env backend/.venv backend/data backend/__pycache__ frontend/.env.local
   ```

   Если вывод пустой — этих путей нет в истории текущих веток, можно переходить к обычному `push`.

   Если появились строки с коммитами — пока не отправляй проект: файлы были и в других коммитах. Пришли только этот вывод, и разберём следующий шаг. **Содержимое `.env` присылать не нужно.**

</details>

## 15. Публикация фронтенда и API

**Я · 17.10.2026, 02:50 МСК**

> Все сделал, обе проверки пустые, файлы на месте. Давай теперь зальём проект на GitHub и настроим бесплатный хостинг, чтобы сайт и форма с Telegram работали по ссылке. Пиши по шагам, сам ничего не меняй.

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 02:53 МСК</summary>

**Публикуем так: React — на GitHub Pages, FastAPI и SQLite — на PythonAnywhere.** Форма будет обращаться к API, а API — сохранять заявку и отправлять её в Telegram.

Для тестового проекта это бесплатный вариант с сохранением файлов. Но учти два ограничения PythonAnywhere: поддержка FastAPI пока экспериментальная, а бесплатное веб-приложение имеет срок действия месяц и требует продления. [Условия бесплатного аккаунта](https://help.pythonanywhere.com/pages/FreeAccountsFeatures/), [документация FastAPI на PythonAnywhere](https://help.pythonanywhere.com/pages/ASGICommandLine/).

Ниже использую:

- `GITHUB_USER` — твой логин GitHub.
- `PA_USER` — логин, который выберешь на PythonAnywhere.
- `kvarta-coffee` — название нового репозитория.

**Везде заменяй эти обозначения своими значениями.** Команды выполняй по очереди; при ошибке остановись на соответствующем шаге.

1. **Подготовь SQLite к хостингу — локально в VSCodium.**

   В `backend/database.py` найди строку с:

   ```python
   PRAGMA journal_mode=WAL
   ```

   Замени в ней только `WAL` на `DELETE`:

   ```python
   PRAGMA journal_mode=DELETE
   ```

   Сохрани остальной код строки.

   Это переключает способ ведения журнала SQLite. **Заявки не удаляются:** `DELETE` здесь — название режима. Он подходит для выбранного хранилища; WAL не поддерживает работу через сетевую файловую систему. Защита от дублей через `BEGIN IMMEDIATE` остаётся. [Документация SQLite](https://www.sqlite.org/wal.html).

   В терминале **из корня `kvarta`**:

   ```powershell
   git add -- backend/database.py
   git commit -m "fix: use SQLite journal mode compatible with hosting"
   ```

2. **Создай репозиторий GitHub.**

   Открой [создание репозитория](https://github.com/new).

   Укажи:

   - Repository name: `kvarta-coffee`.
   - Description: `Лендинг обжарки «Кварта»: React, FastAPI, SQLite и Telegram`.
   - Visibility: **Public**.
   - README, `.gitignore` и лицензию на этом экране **не добавляй** — создаём пустой репозиторий для существующего проекта.

   Нажми **Create repository**.

3. **Отправь исходники — локально, из корня `kvarta`.**

   Сначала:

   ```powershell
   git branch -M main
   git remote -v
   ```

   Если вторая команда ничего не вывела, добавь адрес:

   ```powershell
   git remote add origin https://github.com/GITHUB_USER/kvarta-coffee.git
   ```

   Если `origin` уже существует, проверь его адрес. Если он ведёт в другой репозиторий, замени:

   ```powershell
   git remote set-url origin https://github.com/GITHUB_USER/kvarta-coffee.git
   ```

   Затем:

   ```powershell
   git push -u origin main
   ```

   При запросе авторизации войди в GitHub через предложенное окно браузера.

   Обнови страницу репозитория. Там должны появиться `backend` и `frontend`. Локальные `.env`, `.venv` и `data` в репозиторий не отправляются.

4. **Создай бесплатный аккаунт PythonAnywhere.**

   Зарегистрируйся на [PythonAnywhere](https://www.pythonanywhere.com/) и выбери бесплатный **Beginner account**.

   Инструкция ниже рассчитана на основной сайт `www.pythonanywhere.com`. Твой адрес API будет:

   ```text
   https://PA_USER.pythonanywhere.com
   ```

   Открой **Account → API token → Create a new API token**.

   Это отдельный ключ управления хостингом. К токену Telegram он отношения не имеет; присылать его сюда не нужно.

5. **Скачай проект на сервер и установи зависимости.**

   Теперь команды выполняются **в PythonAnywhere → Consoles → Bash**, а не в PowerShell на компьютере.

   ```bash
   cd ~
   git clone https://github.com/GITHUB_USER/kvarta-coffee.git kvarta
   ```

   Создай серверное окружение:

   ```bash
   mkvirtualenv kvarta --python=python3.11
   ```

   Установи зависимости:

   ```bash
   cd ~/kvarta/backend
   python -m pip install -r requirements.lock.txt
   ```

   Затем установи инструмент управления хостингом:

   ```bash
   python -m pip install --upgrade pythonanywhere
   ```

   Здесь создаётся новое Linux-окружение. Копировать Windows-папку `.venv` на сервер не требуется.

6. **Настрой серверный `.env`.**

   В разделе **Files** PythonAnywhere открой папку:

   ```text
   /home/PA_USER/kvarta/backend
   ```

   Создай там файл `.env`:

   ```dotenv
   TELEGRAM_BOT_TOKEN=ТВОЙ_ТОКЕН_БОТА
   TELEGRAM_CHAT_ID=ТВОЙ_CHAT_ID
   DB_PATH=/home/PA_USER/kvarta-data/leads.sqlite3
   ALLOWED_ORIGINS=https://GITHUB_USER.github.io,http://localhost:3000,http://127.0.0.1:3000
   HTTPS_PROXY=http://proxy.server:3128
   ```

   Замени логины, токен и Chat ID своими значениями.

   Что здесь за что отвечает:

   - `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` — используй уже проверенные локально значения.
   - `DB_PATH` — база хранится **вне папки репозитория**, поэтому обычное обновление кода её не затронет. Наш код сам создаст папку и базу.
   - `ALLOWED_ORIGINS` — разрешает браузеру отправлять форму с твоего сайта. Здесь нужен адрес **без `/kvarta-coffee`**: origin содержит только протокол, домен и порт.
   - `HTTPS_PROXY` — бесплатный PythonAnywhere выпускает внешние запросы через свой прокси. Telegram API входит в разрешённый список, а HTTPX поддерживает эту настройку. [Прокси PythonAnywhere](https://help.pythonanywhere.com/pages/403ForbiddenError/), [список разрешённых адресов](https://www.pythonanywhere.com/whitelist/), [настройки HTTPX](https://www.python-httpx.org/environment_variables/).

   На сервере будет **отдельная новая база**. Локальные тестовые заявки переносить не нужно.

7. **Запусти опубликованный API.**

   В Bash-консоли PythonAnywhere выполни **одной строкой**, заменив все `PA_USER`:

   ```bash
   pa website create --domain PA_USER.pythonanywhere.com --command '/home/PA_USER/.virtualenvs/kvarta/bin/uvicorn --app-dir /home/PA_USER/kvarta/backend --uds ${DOMAIN_SOCKET} --workers 1 main:app'
   ```

   **`${DOMAIN_SOCKET}` оставь как написано**, включая одинарные кавычки вокруг команды.

   Здесь:

   - `--app-dir` указывает папку нашего бэкенда.
   - `--uds` подключает приложение к веб-серверу хостинга.
   - `--workers 1` оставляет один процесс, как рассчитана наша очередь Telegram.
   - `main:app` означает объект `app` из `main.py`.

   Это штатный способ публикации FastAPI на этом хостинге. Держать открытой консоль с локальной командой `uvicorn --reload` не нужно. [Инструкция PythonAnywhere](https://help.pythonanywhere.com/pages/ASGICommandLine/).

   Открой в браузере:

   ```text
   https://PA_USER.pythonanywhere.com/api/health
   ```

   Ожидаемый ответ:

   ```json
   {"ok":true}
   ```

   Если приложение не запускается, посмотри расположение журналов:

   ```bash
   pa website get --domain PA_USER.pythonanywhere.com
   ```

   **К публикации фронтенда переходи после работающего `/api/health`.**

8. **Настрой адрес API для опубликованного React — снова локально в VSCodium.**

   Переименуй:

   ```text
   frontend/.env.local
   ```

   в:

   ```text
   frontend/.env.development.local
   ```

   Внутри оставь локальный адрес:

   ```dotenv
   REACT_APP_API_URL=http://127.0.0.1:8000
   ```

   В корневой `.gitignore` добавь:

   ```gitignore
   frontend/.env.development.local
   ```

   Затем создай `frontend/.env.production`:

   ```dotenv
   REACT_APP_API_URL=https://PA_USER.pythonanywhere.com
   ```

   Теперь `npm start` использует локальный API, а `npm run build` — опубликованный. Переименование важно: прежний `.env.local` мог бы перекрыть адрес из `.env.production`. [Приоритет файлов окружения CRA](https://create-react-app.dev/docs/adding-custom-environment-variables/).

   **В `.env.production` находится только публичный адрес API, поэтому его можно коммитить. Токен Telegram остаётся исключительно на бэкенде.**

9. **Подготовь публикацию React на GitHub Pages.**

   В локальном терминале из корня проекта:

   ```powershell
   cd frontend
   npm install --save-dev gh-pages
   ```

   В `frontend/package.json` добавь отдельное поле верхнего уровня:

   ```json
   "homepage": "https://GITHUB_USER.github.io/kvarta-coffee",
   ```

   Например, расположи его после `"private": true,`.

   В существующий объект `"scripts"` добавь две команды. Он получится таким:

   ```json
   "scripts": {
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test",
     "eject": "react-scripts eject",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

   Не заменяй этим весь `package.json`.

   `homepage` задаёт правильный путь к ресурсам. `predeploy` собирает сайт, а `deploy` публикует содержимое `build` в отдельную ветку `gh-pages`. [Публикация CRA на GitHub Pages](https://create-react-app.dev/docs/deployment/#github-pages).

   Вернись в корень и сохрани изменения:

   ```powershell
   cd ..
   git add -- .gitignore frontend/package.json frontend/package-lock.json frontend/.env.production
   git commit -m "chore: configure production API and GitHub Pages deployment"
   git push
   ```

   Затем опубликуй сборку:

   ```powershell
   cd frontend
   npm run deploy
   ```

   Ожидаемый результат — успешная сборка и сообщение `Published`.

10. **Включи GitHub Pages.**

    В репозитории открой **Settings → Pages**.

    В разделе **Build and deployment** выбери:

    - Source: **Deploy from a branch**.
    - Branch: **gh-pages**.
    - Folder: **/ (root)**.

    Нажми **Save**. После завершения публикации сайт будет доступен по адресу:

    ```text
    https://GITHUB_USER.github.io/kvarta-coffee/
    ```

    Эти настройки соответствуют публикации из отдельной ветки. [Документация GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

11. **Проверь весь путь заявки.**

    Закрой локальные React и FastAPI. Открой опубликованный сайт, желательно ещё и с телефона.

    Проверь последовательно:

    - Картинки, каталог, выбор кофе и прокрутка работают.
    - Неверный телефон показывает подсказку.
    - Заявка с твоим действительным номером показывает успешную отправку.
    - В Telegram приходит сообщение.
    - Повторная отправка того же номера в течение 10 минут не создаёт вторую заявку.

    Для проверки рекламы открой сайт в приватном окне:

    ```text
    https://GITHUB_USER.github.io/kvarta-coffee/?utm_source=instagram&utm_campaign=autumn&utm_content=ad_1
    ```

    Отправь заявку с номером, который не использовался последние 10 минут. В Telegram должны появиться эти метки.

    Посмотреть сохранённые заявки можно в Bash PythonAnywhere:

    ```bash
    ~/.virtualenvs/kvarta/bin/python ~/kvarta/backend/check_db.py
    ```

    Затем перезапусти веб-приложение:

    ```bash
    pa website reload --domain PA_USER.pythonanywhere.com
    ```

    Снова выполни `check_db.py`: заявки должны остаться. Это проверка сохранности базы после перезапуска.

12. **Запомни, как обновлять проект дальше.**

    После изменения фронтенда: коммит, `git push`, затем **из `frontend`**:

    ```powershell
    npm run deploy
    ```

    После изменения бэкенда: коммит и `git push` локально, затем **в Bash PythonAnywhere**:

    ```bash
    cd ~/kvarta
    git pull --ff-only
    ~/.virtualenvs/kvarta/bin/python -m pip install -r backend/requirements.lock.txt
    pa website reload --domain PA_USER.pythonanywhere.com
    ```

    В README укажи выбранный хостинг, экспериментальную поддержку FastAPI, необходимость продления бесплатного приложения и использование SQLite для небольшого тестового проекта. Сам PythonAnywhere не рекомендует SQLite для серьёзной производственной нагрузки. [Базы данных PythonAnywhere](https://help.pythonanywhere.com/pages/KindsOfDatabases).

После выполнения пришли **ссылку на репозиторий и сайт**, а если какой-то шаг завершится ошибкой — её текст и номер шага.

</details>

## 16. Передача диагностики публикации ИИ

**Я · 17.10.2026, 03:26 МСК**

> 00:12 \~ **$&#x20;**/home/xtrasupra/.virtualenvs/kvarta/bin/pa website get --domain xtrasupra.pythonanywhere.com-----------  ------------------------------------------------------------------------------------------------------------------------------------domain name  xtrasupra.pythonanywhere.comenabled      Truecommand      /home/xtrasupra/.virtualenvs/kvarta/bin/uvicorn --app-dir /home/xtrasupra/kvarta/backend --uds ${DOMAIN_SOCKET} --workers 1 main:appaccess log   /var/log/xtrasupra.pythonanywhere.com.access.logerror log    /var/log/xtrasupra.pythonanywhere.com.error.logserver log   /var/log/xtrasupra.pythonanywhere.com.server.log-----------  ------------------------------------------------------------------------------------------------------------------------------------00:26 \~ **$&#x20;**&#x20;&#x20;
>
> Теперь давай сам делай уже все, чини

<details>
<summary>Ответ ChatGPT / Codex · 17.10.2026, 03:27 МСК</summary>

Инструмент остановил управление: **Яндекс Браузер пока не поддерживается из-за ограничений проверки URL**. Журнал прочитать не удалось, изменений я не сделал.

Открой PythonAnywhere **в Chrome или Edge**, войди в свой аккаунт и напиши «открыл». Продолжу исправление оттуда.

</details>

## Что видно из этих эпизодов

Я не принимал первый результат без изменений: задавал направление дизайна, уточнял адаптив и микровзаимодействия, собирал проект по модулям и проверял промежуточные результаты. Когда возникли ошибки публикации, я отдельно поручил ИИ диагностику и исправление. Технические результаты я привёл в [проверках](testing.md).
