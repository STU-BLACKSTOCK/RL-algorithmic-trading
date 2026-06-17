import json
import os
from typing import Any

from backend.config import (
    ANALYTICS_METRICS_PATH,
    INITIAL_CASH,
    MODELS_DIR,
    RESULTS_DIR,
    resolve_model_path,
)

# Historical baseline from early experiments (no checkpoint in repo)
LEGACY_PPO_V1 = {
    "name": "PPO v1",
    "portfolio": 14467,
    "sharpe": 0.86,
    "drawdown": -33.0,
    "returnPct": 44.67,
    "source": "legacy",
}


FALLBACK_MODELS = [
    LEGACY_PPO_V1,
    {
        "name": "PPO v7",
        "portfolio": 11380,
        "sharpe": 0.61,
        "drawdown": -8.0,
        "returnPct": 13.8,
        "source": "legacy",
    },
    {
        "name": "MultiStock v1",
        "portfolio": 10000,
        "sharpe": 0.0,
        "drawdown": 0.0,
        "returnPct": 0.0,
        "source": "legacy",
    },
]


FALLBACK_EQUITY = [
    {"day": "W1", "PPO v1": 10200, "PPO v7": 10100, "MultiStock v1": 10000},
    {"day": "W2", "PPO v1": 10800, "PPO v7": 10300, "MultiStock v1": 10050},
    {"day": "W3", "PPO v1": 11200, "PPO v7": 10600, "MultiStock v1": 9980},
    {"day": "W4", "PPO v1": 12100, "PPO v7": 10900, "MultiStock v1": 10020},
    {"day": "W5", "PPO v1": 13500, "PPO v7": 11200, "MultiStock v1": 10000},
    {"day": "W6", "PPO v1": 14467, "PPO v7": 11380, "MultiStock v1": 10000},
]


class AnalyticsService:

    def _load_metrics_file(self) -> dict[str, Any] | None:

        if not os.path.exists(ANALYTICS_METRICS_PATH):

            return None

        with open(
            ANALYTICS_METRICS_PATH,
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(file)

    def get_analytics(self) -> dict[str, Any]:

        metrics_file = self._load_metrics_file()

        if metrics_file:

            return {
                "models": metrics_file.get(
                    "models",
                    FALLBACK_MODELS,
                ),
                "equity_curve": metrics_file.get(
                    "equity_curve",
                    FALLBACK_EQUITY,
                ),
                "initial_capital": metrics_file.get(
                    "initial_capital",
                    INITIAL_CASH,
                ),
                "source": "evaluated",
                "metrics_path": ANALYTICS_METRICS_PATH,
            }

        return {
            "models": FALLBACK_MODELS,
            "equity_curve": FALLBACK_EQUITY,
            "initial_capital": INITIAL_CASH,
            "source": "fallback",
            "metrics_path": None,
            "hint": (
                "Run 'cd src && python evaluate_all_models.py' "
                "after training to refresh live metrics."
            ),
        }

    def get_available_models(self) -> list[str]:

        if not os.path.isdir(MODELS_DIR):

            return []

        models = []

        for entry in os.listdir(MODELS_DIR):

            path = os.path.join(MODELS_DIR, entry)

            if entry.endswith(".zip"):

                models.append(entry.replace(".zip", ""))

            elif os.path.isdir(path):

                resolved = resolve_model_path(entry)

                if resolved:

                    models.append(entry)

        best = resolve_model_path(
            "best_model",
            os.path.join(MODELS_DIR, "best"),
        )

        if best:

            models.append("best/best_model")

        return sorted(set(models))
