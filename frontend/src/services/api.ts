import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");

export default api;
