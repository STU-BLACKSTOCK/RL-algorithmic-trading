import pandas as pd

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

import os

df = pd.read_csv(
    "../data/test/AAPL.csv"
)

initial_cash = 10000

buy_price = df.iloc[0]["Raw_Close"]

shares = int(initial_cash // buy_price)

remaining_cash = (
    initial_cash -
    shares * buy_price
)

portfolio_values = []

for _, row in df.iterrows():

    value = (
        remaining_cash +
        shares * row["Raw_Close"]
    )

    portfolio_values.append(value)

print(
    "Buy & Hold Final Value:",
    portfolio_values[-1]
)

os.makedirs(
    "../results",
    exist_ok=True
)

plt.figure(figsize=(12,6))

plt.plot(
    portfolio_values
)

plt.title(
    "Buy and Hold Strategy"
)

plt.xlabel(
    "Trading Days"
)

plt.ylabel(
    "Portfolio Value"
)

plt.grid()

plt.savefig(
    "../results/buy_hold_curve.png",
    bbox_inches="tight"
)