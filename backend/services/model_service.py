import os


class ModelService:

    def __init__(self):

        self.model_name = "ppo_aapl_v7"

        self.lookback_window = 30

        self.action_space = 5

    def get_model_info(self):

        return {
            "model": self.model_name,
            "lookback_window": self.lookback_window,
            "action_space": self.action_space
        }