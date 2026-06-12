import yfinance as yf
import os

from config import TICKERS, START_DATE, END_DATE

DATA_DIR = "../data"

os.makedirs(DATA_DIR, exist_ok=True)

for ticker in TICKERS:
    print(f"Downloading {ticker}...")

    df = yf.download(
        ticker,
        start=START_DATE,
        end=END_DATE,
        auto_adjust=True
    )

    file_path = f"{DATA_DIR}/{ticker}.csv"

    df.to_csv(file_path)

    print(f"Saved -> {file_path}")

print("All downloads completed.")