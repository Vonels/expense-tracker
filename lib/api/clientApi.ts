import { Note, NoteFormValues, NoteRes } from "@/types/note";
import { api } from "./api";
import { User } from "@/types/user";

export interface AuthCredentials {
  email: string;
  password: string;
}

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string,
) => {
  const res = await api.get<NoteRes>("/notes", {
    params: { page, perPage: 12, search, tag },
  });
  console.log(res);
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (values: NoteFormValues) => {
  const res = await api.post<Note>("/notes", values);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const register = async (values: AuthCredentials) => {
  const res = await api.post<User>("/auth/register", values);
  return res.data;
};

export const login = async (values: AuthCredentials) => {
  const res = await api.post<User>("/auth/login", values);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await api.get<User | null>("/auth/session");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (values: Partial<User>) => {
  const res = await api.patch<User>("/users/me", values);
  return res.data;
};
