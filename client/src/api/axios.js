import axios from "axios";
import { getAccessToken, setAccessToken } from "../context/AuthContext";
import { refreshTokenRequest } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

// Always send token (in-memory token)
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshTokenRequest();
        setAccessToken(newToken);  // store new access token in memory

        // Retry original request:
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api(error.config);
      } catch (err) {
        console.log("Refresh failed");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
