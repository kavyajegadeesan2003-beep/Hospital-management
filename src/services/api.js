
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(
  (config) => {
    config.metadata = { startedAt: Date.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    response.duration =
      Date.now() - (response.config.metadata?.startedAt || Date.now());
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
