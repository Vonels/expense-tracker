import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      token: null,

      isLoading: false,

      setLoading: (status) => set({ isLoading: status }),

      setAuthData: (user, token) => set({ user, token }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : (data as User),
        })),

      logout: () => set({ user: null, token: null }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),//працюю над логаут
      partialize: (state) => ({
        user: state.user,

        token: state.token,
      }),
    }
  )
);
