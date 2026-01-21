export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

export interface NoteRes {
  notes: Note[];
  totalPages: number;
}
