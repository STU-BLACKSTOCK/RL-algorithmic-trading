from fastapi import APIRouter, HTTPException

from backend.deps import get_model_service
from backend.schemas.prediction_schema import PredictionRequest
from backend.services.analytics_service import AnalyticsService

router = APIRouter()

analytics_service = AnalyticsService()


@router.get("/model-info")
def get_model_info():

    return get_model_service().get_model_info()


@router.get("/dashboard")
def dashboard():

    return get_model_service().get_dashboard_data()


@router.post("/predict")
def predict(request: PredictionRequest):

    service = get_model_service()

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

    return get_model_service().get_stock_analysis(ticker)


@router.get("/history")
def history():

    return get_model_service().get_prediction_history()


@router.get("/analytics")
def analytics():

    return analytics_service.get_analytics()
