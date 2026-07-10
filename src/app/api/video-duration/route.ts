import { NextResponse } from "next/server";
import { fetchYouTubeDuration } from "@/app/lib/youtube-duration";
import { getVideoProvider, getYouTubeId } from "@/app/lib/video";

export const dynamic = "force-dynamic";

/**
 * Devuelve la duración de un video de YouTube ("8:42") a partir de su enlace.
 * Lo usa el panel para rellenar automáticamente el campo de duración.
 */
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") ?? "";

  if (getVideoProvider(url) !== "youtube") {
    return NextResponse.json({ duration: null });
  }

  const videoId = getYouTubeId(url);
  if (!videoId) {
    return NextResponse.json({ duration: null });
  }

  const duration = await fetchYouTubeDuration(videoId);
  return NextResponse.json({ duration });
}
