import pandas as pd
from app.database.connection import SessionLocal
from app.database.models import MarketData, WhaleTransaction, Token
from app.ml.predict import predict_volatility


def calculate_market_risk(coin="ethereum"):

    db = SessionLocal()

    token = db.query(Token).filter(Token.name == coin).first()

    if not token:
     db.close()
     return {
        "risk_score": 0,
        "risk_level": "unknown",
        "message": f"No data for {coin}"
      }

    market_data = db.query(MarketData)\
        .filter(MarketData.token_id == token.id)\
        .all()

    whales = db.query(WhaleTransaction).all()

    db.close()

    market_df = pd.DataFrame([
        {"timestamp": m.timestamp, "price": m.price}
        for m in market_data
    ])

    if market_df.empty:
        return {"error": "No market data available"}

    market_df["timestamp"] = pd.to_datetime(market_df["timestamp"])
    market_df["price_change"] = market_df["price"].pct_change()

    # remove extreme spikes
    market_df = market_df[
        (market_df["price_change"] > -0.2) &
        (market_df["price_change"] < 0.2)
    ]

    market_df = market_df.dropna()

    

    # volatility calculation
    recent_volatility = market_df["price_change"].tail(50).std()

    # whale activity
    recent = whales[-20:] if whales else []
    whale_volume = sum(w.amount_eth for w in recent) / max(len(recent), 1)

    # ML prediction
    prediction = predict_volatility(coin)["predicted_price_change"]

    # normalized scoring
    volatility_score = min(abs(recent_volatility) * 1000, 40)
    prediction_score = min(abs(prediction) * 1000, 30)
    whale_score = min(whale_volume / 50, 30)

    risk_score = int(volatility_score + prediction_score + whale_score)

    if risk_score < 30:
        level = "low"
    elif risk_score < 70:
        level = "medium"
    else:
        level = "high"

    return {
        "risk_score": risk_score,
        "risk_level": level,
        "volatility": float(recent_volatility),
        "predicted_change": float(prediction),
        "recent_whale_volume": float(whale_volume)
    }