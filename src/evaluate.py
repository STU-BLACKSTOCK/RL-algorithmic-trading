import os
from collections import Counter

import pandas as pd

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
from stable_baselines3 import PPO
from metrics import *

from trading_env import TradingEnv


# Load trained model
model = PPO.load(
    "../models/ppo_aapl_v7"
)

# Load test data
df = pd.read_csv(
    "../data/test/AAPL.csv"
)

# Create environment
env = TradingEnv(df)

# Reset environment
obs, info = env.reset()

portfolio_values = []
rewards = []
actions_taken = []

terminated = False
truncated = False

# Run evaluation
while not (terminated or truncated):

    action, _ = model.predict(
        obs,
        deterministic=True
    )

    obs, reward, terminated, truncated, info = env.step(
        action
    )

    portfolio_values.append(
        info["portfolio_value"]
    )

    rewards.append(
        reward
    )

    actions_taken.append(
        int(action)
    )

returns = (
    pd.Series(portfolio_values)
    .pct_change()
    .dropna()
)

# Results
print("\nAction Distribution:")
print(
    Counter(actions_taken)
)

print("\nEvaluation Complete")

print(
    "Final Portfolio Value:",
    portfolio_values[-1]
)


# Count actions
hold_count = actions_taken.count(0)

buy25_count = actions_taken.count(1)
buy100_count = actions_taken.count(2)

sell25_count = actions_taken.count(3)
sell100_count = actions_taken.count(4)

# Print results
print("\nAction Counts")
print("HOLD      :", hold_count)
print("BUY 25%   :", buy25_count)
print("BUY 100%  :", buy100_count)
print("SELL 25%  :", sell25_count)
print("SELL 100% :", sell100_count)

print("\n===== PERFORMANCE =====")

print(
    "Cumulative Return:",
    cumulative_return(
        10000,
        portfolio_values[-1]
    )
)

print(
    "Annualized Return:",
    annualized_return(
        10000,
        portfolio_values[-1],
        len(portfolio_values)
    )
)

print(
    "Volatility:",
    annualized_volatility(
        returns
    )
)

print(
    "Sharpe Ratio:",
    sharpe_ratio(
        returns
    )
)

print(
    "Max Drawdown:",
    max_drawdown(
        portfolio_values
    )
)

# Plot portfolio value
plt.figure(figsize=(12, 6))

plt.plot(portfolio_values)

plt.title(
    "RL Agent Portfolio Value"
)

plt.xlabel(
    "Trading Days"
)

plt.ylabel(
    "Portfolio Value"
)

plt.grid()

# Create results folder
os.makedirs(
    "../results",
    exist_ok=True
)

# Save graph
plt.savefig(
    "../results/equity_curve.png",
    bbox_inches="tight"
)

print(
    "Graph saved to results/equity_curve.png"
)