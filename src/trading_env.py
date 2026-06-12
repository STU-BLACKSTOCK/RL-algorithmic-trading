import gymnasium as gym
import numpy as np
import pandas as pd

from gymnasium import spaces

class TradingEnv(gym.Env):

    metadata = {"render_modes": ["human"]}

    def __init__(
        self,
        df,
        initial_cash=10000,
        transaction_cost=0.001
    ):
        super().__init__()

        self.df = df.reset_index(drop=True)

        self.initial_cash = initial_cash
        self.transaction_cost = transaction_cost

        self.feature_columns = [
            "Close",
            "High",
            "Low",
            "Open",
            "Volume",
            "SMA20",
            "SMA50",
            "EMA20",
            "RSI",
            "MACD",
            "MACD_SIGNAL",
            "Returns"
        ]

        n_features = len(self.feature_columns)

        self.action_space = spaces.Discrete(3) # Hold, Buy, Sell

        obs_size = n_features + 2
        self.observation_space = spaces.Box(
            low=-np.inf,
            high=np.inf,
            shape=(obs_size,),
            dtype=np.float32
        )

        self.current_step = 0
        self.cash = initial_cash
        self.shares_held = 0
        self.portfolio_value = initial_cash

    def _get_observation(self):
        market_data = self.df.loc[
            self.current_step,
            self.feature_columns
        ].values
        
        obs = np.concatenate([
        market_data,
        np.array([
            self.cash,
            self.shares_held
            ])
        ])
        return obs.astype(np.float32)

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        self.current_step = 0
        self.cash = self.initial_cash
        self.shares_held = 0
        self.portfolio_value = self.initial_cash

        observation = self._get_observation()
        info = {}
        return observation, info
