import { useState, useEffect, type ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useSidebarState } from "../hooks/useMediaQuery";
import api from "../services/api";
import type { DashboardData } from "../types/dashboard";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isOpen, isDesktop, toggle, close } = useSidebarState();
  const [modelLoaded, setModelLoaded] = useState<boolean | undefined>();

  useEffect(() => {
    api
      .get<DashboardData>("/dashboard")
      .then((res) => setModelLoaded(res.data.loaded))
      .catch(() => setModelLoaded(false));
  }, []);

  return (
    <div className="app-layout">
      {!isDesktop && (
        <div
          className={`app-layout__overlay ${isOpen ? "app-layout__overlay--visible" : ""}`}
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div className={`app-layout__sidebar ${isOpen || isDesktop ? "app-layout__sidebar--open" : ""}`}>
        <Sidebar onNavigate={close} />
      </div>

      <div className="app-layout__main">
        <Navbar onMenuClick={toggle} modelLoaded={modelLoaded} />
        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
