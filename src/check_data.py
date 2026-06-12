import pandas as pd

df = pd.read_csv("../data/processed/AAPL.csv")

print(df.head())

print("\nShape:")
print(df.shape)

print("\nMissing Values:")
print(df.isnull().sum())