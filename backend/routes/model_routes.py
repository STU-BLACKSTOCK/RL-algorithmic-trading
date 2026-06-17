from fastapi import APIRouter, HTTPException

from backend.services.model_service import ModelService
from backend.services.analytics_service import AnalyticsService
from backend.schemas.prediction_schema import PredictionRequest

router = APIRouter()

service = ModelService()
analytics_service = AnalyticsService()


@router.get("/model-info")
def get_model_info():

    return service.get_model_info()


@router.get("/dashboard")
def dashboard():

    return service.get_dashboard_data()


@router.post("/predict")
def predict(request: PredictionRequest):

    if not service.loaded:

        raise HTTPException(
            status_code=503,
            detail=(
                service.load_error
                or "Model not loaded. Run: python src/train_improved.py"
            ),
        )

    action = service.predict_action(request.ticker)
    action_text = service.action_to_text(action)

    service.repo.save_prediction(
        request.ticker,
        action_text,
    )

    return {
        "ticker": request.ticker,
        "action": action_text,
    }


@router.get("/stock-analysis/{ticker}")
def stock_analysis(ticker: str):

    return service.get_stock_analysis(ticker)


@router.get("/history")
def history():

    return service.get_prediction_history()


@router.get("/analytics")
def analytics():

    return analytics_service.get_analytics()
