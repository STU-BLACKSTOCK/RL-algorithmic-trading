import pandas as pd
import os

from sklearn.preprocessing import MinMaxScaler
import joblib

PROCESSED_DIR = "../data/processed"

TRAIN_DIR = "../data/train"
VAL_DIR = "../data/validation"
TEST_DIR = "../data/test"

os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(VAL_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

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
    "Returns"
]

files = os.listdir(PROCESSED_DIR)

for file in files:

    print(f"\nPreparing {file}")

    path = os.path.join(PROCESSED_DIR, file)

    df = pd.read_csv(path)
    df["Raw_Close"] = df["Close"]

    n = len(df)

    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    train_df = df.iloc[:train_end].copy()
    val_df = df.iloc[train_end:val_end].copy()
    test_df = df.iloc[val_end:].copy()

    scaler = MinMaxScaler()

    train_df[FEATURE_COLUMNS] = scaler.fit_transform(
        train_df[FEATURE_COLUMNS]
    )

    val_df[FEATURE_COLUMNS] = scaler.transform(
        val_df[FEATURE_COLUMNS]
    )

    test_df[FEATURE_COLUMNS] = scaler.transform(
        test_df[FEATURE_COLUMNS]
    )

    ticker = file.replace(".csv", "")

    joblib.dump(
        scaler,
        f"../data/{ticker}_scaler.pkl"
    )

    train_df.to_csv(
        os.path.join(TRAIN_DIR, file),
        index=False
    )

    val_df.to_csv(
        os.path.join(VAL_DIR, file),
        index=False
    )

    test_df.to_csv(
        os.path.join(TEST_DIR, file),
        index=False
    )

    print("Train:", len(train_df))
    print("Validation:", len(val_df))
    print("Test:", len(test_df))

print("\nDataset preparation completed.")