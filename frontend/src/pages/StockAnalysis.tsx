import { useState } from "react";
import api from "../services/api";
import type { StockAnalysis as StockAnalysisType } from "../types/stockAnalysis";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import SignalBadge from "../components/ui/SignalBadge";
import RSIGauge from "../components/ui/RSIGauge";
import { TICKERS } from "../constants";
import {
  formatNumber,
  getMacdSignal,
  getApiErrorMessage,
} from "../utils/formatters";
import { IconAnalysis, IconTrendUp } from "../components/icons";

function StockAnalysis() {
  const [ticker, setTicker] = useState<string>("AAPL");
  const [data, setData] = useState<StockAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<StockAnalysisType>(`/stock-analysis/${ticker}`);
      setData(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const macdSignal = data ? getMacdSignal(data.macd) : null;
  const priceAboveSma20 = data ? data.close > data.sma20 : null;
  const priceAboveSma50 = data ? data.close > data.sma50 : null;

  return (
    <div>
      <PageHeader
        title="Stock Analysis"
        subtitle="Technical indicators and RL-powered trading signals"
      />

      <Card style={{ marginBottom: "24px" }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="analysis-ticker">Select Stock</label>
            <select
              id="analysis-ticker"
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
          <button className="btn btn--primary" onClick={fetchData} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Stock"}
          </button>
        </div>
      </Card>

      {loading && <Loader text="Fetching technical analysis..." />}

      {error && !loading && (
        <ErrorState title="Analysis Failed" message={error} onRetry={fetchData} />
      )}

      {data && !loading && (
        <>
          <div className="kpi-grid">
            <Card
              title="Latest Close"
              value={`$${formatNumber(data.close)}`}
              icon={<IconAnalysis size={20} />}
              hoverable
            >
              <p style={{ marginTop: "8px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                {data.ticker} — most recent closing price
              </p>
            </Card>
            <Card title="RL Prediction" hoverable>
              <div style={{ marginTop: "8px" }}>
                <SignalBadge action={data.prediction} />
              </div>
            </Card>
            <Card title="Trend vs SMA20" hoverable>
              <div style={{ marginTop: "8px", color: priceAboveSma20 ? "var(--color-success)" : "var(--color-danger)", fontWeight: 600 }}>
                {priceAboveSma20 ? "Above SMA20 (Bullish)" : "Below SMA20 (Bearish)"}
              </div>
            </Card>
            <Card title="Trend vs SMA50" hoverable>
              <div style={{ marginTop: "8px", color: priceAboveSma50 ? "var(--color-success)" : "var(--color-danger)", fontWeight: 600 }}>
                {priceAboveSma50 ? "Above SMA50 (Bullish)" : "Below SMA50 (Bearish)"}
              </div>
            </Card>
          </div>

          <section className="section">
            <h2 className="section__title">Technical Indicators</h2>
            <div className="indicator-grid">
              <Card hoverable>
                <div className="card__title">RSI (14)</div>
                <RSIGauge value={data.rsi} />
              </Card>

              <Card hoverable>
                <div className="card__title">MACD</div>
                <div className="card__value card__value--mono" style={{ fontSize: "var(--text-xl)", marginTop: "12px" }}>
                  {formatNumber(data.macd, 4)}
                </div>
                {macdSignal && (
                  <div style={{ marginTop: "8px", color: macdSignal.color, fontWeight: 600, fontSize: "var(--text-sm)" }}>
                    {macdSignal.label} Signal
                  </div>
                )}
              </Card>

              <Card hoverable>
                <div className="card__title">SMA 20</div>
                <div className="card__value card__value--mono" style={{ fontSize: "var(--text-xl)", marginTop: "12px" }}>
                  ${formatNumber(data.sma20)}
                </div>
                <div style={{ marginTop: "8px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  20-day simple moving average
                </div>
              </Card>

              <Card hoverable>
                <div className="card__title">SMA 50</div>
                <div className="card__value card__value--mono" style={{ fontSize: "var(--text-xl)", marginTop: "12px" }}>
                  ${formatNumber(data.sma50)}
                </div>
                <div style={{ marginTop: "8px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  50-day simple moving average
                </div>
              </Card>
            </div>
          </section>

          <section className="section">
            <h2 className="section__title">Technical Analysis Summary</h2>
            <Card hoverable>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <IconTrendUp size={18} style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>Moving Average Crossover</strong>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Price is {priceAboveSma20 ? "above" : "below"} SMA20 (${formatNumber(data.sma20)}) and{" "}
                      {priceAboveSma50 ? "above" : "below"} SMA50 (${formatNumber(data.sma50)}).
                      {priceAboveSma20 && priceAboveSma50
                        ? " Both averages support a bullish trend."
                        : !priceAboveSma20 && !priceAboveSma50
                          ? " Both averages indicate bearish momentum."
                          : " Mixed signals from moving averages."}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <IconAnalysis size={18} style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--text-primary)" }}>Momentum (RSI)</strong>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: "4px" }}>
                      RSI at {formatNumber(data.rsi, 1)} indicates{" "}
                      {data.rsi >= 70 ? "overbought conditions — potential reversal downward." :
                        data.rsi <= 30 ? "oversold conditions — potential reversal upward." :
                          "neutral momentum with no extreme readings."}
                    </p>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                  <strong style={{ color: "var(--text-primary)" }}>RL Agent Recommendation</strong>
                  <div style={{ marginTop: "8px" }}>
                    <SignalBadge action={data.prediction} />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </>
      )}

      {!data && !loading && !error && (
        <Card>
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px" }}>
            Select a stock and click "Analyze Stock" to view technical indicators and RL predictions.
          </p>
        </Card>
      )}
    </div>
  );
}

export default StockAnalysis;
