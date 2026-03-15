from app.ingestion.coingecko_service import get_market_prices
from app.database.connection import SessionLocal
from app.database.crud import get_token_by_name, create_token, insert_market_data

SYMBOLS = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "solana": "SOL",
    "polygon": "MATIC",
    "chainlink": "LINK"
}


def collect_market_data():
    db = SessionLocal()

    prices = get_market_prices()

    for token_name, data in prices.items():

        token = get_token_by_name(db, token_name)

        if not token:
            token = create_token(db, token_name, SYMBOLS[token_name])

        price = data["usd"]

        insert_market_data(db, token.id, price)

    db.close()