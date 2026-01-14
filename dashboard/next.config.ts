import type { NextConfig } from "next";
import path from "path";

const rootDir = path.resolve(process.cwd(), "..");

interface Rule {
  test?: { test?: (input: string) => boolean };
}

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        as: "*.js",
        loaders: ["@svgr/webpack"],
      },
    },
    root: rootDir,
  },

  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },

  outputFileTracingRoot: rootDir,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*",
        port: "",
      },
    ],
    unoptimized: false,
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
