import pandas as pd

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from collections import Counter

from stable_baselines3 import PPO

from trading_env import TradingEnv

from metrics import (
    cumulative_return,
    annualized_return,
    annualized_volatility,
    sharpe_ratio,
    max_drawdown
)


def evaluate_stock(model, stock_name):

    print("\n" + "=" * 50)
    print(f"Evaluating {stock_name}")
    print("=" * 50)

    df = pd.read_csv(
        f"../data/test/{stock_name}.csv"
    )

    env = TradingEnv(df)

    obs, info = env.reset()

    terminated = False
    truncated = False

    portfolio_values = []
    actions_taken = []

    while not terminated and not truncated:

        action, _ = model.predict(
            obs,
            deterministic=True
        )

        actions_taken.append(
            int(action)
        )

        obs, reward, terminated, truncated, info = env.step(
            int(action)
        )

        portfolio_values.append(
            info["portfolio_value"]
        )

    returns = (
        pd.Series(portfolio_values)
        .pct_change()
        .dropna()
    )

    print("\nAction Distribution:")
    print(
        Counter(actions_taken)
    )

    print(
        "\nFinal Portfolio Value:",
        portfolio_values[-1]
    )

    print("\nAction Counts")

    print(
        "HOLD      :",
        actions_taken.count(0)
    )

    print(
        "BUY 25%   :",
        actions_taken.count(1)
    )

    print(
        "BUY 100%  :",
        actions_taken.count(2)
    )

    print(
        "SELL 25%  :",
        actions_taken.count(3)
    )

    print(
        "SELL 100% :",
        actions_taken.count(4)
    )

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

    plt.figure(
        figsize=(12, 6)
    )

    plt.plot(
        portfolio_values
    )

    plt.title(
        f"{stock_name} Equity Curve"
    )

    plt.xlabel(
        "Trading Days"
    )

    plt.ylabel(
        "Portfolio Value"
    )

    plt.grid()

    plt.savefig(
        f"../results/{stock_name}_equity_curve.png",
        bbox_inches="tight"
    )

    plt.close()

    print(
        f"Graph saved to results/{stock_name}_equity_curve.png"
    )


if __name__ == "__main__":

    model = PPO.load(
        "../models/ppo_multistock_v1"
    )

    stocks = [
        "AAPL",
        "MSFT",
        "GOOGL"
    ]

    for stock in stocks:

        evaluate_stock(
            model,
            stock
        )