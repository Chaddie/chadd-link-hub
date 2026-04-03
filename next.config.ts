import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chadd.ie",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
