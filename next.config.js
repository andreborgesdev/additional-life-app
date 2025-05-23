/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bmxkdcjbtchixtkruzit.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    suppressHydrationWarning: true,
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ message: /Extra attributes from the server/ }];
    return config;
  },
};

module.exports = nextConfig;
