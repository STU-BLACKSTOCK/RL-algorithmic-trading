import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import { TICKERS } from "../constants";
import type {
  PaperTradeSessionDetail,
  PaperTradeSessionSummary,
} from "../types/paperTrading";
import PageHeader from "../components/ui/PageHeader";
import MetricCard from "../components/ui/MetricCard";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import SignalBadge from "../components/ui/SignalBadge";
import { formatCurrency, formatPercent, getApiErrorMessage } from "../utils/formatters";
import { CHART_COLORS } from "../constants";

function PaperTrading() {
  const [ticker, setTicker] = useState("AAPL");
  const [initialCash, setInitialCash] = useState(10000);
  const [sessions, setSessions] = useState<PaperTradeSessionSummary[]>([]);
  const [selectedSession, setSelectedSession] = useState<PaperTradeSessionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setListLoading(true);
    try {
      const response = await api.get<PaperTradeSessionSummary[]>("/paper-trade/history");
      setSessions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadSession = async (sessionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PaperTradeSessionDetail>(`/paper-trade/${sessionId}`);
      setSelectedSession(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<PaperTradeSessionDetail>("/paper-trade/run", {
        ticker,
        initial_cash: initialCash,
      });
      setSelectedSession(response.data);
      await loadHistory();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const chartData = selectedSession?.portfolio_history.map((point) => ({
    date: point.date,
    value: point.value,
  })) ?? [];

  return (
    <div>
      <PageHeader
        title="Paper Trading"
        subtitle="Simulate PPO strategy over historical test data with a virtual portfolio"
      />

      <section className="page-section">
        <h2 className="page-section__title">Run Simulation</h2>
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="paper-ticker">Stock</label>
              <select
                id="paper-ticker"
                className="form-select"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                disabled={loading}
              >
                {TICKERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="paper-cash">Initial Cash</label>
              <input
                id="paper-cash"
                className="form-input"
                type="number"
                min={1000}
                step={1000}
                value={initialCash}
                onChange={(e) => setInitialCash(Number(e.target.value))}
                disabled={loading}
              />
            </div>
            <button className="btn btn--primary" onClick={runSimulation} disabled={loading}>
              {loading ? "Running..." : "Start Paper Trade"}
            </button>
          </div>
          <p style={{ marginTop: "12px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            Uses the loaded PPO model and test dataset to walk through each trading day step by step.
          </p>
        </div>
      </section>

      {loading && !selectedSession && <Loader text="Running paper trading simulation..." />}

      {error && (
        <div style={{ marginBottom: "24px" }}>
          <ErrorState title="Simulation Error" message={error} onRetry={runSimulation} />
        </div>
      )}

      {selectedSession && (
        <>
          <section className="page-section">
            <h2 className="page-section__title">Portfolio Summary</h2>
            <div className="kpi-grid">
              <MetricCard label="Ticker" value={selectedSession.ticker} />
              <MetricCard
                label="Final Value"
                value={formatCurrency(selectedSession.final_portfolio_value)}
              />
              <MetricCard
                label="Total Return"
                value={formatPercent(selectedSession.total_return * 100)}
                hint={`Started with ${formatCurrency(selectedSession.initial_cash)}`}
              />
              <MetricCard label="Trades Executed" value={selectedSession.trade_count} />
            </div>
          </section>

          <section className="page-section">
            <h2 className="page-section__title">Portfolio Value Over Time</h2>
            <div className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
                    tickFormatter={(v) => String(v).slice(0, 10)}
                  />
                  <YAxis
                    tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
                    tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: CHART_COLORS.tooltip,
                      border: `1px solid ${CHART_COLORS.grid}`,
                      borderRadius: 6,
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), "Portfolio"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="page-section">
            <h2 className="page-section__title">Trade Log</h2>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>Price</th>
                    <th>Shares Held</th>
                    <th>Cash</th>
                    <th>Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.trades.map((trade, index) => (
                    <tr key={trade.id ?? index}>
                      <td>{String(trade.date_or_step).slice(0, 10)}</td>
                      <td><SignalBadge action={trade.action} showLabel={false} /></td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>${trade.price.toFixed(2)}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{trade.shares}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(trade.cash_after)}</td>
                      <td style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(trade.portfolio_value_after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <section className="page-section">
        <h2 className="page-section__title">Past Sessions</h2>
        {listLoading ? (
          <Loader text="Loading sessions..." inline />
        ) : sessions.length === 0 ? (
          <div className="card">
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
              No paper trading sessions yet. Run a simulation above.
            </p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ticker</th>
                  <th>Return</th>
                  <th>Final Value</th>
                  <th>Trades</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>#{session.session_id}</td>
                    <td>{session.ticker}</td>
                    <td style={{ color: session.total_return >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                      {formatPercent(session.total_return * 100)}
                    </td>
                    <td>{formatCurrency(session.final_portfolio_value)}</td>
                    <td>{session.trade_count}</td>
                    <td>{session.created_at ? String(session.created_at).slice(0, 16) : "—"}</td>
                    <td>
                      <button
                        className="btn btn--ghost"
                        onClick={() => loadSession(session.session_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default PaperTrading;
