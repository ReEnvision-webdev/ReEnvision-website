import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false /* config options here */,
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
