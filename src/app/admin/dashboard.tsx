"use client";

import { useState } from "react";
import Link from "next/link";
import VideoManager from "./video-manager";
import PodcastManager from "./podcast-manager";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

type Podcast = {
  number: string;
  title: string;
  description: string;
  spotifyUrl?: string;
};

export default function AdminDashboard({
  initialVideos,
  initialPodcasts
}: {
  initialVideos: Video[];
  initialPodcasts: Podcast[];
}) {
  const [tab, setTab] = useState<"videos" | "podcasts">("videos");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="adminDashboard">
      <div className="adminTopbar">
        <Link className="adminBrand" href="/">
          <span className="brandMark" aria-hidden="true">
            IA
          </span>
          <span>
            IA para Todos
            <small>Panel de administración</small>
          </span>
        </Link>
        <div className="adminTopActions">
          <Link className="adminGhostLink" href="/" target="_blank">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ver sitio
          </Link>
          <button className="adminGhostLink" onClick={logout} type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 12H4m0 0 4-4m-4 4 4 4M16 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="adminContent">
        <div className="adminTabs" role="tablist" aria-label="Secciones del panel">
          <button
            className={`adminTab ${tab === "videos" ? "active" : ""}`}
            onClick={() => setTab("videos")}
            role="tab"
            aria-selected={tab === "videos"}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="m10 8 6 4-6 4V8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            Videos
          </button>
          <button
            className={`adminTab ${tab === "podcasts" ? "active" : ""}`}
            onClick={() => setTab("podcasts")}
            role="tab"
            aria-selected={tab === "podcasts"}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Podcast
          </button>
        </div>

        {tab === "videos" ? (
          <VideoManager initialVideos={initialVideos} />
        ) : (
          <PodcastManager initialPodcasts={initialPodcasts} />
        )}
      </div>
    </main>
  );
}
