import { TransactionFormValues, TransactionType } from "@/types/transactions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransactionState {
  transactionType: TransactionType;
  selectedCategory: { id: string; name: string } | null;
  draftData: Partial<TransactionFormValues>;

  // Додано методи в інтерфейс
  setTransactionType: (type: TransactionType) => void;
  setCategory: (id: string, name: string, type?: TransactionType) => void;
  setDraftData: (data: Partial<TransactionFormValues>) => void;
  resetCategory: () => void;
  resetDraft: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactionType: "expenses",
      selectedCategory: null,
      draftData: {},

      setTransactionType: (type: TransactionType) =>
        set({ transactionType: type }),

      setCategory: (id: string, name: string, type?: TransactionType) =>
        set((state) => ({
          selectedCategory: { id, name },
          transactionType: type ? type : state.transactionType,
        })),

      setDraftData: (data: Partial<TransactionFormValues>) =>
        set((state) => ({
          draftData: { ...state.draftData, ...data },
        })),

      resetCategory: () => set({ selectedCategory: null }),

      resetDraft: () => set({ draftData: {}, selectedCategory: null }),
    }),
    {
      name: "transaction-storage",
    }
  )
);
