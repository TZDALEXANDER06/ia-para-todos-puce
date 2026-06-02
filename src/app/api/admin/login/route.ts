import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "ia_admin_session";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!adminUsername || !adminPassword || !sessionToken) {
    return NextResponse.json(
      { message: "Las credenciales de administrador no estan configuradas." },
      { status: 500 }
    );
  }

  if (username !== adminUsername || password !== adminPassword) {
    return NextResponse.json(
      { message: "Usuario o contrasena incorrectos." },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
