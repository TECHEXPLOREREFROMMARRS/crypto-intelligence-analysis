from fastapi import APIRouter ,Query
from app.ingestion.historical_importer import import_historical_data

router = APIRouter(prefix="/import", tags=["Data Import"])


@router.post("/historical")
def import_coin_data(coin: str = Query(..., description="Coin id from CoinGecko")):
    return import_historical_data(coin)