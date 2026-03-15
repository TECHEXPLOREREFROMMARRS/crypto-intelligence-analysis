import joblib
from app.features.feature_engineering import build_dataset

model = joblib.load("volatility_model.pkl")

def predict_volatility(coin="ethereum"):

    df = build_dataset(coin)

    if df.empty:
        return {"predicted_price_change": 0}

    df = df.dropna()

    latest = df.tail(1)

    X = latest[["price", "amount_eth"]]

    prediction = model.predict(X)

    return {
        "predicted_price_change": float(prediction[0])
    }