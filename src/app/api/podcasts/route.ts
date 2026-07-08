import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import podcastsData from "@/data/podcasts.json";
import { isAuthorized } from "@/app/lib/admin-auth";

type Podcast = {
  number: string;
  title: string;
  description: string;
  spotifyUrl?: string;
};

const DATA_PATH = "src/data/podcasts.json";

export const dynamic = "force-dynamic";

function isValidPodcasts(value: unknown): value is Podcast[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Podcast).number === "string" &&
        typeof (item as Podcast).title === "string" &&
        typeof (item as Podcast).description === "string" &&
        ((item as Podcast).spotifyUrl === undefined ||
          typeof (item as Podcast).spotifyUrl === "string")
    )
  );
}

function renumberPodcasts(podcasts: Podcast[]) {
  return podcasts.map((podcast, index) => ({
    ...podcast,
    number: String(index + 1).padStart(2, "0")
  }));
}

async function readPodcastsFromGithub() {
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

  const podcasts = await response.json();
  return isValidPodcasts(podcasts) ? renumberPodcasts(podcasts) : null;
}

async function writePodcastsToGithub(podcasts: Podcast[]) {
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
    throw new Error("No se pudo leer el archivo de podcasts desde GitHub.");
  }

  const current = await currentFile.json();
  const content = `${JSON.stringify(podcasts, null, 2)}\n`;

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
      message: "Update podcasts from admin panel",
      sha: current.sha
    })
  });

  if (!update.ok) {
    throw new Error("No se pudo guardar el archivo de podcasts en GitHub.");
  }

  return true;
}

export async function GET() {
  const githubPodcasts = await readPodcastsFromGithub();
  return NextResponse.json(githubPodcasts ?? podcastsData, {
    headers: {
      "Cache-Control": "no-store",
      "X-Podcasts-Source": githubPodcasts ? "github" : "bundle"
    }
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const podcasts = await request.json();

  if (!isValidPodcasts(podcasts)) {
    return NextResponse.json(
      { message: "Formato de podcasts invalido." },
      { status: 400 }
    );
  }

  const orderedPodcasts = renumberPodcasts(podcasts);
  const savedToGithub = await writePodcastsToGithub(orderedPodcasts);

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
      `${JSON.stringify(orderedPodcasts, null, 2)}\n`
    );
  }

  return NextResponse.json({ ok: true });
}
