/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No manual outputFileTracingRoot: Next.js auto-detects the workspace
  // root by walking up to the nearest lockfile (frontend/package-lock.json),
  // which is exactly where packages/shared and this app's hoisted
  // node_modules both live. Setting it manually is redundant now that
  // there's a single unambiguous lockfile, and risks a path mismatch
  // against Vercel's own monorepo root detection.
};

module.exports = nextConfig;
