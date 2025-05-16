const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["bmxkdcjbtchixtkruzit.supabase.co"],
  },
};

module.exports = nextConfig;
