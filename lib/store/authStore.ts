// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface User {
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   currency: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;

//   setLoading: (status: boolean) => void;
//   setAuthData: (user: User, token: string) => void;
//   updateUser: (data: Partial<User>) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isLoading: false,

//       setLoading: (status) => set({ isLoading: status }),

//       setAuthData: (user, token) => set({ user, token }),

//       updateUser: (data) =>
//         set((state) => ({
//           user: state.user ? { ...state.user, ...data } : null,
//         })),

//       logout: () => set({ user: null, token: null }),
//     }),
//     {
//       name: "auth-storage",
//       partialize: (state) => ({
//         user: state.user,
//         token: state.token,
//       }),
//     }
//   )
// );
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api/api";
interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  currency: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  _hasHydrated: boolean;

  setLoading: (status: boolean) => void;
  setAuthData: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      _hasHydrated: false,

      setLoading: (status) => set({ isLoading: status }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuthData: (user) => set({ user }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get<User>("/users/info");
          set({ user: data });
        } catch {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
