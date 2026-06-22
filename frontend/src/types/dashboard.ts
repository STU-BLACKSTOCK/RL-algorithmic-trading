export interface DashboardData {
  model: string;
  lookback_window: number;
  action_space: number;
  loaded: boolean;
  error?: string | null;
}