"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getVideoEmbedUrl,
  getVideoProvider,
  getVideoThumbnail,
  normalizeVideoUrl
} from "../lib/video";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

const providerLabels: Record<string, string> = {
  youtube: "YouTube",
  drive: "Google Drive",
  none: "Sin enlace"
};

function getNextVideoNumber(videos: Video[]) {
  return String(videos.length + 1).padStart(2, "0");
}

function renumberVideos(videos: Video[]) {
  return videos.map((video, index) => ({
    ...video,
    number: String(index + 1).padStart(2, "0")
  }));
}

export default function VideoManager({
  initialVideos
}: {
  initialVideos: Video[];
}) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadVideos() {
      const response = await fetch("/api/videos", { cache: "no-store" });
      if (response.ok) {
        setVideos(await response.json());
      }
      setIsLoading(false);
    }

    loadVideos();
  }, []);

  const publishedCount = useMemo(
    () => videos.filter((video) => Boolean(video.youtubeUrl)).length,
    [videos]
  );

  async function persistVideos(nextVideos: Video[], successMessage: string) {
    setIsSaving(true);
    setSaveMessage("");

    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextVideos)
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

  function updateVideo(index: number, field: keyof Video, value: string) {
    setVideos((currentVideos) =>
      currentVideos.map((video, currentIndex) =>
        currentIndex === index
          ? {
              ...video,
              [field]: field === "youtubeUrl" ? normalizeVideoUrl(value) : value
            }
          : video
      )
    );
    setSaveMessage("");
  }

  async function addVideo() {
    const nextVideos = [
      ...videos,
      {
        number: getNextVideoNumber(videos),
        title: "",
        topic: "",
        youtubeUrl: ""
      }
    ];

    setVideos(nextVideos);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);

    const saved = await persistVideos(
      nextVideos,
      "Video agregado y guardado. Ya se mantendrá al actualizar."
    );

    if (!saved) {
      setVideos(videos);
    }
  }

  async function deleteVideo(index: number) {
    const nextVideos = renumberVideos(
      videos.filter((_, currentIndex) => currentIndex !== index)
    );

    setPreviewIndex(null);
    setVideos(nextVideos);

    const saved = await persistVideos(
      nextVideos,
      "Video borrado y numeración actualizada."
    );

    if (!saved) {
      setVideos(videos);
    }
  }

  async function saveChanges() {
    await persistVideos(
      videos,
      "Cambios guardados. Ya se verán en la página pública."
    );
  }

  return (
    <>
      <header className="adminHeader">
        <div>
          <span className="authBadge">Gestión de videos</span>
          <h1>Videos del proyecto</h1>
          <p>
            Edita el título, la descripción y el enlace de YouTube o Google
            Drive. Los cambios se guardan y se publican en el sitio.
          </p>
        </div>
        <div className="adminActions">
          <button
            className={`button secondary addVideoButton ${justAdded ? "added" : ""}`}
            disabled={isSaving}
            onClick={addVideo}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="18" height="18">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            {justAdded ? "Video agregado" : "Agregar video"}
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

      <section className="adminStats" aria-label="Resumen de publicaciones">
        <div className="adminStat">
          <span className="adminStatIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="m10 8 6 4-6 4V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{videos.length}</strong>
          <span>videos en total</span>
        </div>
        <div className="adminStat">
          <span className="adminStatIcon is-green" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{publishedCount}</strong>
          <span>con enlace publicado</span>
        </div>
        <div className="adminStat">
          <span className="adminStatIcon is-amber" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>{videos.length - publishedCount}</strong>
          <span>pendientes de enlace</span>
        </div>
      </section>

      {saveMessage ? (
        <div className="saveMessage" role="status">
          {saveMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="adminLoading">Cargando videos...</div>
      ) : null}

      <section className="adminVideoList" aria-label="Videos del proyecto">
        {videos.map((video, index) => {
          const provider = getVideoProvider(video.youtubeUrl);
          const embedUrl = getVideoEmbedUrl(video.youtubeUrl);
          const thumbnail = getVideoThumbnail(video.youtubeUrl);
          const hasLink = Boolean(video.youtubeUrl?.trim());
          const invalidLink = hasLink && !embedUrl;
          const isPreviewing = previewIndex === index;

          return (
            <article className="avCard" key={`${video.number}-${index}`}>
              <div className="avMedia">
                {isPreviewing && embedUrl ? (
                  <div className="avPlayer">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      src={embedUrl}
                      title={video.title || `Video ${video.number}`}
                    />
                    <button
                      className="avClose"
                      onClick={() => setPreviewIndex(null)}
                      type="button"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <div className="avThumb">
                    <span className="avThumbFallback" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
                        <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />
                      </svg>
                    </span>
                    {thumbnail ? (
                      <img
                        key={thumbnail}
                        src={thumbnail}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ) : null}
                    {embedUrl ? (
                      <button
                        className="avPlay"
                        onClick={() => setPreviewIndex(index)}
                        type="button"
                        aria-label="Reproducir video de prueba"
                      >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
                        </svg>
                      </button>
                    ) : null}
                    <span className="avNum">{video.number}</span>
                    <span className={`avProvider is-${provider}`}>
                      {providerLabels[provider]}
                    </span>
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
                    onClick={() => deleteVideo(index)}
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
                    onChange={(event) => updateVideo(index, "title", event.target.value)}
                    placeholder="Título del video"
                    value={video.title}
                  />
                </label>

                <label>
                  <span>Descripción</span>
                  <textarea
                    onChange={(event) => updateVideo(index, "topic", event.target.value)}
                    placeholder="Descripción breve del video"
                    rows={3}
                    value={video.topic}
                  />
                </label>

                <label>
                  <span>Enlace del video (YouTube o Drive)</span>
                  <input
                    onChange={(event) =>
                      updateVideo(index, "youtubeUrl", event.target.value)
                    }
                    placeholder="https://youtu.be/... o https://drive.google.com/file/d/..."
                    value={video.youtubeUrl ?? ""}
                  />
                </label>

                {invalidLink ? (
                  <p className="avHint is-warning">
                    Enlace no reconocido. Usa un enlace de YouTube o de Google
                    Drive.
                  </p>
                ) : hasLink ? (
                  <p className="avHint is-ok">
                    Enlace de {providerLabels[provider]} válido. Pulsa la
                    miniatura para probarlo.
                  </p>
                ) : (
                  <p className="avHint">Sin enlace: el video aparece como pendiente.</p>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
