import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/dashboard", "/expenses", "/incomes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let newCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession(request.cookies.toString());
      const setCookieHeader = sessionRes.headers["set-cookie"];

      if (setCookieHeader) {
        newCookies = setCookieHeader;
        accessToken = "updated";
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  const isAuthenticated = !!accessToken;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isLandingPage = pathname === "/";
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let response: NextResponse;

  // --- ЛОГІКА РЕДИРЕКТІВ ---

  if (isAuthenticated && (isLandingPage || isAuthRoute)) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (!isAuthenticated && isPrivateRoute) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else {
    response = NextResponse.next();
  }

  if (newCookies.length > 0) {
    newCookies.forEach((cookie) => {
      response.headers.append("set-cookie", cookie);
    });
  }

  return response;
}
