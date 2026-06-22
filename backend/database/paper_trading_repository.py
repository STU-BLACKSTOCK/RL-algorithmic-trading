import json
from backend.database.db import get_connection


class PaperTradingRepository:

    def create_session(
        self,
        ticker: str,
        initial_cash: float,
        final_portfolio_value: float,
        total_return: float,
        trade_count: int,
        portfolio_history: list,
    ) -> int:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO paper_trading_sessions (
                ticker,
                initial_cash,
                final_portfolio_value,
                total_return,
                trade_count,
                portfolio_history
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                ticker,
                initial_cash,
                final_portfolio_value,
                total_return,
                trade_count,
                json.dumps(portfolio_history),
            ),
        )

        session_id = cursor.lastrowid

        conn.commit()
        conn.close()

        return int(session_id)

    def add_trades(
        self,
        session_id: int,
        trades: list[dict],
    ) -> None:

        conn = get_connection()
        cursor = conn.cursor()

        rows = [
            (
                session_id,
                trade["date_or_step"],
                trade["ticker"],
                trade["action"],
                trade["price"],
                trade["shares"],
                trade["cash_after"],
                trade["portfolio_value_after"],
            )
            for trade in trades
        ]

        cursor.executemany(
            """
            INSERT INTO paper_trading_trades (
                session_id,
                date_or_step,
                ticker,
                action,
                price,
                shares,
                cash_after,
                portfolio_value_after
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            rows,
        )

        conn.commit()
        conn.close()

    def get_sessions(self) -> list[tuple]:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                ticker,
                initial_cash,
                final_portfolio_value,
                total_return,
                trade_count,
                created_at
            FROM paper_trading_sessions
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        conn.close()

        return rows

    def get_session(
        self,
        session_id: int,
    ) -> tuple | None:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                ticker,
                initial_cash,
                final_portfolio_value,
                total_return,
                trade_count,
                portfolio_history,
                created_at
            FROM paper_trading_sessions
            WHERE id = ?
            """,
            (session_id,),
        )

        row = cursor.fetchone()

        conn.close()

        return row

    def get_trades(
        self,
        session_id: int,
    ) -> list[tuple]:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                session_id,
                date_or_step,
                ticker,
                action,
                price,
                shares,
                cash_after,
                portfolio_value_after
            FROM paper_trading_trades
            WHERE session_id = ?
            ORDER BY id ASC
            """,
            (session_id,),
        )

        rows = cursor.fetchall()

        conn.close()

        return rows
