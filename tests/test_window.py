import pandas as pd

from trading_env import TradingEnv

df = pd.read_csv(
    "../data/train/AAPL.csv"
)

env = TradingEnv(df)

obs, info = env.reset()

print(obs.shape)