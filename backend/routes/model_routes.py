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

    action = service.predict_action(
        request.ticker
    )

    action_text = (
        service.action_to_text(
            action
        )
    )

    service.repo.save_prediction(
        request.ticker,
        action_text
    )

    return {
        "ticker":
            request.ticker,
        "action":
            action_text
    }

@router.get(
    "/stock-analysis/{ticker}"
)
def stock_analysis(
    ticker: str
):

    return (
        service.get_stock_analysis(
            ticker
        )
    )

@router.get("/history")
def history():

    return (
        service
        .get_prediction_history()
    )