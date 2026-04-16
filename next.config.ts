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
};

export default nextConfig;
