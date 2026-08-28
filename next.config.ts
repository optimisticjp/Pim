import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "omshreemadhavanandji.org",
        pathname: "/content/**",
      },
      {
        protocol: "https",
        hostname: "sachchidanandmadhavanand.org",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
