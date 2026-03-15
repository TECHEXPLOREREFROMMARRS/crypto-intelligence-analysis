from fastapi import APIRouter
from app.ingestion.market_collector import collect_market_data

router = APIRouter()


@router.post("/collect-market-data")
def collect():
    collect_market_data()
    return {"status": "market data collected"}
