from fastapi import APIRouter
from app.ingestion.coingecko_service import get_eth_price

router = APIRouter()

@router.get("/eth-price")
def eth_price():
    return get_eth_price()