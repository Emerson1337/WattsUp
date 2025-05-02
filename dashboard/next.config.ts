import type { NextConfig } from "next";

interface Rule {
  test?: { test?: (input: string) => boolean };
}

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          as: "*.js",
          loaders: ["@svgr/webpack"],
        },
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
      },
    ],
  },

  // Keep this until Turbo handles SVGs in production builds
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: Rule) =>
      rule.test?.test?.(".svg")
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/url/] },
          use: ["@svgr/webpack"],
        }
      );

      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
