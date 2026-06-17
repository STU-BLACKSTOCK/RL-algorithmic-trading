export interface HistoryItem {
  id: number;
  ticker: string;
  action: string;
  created_at: string;
}

export type HistorySortField = "id" | "ticker" | "action" | "created_at";
export type SortDirection = "asc" | "desc";

export interface HistorySortConfig {
  field: HistorySortField;
  direction: SortDirection;
}
