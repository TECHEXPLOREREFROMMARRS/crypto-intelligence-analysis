from fastapi import FastAPI
from app.database.connection import engine
from app.database.models import Base
from app.api.routes import collector
from app.api.routes import ethereum

from app.api.routes import whales


from app.services.scheduler import start_scheduler
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def home():
    return {"message": "Crypto Intelligence API Running"}

from app.api.routes import ml

app.include_router(ml.router)

from app.api.routes import importer

app.include_router(importer.router)


from app.api.routes import predict

app.include_router(predict.router)

from app.api.routes import analytics

app.include_router(analytics.router)

from app.api.routes import risk

app.include_router(risk.router)



from app.api.routes import whale_history
app.include_router(whale_history.router)

from app.api.routes import price_history
app.include_router(price_history.router)

from app.api.routes import alerts

app.include_router(alerts.router)

from app.api.routes import tokens

app.include_router(tokens.router)