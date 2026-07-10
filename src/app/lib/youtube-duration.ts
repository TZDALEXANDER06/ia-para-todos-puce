// Obtiene la duración de un video de YouTube sin necesidad de API key,
// leyendo la página pública del video. Se usa desde el servidor.

const memoryCache = new Map<string, string | null>();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

/** Convierte segundos a "M:SS" o "H:MM:SS". */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

/** Convierte una duración ISO 8601 (PT1M23S) a segundos. */
function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return NaN;
  }
  const [, h, m, s] = match;
  return Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
}

/** Extrae la duración (en segundos) del HTML de la página del video. */
export function extractDurationSeconds(html: string): number {
  const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
  if (lengthMatch) {
    const seconds = Number(lengthMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds;
    }
  }

  const isoMatch = html.match(/itemprop="duration" content="(PT[^"]+)"/);
  if (isoMatch) {
    const seconds = parseIsoDuration(isoMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds;
    }
  }

  return NaN;
}

/** Devuelve la duración formateada ("8:42") o null si no se pudo obtener. */
export async function fetchYouTubeDuration(
  videoId: string
): Promise<string | null> {
  if (memoryCache.has(videoId)) {
    return memoryCache.get(videoId) ?? null;
  }

  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "es,en;q=0.8" },
      next: { revalidate: 60 * 60 * 24 }
    });

    if (!response.ok) {
      memoryCache.set(videoId, null);
      return null;
    }

    const seconds = extractDurationSeconds(await response.text());
    const duration = Number.isFinite(seconds) ? formatDuration(seconds) : null;
    memoryCache.set(videoId, duration);
    return duration;
  } catch {
    memoryCache.set(videoId, null);
    return null;
  }
}
