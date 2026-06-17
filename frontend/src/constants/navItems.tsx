import type { NavItem } from "./navigation";

export const APP_NAME = "TradeRL";
export const APP_TAGLINE = "AI Trading Analytics";
import {
  IconDashboard,
  IconPrediction,
  IconModel,
  IconAnalytics,
  IconAnalysis,
  IconHistory,
} from "../components/icons";

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Dashboard", icon: <IconDashboard /> },
  { path: "/prediction", label: "Prediction", icon: <IconPrediction /> },
  { path: "/model", label: "Model Info", icon: <IconModel /> },
  { path: "/analytics", label: "Analytics", icon: <IconAnalytics /> },
  { path: "/analysis", label: "Stock Analysis", icon: <IconAnalysis /> },
  { path: "/history", label: "History", icon: <IconHistory /> },
];

export const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/prediction": "Trading Prediction",
  "/model": "Model Information",
  "/analytics": "Analytics",
  "/analysis": "Stock Analysis",
  "/history": "Prediction History",
};
