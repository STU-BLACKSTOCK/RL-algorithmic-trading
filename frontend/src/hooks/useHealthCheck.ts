import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const HEALTH_URL = "http://127.0.0.1:8000/health";
const POLL_INTERVAL = 30000;

export function useHealthCheck() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const response = await axios.get(HEALTH_URL, { timeout: 5000 });
      setIsOnline(response.data?.status === "healthy");
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
