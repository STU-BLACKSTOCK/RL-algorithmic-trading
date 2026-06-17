import os

import pandas as pd

from backend.config import (
    TEST_DATA_DIR,
    FEATURE_COLUMNS,
)


class DataService:

    def get_latest_data(
        self,
        ticker
    ):

        path = os.path.join(
            TEST_DATA_DIR,
            f"{ticker}.csv"
        )

        if not os.path.exists(path):

            raise FileNotFoundError(
                f"No data file found for {ticker} at {path}"
            )

        df = pd.read_csv(path)

        return df

    def get_latest_indicators(
        self,
        ticker
    ):

        df = self.get_latest_data(
            ticker
        )

        latest = df.iloc[-1]

        return {

            "ticker":
                ticker,

            "close":
                float(
                    latest["Raw_Close"]
                ),

            "rsi":
                float(
                    latest["RSI"]
                ),

            "macd":
                float(
                    latest["MACD"]
                ),

            "sma20":
                float(
                    latest["SMA20"]
                ),

            "sma50":
                float(
                    latest["SMA50"]
                )
        }

    @staticmethod
    def get_feature_columns():

        return FEATURE_COLUMNS.copy()
