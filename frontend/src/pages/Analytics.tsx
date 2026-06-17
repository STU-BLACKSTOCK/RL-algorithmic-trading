import { useEffect, useState } from "react";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import ModelComparisonChart from "../components/charts/ModelComparisonChart";
import SharpeRatioChart from "../components/charts/SharpeRatioChart";
import PortfolioComparisonChart from "../components/charts/PortfolioComparisonChart";
import { MODEL_COMPARISON_DATA } from "../data/analyticsData";
import type { AnalyticsResponse, ModelMetrics } from "../types/analytics";
import { formatCurrency, formatPercent } from "../utils/formatters";

function Analytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<AnalyticsResponse>("/analytics");
        setData(response.data);
      } catch (err) {
        setError("Unable to load analytics. Ensure the backend is running.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const models: ModelMetrics[] = data?.models ?? MODEL_COMPARISON_DATA;
  const equityCurve = data?.equity_curve ?? [];
  const source = data?.source ?? "fallback";

  const bestReturn = models.reduce((best, m) =>
    m.returnPct > best.returnPct ? m : best
  , models[0]);

  const bestSharpe = models.reduce((best, m) =>
    m.sharpe > best.sharpe ? m : best
  , models[0]);

  const lowestDrawdown = models.reduce((best, m) =>
    m.drawdown > best.drawdown ? m : best
  , models[0]);

  if (loading) {
    return (
      <>
        <PageHeader title="Analytics Dashboard" subtitle="Compare model performance across evaluation metrics" />
        <Loader text="Loading analytics..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Analytics Dashboard" subtitle="Compare model performance across evaluation metrics" />
        <ErrorState message={error} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        subtitle={
          source === "evaluated"
            ? "Live metrics from evaluate_all_models.py"
            : "Historical metrics — run evaluate_all_models.py after training for live data"
        }
      />

      {data?.hint && source === "fallback" && (
        <Card style={{ marginBottom: "24px", borderColor: "var(--color-warning)" }}>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-warning)" }}>{data.hint}</p>
        </Card>
      )}

      <div className="kpi-grid">
        {models.map((model) => (
          <Card key={model.name} hoverable>
            <div className="card__title">{model.name}</div>
            <div className="card__value card__value--mono" style={{ fontSize: "var(--text-xl)", marginTop: "8px" }}>
              {formatCurrency(model.portfolio)}
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--text-sm)", color: model.returnPct >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                {formatPercent(model.returnPct)}
              </span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                Sharpe: {model.sharpe.toFixed(2)}
              </span>
              {model.source && (
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  ({model.source})
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="charts-grid">
        <ModelComparisonChart models={models} />
        <SharpeRatioChart models={models} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <PortfolioComparisonChart equityCurve={equityCurve} models={models} />
      </div>

      <section className="section" style={{ marginTop: "32px" }}>
        <h2 className="section__title">Model Comparison Table</h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Portfolio Value</th>
                <th>Return</th>
                <th>Sharpe Ratio</th>
                <th>Max Drawdown</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.name}>
                  <td style={{ fontWeight: 600 }}>{model.name}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(model.portfolio)}</td>
                  <td style={{ color: model.returnPct >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                    {formatPercent(model.returnPct)}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{model.sharpe.toFixed(2)}</td>
                  <td style={{ color: "var(--color-danger)" }}>{model.drawdown}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Key Insights</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <Card hoverable>
            <div className="card__title">Best Return</div>
            <p style={{ marginTop: "8px", fontWeight: 600, color: "var(--color-success)" }}>
              {bestReturn.name} achieved {formatPercent(bestReturn.returnPct)} cumulative return
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Highest absolute return on AAPL test data
            </p>
          </Card>
          <Card hoverable>
            <div className="card__title">Best Risk-Adjusted</div>
            <p style={{ marginTop: "8px", fontWeight: 600, color: "var(--accent-primary)" }}>
              {bestSharpe.name} Sharpe ratio of {bestSharpe.sharpe.toFixed(2)}
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Strongest risk-adjusted performance among evaluated models
            </p>
          </Card>
          <Card hoverable>
            <div className="card__title">Lowest Drawdown</div>
            <p style={{ marginTop: "8px", fontWeight: 600, color: "var(--color-info)" }}>
              {lowestDrawdown.name} with {lowestDrawdown.drawdown}% max drawdown
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Production model (PPO v7) prioritizes capital preservation
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
