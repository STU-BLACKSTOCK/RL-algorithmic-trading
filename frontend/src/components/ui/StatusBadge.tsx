interface StatusBadgeProps {
  status: "online" | "offline" | "warning";
  label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {label}
    </span>
  );
}

export default StatusBadge;
