"use client";

import { useEffect, useState } from "react";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

function getYoutubeEmbedUrl(url?: string) {
  if (!url?.trim()) {
    return "";
  }

  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.replace("/", "");
    } else if (parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/")[2] ?? "";
    } else if (parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2] ?? "";
    } else {
      id = parsed.searchParams.get("v") ?? "";
    }

    return id ? `https://www.youtube.com/embed/${id}?playsinline=1&rel=0` : "";
  } catch {
    return "";
  }
}

export default function VideosSection({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch("/api/videos", { cache: "no-store" });
        setVideos(response.ok ? await response.json() : initialVideos);
      } catch {
        setVideos(initialVideos);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideos();
  }, [initialVideos]);

  if (isLoading) {
    return (
      <div className="videoGrid">
        {initialVideos.map((video) => (
          <article className="videoCard" key={video.number}>
            <div className="videoNumber">{video.number}</div>
            <h3>{video.title}</h3>
            <p>{video.topic}</p>
            <div className="videoPlaceholder">Cargando video...</div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="videoGrid">
      {videos.map((video) => {
        const embedUrl = getYoutubeEmbedUrl(video.youtubeUrl);

        return (
          <article className="videoCard" key={video.number}>
            <div className="videoNumber">{video.number}</div>
            <h3>{video.title}</h3>
            <p>{video.topic}</p>

            {embedUrl ? (
              <div className="videoPlayer">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  src={embedUrl}
                  title={video.title}
                />
              </div>
            ) : (
              <div className="videoPlaceholder">Video pendiente de publicar</div>
            )}
          </article>
        );
      })}
    </div>
  );
}
