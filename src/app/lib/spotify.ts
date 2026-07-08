// Utilidades para enlaces de Spotify (episodios, shows, tracks, playlists).

const SPOTIFY_TYPES = ["episode", "show", "track", "playlist", "album"];

type SpotifyRef = { type: string; id: string } | null;

function parseSpotify(url: string): SpotifyRef {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("spotify.com")) {
      return null;
    }
    const parts = parsed.pathname.split("/").filter(Boolean);
    const typeIndex = parts.findIndex((part) => SPOTIFY_TYPES.includes(part));
    if (typeIndex === -1 || !parts[typeIndex + 1]) {
      return null;
    }
    return { type: parts[typeIndex], id: parts[typeIndex + 1] };
  } catch {
    return null;
  }
}

/** URL para incrustar el reproductor de Spotify en un iframe (o "" si no es válida). */
export function getSpotifyEmbedUrl(url?: string): string {
  if (!url?.trim()) {
    return "";
  }
  const ref = parseSpotify(url);
  return ref ? `https://open.spotify.com/embed/${ref.type}/${ref.id}` : "";
}

/** Deja el enlace de Spotify en una forma canónica (sin parámetros como ?si=...). */
export function normalizeSpotifyUrl(url: string): string {
  if (!url.trim()) {
    return "";
  }
  const ref = parseSpotify(url);
  return ref ? `https://open.spotify.com/${ref.type}/${ref.id}` : url;
}

export function isSpotifyUrl(url?: string): boolean {
  return Boolean(getSpotifyEmbedUrl(url));
}
