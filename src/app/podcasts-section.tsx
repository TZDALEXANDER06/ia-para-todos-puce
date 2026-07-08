"use client";

import { useEffect, useState } from "react";
import { getSpotifyEmbedUrl } from "./lib/spotify";

type Podcast = {
  number: string;
  title: string;
  description: string;
  spotifyUrl?: string;
};

export default function PodcastsSection({
  initialPodcasts
}: {
  initialPodcasts: Podcast[];
}) {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPodcasts() {
      try {
        const response = await fetch("/api/podcasts", { cache: "no-store" });
        setPodcasts(response.ok ? await response.json() : initialPodcasts);
      } catch {
        setPodcasts(initialPodcasts);
      } finally {
        setIsLoading(false);
      }
    }

    loadPodcasts();
  }, [initialPodcasts]);

  const list = isLoading ? initialPodcasts : podcasts;

  return (
    <div className="podcastGrid">
      {list.map((podcast) => {
        const embedUrl = getSpotifyEmbedUrl(podcast.spotifyUrl);

        return (
          <article className="podcastCard" key={podcast.number}>
            <div className="podcastTop">
              <span className="podcastNumber">EP {podcast.number}</span>
              <span className="podcastIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7.5 14.5c2.8-1 6-0.8 8.5 0.7M7 11.4c3.4-1.1 7-0.8 10 1M7 8.4c3.8-1.1 7.8-0.7 10.5 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <h3>{podcast.title}</h3>
            {podcast.description ? (
              <p className="podcastDesc">{podcast.description}</p>
            ) : null}

            {embedUrl ? (
              <div className="podcastPlayer">
                <iframe
                  src={embedUrl}
                  title={podcast.title}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="podcastPlaceholder">
                <span className="wave" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                Episodio en preparación
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
