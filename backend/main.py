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