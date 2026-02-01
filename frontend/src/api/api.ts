import axios from "axios";
import { useAuthStore } from "../store/auth_store";
import { refresh } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        await refresh();
        return api(originalRequest); // Retry with new token
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        useAuthStore.getState().setSessionExpired(true);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
