import type { ReactNode, CSSProperties } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  value?: string | number;
  footer?: string;
  icon?: ReactNode;
  iconBg?: string;
  children?: ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: CSSProperties;
}

function Card({
  title,
  subtitle,
  value,
  footer,
  icon,
  iconBg = "var(--accent-muted)",
  children,
  className = "",
  hoverable = false,
  style,
}: CardProps) {
  const cardClass = [
    "card",
    hoverable ? "card--hoverable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} style={style}>
      {(title || icon) && (
        <div className="card__header">
          <div>
            {title && <div className="card__title">{title}</div>}
            {subtitle && <div className="card__subtitle">{subtitle}</div>}
          </div>
          {icon && (
            <div className="card__icon" style={{ background: iconBg, color: "var(--accent-primary)" }}>
              {icon}
            </div>
          )}
        </div>
      )}
      {value !== undefined && <div className="card__value">{value}</div>}
      {children}
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

export default Card;
