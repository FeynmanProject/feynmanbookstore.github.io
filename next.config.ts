import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Ganti dari "export" ke "standalone"
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
