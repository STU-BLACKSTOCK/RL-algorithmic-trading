import pandas as pd

from stable_baselines3.common.env_checker import check_env

from multi_stock_env import (
    MultiStockTradingEnv
)

aapl = pd.read_csv(
    "../data/train/AAPL.csv"
)

msft = pd.read_csv(
    "../data/train/MSFT.csv"
)

googl = pd.read_csv(
    "../data/train/GOOGL.csv"
)

env = MultiStockTradingEnv([
    aapl,
    msft,
    googl
])

check_env(env)

print("Environment passed!")