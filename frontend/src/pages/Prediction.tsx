import { useState } from "react";
import api from "../services/api";
import type { PredictionResponse } from "../types/prediction";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import SignalBadge from "../components/ui/SignalBadge";
import { TICKERS } from "../constants";
import { getActionDescription, getApiErrorMessage, getSignalType } from "../utils/formatters";
import { IconPrediction, IconTrendUp, IconTrendDown, IconAlert } from "../components/icons";

function Prediction() {
  const [ticker, setTicker] = useState<string>("AAPL");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await api.post<PredictionResponse>("/predict", { ticker });
      setPrediction(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signalType = prediction ? getSignalType(prediction.action) : null;

  const signalIcon = signalType === "buy"
    ? <IconTrendUp size={24} />
    : signalType === "sell"
      ? <IconTrendDown size={24} />
      : <IconAlert size={24} />;

  const signalColor = signalType === "buy"
    ? "var(--color-success)"
    : signalType === "sell"
      ? "var(--color-danger)"
      : "var(--color-neutral)";

  return (
    <div>
      <PageHeader
        title="Trading Prediction"
        subtitle="Get real-time RL trading signals powered by the PPO agent"
      />

      <Card style={{ marginBottom: "24px" }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="ticker-select">Select Stock</label>
            <select
              id="ticker-select"
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
          <button
            className="btn btn--primary"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Prediction"}
          </button>
        </div>
      </Card>

      {loading && <Loader text="Running PPO inference..." />}

      {error && !loading && (
        <ErrorState title="Prediction Failed" message={error} onRetry={handlePredict} />
      )}

      {prediction && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <Card
            title="Selected Asset"
            icon={<IconPrediction size={20} />}
            hoverable
            glow
          >
            <div className="card__value card__value--mono" style={{ fontSize: "var(--text-3xl)" }}>
              {prediction.ticker}
            </div>
            <p style={{ marginTop: "8px", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
              Analyzed using 30-day lookback window
            </p>
          </Card>

          <Card
            title="Trading Signal"
            hoverable
            glow
            style={{ borderColor: signalColor }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: signalColor }}>
              {signalIcon}
              <SignalBadge action={prediction.action} />
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
              {getActionDescription(prediction.action)}
            </p>
          </Card>

          <Card title="Signal Strength" hoverable>
            <div style={{ marginTop: "8px" }}>
              {["HOLD", "BUY_25", "BUY_100", "SELL_25", "SELL_100"].map((action) => {
                const isActive = prediction.action === action;
                const type = action.includes("BUY") ? "buy" : action.includes("SELL") ? "sell" : "hold";
                return (
                  <div
                    key={action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      marginBottom: "4px",
                      borderRadius: "6px",
                      background: isActive ? `var(--color-${type === "buy" ? "success" : type === "sell" ? "danger" : "neutral"}-bg)` : "transparent",
                      border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                      fontSize: "var(--text-sm)",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                  >
                    <span>{action.replace("_", " ")}</span>
                    {isActive && <span>● Active</span>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {!prediction && !loading && !error && (
        <Card>
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "24px" }}>
            Select a stock and click "Get Prediction" to receive an RL trading signal.
          </p>
        </Card>
      )}
    </div>
  );
}

export default Prediction;
