import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { parse } from "cookie";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/auth/login", body);

    const setCookie = apiRes.headers["set-cookie"];

    const res = NextResponse.json(apiRes.data);

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path ?? "/",
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.Expires) options.expires = new Date(parsed.Expires);
        if (parsed["Max-Age"]) options.maxAge = Number(parsed["Max-Age"]);

        if (parsed.accessToken) {
          res.cookies.set("accessToken", parsed.accessToken as string, options);
        }

        if (parsed.refreshToken) {
          res.cookies.set(
            "refreshToken",
            parsed.refreshToken as string,
            options
          );
        }
      }
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }
}
