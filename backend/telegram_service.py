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