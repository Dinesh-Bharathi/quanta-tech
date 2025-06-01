import { NextResponse } from "next/server";
import { rateLimiter } from "@/lib/ratelimit.js";
import {
  verifyToken,
  isSessionActive,
  updateSessionExpiry,
} from "@/controllers/auth.controller.js";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
];

function isPublic(pathname) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function unauthorized(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  // Optional: Rate limiting
  // if (isApiRoute) {
  //   const rateLimitResponse = rateLimiter(request);
  //   if (rateLimitResponse) return rateLimitResponse;
  // }

  // Skip public routes
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) return unauthorized(request);

  const isValid = await verifyToken(accessToken);
  if (!isValid) return unauthorized(request);

  const isActive = await isSessionActive(accessToken);
  if (!isActive) return unauthorized(request);

  const didExtend = await updateSessionExpiry(accessToken);

  const response = NextResponse.next();

  if (didExtend) {
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      sameSite: "lax",
    });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
