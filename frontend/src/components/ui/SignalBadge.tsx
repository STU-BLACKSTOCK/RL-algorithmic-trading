import { getSignalType, getActionLabel } from "../../utils/formatters";

interface SignalBadgeProps {
  action: string;
  showLabel?: boolean;
}

function SignalBadge({ action, showLabel = true }: SignalBadgeProps) {
  const type = getSignalType(action);

  return (
    <span className={`signal-badge signal-badge--${type}`}>
      {showLabel ? getActionLabel(action) : action}
    </span>
  );
}

export default SignalBadge;
