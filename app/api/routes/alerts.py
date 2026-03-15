from fastapi import APIRouter
from app.database.connection import SessionLocal
from app.database.models import WhaleTransaction

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/whale-alerts")
def whale_alerts():

    db = SessionLocal()

    whales = db.query(WhaleTransaction)\
        .order_by(WhaleTransaction.timestamp.desc())\
        .limit(10)\
        .all()

    db.close()

    alerts = []

    for w in whales:

        alerts.append({
            "message": f"Whale transfer: {round(w.amount_eth,2)} ETH",
            "timestamp": w.timestamp
        })

    return alerts