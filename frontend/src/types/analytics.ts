export interface ModelMetrics {
  name: string;
  portfolio: number;
  sharpe: number;
  drawdown: number;
  returnPct: number;
  source?: string;
  actions?: Record<string, number>;
}

export interface EquityPoint {
  day: string;
  [modelName: string]: string | number;
}

export interface AnalyticsResponse {
  models: ModelMetrics[];
  equity_curve: EquityPoint[];
  initial_capital: number;
  source: "evaluated" | "fallback";
  metrics_path?: string | null;
  hint?: string;
}
