import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // Ensure the correct project root for builds (fixes mis-detection)
    root: __dirname,
  },
};

export default nextConfig;
