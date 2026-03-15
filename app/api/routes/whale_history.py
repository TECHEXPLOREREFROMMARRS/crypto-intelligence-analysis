from fastapi import APIRouter
from app.database.connection import SessionLocal
from app.database.models import WhaleTransaction

router = APIRouter(prefix="/whales", tags=["Whales"])


@router.get("/history")
def whale_history():

    db = SessionLocal()

    whales = db.query(WhaleTransaction).order_by(
        WhaleTransaction.timestamp.desc()
    ).limit(50).all()

    db.close()

    return [
        {
            "timestamp": w.timestamp,
            "amount_eth": w.amount_eth
        }
        for w in whales
    ]