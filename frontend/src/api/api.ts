import axios from "axios";
import { useAuthStore } from "../store/auth_store";
import { refresh, profile } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await refresh();

        const { accessToken } = response.data.data || response.data;

        if (!accessToken) {
          useAuthStore.getState().clearAuth();
          return Promise.reject(
            new Error("No access token returned from refresh"),
          );
        }

        try {
          await profile();

          useAuthStore.getState().setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (validateError) {
          useAuthStore.getState().clearAuth();
          return Promise.reject(validateError);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
