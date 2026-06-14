from fastapi import FastAPI

from backend.routes.model_routes import (
    router as model_router
)

app = FastAPI(
    title="RL Trading API",
    version="1.0"
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