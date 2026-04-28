import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // EdgeOne Pages 配置
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
