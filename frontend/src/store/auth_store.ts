import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  isLoggingOut: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  setSessionExpired: (expired: boolean) => void;
  setLoggingOut: (loggingOut: boolean) => void;
}

// Prefixing unused 'name' with '_' tells TS it's intentionally unused
const customStorage = {
  getItem: (_name: string): StorageValue<AuthState> | null => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const user = sessionStorage.getItem("user");

    if (!isAuthenticated && !user) return null;

    return {
      state: {
        isAuthenticated: isAuthenticated ? JSON.parse(isAuthenticated) : false,
        user: user ? JSON.parse(user) : null,
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
  },
  removeItem: (_name: string) => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("user");
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      sessionExpired: false,
      isLoggingOut: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
      setSessionExpired: (expired) => set({ sessionExpired: expired }),
      setLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
    }),
    {
      name: "auth",
      storage: customStorage,
      // Fixed: Type-casting the partial state to satisfy the PersistOptions
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }) as AuthState,
    },
  ),
);
