import type { NextConfig } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  rewrites: async () => ({
    beforeFiles: [
      // Auth routes: proxy to Laravel only when Accept: application/json (API calls)
      ...["/login", "/logout", "/register", "/forgot-password", "/reset-password"].map(
        (route) => ({
          source: route,
          has: [{ type: "header" as const, key: "accept", value: "(.*)application/json(.*)" }],
          destination: `${API}${route}`,
        })
      ),
      {
        source: "/sanctum/:path*",
        destination: `${API}/sanctum/:path*`,
      },
      {
        source: "/email/:path*",
        has: [{ type: "header" as const, key: "accept", value: "(.*)application/json(.*)" }],
        destination: `${API}/email/:path*`,
      },
    ],
    afterFiles: [],
    fallback: [
      {
        source: "/api/:path*",
        destination: `${API}/api/:path*`,
      },
    ],
  }),
};

export default nextConfig;
