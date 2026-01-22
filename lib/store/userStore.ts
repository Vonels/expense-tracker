import { create } from "zustand";
interface User {
  name: string;
  currency: string;
  avatarUrl: string | null;
}

interface UserState {
  user: User | null;
  setUser: (userData: User) => void;
  updateUser: (newData: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  updateUser: (newData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...newData } : null,
    })),
}));
