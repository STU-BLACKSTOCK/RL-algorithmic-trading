"""
Optional MultiStock training — expect more HOLD actions unless timesteps are increased.

Run from project root:
    python src/train_multistock_improved.py
"""

import os
import sys

SRC_DIR = os.path.dirname(os.path.abspath(__file__))

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback
from stable_baselines3.common.env_checker import check_env
from stable_baselines3.common.monitor import Monitor

from paths import (
    MULTISTOCK_MODEL_PATH,
    TENSORBOARD_DIR,
    TRAIN_DIR,
    VALIDATION_DIR,
)
from multi_stock_env import MultiStockTradingEnv
from trading_env import TradingEnv


def load_csv(ticker: str, split: str) -> pd.DataFrame:

    split_dir = TRAIN_DIR if split == "train" else VALIDATION_DIR

    return pd.read_csv(
        os.path.join(split_dir, f"{ticker}.csv")
    )


def main():

    print("=" * 60)
    print("MultiStock PPO Training (ppo_multistock_v1)")
    print("=" * 60)

    stocks = [
        ("AAPL", load_csv("AAPL", "train")),
        ("MSFT", load_csv("MSFT", "train")),
        ("GOOGL", load_csv("GOOGL", "train")),
    ]

    env = Monitor(
        MultiStockTradingEnv(stocks)
    )

    val_env = Monitor(
        TradingEnv(
            load_csv("AAPL", "validation")
        )
    )

    check_env(MultiStockTradingEnv(stocks))

    model = PPO(
        policy="MlpPolicy",
        env=env,
        learning_rate=3e-4,
        n_steps=2048,
        batch_size=128,
        n_epochs=10,
        gamma=0.99,
        ent_coef=0.05,
        policy_kwargs={
            "net_arch": {
                "pi": [256, 256],
                "vf": [256, 256],
            }
        },
        verbose=1,
        tensorboard_log=TENSORBOARD_DIR,
    )

    eval_callback = EvalCallback(
        val_env,
        eval_freq=15_000,
        n_eval_episodes=1,
        deterministic=True,
    )

    model.learn(
        total_timesteps=750_000,
        callback=eval_callback,
        progress_bar=True,
    )

    model.save(MULTISTOCK_MODEL_PATH)

    print(f"\nSaved to {MULTISTOCK_MODEL_PATH}")
    print("Run: python src/evaluate_all_models.py")


if __name__ == "__main__":

    main()
