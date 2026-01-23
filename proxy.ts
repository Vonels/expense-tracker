import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

// приватные страницы ExpenseTracker
const privateRoutes = ["/expenses", "/profile"];

// публичные только для неавторизованных
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let justRefreshed = false;
  let newCookies: string[] = [];

  // если нет accessToken, но есть refreshToken — пытаемся обновить сессию
  if (!isAuthenticated && refreshToken) {
    try {
      // твой serverApi checkSession ожидает cookie-string
      const response = await checkSession(`refreshToken=${refreshToken}`);

      if (response.status === 200) {
        isAuthenticated = true;
        justRefreshed = true;

        const setCookieHeader = response.headers["set-cookie"];
        if (setCookieHeader) {
          newCookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
        }
      }
    } catch (error) {
      console.error("Session refresh failed in proxy:", error);
    }
  }

  const isPrivateRoute = privateRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // если только что обновили токены — надо записать set-cookie в браузер
  if (justRefreshed) {
    // если человек на auth-странице — после рефреша уводим на dashboard (или "/")
    const targetUrl = isAuthRoute
      ? new URL("/dashboard", request.url)
      : request.url;
    const redirectResponse = NextResponse.redirect(targetUrl);

    newCookies.forEach((cookie) => {
      redirectResponse.headers.append("set-cookie", cookie);
    });

    return redirectResponse;
  }

  // приватка без авторизации → sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // auth страницы при авторизации → dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// // публичные только для неавторизованных
// const authRoutes = ["/sign-in", "/sign-up"];

// export async function proxy(request: NextRequest) {
//   const { nextUrl } = request;

//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;

//   const isAuthenticated = !!accessToken;

//   const isAuthRoute = authRoutes.some(
//     (route) =>
//       nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"),
//   );

//   // Если уже залогинен — на auth-страницы не пускаем
//   if (isAuthRoute && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Никаких проверок приватных страниц — пока всем разрешено
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/sign-in", "/sign-up"],
// };
