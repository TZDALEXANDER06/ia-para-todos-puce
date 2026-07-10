import { team, videos, podcasts } from "@/data/project";
import VideosSection from "./videos-section";
import PodcastsSection from "./podcasts-section";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import Hero from "./components/hero";
import Reveal from "./components/reveal";
import CountUp from "./components/count-up";

const homeLinks = [
  { href: "#proyecto", label: "Proyecto" },
  { href: "#videos", label: "Videos" },
  { href: "#podcast", label: "Podcast" },
  { href: "#equipo", label: "Equipo" },
  { href: "#videos", label: "Ver contenidos", cta: true }
];

// Contadores dinámicos: se calculan desde los datos publicados.
const publishedVideos = videos.filter((video) =>
  Boolean(video.youtubeUrl && video.youtubeUrl.trim())
).length;
const publishedPodcasts = podcasts.length;

export default function Home() {
  return (
    <main>
      <SiteHeader brandHref="#inicio" links={homeLinks} />

      <Hero />

      <div className="container">
        <Reveal className="metrics" aria-label="Metas principales del proyecto">
          <div className="metricCard">
            <span className="metricIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m10 8 6 4-6 4V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <strong>
              <CountUp end={publishedVideos} />
            </strong>
            <span>videos educativos</span>
          </div>
          <div className="metricCard">
            <span className="metricIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
                <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <strong>
              <CountUp end={publishedPodcasts} />
            </strong>
            <span>episodios de podcast</span>
          </div>
          <a
            className="igCard"
            href="https://www.instagram.com/uso_etico_de_ia_puce?igsh=MTRmcndpdWR0cjY0bQ%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Síguenos en Instagram: @uso_etico_de_ia_puce"
          >
            <span className="igTop">
              <span className="igIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
                </svg>
              </span>
              <span className="igFollow">Síguenos</span>
            </span>
            <strong className="igHandle">
              @uso_etico_<wbr />de_ia_<wbr />puce
            </strong>
            <span className="igLabel">
              Nuestra comunidad en Instagram
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

          <a
            className="igCard spCard"
            href="https://open.spotify.com/show/033M3Ff6f9seP2r6A9Ib5F"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escúchanos en Spotify: Campaña Uso Ético de la IA"
          >
            <span className="igTop">
              <span className="igIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7.5 14.5c2.8-1 6-0.8 8.5 0.7M7 11.4c3.4-1.1 7-0.8 10 1M7 8.4c3.8-1.1 7.8-0.7 10.5 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="igFollow">Escúchanos</span>
            </span>
            <strong className="igHandle">Campaña Uso Ético de la IA</strong>
            <span className="igLabel">
              Nuestro podcast en Spotify
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </Reveal>
      </div>

      <section className="section" id="proyecto">
        <div className="container">
          <Reveal className="objective">
            <h2>Objetivo general</h2>
            <p>
              Diseñar, producir y publicar un ecosistema digital educativo sobre
              Inteligencia Artificial que incluya sitio web, videos y redes
              sociales, utilizando herramientas de IA Generativa para potenciar
              la calidad del contenido y proyectar la identidad institucional de
              la PUCE hacia la comunidad.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" id="videos">
        <div className="container">
          <Reveal className="sectionHeader">
            <p className="eyebrow">Biblioteca audiovisual</p>
            <h2>Videos educativos</h2>
            <p>
              Contenidos breves y claros para aprender de IA con Aurelio: ética,
              seguridad digital, herramientas y buenas prácticas.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <VideosSection initialVideos={videos} showMoreLink />
          </Reveal>
        </div>
      </section>

      <section className="section" id="podcast">
        <div className="container">
          <Reveal className="sectionHeader">
            <p className="eyebrow">Serie de audio</p>
            <h2>Podcast</h2>
            <p>
              Escucha nuestras conversaciones sobre IA, ética y vida estudiantil
              directamente desde Spotify.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <PodcastsSection initialPodcasts={podcasts} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="equipo">
        <div className="container">
          <Reveal className="sectionHeader">
            <p className="eyebrow">Roles del equipo</p>
            <h2>Equipo de trabajo</h2>
            <p>
              Estudiantes de PUCE Sistemas detrás del proyecto de vinculación IA
              para Todos.
            </p>
          </Reveal>
          <div className="teamGrid">
            {team.map((member, index) => (
              <Reveal key={member.email} delay={index * 90}>
                <article className="personCard">
                  <h3>{member.name}</h3>
                  <p className="personRole">{member.role}</p>
                  <span>{member.focus}</span>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
