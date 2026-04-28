import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  trailingSlash: true,
  transpilePackages: ["@cometa/ui", "@cometa/renderer"],
};

export default nextConfig;
