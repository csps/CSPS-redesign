import axios from "axios";
import type { AuthRequest } from "../interfaces/auth/AuthRequest";
import type { UserResponse } from "../interfaces/user/UserResponse";
import { useAuthStore } from "../store/auth_store";
import api from "./api";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import type { AuthUser } from "../types/auth";
import type { ChangePasswordRequest } from "../interfaces/auth/ChangePasswordRequest";
import type {
  InitiateEmailUpdateRequest,
  ConfirmEmailUpdateRequest,
} from "../interfaces/auth/EmailUpdateRequest";
import type { EmailUpdateApiResponse } from "../interfaces/auth/EmailVerificationResponse";

/**
 * Decodes the payload section of a JWT token without verifying its signature.
 * Used client-side to extract claims (role, sub, position) for immediate
 * routing decisions after login, eliminating the need to wait for a
 * separate profile API call.
 *
 * @param token - The raw JWT string in format "header.payload.signature"
 * @returns The decoded payload object containing JWT claims, or null if decoding fails
 */
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch {
    console.warn("Failed to decode JWT payload");
    return null;
  }
};

/**
 * Builds a minimal AuthUser object from JWT claims. This provides just enough
 * user data for ProtectedRoute guards, navigation decisions, and initial UI
 * rendering (e.g., displaying the user's name in the Hero) without waiting
 * for the full profile API response.
 *
 * Expected JWT payload shape:
 *   { studentId: string, role: "STUDENT"|"ADMIN", fullName: string, sub: string, iat, exp }
 *
 * The fullName claim is split into firstName/lastName so downstream components
 * that construct the display name from those fields (e.g., Hero.tsx) work
 * seamlessly during the optimistic login window.
 *
 * @param claims - Decoded JWT payload containing role, studentId, fullName, and sub
 * @returns A minimal AuthUser object sufficient for routing and initial display, or null if claims are invalid
 */
const buildMinimalUserFromClaims = (
  claims: Record<string, any>,
): AuthUser | null => {
  const role = claims.role;
  if (!role) return null;

  // Split "ROGINAND VILLEGAS" → firstName="ROGINAND", lastName="VILLEGAS"
  const nameParts = (claims.fullName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const isAdmin =
    role === "ADMIN" || role === "ROLE_ADMIN" || role.startsWith("ROLE_ADMIN_");

  if (isAdmin) {
    // Build a minimal UserResponse-shaped object for admin routing
    return {
      userId: Number(claims.sub) || 0,
      username: claims.sub || "",
      firstName,
      lastName,
      birthDate: "",
      email: "",
      role: "ADMIN",
      position: claims.position,
    } as AuthUser;
  }

  // Build a minimal StudentResponse-shaped object for student routing + Hero display
  return {
    studentId: claims.studentId || claims.sub || "",
    yearLevel: 0,
    user: {
      userId: Number(claims.sub) || 0,
      username: claims.sub || "",
      firstName,
      lastName,
      birthDate: "",
      email: "",
      role: "STUDENT",
      isProfileComplete: undefined, // Explicitly undefined — evaluated only after full profile load
    },
    role: "STUDENT",
  } as AuthUser;
};

/**
 * Authenticates a user with the backend and performs optimistic login.
 *
 * @param authRequest - Object containing studentId and password
 * @returns The login API response data containing tokens
 * @throws Re-throws the original error after clearing auth state on failure
 */
export const login = async (authRequest: AuthRequest) => {
  const response = await api.post("/auth/login", authRequest);

  try {
    const { accessToken, refreshToken } = response.data.data;

    // Store tokens in sessionStorage
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    // Decode JWT to extract role/position for immediate routing
    const claims = decodeJwtPayload(accessToken);

    if (claims) {
      const minimalUser = buildMinimalUserFromClaims(claims);
      if (minimalUser) {
        // Set optimistic auth state: enough for ProtectedRoute + navigation
        useAuthStore.getState().setUser(minimalUser);
      }
    }

    // If JWT decode failed for any reason, fall back to blocking profile fetch
    const { isAuthenticated } = useAuthStore.getState();

    console.log("Login successful, JWT claims:", claims);
    console.log("isAuthenticated:", isAuthenticated);

    if (isAuthenticated) {
      await profile();
    }

    return response.data;
  } catch (err) {
    useAuthStore.getState().clearAuth();
    throw err;
  }
};

/**
 * Hydrates the full user profile in the background after optimistic login.
 * Called after navigation to replace the minimal JWT-decoded user object
 * with the complete profile data (name, email, yearLevel, etc.).
 *
 * This is a fire-and-forget operation — if it fails, the user remains
 * authenticated with minimal data. Critical UI components should handle
 * the case where user fields may be empty strings until hydration completes.
 *
 * @returns The full AuthUser object from the profile API, or undefined on failure
 */
export const hydrateFullProfile = async (): Promise<AuthUser | undefined> => {
  try {
    const fullUser = await profile();
    useAuthStore.getState().setProfileLoaded(true);
    return fullUser;
  } catch (err) {
    console.warn("Background profile hydration failed:", err);
    // Non-fatal: user stays authenticated with minimal JWT data.
    // On next page load or manual refresh, profile will be re-fetched.
    return undefined;
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

/**
 * Fetches the authenticated user's full profile from the backend.
 * Checks the JWT token role: if ADMIN, calls the admin endpoint directly.
 * Otherwise, tries the student profile endpoint first, falling back to the admin
 * profile endpoint if the student call fails.
 *
 * @returns The fully populated AuthUser object with role discrimination
 * @throws Propagates API errors after clearing auth state on failure
 */
export const profile = async (): Promise<AuthUser> => {
  // Get the access token and decode it to check the role
  const accessToken = sessionStorage.getItem("accessToken");
  const jwtClaims = accessToken ? decodeJwtPayload(accessToken) : null;
  const tokenRole = jwtClaims?.role;

  const isAdmin =
    tokenRole === "ADMIN" ||
    tokenRole === "ROLE_ADMIN" ||
    (typeof tokenRole === "string" && tokenRole.startsWith("ROLE_ADMIN_"));

  // If JWT indicates admin role, call admin endpoint directly
  if (isAdmin) {
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
    } catch (err) {
      useAuthStore.getState().clearAuth();
      throw err;
    }
  }

  // For students, try student endpoint first
  try {
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
    // If student endpoint fails, try admin endpoint as fallback
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

export const changePassword = async (
  changePasswordRequest: ChangePasswordRequest,
) => {
  try {
    const response = await api.post(
      "/auth/change-password",
      changePasswordRequest,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Initiates the email update process
 * Sends a verification code to the user's current email
 */
export const initiateEmailUpdate = async (
  request: InitiateEmailUpdateRequest,
): Promise<EmailUpdateApiResponse> => {
  try {
    const response = await api.post<EmailUpdateApiResponse>(
      "/auth/email/update/initiate",
      request,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Confirms the email update with verification code
 * Updates the user's email address if code is valid
 */
export const confirmEmailUpdate = async (
  request: ConfirmEmailUpdateRequest,
): Promise<EmailUpdateApiResponse> => {
  try {
    const response = await api.post<EmailUpdateApiResponse>(
      "/auth/email/update/confirm",
      request,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
