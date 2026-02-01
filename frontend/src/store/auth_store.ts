import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

// Prefixing unused 'name' with '_' tells TS it's intentionally unused
const customStorage = {
  getItem: (_name: string): StorageValue<AuthState> | null => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const user = localStorage.getItem("user");

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
    localStorage.setItem(
      "isAuthenticated",
      JSON.stringify(value.state.isAuthenticated),
    );
    localStorage.setItem("user", JSON.stringify(value.state.user));
  },
  removeItem: (_name: string) => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
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
