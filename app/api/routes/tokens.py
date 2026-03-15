from fastapi import APIRouter
from app.database.connection import SessionLocal
from app.database.models import Token,MarketData
from sqlalchemy import distinct

router = APIRouter()

@router.get("/tokens")
def get_tokens():

    db = SessionLocal()

    tokens = (
        db.query(Token)
        .join(MarketData, Token.id == MarketData.token_id)
        .distinct()
        .all()
    )

    db.close()

    return [
        {
            "id": t.id,
            "name": t.name,
            "symbol": t.symbol
        }
        for t in tokens
    ]