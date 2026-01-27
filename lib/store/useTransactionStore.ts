import { TransactionType } from "@/types/transactions";
import { create } from "zustand";

interface TransactionState {
  transactionType: TransactionType;
  setTransactionType: (type: TransactionType) => void;
  selectedCategory: { id: string; name: string } | null;
  setCategory: (id: string, name: string, type?: TransactionType) => void;
  resetCategory: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactionType: "expenses",
  selectedCategory: null,

  setTransactionType: (type) => set({ transactionType: type }),
  setCategory: (id, name, type) =>
    set((state) => ({
      selectedCategory: { id, name },
      transactionType: type ? type : state.transactionType,
    })),
  resetCategory: () => set({ selectedCategory: null }),
}));
