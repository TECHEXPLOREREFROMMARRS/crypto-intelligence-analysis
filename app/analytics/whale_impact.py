import pandas as pd
from app.database.connection import SessionLocal
from app.database.models import MarketData, WhaleTransaction, Token


def calculate_whale_impact(coin="ethereum"):

    print("Whale impact requested for:", coin)

    db = SessionLocal()

    token = db.query(Token).filter(Token.name == coin).first()

    if not token:
        db.close()
        return {"whale_price_correlation": 0, "rows_analyzed": 0}

    market_data = db.query(MarketData)\
        .filter(MarketData.token_id == token.id)\
        .all()

    whales = db.query(WhaleTransaction)\
        .filter(WhaleTransaction.token_id == token.id)\
        .all()

    db.close()

    # convert market data
    market_df = pd.DataFrame([
        {"timestamp": m.timestamp, "price": m.price}
        for m in market_data
    ])

    # convert whale data
    whale_df = pd.DataFrame([
        {"timestamp": w.timestamp, "amount_eth": w.amount_eth}
        for w in whales
    ])

    if market_df.empty:
        return {"error": "No market data available"}

    market_df["timestamp"] = pd.to_datetime(market_df["timestamp"]).dt.floor("min")

    if whale_df.empty:
        return {
            "whale_price_correlation": 0,
            "rows_analyzed": len(market_df),
            "whale_data_available": False
        }

    whale_df["timestamp"] = pd.to_datetime(whale_df["timestamp"])

    # aggregate whale transactions per minute
    whale_df = whale_df.groupby(
        pd.Grouper(key="timestamp", freq="1min")
    ).sum().reset_index()

    # merge whale + market
    market_df = market_df.merge(
        whale_df,
        how="left",
        on="timestamp"
    )

    market_df["amount_eth"] = market_df["amount_eth"].fillna(0)

    # compute future price change (5-minute lag)
    market_df["future_price_change"] = market_df["price"].pct_change().shift(-5)

    # remove NaN rows
    market_df = market_df.dropna()

    if len(market_df) < 5:
        return {"error": "Not enough rows for analysis"}

    print("Whale nonzero rows:", (market_df["amount_eth"] > 0).sum())

    # calculate lagged correlation
    correlation = market_df["amount_eth"].corr(market_df["future_price_change"])

    if pd.isna(correlation):
        correlation = 0

    return {
        "whale_price_correlation": float(correlation),
        "rows_analyzed": len(market_df),
        "whale_data_available": True
    }