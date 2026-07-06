import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "ia-para-todos-puce";
const basePath = isGithubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: isGithubPages ? `/${repositoryName}/` : undefined,
  trailingSlash: isStaticExport,
  // Se expone al cliente para prefijar imágenes de /public (next/image no
  // agrega basePath automáticamente a estas rutas en export estático).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isStaticExport
  }
};

export default nextConfig;
