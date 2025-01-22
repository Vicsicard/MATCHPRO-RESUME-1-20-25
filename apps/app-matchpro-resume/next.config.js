/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Don't attempt to load these modules on either client or server side
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  transpilePackages: ['@matchpro/ui', '@matchpro/data', '@matchpro/styles'],
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
