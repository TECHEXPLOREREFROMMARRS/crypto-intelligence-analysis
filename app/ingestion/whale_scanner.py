from app.blockchain.ethereum_service import (
    get_latest_block,
    get_block_with_transactions
)

from app.alerts.whale_detector import detect_whales
from app.database.connection import SessionLocal
from app.database.crud import insert_whale_transaction


def scan_latest_block():

    db = SessionLocal()

    latest_block = get_latest_block()

    block = get_block_with_transactions(latest_block)

    whales = detect_whales(block)

    coin = "ethereum"

    for whale in whales:
        try:
            insert_whale_transaction(db, whale, coin)
        except Exception as e:
         print(e)

    db.close()

    return whales