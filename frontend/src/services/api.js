import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: sessionStorage instead of localStorage
// localStorage is shared across all tabs — causes admin/owner role conflict
// sessionStorage is tab-isolated by spec — each tab has its own auth session
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("gymkey_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clears THIS tab's session
      sessionStorage.removeItem("gymkey_token");
      sessionStorage.removeItem("gymkey_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
