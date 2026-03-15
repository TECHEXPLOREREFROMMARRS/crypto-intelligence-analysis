from fastapi import APIRouter, Query
from app.analytics.market_risk import calculate_market_risk

router = APIRouter(prefix="/alerts", tags=["Risk"])


@router.get("/market-risk")
def market_risk(coin: str = Query("ethereum")):
    return calculate_market_risk(coin)