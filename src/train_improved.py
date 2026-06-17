"""
Improved PPO training for AAPL (production model: ppo_aapl_v7).

Why single-stock AAPL instead of MultiStock v1?
- MultiStock randomly switches tickers each episode, making the MDP harder.
- With only 300k steps the agent often collapses to always HOLD (safe, no loss).
- AAPL-only training gives clearer reward signal and diverse buy/sell actions.
- v7 was chosen for production because it trades actively with lower drawdown (-8%)
  vs v1's higher return (+44%) but severe drawdown (-33%).

Run from project root:
    python src/train_improved.py

Or from src/:
    python train_improved.py
"""

import os
import sys

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SRC_DIR)

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback
from stable_baselines3.common.env_checker import check_env
from stable_baselines3.common.monitor import Monitor

from paths import (
    BEST_MODEL_DIR,
    DEFAULT_MODEL_PATH,
    TENSORBOARD_DIR,
    TRAIN_DIR,
    VALIDATION_DIR,
)
from trading_env import TradingEnv


def load_csv(ticker: str, split: str) -> pd.DataFrame:

    split_dirs = {
        "train": TRAIN_DIR,
        "validation": VALIDATION_DIR,
    }

    path = os.path.join(
        split_dirs[split],
        f"{ticker}.csv",
    )

    return pd.read_csv(path)


def main():

    print("=" * 60)
    print("Improved PPO Training — AAPL (ppo_aapl_v7)")
    print("=" * 60)

    train_df = load_csv("AAPL", "train")
    val_df = load_csv("AAPL", "validation")

    train_env = Monitor(
        TradingEnv(train_df)
    )

    val_env = Monitor(
        TradingEnv(val_df)
    )

    check_env(
        TradingEnv(train_df)
    )

    print("Environment validation passed.")

    model = PPO(
        policy="MlpPolicy",
        env=train_env,
        learning_rate=3e-4,
        n_steps=2048,
        batch_size=64,
        n_epochs=10,
        gamma=0.99,
        gae_lambda=0.95,
        clip_range=0.2,
        ent_coef=0.02,
        vf_coef=0.5,
        max_grad_norm=0.5,
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
        best_model_save_path=BEST_MODEL_DIR,
        log_path=os.path.join(
            os.path.dirname(TENSORBOARD_DIR),
            "eval",
        ),
        eval_freq=10_000,
        n_eval_episodes=1,
        deterministic=True,
        render=False,
    )

    total_timesteps = 500_000

    print(f"\nTraining for {total_timesteps:,} timesteps...")
    print(f"Validation eval every 10,000 steps.")
    print(f"TensorBoard: tensorboard --logdir logs/tensorboard\n")

    model.learn(
        total_timesteps=total_timesteps,
        callback=eval_callback,
        progress_bar=True,
    )

    model.save(DEFAULT_MODEL_PATH)

    print("\n" + "=" * 60)
    print("Training complete!")
    print(f"  Final model:  {DEFAULT_MODEL_PATH}")
    print(f"  Best model:   {BEST_MODEL_DIR}")
    print("\nNext steps:")
    print("  1. python src/evaluate_all_models.py")
    print("  2. uvicorn backend.app:app --reload  (from project root)")
    print("=" * 60)


if __name__ == "__main__":

    main()
