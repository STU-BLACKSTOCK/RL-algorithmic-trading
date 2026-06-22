import type { NavItem } from "./navigation";
import {
  IconDashboard,
  IconPrediction,
  IconModel,
  IconAnalytics,
  IconAnalysis,
  IconHistory,
  IconWallet,
} from "../components/icons";

export const APP_NAME = "RL Trading";
export const APP_TAGLINE = "Capstone Project";

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Dashboard", icon: <IconDashboard /> },
  { path: "/prediction", label: "Prediction", icon: <IconPrediction /> },
  { path: "/paper-trading", label: "Paper Trading", icon: <IconWallet /> },
  { path: "/model", label: "Model Info", icon: <IconModel /> },
  { path: "/analytics", label: "Analytics", icon: <IconAnalytics /> },
  { path: "/analysis", label: "Stock Analysis", icon: <IconAnalysis /> },
  { path: "/history", label: "History", icon: <IconHistory /> },
];

export const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/prediction": "Trading Prediction",
  "/paper-trading": "Paper Trading",
  "/model": "Model Information",
  "/analytics": "Analytics",
  "/analysis": "Stock Analysis",
  "/history": "Prediction History",
};
