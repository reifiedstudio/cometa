import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  transpilePackages: ["@cometa/shared", "@cometa/ui"],
};

export default nextConfig;
