import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "omshreemadhavanandji.org", pathname: "/content/swamiji/**" }],
  },
};

export default nextConfig;
