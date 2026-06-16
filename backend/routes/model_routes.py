from fastapi import APIRouter

from backend.services.model_service import (
    ModelService
)

from backend.schemas.prediction_schema import (
    PredictionRequest
)

router = APIRouter()

service = ModelService()


@router.get("/model-info")
def get_model_info():

    return service.get_model_info()


@router.get("/dashboard")
def dashboard():

    return (
        service.get_dashboard_data()
    )


@router.post("/predict")
def predict(
    request: PredictionRequest
):

    action = (
        service.predict_action(
            request.ticker
        )
    )

    return {
        "ticker":
            request.ticker,
        "action":
            service.action_to_text(
                action
            ),
        "model": "ppo_aapl_v7"
    }