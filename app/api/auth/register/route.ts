import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { parse } from "cookie";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/register", body);

    const setCookie = apiRes.headers["set-cookie"];
    const res = NextResponse.json(apiRes.data, { status: 201 });

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const entries = Object.entries(parsed);

        if (entries.length === 0) continue;

        const [cookieName, cookieValue] = entries[0];

        const options: Partial<ResponseCookie> = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: parsed.Path ?? "/",
        };

        if (parsed.Expires) options.expires = new Date(parsed.Expires);
        if (parsed["Max-Age"]) options.maxAge = Number(parsed["Max-Age"]);

        if (
          (cookieName === "accessToken" || cookieName === "refreshToken") &&
          cookieValue
        ) {
          res.cookies.set(cookieName, cookieValue, options);
        }
      }
    }

    return res;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage =
      apiError.response?.data?.error ||
      apiError.message ||
      "Registration failed";

    return NextResponse.json(
      { error: errorMessage },
      { status: apiError.status || 500 }
    );
  }
}
