import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Since we are exporting a static site, we can't use Next.js' default image optimization
  images: { unoptimized: true },
};

export default nextConfig;
