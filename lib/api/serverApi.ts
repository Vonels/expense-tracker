import { cookies } from "next/headers";
import { api } from "./api";

export const checkSession = async (externalCookie?: string) => {
  const cookieString = externalCookie || (await cookies()).toString();

  const res = await api.get<string>("/auth/session", {
    headers: { Cookie: cookieString },
  });
  return res;
};
