import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import videosData from "@/data/videos.json";

type Video = {
  number: string;
  title: string;
  topic: string;
  youtubeUrl?: string;
};

const DATA_PATH = "src/data/videos.json";
const SESSION_COOKIE = "ia_admin_session";

export const dynamic = "force-dynamic";

function isValidVideos(value: unknown): value is Video[] {
  return (
    Array.isArray(value) &&
    value.every(
      (video) =>
        typeof video === "object" &&
        video !== null &&
        typeof (video as Video).number === "string" &&
        typeof (video as Video).title === "string" &&
        typeof (video as Video).topic === "string" &&
        ((video as Video).youtubeUrl === undefined ||
          typeof (video as Video).youtubeUrl === "string")
    )
  );
}

function renumberVideos(videos: Video[]) {
  return videos.map((video, index) => ({
    ...video,
    number: String(index + 1).padStart(2, "0")
  }));
}

async function readVideosFromGithub() {
  const token = process.env.GITHUB_CONTENTS_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY_FULL_NAME;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!repository || !token) {
    return null;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repository}/contents/${DATA_PATH}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.raw+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return null;
  }

  const videos = await response.json();
  return isValidVideos(videos) ? renumberVideos(videos) : null;
}

async function writeVideosToGithub(videos: Video[]) {
  const token = process.env.GITHUB_CONTENTS_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY_FULL_NAME;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !repository) {
    return false;
  }

  const apiUrl = `https://api.github.com/repos/${repository}/contents/${DATA_PATH}`;
  const currentFile = await fetch(`${apiUrl}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    cache: "no-store"
  });

  if (!currentFile.ok) {
    throw new Error("No se pudo leer el archivo de videos desde GitHub.");
  }

  const current = await currentFile.json();
  const content = `${JSON.stringify(videos, null, 2)}\n`;

  const update = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      branch,
      content: Buffer.from(content, "utf8").toString("base64"),
      message: "Update videos from admin panel",
      sha: current.sha
    })
  });

  if (!update.ok) {
    throw new Error("No se pudo guardar el archivo de videos en GitHub.");
  }

  return true;
}

export async function GET() {
  const githubVideos = await readVideosFromGithub();
  return NextResponse.json(githubVideos ?? videosData, {
    headers: {
      "Cache-Control": "no-store",
      "X-Videos-Source": githubVideos ? "github" : "bundle"
    }
  });
}

export async function POST(request: Request) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionToken || session !== sessionToken) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const videos = await request.json();

  if (!isValidVideos(videos)) {
    return NextResponse.json(
      { message: "Formato de videos invalido." },
      { status: 400 }
    );
  }

  const orderedVideos = renumberVideos(videos);
  const savedToGithub = await writeVideosToGithub(orderedVideos);

  if (!savedToGithub) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          message:
            "Falta configurar GITHUB_CONTENTS_TOKEN y GITHUB_REPOSITORY_FULL_NAME en Vercel para guardar cambios globales."
        },
        { status: 500 }
      );
    }

    await writeFile(
      join(process.cwd(), DATA_PATH),
      `${JSON.stringify(orderedVideos, null, 2)}\n`
    );
  }

  return NextResponse.json({ ok: true });
}
