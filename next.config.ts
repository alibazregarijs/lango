/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  experimental: {
    allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  },
};

export default nextConfig;
