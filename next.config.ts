import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/pm-portfolio.html",
        destination: "/pm",
        permanent: true,
      },
      {
        source: "/pm-portfolio",
        destination: "/pm",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      // Serve the CMS-driven blog at the original URL; it wins over public/blog.html.
      beforeFiles: [{ source: "/blog.html", destination: "/blog" }],
      afterFiles: [
        { source: "/", destination: "/index.html" },
        { source: "/health", destination: "/api/health" },
      ],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
