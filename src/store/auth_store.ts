import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import type { AuthUser } from "../types/auth";

/**
 * AuthState - Zustand store interface for managing authentication state.
 
 * @property user              - The authenticated user object (minimal from JWT or full from profile API)
 * @property isAuthenticated   - Whether the user has valid tokens (set immediately on login)
 * @property isProfileLoaded   - Whether the full user profile has been fetched from the API
 * @property sessionExpired    - Whether the user's session has expired
 * @property isLoggingOut      - Whether a logout operation is in progress
 * @property setUser           - Sets the user and marks as authenticated
 * @property clearAuth         - Clears all auth state (logout / session expiry)
 * @property setSessionExpired - Updates the session expiry flag
 * @property setLoggingOut     - Updates the logging out flag
 * @property setProfileLoaded  - Marks the full profile as loaded after background fetch
 */
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isProfileLoaded: boolean;
  sessionExpired: boolean;
  isLoggingOut: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setSessionExpired: (expired: boolean) => void;
  setLoggingOut: (loggingOut: boolean) => void;
  setProfileLoaded: (loaded: boolean) => void;
}

// Prefixing unused 'name' with '_' tells TS it's intentionally unused
const customStorage = {
  getItem: (_name: string): StorageValue<AuthState> | null => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const user = sessionStorage.getItem("user");
    const sessionExpired = sessionStorage.getItem("sessionExpired");
    const isProfileLoaded = sessionStorage.getItem("isProfileLoaded");

    if (!isAuthenticated && !user) return null;

    return {
      state: {
        isAuthenticated: isAuthenticated ? JSON.parse(isAuthenticated) : false,
        user: user ? JSON.parse(user) : null,
        sessionExpired: sessionExpired ? JSON.parse(sessionExpired) : false,
        isProfileLoaded: isProfileLoaded ? JSON.parse(isProfileLoaded) : false,
        // We cast as any or Partial here because we don't persist functions
      } as AuthState,
      version: 0,
    };
  },
  setItem: (_name: string, value: StorageValue<AuthState>) => {
    sessionStorage.setItem(
      "isAuthenticated",
      JSON.stringify(value.state.isAuthenticated),
    );
    sessionStorage.setItem("user", JSON.stringify(value.state.user));
    sessionStorage.setItem(
      "sessionExpired",
      JSON.stringify(value.state.sessionExpired),
    );
    sessionStorage.setItem(
      "isProfileLoaded",
      JSON.stringify(value.state.isProfileLoaded),
    );
  },
  removeItem: (_name: string) => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("sessionExpired");
    sessionStorage.removeItem("isProfileLoaded");
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isProfileLoaded: false,
      sessionExpired: false,
      isLoggingOut: false,
      setUser: (user) =>
        set({ user, isAuthenticated: true, sessionExpired: false }),
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isProfileLoaded: false,
          sessionExpired: false,
        }),
      setSessionExpired: (sessionExpired) => set({ sessionExpired }),
      setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
      setProfileLoaded: (loaded) => set({ isProfileLoaded: loaded }),
    }),
    {
      name: "auth",
      storage: customStorage,
      // Fixed: Type-casting the partial state to satisfy the PersistOptions
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isProfileLoaded: state.isProfileLoaded,
          sessionExpired: state.sessionExpired,
        }) as AuthState,
    },
  ),
);
