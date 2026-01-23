import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// публичные только для неавторизованных
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const isAuthenticated = !!accessToken;

  const isAuthRoute = authRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/")
  );

  // Если уже залогинен — на auth-страницы не пускаем
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Никаких проверок приватных страниц — пока всем разрешено
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};
