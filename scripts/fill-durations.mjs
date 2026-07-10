/**
 * Rellena el campo "duration" de src/data/videos.json consultando la duración
 * publica de cada video de YouTube (sin API key). No sobreescribe duraciones
 * que ya esten puestas a mano.
 *
 * Uso:  node scripts/fill-durations.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = "src/data/videos.json";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

function parseIsoDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return NaN;
  const [, h, m, s] = match;
  return Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
}

function extractDurationSeconds(html) {
  const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
  if (lengthMatch) {
    const seconds = Number(lengthMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
  }
  const isoMatch = html.match(/itemprop="duration" content="(PT[^"]+)"/);
  if (isoMatch) {
    const seconds = parseIsoDuration(isoMatch[1]);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
  }
  return NaN;
}

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("youtu")) return "";
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] ?? "";
    }
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] ?? "";
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] ?? "";
    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

async function fetchDuration(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "es,en;q=0.8" }
  });
  if (!response.ok) return null;
  const seconds = extractDurationSeconds(await response.text());
  return Number.isFinite(seconds) ? formatDuration(seconds) : null;
}

async function main() {
  const videos = JSON.parse(await readFile(DATA_PATH, "utf8"));
  let updated = 0;

  for (const video of videos) {
    if (video.duration?.trim()) {
      console.log(`${video.number}  ya tenía ${video.duration}`);
      continue;
    }
    const id = getYouTubeId(video.youtubeUrl ?? "");
    if (!id) {
      console.log(`${video.number}  sin enlace de YouTube (omitido)`);
      continue;
    }
    try {
      const duration = await fetchDuration(id);
      if (duration) {
        video.duration = duration;
        updated++;
        console.log(`${video.number}  ${duration}`);
      } else {
        console.log(`${video.number}  no se pudo obtener`);
      }
    } catch (error) {
      console.log(`${video.number}  error: ${error.message}`);
    }
  }

  await writeFile(DATA_PATH, `${JSON.stringify(videos, null, 2)}\n`);
  console.log(`\nListo: ${updated} duraciones agregadas en ${DATA_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
