const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensures the standalone/serverless build traces files from the shared
  // package that lives outside this app's own directory (packages/shared).
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

module.exports = nextConfig;
