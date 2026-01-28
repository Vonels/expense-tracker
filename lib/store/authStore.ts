import { create } from "zustand";

import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

interface User {
  name: string;

  email: string;

  avatarUrl?: string;

  currency: string;
}

interface AuthState {
  user: User | null;

  token: string | null;

  isLoading: boolean;

  setLoading: (status: boolean) => void;

  setAuthData: (user: User, token: string) => void;

  updateUser: (data: Partial<User>) => void;

  logout: () => void;
}

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const storage: StateStorage =
  typeof window !== "undefined" ? localStorage : noopStorage;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      setLoading: (status) => set({ isLoading: status }),

      setAuthData: (user, token) =>
        set({
          user,
          token,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
