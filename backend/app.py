from fastapi import FastAPI

app = FastAPI(
    title="RL Trading API",
    version="1.0"
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