import pandas as pd

from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env

from trading_env import TradingEnv

aapl = pd.read_csv(
    "../data/train/AAPL.csv"
)

msft = pd.read_csv(
    "../data/train/MSFT.csv"
)

googl = pd.read_csv(
    "../data/train/GOOGL.csv"
)

from multi_stock_env import (
    MultiStockTradingEnv
)

stocks = [
    ("AAPL", aapl),
    ("MSFT", msft),
    ("GOOGL", googl)
]

env = MultiStockTradingEnv(stocks)

check_env(env)

print("Environment validation passed.")

model = PPO(
    policy="MlpPolicy",
    env=env,
    verbose=1,
    tensorboard_log="../logs/tensorboard/"
)

model.learn(
    total_timesteps=300000
)

model.save(
    "../models/ppo_multistock_v1"
)

print("Training completed.")