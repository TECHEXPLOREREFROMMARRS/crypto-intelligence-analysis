from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.database.models import Base

from app.api.routes import collector
from app.api.routes import ethereum
from app.api.routes import whales
from app.api.routes import ml
from app.api.routes import importer
from app.api.routes import predict
from app.api.routes import analytics
from app.api.routes import risk
from app.api.routes import whale_history
from app.api.routes import price_history
from app.api.routes import alerts
from app.api.routes import tokens

from app.services.scheduler import start_scheduler

app = FastAPI(title="Crypto Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

start_scheduler()

# Routes
app.include_router(collector.router)
app.include_router(ethereum.router)
app.include_router(whales.router)
app.include_router(ml.router)
app.include_router(importer.router)
app.include_router(predict.router)
app.include_router(analytics.router)
app.include_router(risk.router)
app.include_router(whale_history.router)
app.include_router(price_history.router)
app.include_router(alerts.router)
app.include_router(tokens.router)


@app.get("/")
def home():
    return {"message": "Crypto Intelligence API Running"}