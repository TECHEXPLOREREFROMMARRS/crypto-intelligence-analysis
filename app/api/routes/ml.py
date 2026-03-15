from fastapi import APIRouter
from app.ml.train_model import train_model

router = APIRouter(prefix="/ml", tags=["Machine Learning"])


@router.get("/train")
def train():
    try:
        result = train_model()
        return result
    except Exception as e:
        return {"error": str(e)}