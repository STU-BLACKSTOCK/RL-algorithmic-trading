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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS paper_trading_sessions (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ticker TEXT NOT NULL,

        initial_cash REAL NOT NULL,

        final_portfolio_value REAL NOT NULL,

        total_return REAL NOT NULL,

        trade_count INTEGER NOT NULL,

        portfolio_history TEXT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS paper_trading_trades (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        session_id INTEGER NOT NULL,

        date_or_step TEXT NOT NULL,

        ticker TEXT NOT NULL,

        action TEXT NOT NULL,

        price REAL NOT NULL,

        shares REAL NOT NULL,

        cash_after REAL NOT NULL,

        portfolio_value_after REAL NOT NULL,

        FOREIGN KEY (session_id)
            REFERENCES paper_trading_sessions(id)

    )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":

    init_db()

    print(
        "Database initialized."
    )
