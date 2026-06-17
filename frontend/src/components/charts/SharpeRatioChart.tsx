import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { MODEL_COMPARISON_DATA } from "../../data/analyticsData";
import { CHART_COLORS } from "../../constants";
import type { ModelMetrics } from "../../types/analytics";

interface Props {
  models?: ModelMetrics[];
}

function SharpeRatioChart({ models = MODEL_COMPARISON_DATA }: Props) {
  const data = models.map((m) => ({
    name: m.name,
    sharpe: m.sharpe,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Sharpe Ratio Comparison</h3>
        <p className="chart-card__subtitle">Risk-adjusted return across model variants</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis dataKey="name" tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <ReferenceLine y={1} stroke={CHART_COLORS.warning} strokeDasharray="4 4" label={{ value: "Good (1.0)", fill: CHART_COLORS.muted, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip,
              border: `1px solid ${CHART_COLORS.grid}`,
              borderRadius: 8,
              color: "#f1f5f9",
            }}
            formatter={(value) => [Number(value).toFixed(2), "Sharpe Ratio"]}
          />
          <Bar dataKey="sharpe" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.sharpe >= 0.8 ? CHART_COLORS.success : entry.sharpe >= 0.5 ? CHART_COLORS.primary : CHART_COLORS.muted}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SharpeRatioChart;
