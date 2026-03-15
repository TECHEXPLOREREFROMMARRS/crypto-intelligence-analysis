from fastapi import APIRouter, Query
from app.database.connection import SessionLocal
from app.database.models import MarketData, Token

router = APIRouter(prefix="/market", tags=["Market"])


@router.get("/price-history")
def price_history(coin: str = Query("ethereum")):

    db = SessionLocal()

    token = db.query(Token).filter(Token.name == coin).first()

    if not token:
        db.close()
        return []

    prices = db.query(MarketData)\
        .filter(MarketData.token_id == token.id)\
        .order_by(MarketData.timestamp.asc())\
        .limit(200)\
        .all()

    db.close()

    return [
        {
            "timestamp": p.timestamp,
            "price": p.price
        }
        for p in prices
    ]