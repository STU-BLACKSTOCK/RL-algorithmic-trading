import type { TradingAction, SignalType } from "../types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getSignalType(action: string): SignalType {
  if (action.includes("BUY")) return "buy";
  if (action.includes("SELL")) return "sell";
  return "hold";
}

export function getActionLabel(action: TradingAction | string): string {
  const labels: Record<string, string> = {
    HOLD: "Hold Position",
    BUY_25: "Buy 25%",
    BUY_100: "Buy 100%",
    SELL_25: "Sell 25%",
    SELL_100: "Sell 100%",
    UNKNOWN: "Unknown",
  };
  return labels[action] ?? action;
}

export function getActionDescription(action: string): string {
  if (action.includes("BUY_100")) return "Strong buy signal — allocate full available capital";
  if (action.includes("BUY_25")) return "Moderate buy signal — allocate 25% of capital";
  if (action.includes("SELL_100")) return "Strong sell signal — liquidate entire position";
  if (action.includes("SELL_25")) return "Moderate sell signal — reduce position by 25%";
  if (action === "HOLD") return "No action recommended — maintain current position";
  return "Unable to determine trading signal";
}

export function getRsiZone(rsi: number): {
  label: string;
  color: string;
} {
  if (rsi >= 70) return { label: "Overbought", color: "var(--color-danger)" };
  if (rsi <= 30) return { label: "Oversold", color: "var(--color-success)" };
  return { label: "Neutral", color: "var(--color-info)" };
}

export function getMacdSignal(macd: number): {
  label: string;
  color: string;
} {
  if (macd > 0) return { label: "Bullish", color: "var(--color-success)" };
  if (macd < 0) return { label: "Bearish", color: "var(--color-danger)" };
  return { label: "Neutral", color: "var(--color-neutral)" };
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
}
