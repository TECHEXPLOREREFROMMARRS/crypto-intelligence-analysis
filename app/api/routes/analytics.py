from fastapi import APIRouter
from app.analytics.whale_impact import calculate_whale_impact

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/whale-impact")
def whale_impact(coin: str = "ethereum"):
    return calculate_whale_impact(coin)