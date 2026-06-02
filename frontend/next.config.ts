import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.s3.**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Sin `search` => acepta cualquier query string (incluye nuestro cache-buster ?v=N).
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
