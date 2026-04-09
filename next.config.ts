import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: "/ousadbazar",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce-pharma.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  experimental: {
    staticGenerationRetryCount: 3,
  },
};

export default nextConfig;
