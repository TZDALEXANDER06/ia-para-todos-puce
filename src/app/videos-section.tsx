"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVideoEmbedUrl } from "./lib/video";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
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

      {showMoreLink ? (
        <div className="moreVideos">
          <Link href="/videos">Ver más videos</Link>
        </div>
      ) : null}
    </>
  );
}
