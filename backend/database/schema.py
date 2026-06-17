from db import (
    get_connection
)

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

print(
    "Database initialized."
)