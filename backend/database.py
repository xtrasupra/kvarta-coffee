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
        db.execute("PRAGMA journal_mode=DELETE")

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