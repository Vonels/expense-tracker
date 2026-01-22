import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.json({ success: true });
  }

  if (refreshToken) {
    const apiRes = await api.get("auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      const res = NextResponse.json({ success: true });

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path ?? "/",
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.accessToken) {
          res.cookies.set("accessToken", parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          res.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }

      return res;
    }
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
