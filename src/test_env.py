import pandas as pd

from trading_env import TradingEnv

df = pd.read_csv(
    "../data/train/AAPL.csv"
)

env = TradingEnv(df)

obs, info = env.reset()

for _ in range(5):

    action = env.action_space.sample()

    obs, reward, terminated, truncated, info = env.step(action)

    env.render()

    action_names = {
    0: "HOLD",
    1: "BUY_25",
    2: "BUY_ALL",
    3: "SELL_25",
    4: "SELL_ALL"
    }

    print(
        f"Action: {action_names[action]} | "
        f"Reward: {reward:.4f}"
    )

    print(info)

    if terminated:
        break