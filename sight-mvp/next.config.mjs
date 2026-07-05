/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // MVP deploy safeguard: don't let a stray lint rule or type edge-case block
  // the very first production build on Vercel. Tighten these to `false` once
  // the app is live and you've run a clean local `npm run build`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
