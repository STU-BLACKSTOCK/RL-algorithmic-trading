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

        # Features used by the agent
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

        # Actions: 0 = Hold, 1 = Buy, 2 = Sell
        self.action_space = spaces.Discrete(3)

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

        self.trade_count = 0

        self.portfolio_history = [initial_cash]

    def _get_observation(self):
        """Create observation vector"""

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
        """Reset environment"""

        super().reset(seed=seed)

        
        self.current_step = 0

        self.cash = self.initial_cash
        self.shares_held = 0
        self.portfolio_value = self.initial_cash
        self.trade_count = 0
        self.portfolio_history = [self.initial_cash]

        observation = self._get_observation()
        info = {}

        return observation, info

    def _get_current_price(self):   
        """Get current stock price"""

        return self.df.loc[
            self.current_step,
            "Raw_Close"
        ]

    def step(self, action):
        """Execute one trading action"""

        assert self.action_space.contains(
            action
        ), f"Invalid action: {action}"

        current_price = self._get_current_price()

        previous_portfolio_value = self.portfolio_value

        # BUY
        if action == 1:

            max_shares = int(
                self.cash //
                (current_price * (1 + self.transaction_cost))
            )

            if max_shares > 0:

                cost = max_shares * current_price

                fee = cost * self.transaction_cost

                total_cost = cost + fee

                self.cash -= total_cost

                self.shares_held += max_shares

                self.trade_count += 1

        # SELL
        elif action == 2:

            if self.shares_held > 0:

                revenue = (
                    self.shares_held *
                    current_price
                )

                fee = (
                    revenue *
                    self.transaction_cost
                )

                self.cash += (
                    revenue - fee
                )

                self.shares_held = 0
                self.trade_count += 1

        # HOLD
        else:
            pass

        # Move to next timestep
        self.current_step += 1

        terminated = (
            self.current_step >=
            len(self.df) - 1
        )

        truncated = False

        next_price = self._get_current_price()

        # Update portfolio value
        self.portfolio_value = (
            self.cash +
            self.shares_held * next_price
        )

        self.portfolio_history.append(
            self.portfolio_value
        )

        # Reward = change in portfolio value
        reward = (
            self.portfolio_value -
            previous_portfolio_value
        ) / previous_portfolio_value

        observation = self._get_observation()

        info = {
            "portfolio_value": self.portfolio_value,
            "cash": self.cash,
            "shares_held": self.shares_held,
            "trade_count": self.trade_count
        }

        return (
            observation,
            reward,
            terminated,
            truncated,
            info
        )

    def render(self):

        print(
            f"Step: {self.current_step} | "
            f"Cash: {self.cash:.2f} | "
            f"Shares: {self.shares_held} | "
            f"Portfolio: {self.portfolio_value:.2f} | "
            f"Trades: {self.trade_count}"
        )