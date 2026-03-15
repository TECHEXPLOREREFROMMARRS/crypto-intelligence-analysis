from fastapi import APIRouter
from app.ingestion.whale_scanner import scan_latest_block

router = APIRouter(prefix="/whales", tags=["Whales"])


@router.get("/latest")
def whale_alerts():

    whales = scan_latest_block()

    return {
        "whale_transactions": whales
    }