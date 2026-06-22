import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.model_routes import router as model_router
from backend.routes.paper_trading_routes import (
    router as paper_trading_router,
)
from backend.database.schema import init_db


def get_cors_origins() -> list[str]:

    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173",
    )

    return [
        origin.strip()
        for origin in raw.split(",")
        if origin.strip()
    ]


@asynccontextmanager
async def lifespan(app: FastAPI):

    init_db()

    yield


app = FastAPI(
    title="RL Trading API",
    version="1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    model_router,
    prefix="/api",
)

app.include_router(
    paper_trading_router,
    prefix="/api",
)


@app.get("/")
def home():

    return {
        "message": "RL Trading API Running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }
