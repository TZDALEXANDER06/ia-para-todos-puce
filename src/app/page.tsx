import { team, videos, podcast } from "@/data/project";
import VideosSection from "./videos-section";
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
const publishedPodcasts = podcast.length;

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
          <div className="metricCard">
            <span className="metricIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <strong>
              <CountUp end={40} suffix="+" />
            </strong>
            <span>publicaciones en redes</span>
          </div>
          <div className="metricCard">
            <span className="metricIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <strong>
              <CountUp end={120} suffix=" h" />
            </strong>
            <span>horas por estudiante</span>
          </div>
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
              Conversaciones para escuchar sobre IA, ética y vida estudiantil.
              {" "}
              {publishedPodcasts} episodios publicados.
            </p>
          </Reveal>
          <div className="podcastGrid">
            {podcast.map((title, index) => (
              <Reveal key={title} delay={index * 70}>
                <article className="podcastCard">
                  <div className="podcastTop">
                    <span className="podcastNumber">
                      EP {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="podcastIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <h3>{title}</h3>
                  <p className="podcastMeta">
                    <span className="wave" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    Episodio de podcast
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
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
