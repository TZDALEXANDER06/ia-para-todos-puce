import Image from "next/image";
import Link from "next/link";
import { videos } from "@/data/project";
import VideosSection from "../videos-section";

export const metadata = {
  title: "Videos educativos"
};

export default function VideosPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Navegacion principal">
        <Link className="brand" href="/" aria-label="Volver al inicio">
          <span className="brandMark" aria-hidden="true">IA</span>
          <span>IA para Todos</span>
        </Link>
        <div className="headerLogo" aria-label="Pontificia Universidad Católica del Ecuador">
          <Image
            src="/images/logo_puce.png"
            alt="Pontificia Universidad Católica del Ecuador"
            width={608}
            height={156}
            priority
          />
        </div>
        <div className="navLinks">
          <Link href="/">Inicio</Link>
          <Link href="/#podcast">Podcast</Link>
          <Link href="/#equipo">Equipo</Link>
        </div>
      </nav>

      <section className="section videosPageHero">
        <p className="eyebrow">Biblioteca audiovisual</p>
        <h1>Videos educativos</h1>
        <p>
          Explora todos los videos publicados del proyecto IA para Todos,
          incluyendo la serie inicial y los nuevos contenidos agregados por el
          equipo.
        </p>
      </section>

      <section className="section videosPageList">
        <VideosSection initialVideos={videos} showAll />
      </section>
    </main>
  );
}
