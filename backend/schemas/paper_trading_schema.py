from pydantic import BaseModel, Field


class PaperTradeRequest(BaseModel):

    ticker: str
    initial_cash: float = Field(
        default=10000.0,
        gt=0,
    )
