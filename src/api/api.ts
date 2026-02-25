import axios from "axios";
import { useAuthStore } from "../store/auth_store";

// Utility function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = token.split(".")[1];
    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));
    // Check if exp (expiration time) exists and is less than current time
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    console.warn("Failed to decode token:", error);
    return true;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    // Add Authorization header if we have an access token
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      // Check if token is expired before using it
      if (isTokenExpired(accessToken)) {
        console.warn("Access token is expired, setting session expired flag");
        useAuthStore.getState().setSessionExpired(true);
        useAuthStore.getState().clearAuth();
        // Reject the request immediately with 401 error
        return Promise.reject(new Error("Token expired - session has expired"));
      }

      if (!config.url?.includes("/auth/login")) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses (invalid or expired tokens)
    if (error.response?.status === 401) {
      console.warn(
        "401 Unauthorized - Token invalid or expired, setting session expired flag",
      );
      useAuthStore.getState().setSessionExpired(true);
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    // Handle specific error messages about invalid/expired tokens
    const errorMessage = error.response?.data?.message || "";
    if (
      errorMessage.toLowerCase().includes("invalid token") ||
      errorMessage.toLowerCase().includes("expired token") ||
      errorMessage.toLowerCase().includes("invalid jwt")
    ) {
      console.warn("Invalid/Expired token error:", errorMessage);
      useAuthStore.getState().setSessionExpired(true);
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// Export the token checker utility for use in other parts of the app
export const checkTokenExpiration = (): boolean => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) return true; // No token = expired
  return isTokenExpired(accessToken);
};

// Export function to get token expiration time in milliseconds
export const getTokenExpirationTime = (): number | null => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

export default api;
