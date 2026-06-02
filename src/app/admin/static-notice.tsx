import Link from "next/link";

export default function StaticAdminNotice() {
  return (
    <main className="adminShell">
      <section className="loginPanel">
        <Link className="adminBackLink" href="/">Volver al sitio</Link>
        <p className="eyebrow">Panel administrador</p>
        <h1>Panel no disponible en GitHub Pages</h1>
        <p>
          GitHub Pages publica sitios estaticos. Para usar login, cookies y
          guardado real de videos, este panel debe desplegarse en Vercel,
          Netlify o conectarse a una base de datos.
        </p>
      </section>
    </main>
  );
}
