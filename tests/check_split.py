import pandas as pd

train = pd.read_csv("../data/train/AAPL.csv")
val = pd.read_csv("../data/validation/AAPL.csv")
test = pd.read_csv("../data/test/AAPL.csv")

print("Train:", train.shape)
print("Validation:", val.shape)
print("Test:", test.shape)