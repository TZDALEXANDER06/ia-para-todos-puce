"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Video = {
  number: string;
  title: string;
  topic: string;
  audience: string;
  status: string;
  youtubeUrl?: string;
};

const STORAGE_KEY = "ia-para-todos-admin-videos";

function normalizeYoutubeUrl(url: string) {
  if (!url.trim()) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v");

    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  } catch {
    return url;
  }
}

export default function AdminPanel({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(() => {
    if (typeof window === "undefined") {
      return initialVideos;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialVideos;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, [videos]);

  const publishedCount = useMemo(
    () => videos.filter((video) => Boolean(video.youtubeUrl)).length,
    [videos]
  );

  function updateVideo(index: number, field: keyof Video, value: string) {
    setVideos((currentVideos) =>
      currentVideos.map((video, currentIndex) =>
        currentIndex === index
          ? {
              ...video,
              [field]: field === "youtubeUrl" ? normalizeYoutubeUrl(value) : value
            }
          : video
      )
    );
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(videos, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="adminDashboard">
      <header className="adminHeader">
        <div>
          <Link className="adminBackLink" href="/">Volver al sitio</Link>
          <p className="eyebrow">Panel administrador</p>
          <h1>Gestión de videos</h1>
          <p>
            Pega los enlaces de YouTube, actualiza estados y guarda una copia
            exportable de la información.
          </p>
        </div>
        <div className="adminActions">
          <button className="button secondary" onClick={copyJson} type="button">
            {copied ? "Copiado" : "Copiar JSON"}
          </button>
          <button className="button primary" onClick={logout} type="button">
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="adminStats" aria-label="Resumen de publicaciones">
        <div>
          <strong>{publishedCount}</strong>
          <span>videos con enlace</span>
        </div>
        <div>
          <strong>{videos.length - publishedCount}</strong>
          <span>videos pendientes</span>
        </div>
      </section>

      <section className="adminVideoList" aria-label="Videos del proyecto">
        {videos.map((video, index) => (
          <article className="adminVideoCard" key={video.number}>
            <div className="adminVideoTop">
              <span>Video {video.number}</span>
              <select
                aria-label={`Estado del video ${video.number}`}
                onChange={(event) => updateVideo(index, "status", event.target.value)}
                value={video.status}
              >
                <option>Planificado</option>
                <option>Guion inicial</option>
                <option>En grabación</option>
                <option>En edición</option>
                <option>Publicado</option>
              </select>
            </div>

            <label>
              Título
              <input
                onChange={(event) => updateVideo(index, "title", event.target.value)}
                value={video.title}
              />
            </label>

            <label>
              Enlace de YouTube
              <input
                onChange={(event) =>
                  updateVideo(index, "youtubeUrl", event.target.value)
                }
                placeholder="https://www.youtube.com/watch?v=..."
                value={video.youtubeUrl ?? ""}
              />
            </label>

            <label>
              Descripción breve
              <textarea
                onChange={(event) => updateVideo(index, "topic", event.target.value)}
                rows={3}
                value={video.topic}
              />
            </label>

            {video.youtubeUrl ? (
              <a className="textLink" href={video.youtubeUrl} target="_blank">
                Abrir video
              </a>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
