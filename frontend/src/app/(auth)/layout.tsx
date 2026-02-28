"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-auth px-4 relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>⭐</div>
      <div className="absolute top-20 right-16 text-5xl opacity-20 animate-float" style={{ animationDelay: "0.5s" }}>🌈</div>
      <div className="absolute bottom-20 left-16 text-5xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🎨</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: "1.5s" }}>🧩</div>
      <div className="w-full max-w-sm relative z-10">{children}</div>
    </div>
  );
}
