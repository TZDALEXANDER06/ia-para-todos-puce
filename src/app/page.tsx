import Image from "next/image";
import { podcast, team, videos } from "@/data/project";
import VideosSection from "./videos-section";

const youtubePlaylistUrl = "https://www.youtube.com/";
const spotifyUrl = "https://open.spotify.com/";

export default function Home() {
  return (
    <main>
      <nav className="topbar" aria-label="Navegacion principal">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span className="brandMark" aria-hidden="true">IA</span>
          <span>IA para Todos</span>
        </a>
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
          <a href="#videos">Videos</a>
          <a href="#podcast">Podcast</a>
          <a href="#equipo">Equipo</a>
        </div>
      </nav>

      <section id="inicio" className="hero">
        <div className="heroCopy">
          <p className="eyebrow">PUCE Sistemas - Vinculacion 2026</p>
          <h1>IA para Todos: Educación, Ética y Tecnología</h1>
          <p className="heroLead">
            Una plataforma educativa para organizar videos, podcast, recursos y
            evidencias del proyecto de vinculacion sobre inteligencia artificial
            para la comunidad.
          </p>
          <div className="heroActions" aria-label="Accesos principales">
            <a className="button primary" href="#videos">Ver contenidos</a>
            <a className="button secondary" href="#equipo">Ver equipo</a>
          </div>
        </div>
        <div className="heroVisual" aria-label="Aurelio IA, embajador del proyecto">
          <Image
            src="/images/aurelio-ia-hero.png"
            alt="Mascota tipo oso de anteojos como embajador educativo de inteligencia artificial"
            width={1200}
            height={900}
            priority
          />
        </div>
      </section>

      <section className="metrics" aria-label="Metas principales del proyecto">
        <div>
          <strong>8</strong>
          <span>videos educativos</span>
        </div>
        <div>
          <strong>6</strong>
          <span>episodios de podcast</span>
        </div>
        <div>
          <strong>40+</strong>
          <span>publicaciones en redes</span>
        </div>
        <div>
          <strong>120 h</strong>
          <span>por estudiante</span>
        </div>
      </section>

      <section className="section objective" id="proyecto">
        <h2>Objetivo general</h2>
        <p>
          Diseñar, producir y publicar un ecosistema digital educativo sobre
          Inteligencia Artificial que incluya sitio web, videos, podcast y
          redes sociales, utilizando herramientas de IA Generativa para potenciar
          la calidad del contenido y proyectar la identidad institucional de la
          PUCE hacia la comunidad.
        </p>
      </section>

      <section className="section" id="videos">
        <div className="sectionHeader">
          <h2>Videos educativos</h2>
          <a className="textLink" href={youtubePlaylistUrl}>Playlist en YouTube</a>
        </div>
        <VideosSection initialVideos={videos} showMoreLink />
      </section>

      <section className="section mediaBand" id="podcast">
        <div>
          <p className="eyebrow">Podcast semanal</p>
          <h2>Aurelio Habla de IA</h2>
          <p>
            Seis episodios publicados entre la semana 2 y la semana 7, con
            introduccion, desarrollo, recomendacion de la semana, timestamps y
            notas completas para Spotify.
          </p>
          <a className="button secondary" href={spotifyUrl}>Abrir en Spotify</a>
        </div>
        <ol className="podcastList">
          {podcast.map((episode, index) => (
            <li key={episode}>
              <span>EP{String(index + 1).padStart(2, "0")}</span>
              {episode}
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="equipo">
        <div className="sectionHeader">
          <p className="eyebrow">Roles</p>
          <h2>Equipo de trabajo</h2>
        </div>
        <div className="teamGrid">
          {team.map((member) => (
            <article className="personCard" key={member.email}>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <span>{member.focus}</span>
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footerMain">
          <strong>IA para Todos - PUCE Sistemas 2026</strong>
          <address className="footerContact">
            <span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.4" />
              </svg>
              Avenida 12 de Octubre 1076 y Vicente Ramón Roca
            </span>
            <a href="tel:+593022991700">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z" />
              </svg>
              (593) (02) 2991700
            </a>
            <a href="https://www.puce.edu.ec">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                <path d="M12 2a15.3 15.3 0 0 0 0 20" />
              </svg>
              www.puce.edu.ec
            </a>
          </address>
          <p>
            Todos los derechos reservados Pontificia Universidad Católica del
            Ecuador - Dirección de Informática - 2023
          </p>
        </div>
      </footer>
    </main>
  );
}
