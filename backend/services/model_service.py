from stable_baselines3 import PPO
import os
import numpy as np

from backend.services.data_service import (
    DataService
)

from backend.database.prediction_repository import (
    PredictionRepository
)

# Project root directory
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# Model path
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "ppo_aapl_v7"
)


class ModelService:

    def __init__(self):

        self.model_path = MODEL_PATH
        self.repo = PredictionRepository()

        # Load trained PPO model
        self.model = PPO.load(
            self.model_path
        )

        self.model_name = "ppo_aapl_v7"

        self.lookback_window = 30

        # Actions:
        # 0 = Hold
        # 1 = Buy 25%
        # 2 = Buy 100%
        # 3 = Sell 25%
        # 4 = Sell 100%
        self.action_space = 5
        self.data_service = (
            DataService()
        )

    def get_model_info(self):

        return {
            "model": self.model_name,
            "lookback_window": self.lookback_window,
            "action_space": self.action_space,
            "loaded": True
        }

    def predict_action(
        self,
        ticker
    ):

        obs_size = (
            self.lookback_window * 12
        ) + 2

        observation = (
            self.build_observation(
            ticker
            )
        )

        action, _ = self.model.predict(
            observation,
            deterministic=True
        )

        return int(action)

    def action_to_text(
    self,
    action
    ):

        mapping = {
            0: "HOLD",
            1: "BUY_25",
            2: "BUY_100",
            3: "SELL_25",
            4: "SELL_100"
        }

        return mapping.get(
            action,
            "UNKNOWN"
        )

    def build_observation(
    self,
    ticker
    ):

        df = self.data_service.get_latest_data(
            ticker
        )

        latest_rows = df.tail(
            self.lookback_window
        )

        feature_columns = [

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

        market_data = latest_rows[
            feature_columns
        ].values.flatten()

        observation = np.concatenate([

            market_data,

            np.array([
                10000,
                0
            ])

        ])

        return observation.astype(
            np.float32
        )

    
    def get_dashboard_data(self):

        return {
            "model": self.model_name,
            "lookback_window":
                self.lookback_window,
            "action_space":
                self.action_space,
            "loaded": True
        }

    def get_stock_analysis(
        self,
        ticker
    ):

        analysis = (
            self.data_service
            .get_latest_indicators(
                ticker
            )
        )

        action = (
            self.predict_action(
                ticker
            )
        )

        analysis[
            "prediction"
        ] = self.action_to_text(
            action
        )

        return analysis

        
    def get_prediction_history(
        self
    ):

        rows = (
            self.repo
            .get_history()
        )

        history = []

        for row in rows:

            history.append({

                "id": row[0],

                "ticker": row[1],

                "action": row[2],

                "created_at": row[3]

            })

        return history

    