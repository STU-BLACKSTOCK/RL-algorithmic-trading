import { useEffect, useState } from "react";
import api from "../services/api";
import type { DashboardData } from "../types/dashboard";
import PageHeader from "../components/ui/PageHeader";
import MetricCard from "../components/ui/MetricCard";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import StatusBadge from "../components/ui/StatusBadge";
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
    } catch {
      setError("Unable to load dashboard. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="System overview" />
        <Loader text="Loading..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="System overview" />
        <ErrorState message={error} onRetry={fetchDashboard} />
      </>
    );
  }

  const backendStatus = isChecking ? "warning" : isOnline ? "online" : "offline";
  const modelStatus = data?.loaded ? "online" : "offline";

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="RL algorithmic trading platform — system status and model overview"
      />

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <StatusBadge
          status={backendStatus}
          label={isOnline ? "API Online" : "API Offline"}
        />
        <StatusBadge
          status={modelStatus}
          label={data?.loaded ? "Model Loaded" : "Model Not Loaded"}
        />
      </div>

      <section className="page-section">
        <h2 className="page-section__title">Model Status</h2>
        <div className="kpi-grid">
          <MetricCard label="Model" value={data?.model ?? "—"} />
          <MetricCard label="Lookback Window" value={`${data?.lookback_window ?? 0} days`} />
          <MetricCard label="Action Space" value={`${data?.action_space ?? 0} actions`} />
          <MetricCard
            label="Model State"
            value={data?.loaded ? "Ready" : "Unavailable"}
            hint={data?.loaded ? "PPO checkpoint loaded" : "Train model to enable predictions"}
          />
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section__title">Project Overview</h2>
        <div className="card">
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "var(--text-sm)" }}>
            This capstone project uses Proximal Policy Optimization (PPO) to generate trading signals
            for AAPL, MSFT, and GOOGL. The backend serves model predictions and technical indicators;
            the frontend provides analytics, paper trading simulation, and prediction history.
          </p>
          <ul style={{ marginTop: "16px", paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "var(--text-sm)", lineHeight: 1.8 }}>
            <li><strong style={{ color: "var(--text-primary)" }}>Prediction</strong> — single-step RL signal for a ticker</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Paper Trading</strong> — full backtest simulation on test data</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Stock Analysis</strong> — technical indicators + model output</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Analytics</strong> — model comparison metrics</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
