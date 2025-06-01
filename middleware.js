import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimit.js";
import { verifyToken } from "@/controllers/auth.controller.js";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/api/auth"];

function isPublic(pathname) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Rate limiting for API routes (optional)
  // if (pathname.startsWith("/api/")) {
  //   const rateLimitResponse = rateLimiter(request);
  //   if (rateLimitResponse) return rateLimitResponse;
  // }

  // 2. Access token from cookies
  const accessToken = request.cookies.get("accessToken")?.value;

  // 3. Allow public routes without auth
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 4. Redirect or return 401 if no token
  if (!accessToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    if (!pathname.startsWith("/api/")) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. Verify token
  const isValid = await verifyToken(accessToken);
  if (!isValid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    if (!pathname.startsWith("/api/")) {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
