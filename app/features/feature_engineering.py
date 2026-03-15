import pandas as pd
from app.database.connection import SessionLocal
from app.database.models import MarketData, WhaleTransaction, Token


def build_dataset(coin="ethereum"):

    db = SessionLocal()

    token = db.query(Token).filter(Token.name == coin).first()

    if token is None:
        db.close()
        return pd.DataFrame()

    market_data = db.query(MarketData)\
        .filter(MarketData.token_id == token.id)\
        .all()

    whales = db.query(WhaleTransaction).all()

    db.close()

    market_df = pd.DataFrame([
        {
            "timestamp": m.timestamp,
            "price": m.price
        }
        for m in market_data
    ])

    whale_df = pd.DataFrame([
        {
            "timestamp": w.timestamp,
            "amount_eth": w.amount_eth
        }
        for w in whales
    ])

    market_df["timestamp"] = pd.to_datetime(market_df["timestamp"])

    if whale_df.empty:
        market_df["amount_eth"] = 0
    else:

        whale_df["timestamp"] = pd.to_datetime(whale_df["timestamp"])

        whale_df = whale_df.groupby(
            pd.Grouper(key="timestamp", freq="1min")
        ).sum().reset_index()

        market_df = market_df.merge(
            whale_df,
            how="left",
            on="timestamp"
        )

        market_df["amount_eth"] = market_df["amount_eth"].fillna(0)

    # ---------- Feature Engineering ----------

    # price change
    market_df["price_change"] = market_df["price"].pct_change()

    # short moving average
    market_df["ma_5"] = market_df["price"].rolling(window=5).mean()

    # longer moving average
    market_df["ma_15"] = market_df["price"].rolling(window=15).mean()

    # rolling volatility
    market_df["volatility_10"] = market_df["price"].rolling(window=10).std()

    # momentum
    market_df["momentum"] = market_df["price"] - market_df["price"].shift(5)

    # whale intensity (smoothed)
    market_df["whale_ma"] = market_df["amount_eth"].rolling(window=5).mean()

    market_df = market_df.dropna()

    return market_df