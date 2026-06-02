import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "ia-para-todos-puce";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: isGithubPages ? `/${repositoryName}` : undefined,
  assetPrefix: isGithubPages ? `/${repositoryName}/` : undefined,
  trailingSlash: isStaticExport,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isStaticExport
  }
};

export default nextConfig;
