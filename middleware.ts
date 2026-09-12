import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminSessionEdge } from "./lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await verifyAdminSessionEdge(token);
    if (ok) {
      return NextResponse.next();
    }
  } catch {
    // Fall through to login if the session check fails.
  }

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.searchParams.set("from", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
  runtime: "nodejs",
};
