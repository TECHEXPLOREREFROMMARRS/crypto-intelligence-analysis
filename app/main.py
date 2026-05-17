from fastapi import FastAPI
from database.connection import engine
from database.models import Base
from api.routes import collector
from api.routes import ethereum
from api.routes import whales
from services.scheduler import start_scheduler
from fastapi.middleware.cors import CORSMiddleware
from api.routes import ml
from api.routes import importer
from api.routes import predict
from api.routes import analytics
from api.routes import risk
from api.routes import whale_history
from api.routes import price_history
from api.routes import alerts
from api.routes import tokens

app = FastAPI(title="Crypto Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(whales.router)

Base.metadata.create_all(bind=engine)

start_scheduler()

# routes
app.include_router(collector.router)
app.include_router(ethereum.router)
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