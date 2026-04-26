import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds — dev mode needs dynamic routing
  ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
  trailingSlash: true,
  transpilePackages: ["@cometa/ui"],
};

export default nextConfig;
