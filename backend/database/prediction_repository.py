from backend.database.db import (
    get_connection
)


class PredictionRepository:

    def save_prediction(
        self,
        ticker,
        action
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(

            """
            INSERT INTO predictions
            (
                ticker,
                action
            )
            VALUES (?,?)
            """,

            (
                ticker,
                action
            )
        )

        conn.commit()

        conn.close()

    def get_history(self):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                ticker,
                action,
                created_at
            FROM predictions
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        conn.close()

        return rows    