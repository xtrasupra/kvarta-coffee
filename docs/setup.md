# Как запустить и опубликовать проект

Я использовал VSCodium, React с `react-scripts`, Python/FastAPI и SQLite. Ниже описал воспроизводимую настройку без реальных ключей. [Вернуться в README](../README.md).

## Структура

```text
kvarta/
├── frontend/
│   ├── public/                 # HTML, favicon, robots.txt
│   ├── src/components/         # секции, карточки, фильтр, форма
│   ├── src/data/products.js    # ассортимент и цены
│   ├── src/api/leads.js        # POST и атрибуция рекламы
│   └── .env.production         # только публичный URL API
├── backend/
│   ├── main.py                # DTO, валидация, CORS, маршруты
│   ├── config.py              # чтение переменных окружения
│   ├── database.py            # SQLite, транзакция и очередь
│   └── telegram_service.py    # уведомления и повторные попытки
└── docs/                      # процесс, диалог, снимки, отчёты
```

## Локальный запуск на Windows

Нужны Node.js/npm, Git и Python 3.11+. Секреты в репозиторий не входят.

```powershell
git clone https://github.com/xtrasupra/kvarta-coffee.git
cd kvarta/frontend
npm ci
```

Для разработки я создаю `frontend/.env.development.local`:

```dotenv
REACT_APP_API_URL=http://127.0.0.1:8000
```

```powershell
npm start
```

В отдельном терминале из корня проекта:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock.txt
```

Создаю `backend/.env` и заполняю своими значениями:

```dotenv
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DB_PATH=data/leads.sqlite3
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Локальная проверка: `http://127.0.0.1:8000/api/health`. Чтобы определить Chat ID, сначала отправляю `/start` своему боту, затем запускаю `get_chat_id.py`. Для Telegram использую [@kvarta_applicationsbot](https://t.me/kvarta_applicationsbot); токен и адресата задаю только на сервере. Открытие бота другим человеком само по себе не меняет адресата уведомлений.

## Production и GitHub Pages

В `frontend/.env.production` находится публичный адрес:

```dotenv
REACT_APP_API_URL=https://xtrasupra.pythonanywhere.com
```

Я не оставляю `.env.local` с локальным API: CRA читает его и при production-сборке, и он перекрывает `.env.production`. Файл с адресом для разработки называется `.env.development.local`. В `package.json` задан `homepage` с путём `/kvarta-coffee`.

```powershell
cd frontend
npm run deploy
```

Команда собирает сайт и публикует `build` в `gh-pages`. Маска `--remove` дополнительно удаляет из ветки старые `.env`, `.env.*` и `.gitignore`: стандартная маска утилиты пропускает скрытые файлы. Серверные настройки не должны попадать в ветку сайта. В GitHub Pages выбраны `Deploy from a branch`, ветка `gh-pages`, папка `/ (root)`. Python-код на Pages не запускается.

## PythonAnywhere

На сервере устанавливаю зависимости в Linux-окружение и создаю отдельный `.env`. Основные production-настройки:

```dotenv
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DB_PATH=data/leads.sqlite3
ALLOWED_ORIGINS=https://xtrasupra.github.io,http://localhost:3000,http://127.0.0.1:3000
HTTPS_PROXY=http://proxy.server:3128
```

В CORS указан origin без `/kvarta-coffee`. Текущая относительная база разрешается относительно папки `backend`; она находится в постоянном домашнем хранилище аккаунта и исключена из Git. Для другого размещения задаю абсолютный `DB_PATH` и отдельно переношу базу через корректную резервную копию — смена пути сама по себе не переносит старые заявки.

Команда уже настроенного приложения:

```bash
/home/xtrasupra/.virtualenvs/kvarta/bin/uvicorn --app-dir /home/xtrasupra/kvarta/backend --uds ${DOMAIN_SOCKET} --workers 1 main:app
```

После обновления кода или серверного окружения выполняю перезапуск:

```bash
/home/xtrasupra/.virtualenvs/kvarta/bin/pa website reload --domain xtrasupra.pythonanywhere.com
```

Для этого проекта оставляю один процесс: очередь Telegram не рассчитана на несколько независимых отправителей. Состояние очереди хранится в SQLite. Бесплатный сервис и экспериментальный ASGI имеют ограничения; для реальной эксплуатации я предусмотрел бы резервные копии, мониторинг, отдельную БД и поддерживаемый способ развёртывания.

## Проверки перед публикацией

```powershell
git status --short
git ls-files -- backend/.env backend/.venv backend/data
```

Последняя команда не должна выводить секреты, окружение или базу. В репозитории нет реальных токенов. Проверку пользовательской формы и результаты Lighthouse я описал в [testing.md](testing.md).
