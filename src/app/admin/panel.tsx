"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

function normalizeYoutubeUrl(url: string) {
  if (!url.trim()) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const id = parsed.hostname.includes("youtu.be")
      ? parsed.pathname.slice(1)
      : parsed.pathname.startsWith("/shorts/")
        ? parsed.pathname.split("/")[2]
        : parsed.searchParams.get("v");

    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  } catch {
    return url;
  }
}

export default function AdminPanel({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
    setSaveMessage("");
  }

  async function saveChanges() {
    setIsSaving(true);
    setSaveMessage("");

    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videos)
    });

    setIsSaving(false);

    if (!response.ok) {
      const body = await response.json();
      setSaveMessage(body.message ?? "No se pudieron guardar los cambios.");
      return;
    }

    setSaveMessage("Cambios guardados. Ya se verán en la página pública.");
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
            Edita el título, la descripción y el enlace de YouTube. El botón
            guardar actualiza lo que se ve en este navegador.
          </p>
        </div>
        <div className="adminActions">
          <button className="button primary" onClick={saveChanges} type="button">
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button className="button secondary" onClick={logout} type="button">
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

      {saveMessage ? <div className="saveMessage">{saveMessage}</div> : null}

      {isLoading ? <div className="saveMessage">Cargando videos...</div> : null}

      <section className="adminVideoList" aria-label="Videos del proyecto">
        {videos.map((video, index) => (
          <article className="adminVideoCard" key={video.number}>
            <div className="adminVideoTop">
              <span>Video {video.number}</span>
            </div>

            <label>
              Título
              <input
                onChange={(event) => updateVideo(index, "title", event.target.value)}
                value={video.title}
              />
            </label>

            <label>
              Descripción
              <textarea
                onChange={(event) => updateVideo(index, "topic", event.target.value)}
                rows={4}
                value={video.topic}
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
          </article>
        ))}
      </section>
    </main>
  );
}
