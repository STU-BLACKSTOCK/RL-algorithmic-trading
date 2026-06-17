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
import { PORTFOLIO_EQUITY_DATA, MODEL_COMPARISON_DATA } from "../../data/analyticsData";
import { CHART_COLORS } from "../../constants";
import { formatCurrency } from "../../utils/formatters";
import type { EquityPoint, ModelMetrics } from "../../types/analytics";

const LINE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.info, CHART_COLORS.warning];

interface Props {
  equityCurve?: EquityPoint[];
  models?: ModelMetrics[];
}

function PortfolioComparisonChart({
  equityCurve = PORTFOLIO_EQUITY_DATA,
  models = MODEL_COMPARISON_DATA,
}: Props) {
  const modelNames = models
    .filter((m) => m.source !== "legacy" || m.name === "PPO v7" || m.name === "PPO v1")
    .map((m) => m.name)
    .filter((name, index, arr) => arr.indexOf(name) === index);

  const chartModels = equityCurve.length > 0
    ? Object.keys(equityCurve[0]).filter((k) => k !== "day")
    : modelNames.slice(0, 3);

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Equity Curve Comparison</h3>
        <p className="chart-card__subtitle">Portfolio growth over AAPL test period</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={equityCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          {chartModels.map((name, index) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={LINE_COLORS[index % LINE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              strokeDasharray={name.includes("MultiStock") ? "5 5" : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioComparisonChart;
