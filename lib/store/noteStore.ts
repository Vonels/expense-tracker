import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NoteDraft {
  title: string;
  content: string;
  tag: string;
}

interface NoteState {
  draft: NoteDraft;
  setDraft: (partialDraft: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (partialDraft) =>
        set((state) => ({
          draft: { ...state.draft, ...partialDraft },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
