"use client";

import { useEffect, useMemo, useState } from "react";
import { getSpotifyEmbedUrl, normalizeSpotifyUrl } from "../lib/spotify";

type Podcast = {
  number: string;
  title: string;
  description: string;
  spotifyUrl?: string;
};

function getNextNumber(podcasts: Podcast[]) {
  return String(podcasts.length + 1).padStart(2, "0");
}

function renumber(podcasts: Podcast[]) {
  return podcasts.map((podcast, index) => ({
    ...podcast,
    number: String(index + 1).padStart(2, "0")
  }));
}

export default function PodcastManager({
  initialPodcasts
}: {
  initialPodcasts: Podcast[];
}) {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/podcasts", { cache: "no-store" });
      if (response.ok) {
        setPodcasts(await response.json());
      }
      setIsLoading(false);
    }

    load();
  }, []);

  const publishedCount = useMemo(
    () => podcasts.filter((podcast) => Boolean(getSpotifyEmbedUrl(podcast.spotifyUrl))).length,
    [podcasts]
  );

  async function persist(next: Podcast[], successMessage: string) {
    setIsSaving(true);
    setSaveMessage("");

    const response = await fetch("/api/podcasts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });

    setIsSaving(false);

    if (!response.ok) {
      const body = await response.json();
      setSaveMessage(body.message ?? "No se pudieron guardar los cambios.");
      return false;
    }

    setSaveMessage(successMessage);
    return true;
  }

  function updatePodcast(index: number, field: keyof Podcast, value: string) {
    setPodcasts((current) =>
      current.map((podcast, currentIndex) =>
        currentIndex === index
          ? {
              ...podcast,
              [field]:
                field === "spotifyUrl" ? normalizeSpotifyUrl(value) : value
            }
          : podcast
      )
    );
    setSaveMessage("");
  }

  async function addPodcast() {
    const next = [
      ...podcasts,
      {
        number: getNextNumber(podcasts),
        title: "",
        description: "",
        spotifyUrl: ""
      }
    ];

    setPodcasts(next);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);

    const saved = await persist(
      next,
      "Episodio agregado y guardado. Ya se mantendrá al actualizar."
    );

    if (!saved) {
      setPodcasts(podcasts);
    }
  }

  async function deletePodcast(index: number) {
    const next = renumber(
      podcasts.filter((_, currentIndex) => currentIndex !== index)
    );

    setPodcasts(next);

    const saved = await persist(
      next,
      "Episodio borrado y numeración actualizada."
    );

    if (!saved) {
      setPodcasts(podcasts);
    }
  }

  async function saveChanges() {
    await persist(podcasts, "Cambios guardados. Ya se verán en la página pública.");
  }

  return (
    <>
      <header className="adminHeader">
        <div>
          <span className="authBadge">Gestión de podcast</span>
          <h1>Podcast del proyecto</h1>
          <p>
            Edita el título, la descripción y pega el enlace de Spotify de cada
            episodio. El reproductor aparece aquí y en la página pública.
          </p>
        </div>
        <div className="adminActions">
          <button
            className={`button secondary addVideoButton ${justAdded ? "added" : ""}`}
            disabled={isSaving}
            onClick={addPodcast}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            {justAdded ? "Episodio agregado" : "Agregar episodio"}
          </button>
          <button
            className="button primary"
            disabled={isSaving}
            onClick={saveChanges}
            type="button"
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </header>

      <section className="adminStats" aria-label="Resumen de episodios">
        <div className="adminStat">
          <span className="adminStatIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{podcasts.length}</strong>
          <span>episodios en total</span>
        </div>
        <div className="adminStat">
          <span className="adminStatIcon is-green" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{publishedCount}</strong>
          <span>con Spotify publicado</span>
        </div>
        <div className="adminStat">
          <span className="adminStatIcon is-amber" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{podcasts.length - publishedCount}</strong>
          <span>pendientes de enlace</span>
        </div>
      </section>

      {saveMessage ? (
        <div className="saveMessage" role="status">
          {saveMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="adminLoading">Cargando episodios...</div>
      ) : null}

      <section className="pmGrid" aria-label="Episodios del podcast">
        {podcasts.map((podcast, index) => {
          const embedUrl = getSpotifyEmbedUrl(podcast.spotifyUrl);
          const hasLink = Boolean(podcast.spotifyUrl?.trim());
          const invalidLink = hasLink && !embedUrl;

          return (
            <article className="pmCard" key={`${podcast.number}-${index}`}>
              <div className="pmMedia">
                <span className="avNum">EP {podcast.number}</span>
                {embedUrl ? (
                  <iframe
                    className="pmSpotify"
                    src={embedUrl}
                    title={podcast.title || `Episodio ${podcast.number}`}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="pmPlaceholder">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M7.5 14.5c2.8-1 6-0.8 8.5 0.7M7 11.4c3.4-1.1 7-0.8 10 1M7 8.4c3.8-1.1 7.8-0.7 10.5 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Pega un enlace de Spotify para ver el reproductor
                  </div>
                )}
              </div>

              <div className="avBody">
                <div className="avBodyTop">
                  <span
                    className={`avStatus ${hasLink ? "is-published" : "is-pending"}`}
                  >
                    <span className="dot" aria-hidden="true" />
                    {hasLink ? "Publicado" : "Pendiente"}
                  </span>
                  <button
                    className="deleteVideoButton"
                    disabled={isSaving}
                    onClick={() => deletePodcast(index)}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
                      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Eliminar
                  </button>
                </div>

                <label>
                  <span>Título</span>
                  <input
                    onChange={(event) => updatePodcast(index, "title", event.target.value)}
                    placeholder="Título del episodio"
                    value={podcast.title}
                  />
                </label>

                <label>
                  <span>Descripción</span>
                  <textarea
                    onChange={(event) =>
                      updatePodcast(index, "description", event.target.value)
                    }
                    placeholder="Descripción breve del episodio"
                    rows={2}
                    value={podcast.description}
                  />
                </label>

                <label>
                  <span>Enlace de Spotify</span>
                  <input
                    onChange={(event) =>
                      updatePodcast(index, "spotifyUrl", event.target.value)
                    }
                    placeholder="https://open.spotify.com/episode/..."
                    value={podcast.spotifyUrl ?? ""}
                  />
                </label>

                {invalidLink ? (
                  <p className="avHint is-warning">
                    Enlace no reconocido. Usa un enlace de Spotify (episodio,
                    show o playlist).
                  </p>
                ) : hasLink ? (
                  <p className="avHint is-ok">Enlace de Spotify válido.</p>
                ) : (
                  <p className="avHint">Sin enlace: el episodio aparece como pendiente.</p>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
