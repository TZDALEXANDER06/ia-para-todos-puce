"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="adminShell">
      <form className="loginPanel" onSubmit={handleSubmit}>
        <Link className="adminBackLink" href="/">Volver al sitio</Link>
        <p className="eyebrow">Panel privado</p>
        <h1>Acceso administrador</h1>
        <p>
          Ingresa con las credenciales del equipo para gestionar enlaces de
          videos y estado de publicacion.
        </p>

        <label>
          Usuario
          <input
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            required
            type="text"
            value={username}
          />
        </label>

        <label>
          Contraseña
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error ? <div className="formError">{error}</div> : null}

        <button className="button primary" disabled={isLoading} type="submit">
          {isLoading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
