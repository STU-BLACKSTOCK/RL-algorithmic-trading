export interface ModelMetrics {
  name: string;
  portfolio: number;
  sharpe: number;
  drawdown: number;
  returnPct: number;
}

export const MODEL_COMPARISON_DATA: ModelMetrics[] = [
  {
    name: "PPO v1",
    portfolio: 14467,
    sharpe: 0.86,
    drawdown: -33,
    returnPct: 44.67,
  },
  {
    name: "PPO v7",
    portfolio: 11380,
    sharpe: 0.61,
    drawdown: -8,
    returnPct: 13.8,
  },
  {
    name: "MultiStock v1",
    portfolio: 10000,
    sharpe: 0.0,
    drawdown: 0,
    returnPct: 0,
  },
];

export const PORTFOLIO_EQUITY_DATA = [
  { day: "W1", "PPO v1": 10200, "PPO v7": 10100, "MultiStock": 10000 },
  { day: "W2", "PPO v1": 10800, "PPO v7": 10300, "MultiStock": 10050 },
  { day: "W3", "PPO v1": 11200, "PPO v7": 10600, "MultiStock": 9980 },
  { day: "W4", "PPO v1": 12100, "PPO v7": 10900, "MultiStock": 10020 },
  { day: "W5", "PPO v1": 13500, "PPO v7": 11200, "MultiStock": 10000 },
  { day: "W6", "PPO v1": 14467, "PPO v7": 11380, "MultiStock": 10000 },
];

export const INITIAL_CAPITAL = 10000;
