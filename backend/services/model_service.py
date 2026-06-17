import os

import numpy as np
from stable_baselines3 import PPO

from backend.config import (
    DEFAULT_MODEL_NAME,
    DEFAULT_MODEL_PATH,
    FEATURE_COLUMNS,
    INITIAL_CASH,
    LOOKBACK_WINDOW,
    resolve_model_path,
)
from backend.services.data_service import DataService
from backend.database.prediction_repository import PredictionRepository


class ModelService:

    def __init__(self):

        self.model_path = DEFAULT_MODEL_PATH
        self.model_name = DEFAULT_MODEL_NAME
        self.lookback_window = LOOKBACK_WINDOW
        self.action_space = 5
        self.initial_cash = INITIAL_CASH

        self.repo = PredictionRepository()
        self.data_service = DataService()

        self.model = None
        self.loaded = False
        self.load_error = None

        self._load_model()

    def _load_model(self):

        resolved_path = resolve_model_path(
            DEFAULT_MODEL_NAME
        )

        if not resolved_path:

            self.model_path = DEFAULT_MODEL_PATH
            self.load_error = (
                f"Model not found at {DEFAULT_MODEL_PATH} "
                f"or {DEFAULT_MODEL_PATH}.zip. "
                "Run: python src/train_improved.py"
            )

            print(
                f"WARNING: {self.load_error}"
            )

            return

        self.model_path = resolved_path

        try:

            self.model = PPO.load(
                self.model_path
            )

            self.loaded = True
            self.load_error = None

        except Exception as error:

            self.load_error = str(error)

            print(
                f"WARNING: Failed to load model: {error}"
            )

    def get_model_info(self):

        return {
            "model": self.model_name,
            "lookback_window": self.lookback_window,
            "action_space": self.action_space,
            "loaded": self.loaded,
            "error": self.load_error,
        }

    def predict_action(
        self,
        ticker
    ):

        if not self.loaded or self.model is None:

            raise RuntimeError(
                self.load_error
                or "Model is not loaded."
            )

        observation = self.build_observation(
            ticker
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
            4: "SELL_100",
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

        market_data = latest_rows[
            FEATURE_COLUMNS
        ].values.flatten()

        # Match training env: cash_ratio and position_ratio
        # Fresh portfolio = 100% cash, 0% position
        cash_ratio = 1.0
        position_ratio = 0.0

        observation = np.concatenate([
            market_data,
            np.array([
                cash_ratio,
                position_ratio,
            ], dtype=np.float32),
        ])

        return observation.astype(
            np.float32
        )

    def get_dashboard_data(self):

        return self.get_model_info()

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

        if self.loaded:

            action = self.predict_action(
                ticker
            )

            analysis["prediction"] = (
                self.action_to_text(action)
            )

        else:

            analysis["prediction"] = "UNAVAILABLE"
            analysis["model_error"] = self.load_error

        return analysis

    def get_prediction_history(
        self
    ):

        rows = self.repo.get_history()

        history = []

        for row in rows:

            history.append({
                "id": row[0],
                "ticker": row[1],
                "action": row[2],
                "created_at": row[3],
            })

        return history
