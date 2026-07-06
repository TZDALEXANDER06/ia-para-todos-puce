"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { asset } from "../../lib/asset";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    setIsLoading(false);

    if (!response.ok) {
      const body = await response.json();
      setError(body.message ?? "No se pudo iniciar sesion.");
      return;
    }

    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <main className="adminAuth">
      <aside className="authAside">
        <div className="authAsideTop">
          <span className="authBrand">
            <span className="brandMark" aria-hidden="true">
              IA
            </span>
            IA para Todos
          </span>
          <p className="authAsideLead">
            Panel de administración para gestionar los videos educativos del
            proyecto de vinculación de la PUCE.
          </p>
          <ul className="authFeatures">
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Agrega, edita y elimina videos
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Enlaces de YouTube y Google Drive
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Los cambios se publican en el sitio
            </li>
          </ul>
        </div>
        <Image
          className="authBear"
          src={asset("/images/aurelio-hero.png")}
          alt="Aurelio, mascota de la PUCE"
          width={636}
          height={1170}
          priority
          unoptimized
        />
      </aside>

      <div className="authMain">
        <form className="authForm" onSubmit={handleSubmit}>
          <Link className="adminBackLink" href="/">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al sitio
          </Link>

          <span className="authBadge">Panel privado</span>
          <h1>Acceso administrador</h1>
          <p className="authSubtitle">
            Ingresa con las credenciales del equipo para gestionar los enlaces y
            el estado de publicación de los videos.
          </p>

          <label className="field">
            <span className="fieldLabel">Usuario</span>
            <span className="fieldControl">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Usuario"
                required
                type="text"
                value={username}
              />
            </span>
          </label>

          <label className="field">
            <span className="fieldLabel">Contraseña</span>
            <span className="fieldControl">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                className="fieldToggle"
                type="button"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A9.6 9.6 0 0 1 12 4c5 0 9 4.5 10 8a12 12 0 0 1-2.2 3.3M6.1 6.1C3.8 7.5 2.3 9.7 2 12c1 3.5 5 8 10 8a9.6 9.6 0 0 0 3.3-.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </span>
          </label>

          {error ? (
            <div className="formError" role="alert">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          ) : null}

          <button className="button primary authSubmit" disabled={isLoading} type="submit">
            {isLoading ? "Ingresando..." : "Ingresar al panel"}
          </button>

          <p className="authHint">Acceso restringido al equipo del proyecto.</p>
        </form>
      </div>
    </main>
  );
}
