import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "ia_admin_session";

export function proxy(request: NextRequest) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (session === sessionToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin"]
};
