import { NavLink } from "react-router-dom";
import { NAV_ITEMS, APP_NAME, APP_TAGLINE } from "../../constants/navItems";
import { IconTrendUp } from "../icons";

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <IconTrendUp size={18} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">{APP_NAME}</span>
          <span className="sidebar__brand-tagline">{APP_TAGLINE}</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            onClick={onNavigate}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__footer-text">PPO Reinforcement Learning</p>
        <p className="sidebar__footer-text">Capstone Project v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
