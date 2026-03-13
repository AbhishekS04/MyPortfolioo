
import type { NextConfig } from "next";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "wallpapers.com",
      },
      {
        protocol: "https",
        hostname: "rdxqqgntmtzvqsmepmls.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "framer-motion", "lodash"],
  },
  async headers() {
    // unsafe-eval needed in dev for webpack HMR, removed in production
    const isDev = process.env.NODE_ENV === "development";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://github.com https://raw.githubusercontent.com https://avatars.githubusercontent.com https://res.cloudinary.com https://media.licdn.com https://wallpapers.com https://rdxqqgntmtzvqsmepmls.supabase.co https://basemaps.cartocdn.com https://emojicdn.elk.sh https://ik.imagekit.io",
              "font-src 'self'",
              "connect-src 'self' https://rdxqqgntmtzvqsmepmls.supabase.co https://cumdfaxqugcqgcfusaye.supabase.co https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com",
              "media-src 'self' data: blob: https://res.cloudinary.com https://ik.imagekit.io",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));