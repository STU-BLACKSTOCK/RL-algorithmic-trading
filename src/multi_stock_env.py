import random

from trading_env import TradingEnv


class MultiStockTradingEnv(TradingEnv):

    def __init__(self, stocks):

        self.stocks = stocks

        stock_name, stock_df = random.choice(
            self.stocks
        )

        self.current_stock = stock_name

        super().__init__(stock_df)

    def reset(
        self,
        seed=None,
        options=None
    ):

        stock_name, stock_df = random.choice(
            self.stocks
        )

        self.current_stock = stock_name

        self.df = stock_df.reset_index(
            drop=True
        )

        print(
            f"Episode started on {self.current_stock}"
        )

        return super().reset(
            seed=seed,
            options=options
        )