import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import ModelComparisonChart from "../components/charts/ModelComparisonChart";
import SharpeRatioChart from "../components/charts/SharpeRatioChart";
import PortfolioComparisonChart from "../components/charts/PortfolioComparisonChart";
import { MODEL_COMPARISON_DATA } from "../data/analyticsData";
import { formatCurrency, formatPercent } from "../utils/formatters";

function Analytics() {
  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Compare model performance across evaluation metrics"
      />

      <div className="kpi-grid">
        {MODEL_COMPARISON_DATA.map((model) => (
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
            </div>
          </Card>
        ))}
      </div>

      <div className="charts-grid">
        <ModelComparisonChart />
        <SharpeRatioChart />
      </div>

      <div style={{ marginTop: "24px" }}>
        <PortfolioComparisonChart />
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
              {MODEL_COMPARISON_DATA.map((model) => (
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
              PPO v1 achieved +44.67% cumulative return
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Highest absolute return but with significant drawdown risk (-33%)
            </p>
          </Card>
          <Card hoverable>
            <div className="card__title">Best Risk-Adjusted</div>
            <p style={{ marginTop: "8px", fontWeight: 600, color: "var(--accent-primary)" }}>
              PPO v1 Sharpe ratio of 0.86
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Strongest risk-adjusted performance among all variants
            </p>
          </Card>
          <Card hoverable>
            <div className="card__title">Lowest Drawdown</div>
            <p style={{ marginTop: "8px", fontWeight: 600, color: "var(--color-info)" }}>
              PPO v7 with only -8% max drawdown
            </p>
            <p style={{ marginTop: "4px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Production model prioritizes capital preservation
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
