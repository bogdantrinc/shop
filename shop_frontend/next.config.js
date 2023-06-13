/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
}

module.exports = nextConfig
