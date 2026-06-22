export interface PaperTradeRequest {
  ticker: string;
  initial_cash?: number;
}

export interface PaperTradeStep {
  date: string;
  value: number;
  action?: string;
}

export interface PaperTradeLogEntry {
  id?: number;
  session_id?: number;
  date_or_step: string;
  ticker: string;
  action: string;
  price: number;
  shares: number;
  cash_after: number;
  portfolio_value_after: number;
}

export interface PaperTradeSessionSummary {
  session_id: number;
  ticker: string;
  initial_cash: number;
  final_portfolio_value: number;
  total_return: number;
  trade_count: number;
  created_at?: string;
}

export interface PaperTradeSessionDetail extends PaperTradeSessionSummary {
  portfolio_history: PaperTradeStep[];
  trades: PaperTradeLogEntry[];
}
