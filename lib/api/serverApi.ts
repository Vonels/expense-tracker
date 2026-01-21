import { cookies } from "next/headers";
import { api } from "./api";
import { Note, NoteRes } from "@/types/note";
import { User } from "@/types/user";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const fetchNotes = async (
  page: number,
  search?: string,
  tag?: string,
) => {
  const authHeaders = await getAuthHeaders();
  const res = await api.get<NoteRes>("/notes", {
    ...authHeaders,
    params: { page, perPage: 12, search, tag },
  });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const authHeaders = await getAuthHeaders();
  const res = await api.get<Note>(`/notes/${id}`, authHeaders);
  return res.data;
};

export const getMe = async () => {
  const authHeaders = await getAuthHeaders();
  const res = await api.get<User>("/users/me", authHeaders);
  return res.data;
};

export const checkSession = async (externalCookie?: string) => {
  const cookieString = externalCookie || (await cookies()).toString();

  const res = await api.get<string>("/auth/session", {
    headers: { Cookie: cookieString },
  });
  return res;
};
