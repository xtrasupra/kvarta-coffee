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