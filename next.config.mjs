/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['blob.v0.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default nextConfig
