import { useLocation } from "react-router-dom";
import { IconMenu } from "../icons";
import StatusBadge from "../ui/StatusBadge";
import { APP_NAME, ROUTE_TITLES } from "../../constants/navItems";
import { useHealthCheck } from "../../hooks/useHealthCheck";

interface NavbarProps {
  onMenuClick: () => void;
  modelLoaded?: boolean;
}

function Navbar({ onMenuClick, modelLoaded }: NavbarProps) {
  const location = useLocation();
  const pageTitle = ROUTE_TITLES[location.pathname] ?? "Dashboard";
  const { isOnline, isChecking } = useHealthCheck();

  const backendStatus = isChecking
    ? "warning"
    : isOnline
      ? "online"
      : "offline";

  const backendLabel = isChecking
    ? "Checking..."
    : isOnline
      ? "API Online"
      : "API Offline";

  const modelStatus = modelLoaded ? "online" : "warning";
  const modelLabel = modelLoaded ? "Model Ready" : "Model Unknown";

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <IconMenu />
        </button>
        <div className="navbar__breadcrumb">
          {APP_NAME} / <strong>{pageTitle}</strong>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__status-group">
          <StatusBadge status={backendStatus} label={backendLabel} />
          <StatusBadge status={modelStatus} label={modelLabel} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
