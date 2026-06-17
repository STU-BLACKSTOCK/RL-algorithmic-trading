import sqlite3

DATABASE = "backend/database/trading.db"


def get_connection():

    return sqlite3.connect(
        DATABASE
    )