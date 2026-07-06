// Utilidades compartidas para enlaces de video (YouTube y Google Drive).
// Se usa tanto en la página pública como en el panel de administración.

export type VideoProvider = "youtube" | "drive" | "none";

export function getYouTubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] ?? "";
    }
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2] ?? "";
    }
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/")[2] ?? "";
    }
    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export function getDriveId(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("drive.google.com")) {
      return "";
    }
    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    return fileMatch?.[1] ?? parsed.searchParams.get("id") ?? "";
  } catch {
    return "";
  }
}

export function getVideoProvider(url?: string): VideoProvider {
  if (!url?.trim()) {
    return "none";
  }
  try {
    const host = new URL(url).hostname;
    if (host.includes("youtu")) {
      return "youtube";
    }
    if (host.includes("drive.google.com")) {
      return "drive";
    }
  } catch {
    return "none";
  }
  return "none";
}

/** Devuelve la URL para incrustar en un iframe (o "" si no es válida). */
export function getVideoEmbedUrl(url?: string): string {
  if (!url?.trim()) {
    return "";
  }

  const provider = getVideoProvider(url);

  if (provider === "drive") {
    const id = getDriveId(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : "";
  }

  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?playsinline=1&rel=0` : "";
  }

  return "";
}

/** Miniatura del video para previsualización (o "" si no se puede). */
export function getVideoThumbnail(url?: string): string {
  const provider = getVideoProvider(url);

  if (provider === "youtube") {
    const id = getYouTubeId(url as string);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }

  if (provider === "drive") {
    const id = getDriveId(url as string);
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w640` : "";
  }

  return "";
}

/** Normaliza el enlace pegado en el panel a una forma canónica. */
export function normalizeVideoUrl(url: string): string {
  if (!url.trim()) {
    return "";
  }

  const provider = getVideoProvider(url);

  if (provider === "drive") {
    return url;
  }

  if (provider === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  }

  return url;
}
