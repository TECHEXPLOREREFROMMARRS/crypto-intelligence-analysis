from sqlalchemy.orm import Session
from app.database.models import Token, MarketData, WhaleTransaction


def get_token_by_name(db: Session, name: str):
    return db.query(Token).filter(Token.name == name).first()


def create_token(db: Session, name: str, symbol: str):
    token = Token(name=name, symbol=symbol)
    db.add(token)
    db.commit()
    db.refresh(token)
    return token


def insert_market_data(db: Session, token_id: int, price: float):
    market = MarketData(
        token_id=token_id,
        price=price
    )

    db.add(market)
    db.commit()


def insert_whale_transaction(db, whale, coin):

    token = db.query(Token).filter(Token.name == coin).first()

    if not token:
        return

    record = WhaleTransaction(
        token_id=token.id,
        tx_hash=whale.get("hash"),
        sender=whale.get("from"),
        receiver=whale.get("to"),
        amount_eth=whale.get("amount_eth"),
        timestamp=whale.get("timestamp")
    )

    db.add(record)
    db.commit()