from stable_baselines3 import PPO
import os
import numpy as np

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

    def get_model_info(self):

        return {
            "model": self.model_name,
            "lookback_window": self.lookback_window,
            "action_space": self.action_space,
            "loaded": True
        }

    def predict_action(self):

        obs_size = (
            self.lookback_window * 12
        ) + 2

        observation = np.zeros(
            obs_size,
            dtype=np.float32
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