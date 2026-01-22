import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Category {
  _id: string;
  categoryName: string;
  type: "incomes" | "expenses";
}

interface UserState {
  _id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  currency: string;
  categories: {
    incomes: Category[];
    expenses: Category[];
  };
  transactionsTotal: {
    incomes: number;
    expenses: number;
  };

  updateProfile: (
    data: Partial<Pick<UserState, "name" | "avatarUrl" | "currency">>,
  ) => void;
  setCategories: (type: "incomes" | "expenses", categories: Category[]) => void;
  updateTotals: (totals: { incomes?: number; expenses?: number }) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      _id: "507f1f77bcf86cd799439011",
      name: "Bob",
      email: "user@example.com",
      avatarUrl: "https://some.url.com/path/to/avatar.jpg",
      currency: "usd",
      categories: {
        incomes: [
          {
            _id: "6522bf1f9027bb7d55d6512b",
            categoryName: "Salary",
            type: "incomes",
          },
        ],
        expenses: [
          {
            _id: "6522bf1f9027bb7d55c1973a",
            categoryName: "Car",
            type: "expenses",
          },
        ],
      },
      transactionsTotal: {
        incomes: 700,
        expenses: 700,
      },

      updateProfile: (data) => set((state) => ({ ...state, ...data })),

      setCategories: (type, categories) =>
        set((state) => ({
          categories: { ...state.categories, [type]: categories },
        })),

      updateTotals: (newTotals) =>
        set((state) => ({
          transactionsTotal: { ...state.transactionsTotal, ...newTotals },
        })),
    }),
    { name: "UserStore" },
  ),
);
