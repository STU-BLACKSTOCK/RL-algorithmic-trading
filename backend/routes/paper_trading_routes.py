from fastapi import APIRouter, HTTPException

from backend.deps import get_model_service
from backend.schemas.paper_trading_schema import PaperTradeRequest
from backend.services.paper_trading_service import PaperTradingService

router = APIRouter()

_paper_service: PaperTradingService | None = None


def get_paper_service() -> PaperTradingService:

    global _paper_service

    if _paper_service is None:

        _paper_service = PaperTradingService(
            get_model_service()
        )

    return _paper_service


@router.post("/paper-trade/run")
def run_paper_trade(
    request: PaperTradeRequest,
):

    service = get_paper_service()

    try:

        return service.run_simulation(
            ticker=request.ticker,
            initial_cash=request.initial_cash,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except RuntimeError as error:

        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error


@router.get("/paper-trade/history")
def paper_trade_history():

    service = get_paper_service()

    return service.get_history()


@router.get("/paper-trade/{session_id}")
def paper_trade_session(
    session_id: int,
):

    service = get_paper_service()

    session = service.get_session(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Paper trading session not found.",
        )

    return session
