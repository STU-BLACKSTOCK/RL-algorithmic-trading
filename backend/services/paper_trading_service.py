import os
import sys

from backend.config import BASE_DIR, INITIAL_CASH, TEST_DATA_DIR
from backend.database.paper_trading_repository import PaperTradingRepository
from backend.services.data_service import DataService
from backend.services.model_service import ModelService

SRC_DIR = os.path.join(BASE_DIR, "src")

if SRC_DIR not in sys.path:

    sys.path.insert(0, SRC_DIR)

from trading_env import TradingEnv  # noqa: E402


ACTION_LABELS = {
    0: "HOLD",
    1: "BUY_25",
    2: "BUY_100",
    3: "SELL_25",
    4: "SELL_100",
}

ALLOWED_TICKERS = ["AAPL", "MSFT", "GOOGL"]


class PaperTradingService:

    def __init__(
        self,
        model_service: ModelService,
    ):

        self.model_service = model_service
        self.data_service = DataService()
        self.repo = PaperTradingRepository()

    def run_simulation(
        self,
        ticker: str,
        initial_cash: float = INITIAL_CASH,
    ) -> dict:

        ticker = ticker.upper()

        if ticker not in ALLOWED_TICKERS:

            raise ValueError(
                f"Unsupported ticker '{ticker}'. "
                f"Allowed: {', '.join(ALLOWED_TICKERS)}"
            )

        if not self.model_service.loaded:

            raise RuntimeError(
                self.model_service.load_error
                or "Model is not loaded."
            )

        df = self.data_service.get_latest_data(ticker)

        env = TradingEnv(
            df,
            initial_cash=initial_cash,
        )

        model = self.model_service.model

        obs, _ = env.reset()

        terminated = False
        truncated = False

        trades: list[dict] = []
        portfolio_history: list[dict] = []

        while not (terminated or truncated):

            action, _ = model.predict(
                obs,
                deterministic=True,
            )

            action_int = int(action)
            step_index = env.current_step

            if "Date" in df.columns:

                date_or_step = str(
                    df.loc[step_index, "Date"]
                )

            else:

                date_or_step = str(step_index)

            price = float(
                env._get_current_price()
            )

            obs, _, terminated, truncated, info = env.step(
                action_int
            )

            shares_after = info["shares_held"]

            trade_record = {
                "date_or_step": date_or_step,
                "ticker": ticker,
                "action": ACTION_LABELS.get(
                    action_int,
                    "UNKNOWN",
                ),
                "price": round(price, 4),
                "shares": shares_after,
                "cash_after": round(
                    info["cash"],
                    2,
                ),
                "portfolio_value_after": round(
                    info["portfolio_value"],
                    2,
                ),
            }

            trades.append(trade_record)

            portfolio_history.append({
                "date": date_or_step,
                "value": round(
                    info["portfolio_value"],
                    2,
                ),
                "action": trade_record["action"],
            })

        final_value = info["portfolio_value"]
        total_return = (
            (final_value - initial_cash)
            / initial_cash
        )

        session_id = self.repo.create_session(
            ticker=ticker,
            initial_cash=initial_cash,
            final_portfolio_value=round(
                final_value,
                2,
            ),
            total_return=round(
                total_return,
                6,
            ),
            trade_count=info["trade_count"],
            portfolio_history=portfolio_history,
        )

        self.repo.add_trades(
            session_id,
            trades,
        )

        return self._format_session_detail(
            session_id,
            ticker,
            initial_cash,
            round(final_value, 2),
            round(total_return, 6),
            info["trade_count"],
            portfolio_history,
            trades,
        )

    def get_history(self) -> list[dict]:

        rows = self.repo.get_sessions()

        return [
            self._format_session_summary(row)
            for row in rows
        ]

    def get_session(
        self,
        session_id: int,
    ) -> dict | None:

        row = self.repo.get_session(session_id)

        if row is None:

            return None

        trade_rows = self.repo.get_trades(session_id)

        import json

        portfolio_history = json.loads(
            row[6]
        )

        trades = [
            self._format_trade(trade_row)
            for trade_row in trade_rows
        ]

        return {
            "session_id": row[0],
            "ticker": row[1],
            "initial_cash": row[2],
            "final_portfolio_value": row[3],
            "total_return": row[4],
            "trade_count": row[5],
            "portfolio_history": portfolio_history,
            "created_at": row[7],
            "trades": trades,
        }

    def _format_session_summary(
        self,
        row: tuple,
    ) -> dict:

        return {
            "session_id": row[0],
            "ticker": row[1],
            "initial_cash": row[2],
            "final_portfolio_value": row[3],
            "total_return": row[4],
            "trade_count": row[5],
            "created_at": row[6],
        }

    def _format_trade(
        self,
        row: tuple,
    ) -> dict:

        return {
            "id": row[0],
            "session_id": row[1],
            "date_or_step": row[2],
            "ticker": row[3],
            "action": row[4],
            "price": row[5],
            "shares": row[6],
            "cash_after": row[7],
            "portfolio_value_after": row[8],
        }

    def _format_session_detail(
        self,
        session_id: int,
        ticker: str,
        initial_cash: float,
        final_portfolio_value: float,
        total_return: float,
        trade_count: int,
        portfolio_history: list,
        trades: list[dict],
    ) -> dict:

        return {
            "session_id": session_id,
            "ticker": ticker,
            "initial_cash": initial_cash,
            "final_portfolio_value": final_portfolio_value,
            "total_return": total_return,
            "trade_count": trade_count,
            "portfolio_history": portfolio_history,
            "trades": trades,
        }
