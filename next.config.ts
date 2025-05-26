import type { NextConfig } from "next";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    reactRemoveProperties: true,
  },
  generateBuildId: async () => {
    return Math.random().toString(36).substring(2, 15);
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (minimizer: any) => minimizer.constructor.name !== 'CssMinimizerPlugin'
      );
      config.optimization.minimizer.push(
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'advanced',
              { discardComments: { removeAll: true } }
            ],
          },
        })
      );
    }
    return config;
  },
  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'liebling.eduardogomez.io',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(process.env.IMAGE_DOMAINS || '').split(',').filter(Boolean).map(domain => ({
        protocol: 'https' as const,
        hostname: domain.trim(),
      })),
    ]
  },
};

export default nextConfig;