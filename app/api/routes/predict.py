from fastapi import APIRouter, Query
from app.ml.predict import predict_volatility

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.get("/volatility")
def volatility_prediction(coin: str = Query("ethereum")):

    return predict_volatility(coin)