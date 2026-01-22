import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  await api.post("auth/logout", null, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const res = NextResponse.json({ message: "Logged out successfully" });

  res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return res;
}
