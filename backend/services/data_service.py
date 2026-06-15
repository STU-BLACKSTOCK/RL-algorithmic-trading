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