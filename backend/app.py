from fastapi import FastAPI

from backend.routes.model_routes import (
    router as model_router
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RL Trading API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    model_router,
    prefix="/api"
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