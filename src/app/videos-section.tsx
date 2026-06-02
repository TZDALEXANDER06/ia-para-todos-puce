"use client";

import { useState } from "react";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

const STORAGE_KEY = "ia-para-todos-admin-videos";

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

    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

export default function VideosSection({ initialVideos }: { initialVideos: Video[] }) {
  const [videos] = useState<Video[]>(() => {
    if (typeof window === "undefined") {
      return initialVideos;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialVideos;
  });

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
