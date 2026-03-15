from fastapi import APIRouter
from app.blockchain.ethereum_service import is_connected, get_latest_block

router = APIRouter(prefix="/ethereum", tags=["Ethereum"])


@router.get("/status")
def ethereum_status():

    return {
        "connected": is_connected(),
        "latest_block": get_latest_block()
    }