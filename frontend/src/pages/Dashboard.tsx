import { useEffect, useState } from "react";
import api from "../services/api";
import type { DashboardData } from "../types/dashboard";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import StatusBadge from "../components/ui/StatusBadge";
import {
  IconBrain,
  IconServer,
  IconWallet,
  IconTrendUp,
} from "../components/icons";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { MODEL_COMPARISON_DATA, INITIAL_CAPITAL } from "../data/analyticsData";
import { useHealthCheck } from "../hooks/useHealthCheck";

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, isChecking } = useHealthCheck();

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<DashboardData>("/dashboard");
      setData(response.data);
    } catch (err) {
      setError("Unable to load dashboard data. Ensure the backend server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const bestModel = MODEL_COMPARISON_DATA.reduce((best, current) =>
    current.portfolio > best.portfolio ? current : best
  );

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Overview of your RL trading platform" />
        <Loader text="Loading dashboard..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Overview of your RL trading platform" />
        <ErrorState message={error} onRetry={fetchDashboard} />
      </>
    );
  }

  const backendStatus = isChecking ? "warning" : isOnline ? "online" : "offline";
  const backendLabel = isChecking ? "Checking API..." : isOnline ? "Backend Connected" : "Backend Offline";
  const modelStatus = data?.loaded ? "online" : "offline";
  const modelLabel = data?.loaded ? "PPO Model Loaded" : "Model Not Loaded";

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your reinforcement learning trading platform"
      />

      <section className="section">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <StatusBadge status={backendStatus} label={backendLabel} />
          <StatusBadge status={modelStatus} label={modelLabel} />
        </div>
      </section>

      <div className="kpi-grid">
        <Card
          title="Active Model"
          value={data?.model ?? "—"}
          icon={<IconBrain size={20} />}
          iconBg="rgba(99, 102, 241, 0.15)"
          footer={`${data?.action_space ?? 0} discrete actions`}
          hoverable
        />
        <Card
          title="Lookback Window"
          value={`${data?.lookback_window ?? 0} days`}
          icon={<IconTrendUp size={20} />}
          iconBg="rgba(59, 130, 246, 0.15)"
          footer="Historical feature window"
          hoverable
        />
        <Card
          title="Best Model Return"
          value={formatPercent(bestModel.returnPct)}
          icon={<IconWallet size={20} />}
          iconBg="rgba(34, 197, 94, 0.12)"
          footer={`${bestModel.name} on test data`}
          hoverable
          glow
        />
        <Card
          title="Initial Capital"
          value={formatCurrency(INITIAL_CAPITAL)}
          icon={<IconServer size={20} />}
          iconBg="rgba(6, 182, 212, 0.12)"
          footer="Simulation starting balance"
          hoverable
        />
      </div>

      <section className="section">
        <h2 className="section__title">Portfolio Summary</h2>
        <div className="kpi-grid">
          {MODEL_COMPARISON_DATA.map((model) => (
            <Card key={model.name} hoverable>
              <div className="card__header">
                <div>
                  <div className="card__title">{model.name}</div>
                  <div className="card__subtitle">Evaluation results</div>
                </div>
              </div>
              <div className="card__value card__value--mono" style={{ fontSize: "var(--text-xl)" }}>
                {formatCurrency(model.portfolio)}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "var(--text-sm)", color: model.returnPct >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                  {formatPercent(model.returnPct)}
                </span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                  Sharpe: {model.sharpe.toFixed(2)}
                </span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-danger)" }}>
                  Max DD: {model.drawdown}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">System Status</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <Card title="Backend API" hoverable>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                FastAPI server at localhost:8000
              </span>
              <StatusBadge status={backendStatus} label={isOnline ? "Online" : "Offline"} />
            </div>
          </Card>
          <Card title="RL Model" hoverable>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                PPO agent inference engine
              </span>
              <StatusBadge status={modelStatus} label={data?.loaded ? "Ready" : "Unavailable"} />
            </div>
          </Card>
          <Card title="Supported Tickers" hoverable>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              {["AAPL", "MSFT", "GOOGL"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "4px 12px",
                    background: "var(--bg-hover)",
                    borderRadius: "6px",
                    fontSize: "var(--text-sm)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
