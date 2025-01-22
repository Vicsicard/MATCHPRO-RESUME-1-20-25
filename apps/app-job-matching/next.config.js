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

    // Ignore test files
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /test/,
          use: 'null-loader',
        },
      ],
    };

    return config;
  },
  transpilePackages: ['@matchpro/ui', '@matchpro/data', '@matchpro/styles'],
};

module.exports = nextConfig;
