import requests
from datetime import datetime
from fastapi import HTTPException
from app.database.connection import SessionLocal
from app.database.crud import get_token_by_name, create_token, insert_market_data

def import_historical_data(coin):

    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"

    params = {
        "vs_currency": "usd",
        "days": 30
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="Coin not supported or invalid CoinGecko ID"
        )

    data = response.json()

    db = SessionLocal()

    token = get_token_by_name(db, coin)

    if not token:
        token = create_token(db, coin, coin.upper())

    prices = data.get("prices", [])

    if not prices:
        raise HTTPException(
            status_code=400,
            detail="No market data available for this coin"
        )

    for price_point in prices:

        timestamp = datetime.fromtimestamp(price_point[0] / 1000)
        price = price_point[1]

        insert_market_data(db, token.id, price)

    db.close()

    return {
        "status": "success",
        "coin": coin,
        "rows_imported": len(prices)
    }