export const TICKERS = ["AAPL", "MSFT", "GOOGL"] as const;

export type Ticker = (typeof TICKERS)[number];

export const ITEMS_PER_PAGE = 10;

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#6366f1",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
  muted: "#64748b",
  grid: "rgba(148, 163, 184, 0.1)",
  tooltip: "#1a2234",
} as const;
