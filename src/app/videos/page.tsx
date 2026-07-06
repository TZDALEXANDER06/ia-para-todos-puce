import { videos } from "@/data/project";
import VideosSection from "../videos-section";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import Reveal from "../components/reveal";

export const metadata = {
  title: "Videos educativos"
};

const videoLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#proyecto", label: "Proyecto" },
  { href: "/#podcast", label: "Podcast" },
  { href: "/#equipo", label: "Equipo" }
];

export default function VideosPage() {
  return (
    <main>
      <SiteHeader brandHref="/" links={videoLinks} />

      <section className="section videosPageHero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Biblioteca audiovisual</p>
            <h1>Videos educativos</h1>
            <p>
              Explora todos los videos publicados del proyecto IA para Todos,
              incluyendo la serie inicial y los nuevos contenidos agregados por
              el equipo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section videosPageList">
        <div className="container">
          <Reveal>
            <VideosSection initialVideos={videos} showAll />
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
