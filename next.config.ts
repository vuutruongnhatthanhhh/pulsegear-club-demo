import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["qwcjtaxwbohopscyjiyv.supabase.co", "images.unsplash.com"],
  },

  webpack: (config, { dev }) => {
    if (dev) {
      // Windows dev environments intermittently hit ENOENT errors reading
      // webpack's on-disk cache pack files (antivirus/file-lock races),
      // which corrupts the build and breaks client chunks. Keep the cache
      // in memory instead of on disk for dev to avoid that failure mode.
      config.cache = { type: "memory" };
    }
    return config;
  },
};

export default nextConfig;
