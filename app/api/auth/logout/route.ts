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

  let res: NextResponse;

  if (backendRes.status === 204) {
    res = new NextResponse(null, { status: 204 });
  } else {
    res = NextResponse.json(
      { success: backendRes.ok },
      { status: backendRes.status }
    );
  }

  res.headers.set(
    "Set-Cookie",
    "accessToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
  );

  return res;
}
