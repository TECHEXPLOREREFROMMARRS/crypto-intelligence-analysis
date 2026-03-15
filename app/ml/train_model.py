from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from app.features.feature_engineering import build_dataset


def train_model():

    df = build_dataset()

    print("Rows before dropna:", len(df))

    df = df.dropna()

    print("Rows after dropna:", len(df))
    # ensure whale column exists
    if "amount_eth" not in df.columns:
        df["amount_eth"] = 0

    X = df[
    [
        "price",
        "price_change",
        "ma_5",
        "ma_15",
        "volatility_10",
        "momentum",
        "amount_eth",
        "whale_ma"
    ]
]
    y = df["price_change"]

    if len(df) < 5:
        return {"message": "Not enough data to train model yet"}

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2
    )

    model = RandomForestRegressor()
    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)

    return {
        "model_score": score
    }