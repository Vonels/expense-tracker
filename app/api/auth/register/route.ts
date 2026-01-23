import { NextRequest, NextResponse } from "next/server";
import { api, ApiError } from "../../api";
import { parse } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const apiRes = await api.post("auth/register", body);

    const setCookie = apiRes.headers["set-cookie"];

    if (!setCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    const res = NextResponse.json(apiRes.data);

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
