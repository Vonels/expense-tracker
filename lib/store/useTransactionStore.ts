import { create } from "zustand";

interface TransactionState {
  transactionType: "expenses" | "incomes";
  setTransactionType: (type: "expenses" | "incomes") => void;
  selectedCategory: { id: string; name: string } | null;
  setCategory: (id: string, name: string) => void;
  resetCategory: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactionType: "expenses",
  selectedCategory: null,

  setTransactionType: (type) => set({ transactionType: type }),
  setCategory: (id, name) => set({ selectedCategory: { id, name } }),
  resetCategory: () => set({ selectedCategory: null }),
}));
