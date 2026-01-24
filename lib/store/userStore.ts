import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Category {
  _id: string;
  categoryName: string;
  type: "incomes" | "expenses";
  sum: number | null;
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

  updateUser: (
    data: Partial<Pick<UserState, "name" | "avatarUrl" | "currency">>
  ) => void;

  setCategories: (type: "incomes" | "expenses", categories: Category[]) => void;
  updateTotals: (totals: { incomes?: number; expenses?: number }) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      _id: "",
      name: null,
      email: "",
      avatarUrl: null,
      currency: "uah",
      categories: {
        incomes: [],
        expenses: [],
      },
      transactionsTotal: {
        incomes: 0,
        expenses: 0,
      },

      updateUser: (data) =>
        set((state) => ({ ...state, ...data }), false, "updateUser"),

      setCategories: (type, categories) =>
        set(
          (state) => ({
            categories: { ...state.categories, [type]: categories },
          }),
          false,
          "setCategories"
        ),

      updateTotals: (newTotals) =>
        set(
          (state) => ({
            transactionsTotal: { ...state.transactionsTotal, ...newTotals },
          }),
          false,
          "updateTotals"
        ),
    }),
    { name: "UserStore" }
  )
);
