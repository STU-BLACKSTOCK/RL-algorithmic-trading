interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="metric-card">
      <span className="metric-card__label">{label}</span>
      <span className="metric-card__value">{value}</span>
      {hint && <span className="metric-card__hint">{hint}</span>}
    </div>
  );
}

export default MetricCard;
