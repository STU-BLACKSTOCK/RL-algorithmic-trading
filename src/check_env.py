import pandas as pd

from stable_baselines3.common.env_checker import check_env

from trading_env import TradingEnv

df = pd.read_csv(
    "../data/train/AAPL.csv"
)

env = TradingEnv(df)

check_env(env)

print("Environment passed!")