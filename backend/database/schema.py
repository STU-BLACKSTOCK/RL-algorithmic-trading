from backend.database.db import get_connection


def init_db():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (

        id INTEGER PRIMARY KEY
        AUTOINCREMENT,

        ticker TEXT,

        action TEXT,

        created_at
        TIMESTAMP DEFAULT
        CURRENT_TIMESTAMP

    )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":

    init_db()

    print(
        "Database initialized."
    )
