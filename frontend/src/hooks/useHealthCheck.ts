import { useState, useEffect, useCallback } from "react";
import { API_ROOT } from "../services/api";

const HEALTH_URL = `${API_ROOT}/health`;
const POLL_INTERVAL = 30000;

export function useHealthCheck() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(HEALTH_URL, {
        signal: AbortSignal.timeout(5000),
      });
      const data = await response.json();
      setIsOnline(data?.status === "healthy");
    } catch {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isOnline, isChecking, refresh: checkHealth };
}
