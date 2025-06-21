import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    reactRemoveProperties: true,
  },
  generateBuildId: async () => {
    return Math.random().toString(36).slice(2, 15)
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },          
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.renatovicente.dev',
      },
      {
        protocol: 'https',
        hostname: 'admin.renatovicente.dev',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      ...(process.env.IMAGE_DOMAINS || '')
        .split(',')
        .filter(Boolean)
        .map((domain) => ({
          protocol: 'https' as const,
          hostname: domain.trim(),
        })),
    ],
  },
}

export default nextConfig
