import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectedPaths = ["/user-profile", "/administrator"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    try {
      // Проверяем нашу кастомную cookie
      const sessionCookie = request.cookies.get("user");

      if (!sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user-profile/:path*", "/administrator/:path*"],
};
