import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For static export deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
