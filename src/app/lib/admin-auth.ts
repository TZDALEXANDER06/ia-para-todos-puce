const SESSION_COOKIE = "ia_admin_session";

/**
 * Verifica la sesión del administrador leyendo la cabecera `Cookie` de la
 * petición. Se hace así (y no con cookies() de next/headers) porque las rutas
 * de API están marcadas como `force-static` para poder exportarse a GitHub
 * Pages, y en ese modo cookies() queda neutralizado (devuelve vacío). La
 * cabecera cruda de la petición sí llega intacta en Vercel/servidor.
 */
export function isAuthorized(request: Request): boolean {
  const token = process.env.ADMIN_SESSION_TOKEN;
  if (!token) {
    return false;
  }

  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const name = part.slice(0, eq).trim();
    if (name === SESSION_COOKIE) {
      return decodeURIComponent(part.slice(eq + 1).trim()) === token;
    }
  }

  return false;
}
