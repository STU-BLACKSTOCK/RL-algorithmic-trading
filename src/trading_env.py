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
        self.lookback_window = 30

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
        self.action_space = spaces.Discrete(5)

        obs_size = (
            self.lookback_window *
            n_features
        ) + 2

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

        start = (
            self.current_step -
            self.lookback_window
        )

        end = self.current_step

        market_window = self.df.loc[
            start:end - 1,
            self.feature_columns
        ].values

        market_window = market_window.flatten()

        current_price = self._get_current_price()

        portfolio_value = max(
            self.portfolio_value,
            1e-8
        )

        cash_ratio = (
            self.cash /
            portfolio_value
        )

        position_ratio = (
            self.shares_held *
            current_price
        ) / portfolio_value

        obs = np.concatenate([

            market_window,

            np.array([
                cash_ratio,
                position_ratio
            ])

        ])

        return obs.astype(np.float32)

    def reset(self, seed=None, options=None):
        """Reset environment"""

        super().reset(seed=seed)

        
        self.current_step = self.lookback_window

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

        # HOLD
        if action == 0:
            pass

        elif action == 1:

            budget = self.cash * 0.25

            shares_to_buy = int(
                budget //
                (current_price * (1 + self.transaction_cost))
            )

            if shares_to_buy > 0:

                cost = shares_to_buy * current_price

                fee = cost * self.transaction_cost

                self.cash -= (cost + fee)

                self.shares_held += shares_to_buy

                self.trade_count += 1

        elif action == 2:

            shares_to_buy = int(
            self.cash //
            (current_price * (1 + self.transaction_cost))
            )

            if shares_to_buy > 0:

                cost = shares_to_buy * current_price

                fee = cost * self.transaction_cost

                self.cash -= (cost + fee)

                self.shares_held += shares_to_buy

                self.trade_count += 1

        elif action == 3:

            shares_to_sell = int(
            self.shares_held * 0.25
        )

            if shares_to_sell > 0:

                revenue = shares_to_sell * current_price

                fee = revenue * self.transaction_cost

                self.cash += (revenue - fee)

                self.shares_held -= shares_to_sell

                self.trade_count += 1

        elif action == 4:

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