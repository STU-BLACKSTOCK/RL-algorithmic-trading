import os

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_DIR = os.path.join(BASE_DIR, "data")
TEST_DATA_DIR = os.path.join(DATA_DIR, "test")
TRAIN_DATA_DIR = os.path.join(DATA_DIR, "train")
VALIDATION_DATA_DIR = os.path.join(DATA_DIR, "validation")

MODELS_DIR = os.path.join(BASE_DIR, "models")
RESULTS_DIR = os.path.join(BASE_DIR, "results")
LOGS_DIR = os.path.join(BASE_DIR, "logs")

DATABASE_PATH = os.path.join(
    BASE_DIR,
    "backend",
    "database",
    "trading.db"
)

ANALYTICS_METRICS_PATH = os.path.join(
    RESULTS_DIR,
    "analytics_metrics.json"
)

DEFAULT_MODEL_NAME = "ppo_aapl_v7"

INITIAL_CASH = 10000.0
LOOKBACK_WINDOW = 30


def resolve_model_path(
    model_name: str,
    models_dir: str | None = None,
) -> str | None:
    """Find a SB3 checkpoint saved as a folder or .zip file."""

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

FEATURE_COLUMNS = [
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
    "Returns",
]
