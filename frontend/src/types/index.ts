export type { DashboardData } from "./dashboard";
export type { ModelInfo } from "./model";
export type { PredictionResponse } from "./prediction";
export type { StockAnalysis } from "./stockAnalysis";
export type { HistoryItem, HistorySortField, SortDirection, HistorySortConfig } from "./history";
export type { HealthStatus, ApiError } from "./api";
export type { AnalyticsResponse, ModelMetrics, EquityPoint } from "./analytics";
export type {
  PaperTradeRequest,
  PaperTradeSessionSummary,
  PaperTradeSessionDetail,
  PaperTradeLogEntry,
  PaperTradeStep,
} from "./paperTrading";

export type TradingAction =
  | "HOLD"
  | "BUY_25"
  | "BUY_100"
  | "SELL_25"
  | "SELL_100"
  | "UNKNOWN";

export type SignalType = "buy" | "sell" | "hold";
