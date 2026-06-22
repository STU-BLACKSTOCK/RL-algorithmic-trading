import { useEffect, useState } from "react";
import api from "../services/api";
import type { ModelInfo } from "../types/model";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import StatusBadge from "../components/ui/StatusBadge";
import { IconBrain, IconModel } from "../components/icons";

const ACTION_LABELS = [
  { id: 0, label: "HOLD", description: "Maintain current position" },
  { id: 1, label: "BUY 25%", description: "Purchase 25% of available capital" },
  { id: 2, label: "BUY 100%", description: "Purchase with full available capital" },
  { id: 3, label: "SELL 25%", description: "Sell 25% of current holdings" },
  { id: 4, label: "SELL 100%", description: "Liquidate entire position" },
];

const FEATURES = [
  "Close", "High", "Low", "Open", "Volume",
  "SMA20", "SMA50", "EMA20", "RSI", "MACD", "MACD Signal", "Returns",
];

function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ModelInfo>("/model-info");
      setModelInfo(response.data);
    } catch (err) {
      setError("Unable to load model information.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelInfo();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader title="Model Information" subtitle="Details about the deployed PPO agent" />
        <Loader text="Loading model info..." />
      </>
    );
  }

  if (error || !modelInfo) {
    return (
      <>
        <PageHeader title="Model Information" subtitle="Details about the deployed PPO agent" />
        <ErrorState message={error ?? "No model data available"} onRetry={fetchModelInfo} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Model Information"
        subtitle="Architecture and configuration of the deployed reinforcement learning agent"
      />

      <div className="kpi-grid">
        <Card
          title="Model Name"
          value={modelInfo.model}
          icon={<IconBrain size={20} />}
          hoverable
        />
        <Card
          title="Lookback Window"
          value={`${modelInfo.lookback_window} days`}
          icon={<IconModel size={20} />}
          hoverable
        />
        <Card
          title="Action Space"
          value={`${modelInfo.action_space} actions`}
          hoverable
        />
        <Card title="Status" hoverable>
          <div style={{ marginTop: "8px" }}>
            <StatusBadge
              status={modelInfo.loaded ? "online" : "offline"}
              label={modelInfo.loaded ? "Loaded & Ready" : "Not Loaded"}
            />
          </div>
        </Card>
      </div>

      <section className="section">
        <h2 className="section__title">Action Space</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
          {ACTION_LABELS.map((action) => (
            <Card key={action.id} hoverable>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--accent-muted)",
                    color: "var(--accent-primary)",
                    fontWeight: 700,
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {action.id}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{action.label}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{action.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Observation Features</h2>
        <Card>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "16px" }}>
            The agent observes a {modelInfo.lookback_window}-day window of {FEATURES.length} features plus portfolio state (362 dimensions total).
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {FEATURES.map((feature) => (
              <span
                key={feature}
                style={{
                  padding: "6px 12px",
                  background: "var(--bg-hover)",
                  borderRadius: "6px",
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-secondary)",
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </Card>
      </section>

      <section className="section">
        <h2 className="section__title">Algorithm Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <Card title="Algorithm" hoverable>
            <p style={{ marginTop: "8px", color: "var(--text-primary)", fontWeight: 600 }}>Proximal Policy Optimization (PPO)</p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Stable-Baselines3 implementation</p>
          </Card>
          <Card title="Policy Network" hoverable>
            <p style={{ marginTop: "8px", color: "var(--text-primary)", fontWeight: 600 }}>MLP Policy</p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Multi-layer perceptron actor-critic</p>
          </Card>
          <Card title="Framework" hoverable>
            <p style={{ marginTop: "8px", color: "var(--text-primary)", fontWeight: 600 }}>Gymnasium + PyTorch</p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Custom trading environment</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default ModelInfoPage;
