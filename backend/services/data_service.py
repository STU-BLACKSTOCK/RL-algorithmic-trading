import pandas as pd


class DataService:

    def get_latest_data(
        self,
        ticker
    ):

        path = (
            f"data/test/{ticker}.csv"
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