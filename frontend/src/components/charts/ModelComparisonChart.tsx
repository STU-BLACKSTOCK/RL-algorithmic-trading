import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MODEL_COMPARISON_DATA } from "../../data/analyticsData";
import { CHART_COLORS } from "../../constants";
import { formatCurrency } from "../../utils/formatters";
import type { ModelMetrics } from "../../types/analytics";

const BAR_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.info, CHART_COLORS.warning];

interface Props {
  models?: ModelMetrics[];
}

function ModelComparisonChart({ models = MODEL_COMPARISON_DATA }: Props) {
  const data = models.map((m) => ({
    name: m.name,
    portfolio: m.portfolio,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Portfolio Value Comparison</h3>
        <p className="chart-card__subtitle">Final portfolio value by model (initial capital $10,000)</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis dataKey="name" tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltip,
              border: `1px solid ${CHART_COLORS.grid}`,
              borderRadius: 8,
              color: "#f1f5f9",
            }}
            formatter={(value) => [formatCurrency(Number(value)), "Portfolio"]}
          />
          <Bar dataKey="portfolio" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ModelComparisonChart;
