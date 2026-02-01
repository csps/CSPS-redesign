import type { AuthRequest } from "../interfaces/auth/AuthRequest";
import type { UserResponse } from "../interfaces/user/UserResponse";
import { useAuthStore } from "../store/auth_store";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import type { TokenPayload } from "../interfaces/token_payload";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import type { AuthUser } from "../types/auth";

export const login = async (authRequest: AuthRequest) => {
  const response = await api.post("/auth/login", authRequest);

  const { accessToken } = response.data.data;

  if (!accessToken) {
    throw new Error("No access token returned");
  }

  useAuthStore.getState().setAccessToken(accessToken);

  try {
    // profile() already sets the user
    await profile();
    return response.data;
  } catch (err) {
    useAuthStore.getState().clearAuth();
    throw err;
  }
};

export const refresh = async () => {
  try {
    const response = await api.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );

    const { accessToken } = response.data;

    useAuthStore.getState().setAccessToken(accessToken);

    return response.data;
  } catch (err) {
    console.error("Refresh error:", err);
    throw err;
  }
};

export const profile = async (): Promise<AuthUser> => {
  const token = useAuthStore.getState().accessToken;

  if (!token) throw new Error("No access token available");

  const decodedToken = jwtDecode<TokenPayload>(token);
  const { role, exp } = decodedToken as TokenPayload;

  // basic token expiry check
  if (typeof exp === "number" && exp < Date.now() / 1000) {
    useAuthStore.getState().clearAuth();
    throw new Error("Access token is expired");
  }

  if (role !== "STUDENT" && role !== "ADMIN") {
    useAuthStore.getState().clearAuth();
    throw new Error("Invalid role in token");
  }

  const endpoint = role === "STUDENT" ? "/auth/profile" : "/auth/admin/profile";

  try {
    if (role === "STUDENT") {
      const res = await api.get<StudentResponse>(endpoint);

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
    }

    const res = await api.get<UserResponse>(endpoint);

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
  } catch (err) {
    // ensure we don't leave a bad token/user in the store
    useAuthStore.getState().clearAuth();
    throw err;
  }
};
