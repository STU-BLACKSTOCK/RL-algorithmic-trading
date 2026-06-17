"""
Evaluate all available models and write results/analytics_metrics.json
for the /api/analytics endpoint and frontend charts.

Run from project root:
    python src/evaluate_all_models.py
"""

import json
import os
import sys
from collections import Counter

SRC_DIR = os.path.dirname(os.path.abspath(__file__))

if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

import numpy as np
import pandas as pd
from stable_baselines3 import PPO

from paths import (
    ANALYTICS_METRICS_PATH,
    BEST_MODEL_PATH,
    DEFAULT_MODEL_PATH,
    INITIAL_CASH,
    MULTISTOCK_MODEL_PATH,
    RESULTS_DIR,
    TEST_DIR,
    resolve_model_path,
)
from metrics import (
    cumulative_return,
    max_drawdown,
    sharpe_ratio,
)
from trading_env import TradingEnv


LEGACY_PPO_V1 = {
    "name": "PPO v1",
    "portfolio": 14467,
    "sharpe": 0.86,
    "drawdown": -33.0,
    "returnPct": 44.67,
    "source": "legacy",
}


MODEL_CONFIGS = [
    {
        "name": "PPO v7",
        "path": DEFAULT_MODEL_PATH,
        "label": "PPO v7",
    },
    {
        "name": "MultiStock v1",
        "path": MULTISTOCK_MODEL_PATH,
        "label": "MultiStock v1",
    },
    {
        "name": "Best (validation)",
        "path": BEST_MODEL_PATH,
        "label": "Best Val Model",
    },
]


def evaluate_model(
    model_path: str,
    label: str,
    test_ticker: str = "AAPL",
) -> dict | None:

    if not model_path or not os.path.exists(model_path):

        print(f"  Skip {label}: not found at {model_path}")

        return None

    print(f"\nEvaluating {label} on {test_ticker} test data...")

    model = PPO.load(model_path)

    df = pd.read_csv(
        os.path.join(TEST_DIR, f"{test_ticker}.csv")
    )

    env = TradingEnv(df)
    obs, _ = env.reset()

    portfolio_values = [INITIAL_CASH]
    actions_taken = []

    terminated = False
    truncated = False

    while not (terminated or truncated):

        action, _ = model.predict(obs, deterministic=True)
        actions_taken.append(int(action))

        obs, _, terminated, truncated, info = env.step(int(action))

        portfolio_values.append(
            info["portfolio_value"]
        )

    returns = (
        pd.Series(portfolio_values)
        .pct_change()
        .dropna()
    )

    final_value = portfolio_values[-1]
    return_pct = cumulative_return(INITIAL_CASH, final_value) * 100
    sharpe = float(sharpe_ratio(returns))
    drawdown = float(max_drawdown(portfolio_values)) * 100

    action_counts = Counter(actions_taken)

    print(f"  Portfolio: ${final_value:,.0f}  Return: {return_pct:+.1f}%")
    print(f"  Sharpe: {sharpe:.2f}  Max DD: {drawdown:.1f}%")
    print(f"  Actions: {dict(action_counts)}")

    return {
        "name": label,
        "portfolio": round(final_value, 2),
        "sharpe": round(sharpe, 2),
        "drawdown": round(drawdown, 1),
        "returnPct": round(return_pct, 2),
        "source": "evaluated",
        "actions": {
            "HOLD": action_counts.get(0, 0),
            "BUY_25": action_counts.get(1, 0),
            "BUY_100": action_counts.get(2, 0),
            "SELL_25": action_counts.get(3, 0),
            "SELL_100": action_counts.get(4, 0),
        },
    }


def main():

    print("=" * 60)
    print("Evaluate All Models → analytics_metrics.json")
    print("=" * 60)

    os.makedirs(RESULTS_DIR, exist_ok=True)

    models = [LEGACY_PPO_V1]

    for config in MODEL_CONFIGS:

        result = evaluate_model(
            config["path"],
            config["label"],
        )

        if result:

            models.append(result)

    # Build equity curve: one row per week, one column per model
    week_labels = ["W1", "W2", "W3", "W4", "W5", "W6"]
    model_series: dict[str, list[float]] = {}

    for config in MODEL_CONFIGS:

        if not os.path.exists(config["path"]):

            continue

        model = PPO.load(config["path"])
        df = pd.read_csv(os.path.join(TEST_DIR, "AAPL.csv"))
        env = TradingEnv(df)
        obs, _ = env.reset()

        values = [INITIAL_CASH]
        terminated = False
        truncated = False

        while not (terminated or truncated):

            action, _ = model.predict(obs, deterministic=True)
            obs, _, terminated, truncated, info = env.step(int(action))
            values.append(info["portfolio_value"])

        model_series[config["label"]] = values

    equity_curve = []

    for week_index, week in enumerate(week_labels):

        row: dict = {"day": week}

        for label, values in model_series.items():

            if len(values) <= 1:

                row[label] = values[0]

                continue

            idx = int(
                week_index
                / max(len(week_labels) - 1, 1)
                * (len(values) - 1)
            )

            row[label] = round(values[idx], 2)

        if len(row) > 1:

            equity_curve.append(row)

    payload = {
        "models": models,
        "equity_curve": equity_curve,
        "initial_capital": INITIAL_CASH,
    }

    with open(ANALYTICS_METRICS_PATH, "w", encoding="utf-8") as file:

        json.dump(payload, file, indent=2)

    print(f"\nSaved metrics to {ANALYTICS_METRICS_PATH}")
    print(f"Models evaluated: {len(models)}")


if __name__ == "__main__":

    main()
