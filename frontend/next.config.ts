import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/sanctum/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/sanctum/:path*`,
    },
    {
      source: "/login",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/login`,
    },
    {
      source: "/logout",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/logout`,
    },
    {
      source: "/register",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/register`,
    },
    {
      source: "/forgot-password",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/forgot-password`,
    },
    {
      source: "/reset-password",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/reset-password`,
    },
    {
      source: "/email/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/email/:path*`,
    },
    {
      source: "/api/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
    },
  ],
};

export default nextConfig;
