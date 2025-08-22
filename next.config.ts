import type { NextConfig } from "next";

const supabaseHost = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL as string}/**`);

const nextConfig: NextConfig = {
  devIndicators: false /* config options here */,
  images: {
    remotePatterns: [supabaseHost],
  },
};

export default nextConfig;
