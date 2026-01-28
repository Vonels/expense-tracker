import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { api } from "@/lib/api/api";

interface User {
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  currency: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  _hasHydrated: boolean;

  setLoading: (status: boolean) => void;
  setAuthData: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
  refreshUser: () => Promise<void>;
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
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      _hasHydrated: false,

      setLoading: (status) => set({ isLoading: status }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuthData: (user, token) => set({ user, token }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await api.get<User>("/users/info");
          set({ user: data });
        } catch (error) {
          console.error("Auth refresh failed:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
