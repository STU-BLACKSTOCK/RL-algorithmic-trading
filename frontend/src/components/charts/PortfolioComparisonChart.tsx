import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PORTFOLIO_EQUITY_DATA } from "../../data/analyticsData";
import { CHART_COLORS } from "../../constants";
import { formatCurrency } from "../../utils/formatters";

function PortfolioComparisonChart() {
  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Equity Curve Comparison</h3>
        <p className="chart-card__subtitle">Portfolio growth over evaluation period</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={PORTFOLIO_EQUITY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis dataKey="day" tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip,
              border: `1px solid ${CHART_COLORS.grid}`,
              borderRadius: 8,
              color: "#f1f5f9",
            }}
            formatter={(value) => [formatCurrency(Number(value)), ""]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.muted }} />
          <Line type="monotone" dataKey="PPO v1" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="PPO v7" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="MultiStock" stroke={CHART_COLORS.info} strokeWidth={2} dot={false} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioComparisonChart;
