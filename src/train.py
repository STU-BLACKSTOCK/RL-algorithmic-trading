import pandas as pd

from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env

from trading_env import TradingEnv

df = pd.read_csv(
    "../data/train/AAPL.csv"
)

env = TradingEnv(df)

check_env(env)

print("Environment validation passed.")

model = PPO(
    policy="MlpPolicy",
    env=env,
    verbose=1,
    tensorboard_log="../logs/tensorboard/"
)

model.learn(
    total_timesteps=200000
)

model.save(
    "../models/ppo_aapl_v7"
)

print("Training completed.")