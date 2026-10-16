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