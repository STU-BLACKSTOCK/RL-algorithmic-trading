import pandas as pd
import os

from ta.trend import SMAIndicator
from ta.trend import EMAIndicator
from ta.trend import MACD
from ta.momentum import RSIIndicator

RAW_DATA_DIR = "../data/raw"
PROCESSED_DATA_DIR = "../data/processed"

os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)

files = os.listdir(RAW_DATA_DIR)

for file in files:

    print(f"Processing {file}")

    path = os.path.join(RAW_DATA_DIR, file)

    df = pd.read_csv(path)

    # ---------------------
    # Moving Averages
    # ---------------------

    df["SMA20"] = SMAIndicator(
        close=df["Close"],
        window=20
    ).sma_indicator()

    df["SMA50"] = SMAIndicator(
        close=df["Close"],
        window=50
    ).sma_indicator()

    # ---------------------
    # EMA
    # ---------------------

    df["EMA20"] = EMAIndicator(
        close=df["Close"],
        window=20
    ).ema_indicator()

    # ---------------------
    # RSI
    # ---------------------

    df["RSI"] = RSIIndicator(
        close=df["Close"],
        window=14
    ).rsi()

    # ---------------------
    # MACD
    # ---------------------

    macd = MACD(close=df["Close"])

    df["MACD"] = macd.macd()
    df["MACD_SIGNAL"] = macd.macd_signal()

    # ---------------------
    # Daily Return
    # ---------------------

    df["Returns"] = df["Close"].pct_change()

    # ---------------------
    # Remove NaNs
    # ---------------------

    df.dropna(inplace=True)

    output_path = os.path.join(
        PROCESSED_DATA_DIR,
        file
    )

    df.to_csv(output_path, index=False)

    print(f"Saved -> {output_path}")

print("Feature engineering completed.")