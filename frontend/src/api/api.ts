import axios from "axios";
import { useAuthStore } from "../store/auth_store";
import { refresh } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: any;
}

let isRefreshing = false;
let requestQueue: QueuedRequest[] = [];

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

      // 1. If refresh is in progress, just add to queue and STOP.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // 2. Wait for the refresh response first
        await refresh();

        // 3. REFRESH SUCCESS: Now process the queue one-by-one (Sequentially)
        for (const queued of requestQueue) {
          try {
            const result = await api(queued.config);
            queued.resolve(result); // Pass success back to the component
          } catch (fail) {
            queued.reject(fail); // Pass error back to the component
          }
        }

        requestQueue = []; // Clear queue after sequential processing
        return api(originalRequest); // Finally, retry the original request
      } catch (refreshError) {
        // 4. REFRESH FAILED: Reject everyone waiting
        requestQueue.forEach((q) => q.reject(refreshError));
        requestQueue = [];

        useAuthStore.getState().clearAuth();
        useAuthStore.getState().setSessionExpired(true);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
export default api;
