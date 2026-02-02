import axios from "axios";
import type { AuthRequest } from "../interfaces/auth/AuthRequest";
import type { UserResponse } from "../interfaces/user/UserResponse";
import { useAuthStore } from "../store/auth_store";
import api from "./api";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import type { AuthUser } from "../types/auth";

export const login = async (authRequest: AuthRequest) => {
  const response = await api.post("/auth/login", authRequest);

  try {
    const { accessToken, refreshToken } = response.data.data;

    // Store tokens in sessionStorage
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    // Get user profile and set in store
    await profile();
    return response.data;
  } catch (err) {
    useAuthStore.getState().clearAuth();
    throw err;
  }
};

export const refresh = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Use a separate axios instance to avoid interceptor loops
    const refreshApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    const response = await refreshApi.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data.data;

    // Update access token in sessionStorage
    sessionStorage.setItem("accessToken", accessToken);

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const logout = async () => {
  try {
    useAuthStore.getState().setLoggingOut(true);

    const refreshToken = sessionStorage.getItem("refreshToken");

    const response = await api.post("/auth/logout", {
      refreshToken,
    });

    // Clear tokens from sessionStorage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    useAuthStore.getState().clearAuth();
    return response.data;
  } catch (err) {
    throw err;
  } finally {
    useAuthStore.getState().setLoggingOut(false);
  }
};

export const profile = async (): Promise<AuthUser> => {
  try {
    // Try to get student profile first
    const res = await api.get<StudentResponse>("/auth/profile");

    // validate shape
    if (
      !res?.data ||
      typeof res.data.studentId !== "string" ||
      !res.data.user
    ) {
      useAuthStore.getState().clearAuth();
      throw new Error("Invalid student profile response");
    }

    const user: AuthUser = {
      ...res.data,
      role: "STUDENT",
    };

    useAuthStore.getState().setUser(user);
    return user;
  } catch (err) {
    // If student endpoint fails, try admin endpoint
    try {
      const res = await api.get<UserResponse>("/auth/admin/profile");

      if (!res?.data) {
        useAuthStore.getState().clearAuth();
        throw new Error("Invalid admin profile response");
      }

      const user: AuthUser = {
        ...res.data,
        role: "ADMIN",
      };

      useAuthStore.getState().setUser(user);
      return user;
    } catch (adminErr) {
      useAuthStore.getState().clearAuth();
      throw adminErr;
    }
  }
};
