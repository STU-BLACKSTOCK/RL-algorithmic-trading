import os
import sys

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_DIR = os.path.join(PROJECT_ROOT, "data")
TRAIN_DIR = os.path.join(DATA_DIR, "train")
VALIDATION_DIR = os.path.join(DATA_DIR, "validation")
TEST_DIR = os.path.join(DATA_DIR, "test")

MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "results")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs")

BEST_MODEL_DIR = os.path.join(MODELS_DIR, "best")
TENSORBOARD_DIR = os.path.join(LOGS_DIR, "tensorboard")

ANALYTICS_METRICS_PATH = os.path.join(
    RESULTS_DIR,
    "analytics_metrics.json",
)

DEFAULT_MODEL_NAME = "ppo_aapl_v7"


def resolve_model_path(
    model_name: str,
    models_dir: str | None = None,
) -> str | None:

    root = models_dir or MODELS_DIR

    candidates = [
        os.path.join(root, model_name),
        os.path.join(root, f"{model_name}.zip"),
    ]

    for path in candidates:

        if os.path.exists(path):

            return path

    return None


DEFAULT_MODEL_PATH = (
    resolve_model_path(DEFAULT_MODEL_NAME)
    or os.path.join(MODELS_DIR, DEFAULT_MODEL_NAME)
)

MULTISTOCK_MODEL_PATH = (
    resolve_model_path("ppo_multistock_v1")
    or os.path.join(MODELS_DIR, "ppo_multistock_v1")
)

BEST_MODEL_PATH = (
    resolve_model_path("best_model", BEST_MODEL_DIR)
    or os.path.join(BEST_MODEL_DIR, "best_model")
)

INITIAL_CASH = 10000.0
TICKERS = ["AAPL", "MSFT", "GOOGL"]

# Ensure src modules import when running from project root
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, os.path.join(PROJECT_ROOT, "src"))

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
os.makedirs(BEST_MODEL_DIR, exist_ok=True)
os.makedirs(TENSORBOARD_DIR, exist_ok=True)
