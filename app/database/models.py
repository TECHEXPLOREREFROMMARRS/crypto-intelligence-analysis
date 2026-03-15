from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime\

from app.database.connection import Base


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    symbol = Column(String)

    market_data = relationship("MarketData", back_populates="token")


class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"))
    price = Column(Float)
    volume = Column(Float)

    timestamp = Column(DateTime, default=datetime.utcnow)

    token = relationship("Token", back_populates="market_data")

from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime


class WhaleTransaction(Base):
    __tablename__ = "whale_transactions"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"))
    tx_hash = Column(String, unique=True)
    sender = Column(String)
    receiver = Column(String)

    amount_eth = Column(Float)

    timestamp = Column(DateTime, default=datetime.utcnow)