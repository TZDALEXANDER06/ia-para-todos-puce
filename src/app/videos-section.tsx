"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getVideoEmbedUrl,
  getVideoProvider,
  getVideoThumbnail
} from "./lib/video";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
  duration?: string;
};

type VideosSectionProps = {
  initialVideos: Video[];
  showAll?: boolean;
  showMoreLink?: boolean;
};

export default function VideosSection({
  initialVideos,
  showAll = false,
  showMoreLink = false
}: VideosSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);

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
        {(showAll ? initialVideos : initialVideos.slice(0, 8)).map((video) => (
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

  const visibleVideos = showAll ? videos : videos.slice(0, 8);

  return (
    <>
      <div className="videoGrid">
        {visibleVideos.map((video) => {
          const embedUrl = getVideoEmbedUrl(video.youtubeUrl);
          const thumbnail = getVideoThumbnail(video.youtubeUrl);
          const provider = getVideoProvider(video.youtubeUrl);
          const isPlaying = playing === video.number;
          const playUrl =
            provider === "youtube" ? `${embedUrl}&autoplay=1` : embedUrl;
          const duration = video.duration?.trim();

          return (
            <article className="videoCard" key={video.number}>
              <div className="videoNumber">{video.number}</div>
              <h3>{video.title}</h3>
              <p>{video.topic}</p>

              {!embedUrl ? (
                <div className="videoPlaceholder">Video pendiente de publicar</div>
              ) : isPlaying ? (
                <div className="videoPlayer">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    src={playUrl}
                    title={video.title}
                  />
                </div>
              ) : (
                <button
                  className="videoPoster"
                  onClick={() => setPlaying(video.number)}
                  type="button"
                  aria-label={`Reproducir: ${video.title}`}
                >
                  <span className="videoPosterBg" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="m10 8 6 4-6 4V8Z" fill="currentColor" />
                    </svg>
                  </span>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : null}
                  <span className="videoPlayBtn" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7-11-7Z" fill="currentColor" />
                    </svg>
                  </span>
                  {duration ? (
                    <span className="videoDuration">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {duration}
                    </span>
                  ) : null}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {showMoreLink ? (
        <div className="moreVideos">
          <Link href="/videos">Ver más videos</Link>
        </div>
      ) : null}
    </>
  );
}
