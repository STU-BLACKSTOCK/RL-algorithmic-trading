export interface HealthStatus {
  status: "healthy" | "unhealthy";
}

export interface ApiError {
  message: string;
  status?: number;
}
