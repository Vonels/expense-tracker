import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/auth/logout`,
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );

  const res = NextResponse.json(
    { success: true },
    { status: backendRes.status }
  );

  res.headers.set("set-cookie", "accessToken=; Path=/; Max-Age=0");

  return res;
}
